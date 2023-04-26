import React, { useContext, useState, useRef } from "react";
import CrossIcon from "../../../shared/svg/cross-icon";
import { ONDC_COLORS } from "../../../shared/colors";
import Button from "../../../shared/button/button";
import { buttonTypes } from "../../../shared/button/utils";
import styles from "../../../../styles/search-product-modal/searchProductModal.module.scss";
import ErrorMessage from "../../../shared/error-message/errorMessage";
import Input from "../../../shared/input/input";
import { toast_actions, toast_types } from "../../../shared/toast/utils/toast";
import axios from "axios";
import { getValueFromCookie } from "../../../../utils/cookies";
import { ToastContext } from "../../../../context/toastContext";
import validator from "validator";
import useCancellablePromise from "../../../../api/cancelRequest";
import AddressRadioButton from "../../initialize-order/address-details/address-radio-button/addressRadioButton";
import cancelRadioStyles from "../../../../styles/cart/cartView.module.scss";
import Like from "../../../shared/svg/like";
import Dislike from "../../../shared/svg/dislike";
import labelStyles from "../../../shared/input/input.module.scss"
import { getCall, postCall } from "../../../../api/axios";
import { SSE_TIMEOUT } from "../../../../constants/sse-waiting-time";

export default function CustomerActionCard({
    supportActionDetails,
    onClose,
    onSuccess,
}) {
    // CONSTANTS
    const token = getValueFromCookie("token");
    // CONSTANTS
    const ACTION_TYPES = {
        closeIssue: "CLOSE_ISSUE",
        escalateIssue: "ESCALATE_ISSUE",
    };

    // STATES
    const [inlineError, setInlineError] = useState({
        remarks_error: "",
    });
    const [loading, setLoading] = useState(false);
    const [customerRemarks, setCustomerRemarks] = useState("");
    const [selectedCancelType, setSelectedCancelType] = useState(ACTION_TYPES.closeIssue);
    const [like, setLike] = useState()
    const [dislike, setDislike] = useState()

    // REFS
    const cancelPartialEventSourceResponseRef = useRef(null);
    const eventTimeOutRef = useRef([]);

    // CONTEXT
    const dispatch = useContext(ToastContext);

    // HOOKS
    const { cancellablePromise } = useCancellablePromise();

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

    // use this function to check the user entered remarks
    function checkRemarks() {
        if (validator.isEmpty(customerRemarks)) {
            setInlineError((error) => ({
                ...error,
                remarks_error: "Please enter a phone number",
            }));
            return false;
        }
        return true;
    }

    // use this function to check the user rating
    function checkRating() {
        if (like === undefined && dislike === undefined) {
            setInlineError((error) => ({
                ...error,
                remarks_error: "Please choose a rating",
            }));
            return false;
        }
        return true;
    }

    async function contactSupport() {
        if (selectedCancelType === ACTION_TYPES.closeIssue && !checkRating()) {
            return;
        }
        if (selectedCancelType === ACTION_TYPES.escalateIssue && !checkRemarks()) {
            return;
        }
        cancelPartialEventSourceResponseRef.current = [];
        setLoading(true);
        try {
            const { bpp_id, issue_actions, issue_id } = supportActionDetails
            const dataObject = {
                context: {
                    action: "issue",
                    bpp_id,
                    // bpp_uri,
                    timestamp: new Date(),
                },
            }

            if (selectedCancelType === ACTION_TYPES.closeIssue) {
                dataObject.message = {
                    issue: {
                        id: issue_id,
                        status: "CLOSED",
                        rating: like ? "THUMBS-UP" : "THUMBS-DOWN",
                        updated_at: new Date(),
                        created_at: new Date(),
                        issue_actions: {
                            complainant_actions: [
                                ...issue_actions.complainant_actions,
                                {
                                    complainant_action: "CLOSE",
                                    remarks: "Complaint closed",
                                    updated_at: new Date(),
                                    updated_by: issue_actions.complainant_actions[0].updated_by
                                }
                            ]
                        },
                    },
                }
            } else {
                dataObject.message = {
                    issue: {
                        id: issue_id,
                        status: "OPEN",
                        issue_type: "GRIEVANCE",
                        updated_at: new Date(),
                        created_at: new Date(),
                        issue_actions: {
                            complainant_actions: [
                                ...issue_actions.complainant_actions,
                                {
                                    complainant_action: "ESCALATE",
                                    remarks: customerRemarks,
                                    updated_at: new Date(),
                                    updated_by: issue_actions.complainant_actions[0].updated_by
                                }
                            ]
                        },
                    },
                }
            }

            const data = await cancellablePromise(
                postCall("/issueApis/v1/issue", dataObject));
            //Error handling workflow eg, NACK
            if (data.message && data.message.ack.status === "NACK") {
                setLoading(false);
                dispatchToast("Something went wrong", toast_types.error);
            } else {
                fetchCancelPartialOrderDataThroughEvents(data.context?.message_id);
            }
        } catch (err) {
            setLoading(false);
            dispatchToast(err?.message, toast_types.error);
        }
    }

    // PARTIAL CANCEL APIS
    // use this function to fetch cancel product through events
    function fetchCancelPartialOrderDataThroughEvents(message_id) {
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
        es.addEventListener("on_issue", (e) => {
            console.log("HERE in ON_ISSUE");
            const { messageId } = JSON.parse(e?.data);
            getPartialCancelOrderDetails(messageId);
        });

        const timer = setTimeout(() => {
            es.close();
            if (cancelPartialEventSourceResponseRef.current.length <= 0) {
                dispatchToast(
                    "Cannot proceed with you request now! Please try again",
                    toast_types.error
                );
                setLoading(false);
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

    // on Issue api
    async function getPartialCancelOrderDetails(message_id) {
        try {
            const data = await cancellablePromise(
                getCall(`/issueApis/v1/on_issue?messageId=${message_id}`)
            );
            cancelPartialEventSourceResponseRef.current = [
                ...cancelPartialEventSourceResponseRef.current,
                data,
            ];
            setLoading(false);
            if (data?.message) {
                onSuccess();
            } else {
                dispatchToast(
                    "Something went wrong!, product status cannot be updated",
                    toast_types.error
                );
            }
        } catch (err) {
            setLoading(false);
            dispatchToast(err?.message, toast_types.error);
            eventTimeOutRef.current.forEach(({ eventSource, timer }) => {
                eventSource.close();
                clearTimeout(timer);
            });
        }
    }

    const review = (type) => {
        setInlineError((inlineError) => ({
            ...inlineError,
            remarks_error: "",
        }));
        if (type === 'like') {
            setLike(true)
            setDislike(false)
        } else {
            setLike(false)
            setDislike(true)
        }

    }

    return (
        <div className={styles.overlay}>
            <div className={styles.popup_card}>
                <div className={`${styles.card_header} d-flex align-items-center`}>
                    <p className={styles.card_header_title}>Take Action</p>
                    <div className="ms-auto">
                        <CrossIcon
                            width="20"
                            height="20"
                            color={ONDC_COLORS.SECONDARYCOLOR}
                            style={{ cursor: "pointer" }}
                            onClick={onClose}
                        />
                    </div>
                </div>

                <div className="p-2 d-flex align-items-center">
                    <AddressRadioButton
                        disabled={loading}
                        checked={selectedCancelType === ACTION_TYPES.closeIssue}
                        onClick={() => {
                            setSelectedCancelType(ACTION_TYPES.closeIssue);
                            setInlineError((inlineError) => ({
                                ...inlineError,
                                remarks_error: "",
                            }));
                        }}
                    >
                        <div className="px-3">
                            <p className={cancelRadioStyles.address_name_and_phone}>
                                Close
                            </p>
                        </div>
                    </AddressRadioButton>

                    <AddressRadioButton
                        disabled={loading}
                        checked={selectedCancelType === ACTION_TYPES.escalateIssue}
                        onClick={() => {
                            setSelectedCancelType(ACTION_TYPES.escalateIssue);
                            setInlineError((inlineError) => ({
                                ...inlineError,
                                remarks_error: "",
                            }));
                        }}
                    >
                        <div className="px-3">
                            <p className={cancelRadioStyles.address_name_and_phone}>
                                Escalate
                            </p>
                        </div>
                    </AddressRadioButton>
                </div>
                <div className={styles.card_body}>
                    {selectedCancelType === ACTION_TYPES.closeIssue ?
                        <div>
                            <label
                                className={`${labelStyles.form_label} ${labelStyles.required}`}
                            >
                                Choose Rating
                            </label>
                            <div
                                className="d-flex align-items-center justify-content-center" >
                                <button style={{ border: 'none', backgroundColor: 'transparent' }} onClick={() => review('like')}>
                                    <Like like={like} />
                                </button>
                                <button style={{ border: 'none', backgroundColor: 'transparent' }} onClick={() => review('dislike')}>
                                    <Dislike dislike={dislike} />
                                </button>
                            </div>
                        </div>
                        :
                        <Input
                            label_name="Remarks"
                            type="text"
                            placeholder="Enter the remarks."
                            id="remarks"
                            has_error={inlineError.remarks_error}
                            value={customerRemarks}
                            onChange={(event) => {
                                const remarks = event.target.value;
                                setCustomerRemarks(remarks);
                                setInlineError((inlineError) => ({
                                    ...inlineError,
                                    remarks_error: "",
                                }));
                            }}
                            required
                        />

                    }
                    {inlineError.remarks_error && (
                        <ErrorMessage>{inlineError.remarks_error}</ErrorMessage>
                    )}
                </div>

                <div
                    className={`${styles.card_footer} d-flex align-items-center justify-content-center`}
                >
                    <div className="px-3">
                        <Button
                            disabled={loading}
                            button_type={buttonTypes.secondary}
                            button_hover_type={buttonTypes.secondary_hover}
                            button_text="Cancel"
                            onClick={() => {
                                onClose();
                            }}
                        />
                    </div>
                    <div className="px-3">
                        <Button
                            isloading={loading ? 1 : 0}
                            disabled={loading}
                            button_type={buttonTypes.primary}
                            button_hover_type={buttonTypes.primary_hover}
                            button_text="Submit"
                            onClick={() => {
                                contactSupport();
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
