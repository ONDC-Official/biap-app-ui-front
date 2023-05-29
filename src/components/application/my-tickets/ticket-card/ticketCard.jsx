import React, { useEffect, useState, useContext, useRef } from "react";
import moment from "moment";
import { getOrderStatus } from "../../../../constants/order-status";
import styles from "../../../../styles/orders/orders.module.scss";
import { ONDC_COLORS } from "../../../shared/colors";
import DropdownSvg from "../../../shared/svg/dropdonw";
import { ToastContext } from "../../../../context/toastContext";
import useCancellablePromise from "../../../../api/cancelRequest";
import { toast_actions, toast_types } from "../../../shared/toast/utils/toast";
import { getCall, postCall } from "../../../../api/axios";
import { getValueFromCookie } from "../../../../utils/cookies";
import { SSE_TIMEOUT } from "../../../../constants/sse-waiting-time";
import Loading from "../../../shared/loading/loading";
import CustomerActionCard from "../action-card/actionCard";
import { ISSUE_TYPES } from "../../../../constants/issue-types";

export default function TicketCard(props) {
    const {
        order_details,
        category,
        sub_category,
        description,
        issue_actions,
        issue_type,
        status,
        updated_at,
        created_at,
        accoodion_id,
        currentSelectedAccordion,
        setCurrentSelectedAccordion,
        transaction_id,
        onFetchUpdatedOrder,
        bpp_id,
        issue_id,
    } = props;


    // STATES
    const [statusLoading, setStatusLoading] = useState(false);
    const [toggleActionModal, setToggleActionModal] = useState(false);
    const [supportActionDetails, setSupportActionDetails] = useState();
    const [issueActions, setIssueActions] = useState([]);

    // HELPERS
    const current_order_status = getOrderStatus(status);

    // REFS
    const cancelPartialEventSourceResponseRef = useRef(null);
    const eventTimeOutRef = useRef([]);

    // CONTEXT
    const dispatch = useContext(ToastContext);

    // HOOKS
    const { cancellablePromise } = useCancellablePromise();

    const AllCategory = ISSUE_TYPES.map((item) => {
        return item.subCategory.map((subcategoryItem) => {
            return {
                ...subcategoryItem,
                category: item.value,
            };
        });
    }).flat();

    // use this function to dispatch error
    function dispatchToast(message, type) {
        dispatch({
            type: toast_actions.ADD_TOAST,
            payload: {
                id: Math.floor(Math.random() * 100),
                type,
                message,
            },
        });
    }

    useEffect(() => {
        mergeRespondantArrays(issue_actions)
    }, [])

    const mergeRespondantArrays = (actions) => {
        let resActions = actions.respondent_actions,
            comActions = actions.complainant_actions.map(item => { return ({ ...item, respondent_action: item.complainant_action }) }),
            mergedarray = [...comActions, ...resActions]

        mergedarray.sort((a, b) => new Date(a.updated_at) - new Date(b.updated_at));
        setIssueActions(mergedarray)
    }


    const checkIssueStatus = async () => {
        cancelPartialEventSourceResponseRef.current = [];
        setStatusLoading(true);
        try {
            const data = await cancellablePromise(
                postCall("/issueApis/v1/issue_status", {
                    context: {
                        transaction_id,
                        bpp_id
                    },
                    message: {
                        issue_id: issue_id,
                    },
                })
            );
            //Error handling workflow eg, NACK
            if (data.message && data.message.ack.status === "NACK") {
                setStatusLoading(false);
                dispatchToast("Something went wrong", toast_types.error);
            } else {
                fetchIssueStatusThroughEvents(data.context?.message_id);
            }
        } catch (err) {
            setStatusLoading(false);
            dispatchToast(err?.message, toast_types.error);
        }
    };

    function fetchIssueStatusThroughEvents(message_id) {
        const token = getValueFromCookie("token");
        let header = {
            headers: {
                ...(token && {
                    Authorization: `Bearer ${token}`,
                }),
            },
        };
        let es = new window.EventSourcePolyfill(
            `${process.env.REACT_APP_BASE_URL}issueApis/events?messageId=${message_id}`,
            header
        );
        es.addEventListener("on_issue_status", (e) => {
            const { messageId } = JSON.parse(e?.data);
            getIssueStatusDetails(messageId);
        });

        const timer = setTimeout(() => {
            es.close();
            if (cancelPartialEventSourceResponseRef.current.length <= 0) {
                dispatchToast(
                    "Cannot proceed with you request now! Please try again",
                    toast_types.error
                );
                setStatusLoading(false);
            }
        }, SSE_TIMEOUT);

        eventTimeOutRef.current = [
            ...eventTimeOutRef.current,
            {
                eventSource: es,
                timer,
            },
        ];
    }

    async function getIssueStatusDetails(message_id) {
        try {
            const data = await cancellablePromise(
                getCall(`/issueApis/v1/on_issue_status?messageId=${message_id}`)
            );
            cancelPartialEventSourceResponseRef.current = [
                ...cancelPartialEventSourceResponseRef.current,
                data,
            ];
            setStatusLoading(false);
            if (data?.message) {
                mergeRespondantArrays({ respondent_actions: data.message.issue?.issue_actions.respondent_actions, complainant_actions: issue_actions.complainant_actions })
                onFetchUpdatedOrder();
            } else {
                dispatchToast(
                    "Something went wrong!, issue status cannot be fetched",
                    toast_types.error
                );
            }
        } catch (err) {
            setStatusLoading(false);
            dispatchToast(err?.message, toast_types.error);
            eventTimeOutRef.current.forEach(({ eventSource, timer }) => {
                eventSource.close();
                clearTimeout(timer);
            });
        }
    }

    return (
        <div className={styles.orders_card}>
            {toggleActionModal && (
                <CustomerActionCard
                    supportActionDetails={supportActionDetails}
                    onClose={() => setToggleActionModal(false)}
                    onSuccess={(actionData) => {
                        dispatchToast("Action successfully taken", toast_types.success);
                        setSupportActionDetails();
                        setToggleActionModal(false);
                        setIssueActions([...issueActions, actionData])
                    }}
                />
            )}
            <div
                className={`d-flex align-items-center ${styles.padding_20}`}
                data-bs-toggle="collapse"
                data-bs-target={`#${accoodion_id}`}
                aria-expanded="true"
                aria-controls={accoodion_id}
                onClick={() => {
                    setCurrentSelectedAccordion(accoodion_id);
                }}
                style={{ cursor: "pointer" }}
            >
                <div className="flex-grow-1">
                    <p className={styles.card_header_title}>
                        {category + "-" + AllCategory.find(x => x.enums === sub_category)?.value ?? "NA"}
                    </p>
                    <p className={styles.address_type_label} style={{ fontSize: "12px" }}>
                        {issue_type ?? "Issue"} raised on
                        <span style={{ fontWeight: "500", padding: "0 5px" }}>
                            {updated_at ? moment(updated_at).format("MMMM Do, YYYY") : "NA"}
                        </span>
                    </p>
                    <p className={styles.address_type_label} style={{ fontSize: "12px" }}>
                        Issue Id:
                        <span style={{ fontWeight: "500", padding: "0 5px" }}>
                            {issue_id}
                        </span>
                    </p>
                </div>
                <div className="px-3" style={{ width: "18%" }}>
                    <p className={styles.status_label}>Status:</p>
                    <div className="pt-1">
                        {current_order_status ? (
                            <div
                                className={styles.status_chip}
                                style={{
                                    background: `rgba(${current_order_status?.color}, 0.05)`,
                                    border: `1px solid ${current_order_status?.border}`,
                                }}
                            >
                                <p
                                    className={styles.status_text}
                                    style={{ color: current_order_status?.border }}
                                >
                                    {current_order_status?.status}
                                </p>
                            </div>
                        ) : (
                            <p className={styles.status_text} style={{ textAlign: "left" }}>
                                NA
                            </p>
                        )}
                    </div>
                </div>
                <div className="px-2" style={{ width: "7%" }}>
                    <div
                        style={
                            currentSelectedAccordion === accoodion_id
                                ? {
                                    transform: "rotate(180deg)",
                                    transition: "all 0.7s",
                                }
                                : { transform: "rotate(0)", transition: "all 0.7s" }
                        }
                    >
                        <DropdownSvg
                            color={
                                currentSelectedAccordion === accoodion_id
                                    ? ONDC_COLORS.ACCENTCOLOR
                                    : "#ddd"
                            }
                        />
                    </div>
                </div>
            </div>
            <div
                id={accoodion_id}
                className={`accordion-collapse collapse ${styles.padding_20}`}
                aria-labelledby={accoodion_id}
                data-bs-parent="#ordersAccordion"
                style={{ padding: "0 20px 20px" }}
            >
                {/* LIST OF PRODUCT OF AN ORDER  */}
                <div className="py-2" style={{ borderTop: "1px solid #ddd" }}>
                    {order_details?.items?.map(({ id, product, quantity }, index) => {
                        const totalPriceOfProduct =
                            Number(product?.price?.value) * Number(quantity?.count);
                        return (
                            <>
                                <div key={id} className="d-flex align-items-center pt-3">
                                    <div style={{ width: "90%" }}>
                                        <p
                                            className={styles.product_name}
                                            title={product.descriptor.name}
                                            style={{ fontSize: "16px" }}
                                        >
                                            {product.descriptor.name}
                                        </p>
                                        <div className="pt-1">
                                            <p className={styles.quantity_count}>
                                                {`QTY: ${quantity?.count ?? "0"}  X  ₹ ${Number(
                                                    product?.price?.value
                                                )?.toFixed(2)}`}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="ms-auto">
                                        <p
                                            className={styles.product_price}
                                            style={{ whiteSpace: "nowrap" }}
                                        >
                                            ₹ {Number(totalPriceOfProduct)?.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                                {index < order_details?.items?.length - 1 && (
                                    <hr
                                        className="mt-3 mb-0"
                                        style={{ border: "1px solid #ddd", width: "100%" }}
                                    />
                                )}
                            </>
                        );
                    })}
                </div>

                {/* ISSUE DESCRIPTION */}
                <div className="py-2" style={{ borderTop: "1px solid #ddd" }}>
                    <p className={styles.address_name_and_phone}>
                        {description?.short_desc ?? "NA"}
                    </p>
                    <p className={styles.address_type_label}>
                        {description?.long_desc ?? "NA"}
                    </p>
                    {/* {description?.additional_desc?.url && (
                        <div>
                            <a
                                href={description.additional_desc.url}
                                rel="noreferrer"
                                target="_blank"
                            >
                                <div>{description.additional_desc.url}</div>
                            </a>
                        </div>
                    )} */}
                    {description?.images &&
                        description?.images?.map((image) => {
                            return (
                                <div className="container py-2 px-0">
                                    <a href={image} rel="noreferrer" target="_blank">
                                        <img style={{ height: "25%", width: "25%" }} src={image} />
                                    </a>
                                </div>
                            );
                        })}
                </div>

                {/* ITEM RESOLUTION TIME  */}
                <div
                    className="container py-2 px-0"
                    style={{ borderTop: "1px solid #ddd" }}
                >
                    <div className="row">
                        <div className="col-md-6 py-2">
                            <p className={styles.address_type_label}>
                                Expected response time:
                            </p>
                            <p className={styles.address_name_and_phone}>
                                {moment(created_at)
                                    .add(2, "hours")
                                    .format("hh:mm a, MMMM Do, YYYY")}
                            </p>
                        </div>
                        <div className="col-md-6 py-2">
                            <p className={styles.address_type_label}>
                                Expected resolution time:
                            </p>
                            <p className={styles.address_name_and_phone}>
                                {moment(created_at)
                                    .add(1, "days")
                                    .format("hh:mm a, MMMM Do, YYYY")}
                            </p>
                        </div>
                    </div>
                </div>

                {/* RESPONDENT ACTIONS  */}
                {issueActions?.length > 0 && (
                    <div
                        className="container py-2 px-0"
                        style={{ borderTop: "1px solid #ddd" }}
                    >
                        <p className={styles.product_name} style={{ fontSize: "16px" }}>
                            Actions taken
                        </p>
                        {issueActions?.map(
                            (
                                { respondent_action, short_desc, updated_at, updated_by },
                                index
                            ) => {
                                return (
                                    <>
                                        <div key={index} className="d-flex align-items-center pt-3">
                                            <div style={{ width: "90%" }}>
                                                <p
                                                    className={styles.product_name}
                                                    title={short_desc}
                                                    style={{ fontSize: "16px" }}
                                                >
                                                    ⦿ {short_desc}
                                                </p>
                                                <div className="pt-1">
                                                    <p className={styles.quantity_count}>
                                                        {`Updated by: ${updated_by?.person?.name}`}
                                                    </p>
                                                </div>
                                                <div className="pt-1">
                                                    <p className={styles.quantity_count}>
                                                        {`Updated at:  ${moment(updated_at).format(
                                                            "MMMM Do, YYYY hh:mm a"
                                                        )}`}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="ms-auto">
                                                <p
                                                    className={styles.product_price}
                                                    style={{ whiteSpace: "nowrap" }}
                                                >
                                                    Action: {respondent_action}
                                                </p>
                                            </div>
                                        </div>
                                        {index < issueActions?.length - 1 && (
                                            <hr
                                                className="mt-3 mb-0"
                                                style={{ border: "1px solid #ddd", width: "100%" }}
                                            />
                                        )}
                                    </>
                                );
                            }
                        )}
                    </div>
                )}

                {/* RESOLUTION  */}
                {issue_actions?.resolution && (
                    <div
                        className="container py-2 px-0"
                        style={{ borderTop: "1px solid #ddd" }}
                    >
                        <p className={styles.product_name} style={{ fontSize: "16px" }}>
                            Resolution
                        </p>

                        <div className="d-flex align-items-center pt-3">
                            <div style={{ width: "90%" }}>
                                <p
                                    className={styles.product_name}
                                    title={issue_actions?.resolution?.resolution_remarks}
                                    style={{ fontSize: "16px" }}
                                >
                                    {issue_actions?.resolution?.resolution_remarks}
                                </p>
                            </div>
                            <div className="ms-auto">
                                <p
                                    className={styles.product_price}
                                    style={{ whiteSpace: "nowrap" }}
                                >
                                    Action: {issue_actions?.resolution?.resolution_action}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ACTIONS FOR AN ORDER  */}
                <div
                    className="d-flex align-items-center mt-3 pt-3 "
                    style={{ borderTop: "1px solid #ddd" }}
                >
                    <div >
                        <p className={styles.status_label}>
                            Email:{" "}
                            {issue_actions?.respondent_actions[issue_actions.respondent_actions.length - 1]?.updated_by
                                ?.contact?.email ?? "N/A"}
                        </p>
                        <p className={styles.status_label}>
                            Phone:{" "}
                            {issue_actions?.respondent_actions[issue_actions.respondent_actions.length - 1]?.updated_by
                                ?.contact?.phone ?? "N/A"}
                        </p>
                    </div>
                    {((issueActions[issueActions.length - 1]?.respondent_action !== "ESCALATE") && !issueActions?.some(x => x.respondent_action === "CLOSE")) &&
                        <div className="ms-auto">
                            <div className="d-flex align-items-center justify-content-center flex-wrap">
                                {
                                    issueActions.some(x => x.respondent_action === "RESOLVED") ?
                                        <button
                                            disabled={
                                                statusLoading
                                            }
                                            className={
                                                statusLoading
                                                    ? styles.secondary_action_loading
                                                    : styles.secondary_action
                                            }
                                            onClick={() => {
                                                setSupportActionDetails(props)
                                                setToggleActionModal(true)
                                            }}
                                        >
                                            {statusLoading ? (
                                                <Loading backgroundColor={ONDC_COLORS.SECONDARYCOLOR} />
                                            ) : (
                                                "Take Action"
                                            )}
                                        </button>
                                        :
                                        <button
                                            disabled={
                                                statusLoading
                                            }
                                            className={
                                                statusLoading
                                                    ? styles.secondary_action_loading
                                                    : styles.secondary_action
                                            }
                                            onClick={() => checkIssueStatus()}
                                        >
                                            {statusLoading ? (
                                                <Loading backgroundColor={ONDC_COLORS.SECONDARYCOLOR} />
                                            ) : (
                                                "Get Status"
                                            )}
                                        </button>
                                }
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}
