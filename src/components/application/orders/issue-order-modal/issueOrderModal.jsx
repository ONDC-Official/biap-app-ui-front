import React, { useContext, useState, useEffect, useRef } from "react";
import CrossIcon from "../../../shared/svg/cross-icon";
import { ONDC_COLORS } from "../../../shared/colors";
import Button from "../../../shared/button/button";
import { buttonTypes } from "../../../shared/button/utils";
import styles from "../../../../styles/search-product-modal/searchProductModal.module.scss";
import productStyles from "../../../../styles/orders/orders.module.scss";
import ErrorMessage from "../../../shared/error-message/errorMessage";
import { toast_actions, toast_types } from "../../../shared/toast/utils/toast";
import { ToastContext } from "../../../../context/toastContext";
import useCancellablePromise from "../../../../api/cancelRequest";
import { getCall, postCall } from "../../../../api/axios";
import Checkbox from "../../../shared/checkbox/checkbox";
import Dropdown from "../../../shared/dropdown/dropdown";
import DropdownSvg from "../../../shared/svg/dropdonw";
import { ISSUE_TYPES } from "../../../../constants/issue-types";
import Input from "../../../shared/input/input";
import validator from "validator";
import { getValueFromCookie } from "../../../../utils/cookies";
import { SSE_TIMEOUT } from "../../../../constants/sse-waiting-time";

export default function IssueOrderModal({
    billing_address,
    delivery_address,
    transaction_id,
    fulfillments,
    bpp_id,
    bpp_uri,
    order_id,
    order_status,
    partailsCancelProductList = [],
    onClose,
    onSuccess,
    quantity,
}) {
    // STATES
    const [inlineError, setInlineError] = useState({
        selected_id_error: "",
        subcategory_error: "",
        shortDescription_error: "",
        longDescription_error: ""
    });
    const [loading, setLoading] = useState(false);
    const [selectedIssueCategory, setSelectedIssueCategory] = useState();
    const [selectedIssueSubcategory, setSelectedIssueSubcategory] = useState();
    const [shortDescription, setShortDescription] = useState('');
    const [longDescription, setLongDescription] = useState('');
    const [baseImage, setBaseImage] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [orderQty, setOrderQty] = useState([]);

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

    // use this api to raise an order issue
    async function handleRaiseOrderIssue() {
        const allCheckPassed = [checkSubcategory(), checkIsOrderSelected(), checkShortDescription(), checkLongDescription()].every(Boolean);
        if (!allCheckPassed) return;

        cancelPartialEventSourceResponseRef.current = [];
        setLoading(true);
        const map = new Map();
        selectedIds.map((item) => {
            const provider_id = item?.provider_details?.id;
            if (map.get(provider_id)) {
                return map.set(provider_id, [...map.get(provider_id), item]);
            }
            return map.set(provider_id, [item]);
        });
        const requestObject = Array.from(map.values());
        console.log('requestObject= ', requestObject);
        try {
            const data = await cancellablePromise(
                postCall("/issueApis/v1/issue",
                    requestObject?.map((item, index) => {
                        return {
                            context: {
                                city: delivery_address.location?.city,
                                state: delivery_address.location?.state,
                                transaction_id,
                            },
                            message: {
                                issue: {
                                    category: selectedIssueCategory.value.toUpperCase(),
                                    sub_category: selectedIssueSubcategory.value,
                                    bppId: bpp_id,
                                    bpp_uri,
                                    created_at: new Date(),
                                    updated_at: new Date(),
                                    complainant_info: {
                                        person: {
                                            name: billing_address.name,
                                            email: billing_address.email
                                        },
                                        contact: {
                                            phone: billing_address.phone
                                        }
                                    },
                                    description: {
                                        short_desc: shortDescription,
                                        long_desc: longDescription,
                                        additional_desc: {
                                            "url": "https://buyerapp.com/additonal-details/desc.txt",
                                            "content_type": "text/plain"
                                        },
                                        images: baseImage
                                    },
                                    order_details: {
                                        id: order_id,
                                        state: order_status,
                                        items: selectedIds,
                                        fulfillments: fulfillments,
                                        provider_id: item?.[index]?.product.provider_details?.id
                                    },
                                    issue_actions: {
                                        complainant_actions: []
                                    }
                                }
                            },
                        }
                    })
                )
            );
            //Error handling workflow eg, NACK
            if (data[0].error && data[0].message.ack.status === "NACK") {
                setLoading(false);
                dispatchToast(data[0].error.message, toast_types.error);
            } else {
                fetchCancelPartialOrderDataThroughEvents(
                    data?.map((txn) => {
                        const { context } = txn;
                        return context?.message_id;
                    })
                );
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
            `${process.env.REACT_APP_BASE_URL}clientApis/events?messageId=${message_id}`,
            header
        );
        es.addEventListener("on_update", (e) => {
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
                getCall(`/clientApis/v2/on_issue?messageId=${message_id}`)
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

    useEffect(() => {
        return () => {
            eventTimeOutRef.current.forEach(({ eventSource, timer }) => {
                eventSource.close();
                clearTimeout(timer);
            });
        };
    }, []);

    function checkShortDescription() {
        if (validator.isEmpty(shortDescription.trim())) {
            setInlineError((error) => ({
                ...error,
                shortDescription_error: "Please enter short description",
            }));
            return false;
        }
        return true;
    }

    function checkLongDescription() {
        if (validator.isEmpty(longDescription.trim())) {
            setInlineError((error) => ({
                ...error,
                longDescription_error: "Please enter long description",
            }));
            return false;
        }
        return true;
    }

    // use this function to check if any order is selected
    function checkIsOrderSelected() {
        if (selectedIds.length <= 0) {
            setInlineError((error) => ({
                ...error,
                selected_id_error: "Please select item to raise an issue",
            }));
            return false;
        }
        return true;
    }

    // use this function to check if any reason is selected
    function checkSubcategory() {
        if (!selectedIssueSubcategory) {
            setInlineError((error) => ({
                ...error,
                subcategory_error: "Please select subcategory",
            }));
            return false;
        }
        return true;
    }

    // use this function to check if the provider is already selected
    function isProductSelected(id) {
        return (
            selectedIds.filter(({ id: provider_id }) => provider_id === id).length > 0
        );
    }

    // use this function to add attribute in filter list
    function addProductToCancel(attribute, qty) {
        let modifiedAttributes = {
            id: attribute.id,
            quantity: {
                count: qty
            },
            product: attribute
        }
        setSelectedIds([...selectedIds, modifiedAttributes]);
    }

    useEffect(() => {
        if (selectedIds.length > 0) {
            if (selectedIds.length < partailsCancelProductList.length) {

                const type = ISSUE_TYPES.find(
                    ({ value }) =>
                        value === "Item"
                );
                setSelectedIssueCategory(type);
            } else {

                const type = ISSUE_TYPES.find(
                    ({ value }) =>
                        value === "Fulfillment"
                );
                setSelectedIssueCategory(type);
            }

        }
    }, [selectedIds]);

    // use this function to remove the selected attribute from filter
    function removeProductToCancel(attribute) {
        setSelectedIds(selectedIds.filter(({ id }) => id !== attribute.id));
    }


    useEffect(() => {
        if (quantity) {
            setOrderQty(JSON.parse(JSON.stringify(Object.assign(quantity))));
        }
    }, [quantity]);

    const uploadImage = async (e) => {
        const file = e.target.files
        const uploaded = [...baseImage];

        for (let index = 0; index < file.length; index++) {
            const element = file[index];
            const base64 = await convertBase64(element);
            uploaded.push(base64)
            if (index === file.length - 1) {
                setBaseImage(uploaded)
            }
        }
    };

    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.popup_card} style={{ width: "700px" }}>
                <div className={`${styles.card_header} d-flex align-items-center`}>
                    <p className={styles.card_header_title}>Raise an Issue</p>
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
                <div className={styles.card_body}>
                    <p className={styles.cancel_dropdown_label_text}>
                        Choose Items that had a problem
                    </p>
                    <div style={{ maxHeight: "250px", overflow: "auto" }}>
                        <div className="px-1 py-2">
                            {partailsCancelProductList?.map((product, idx) => {
                                return (
                                    <div
                                        key={product?.id}
                                        className="d-flex align-items-center"
                                    >
                                        <div style={{ width: isProductSelected(product?.id) ? "70%" : "90%" }}>
                                            <Checkbox
                                                id={product?.id}
                                                checked={isProductSelected(product?.id)}
                                                disabled={loading}
                                                boxBasis="8%"
                                                nameBasis="92%"
                                                onClick={() => {
                                                    setInlineError((error) => ({
                                                        ...error,
                                                        selected_id_error: "",
                                                    }));
                                                    if (isProductSelected(product?.id)) {
                                                        removeProductToCancel(product);
                                                        return;
                                                    }
                                                    addProductToCancel(product, orderQty[idx]?.count);
                                                }}
                                            >
                                                <p
                                                    className={productStyles.product_name}
                                                    title={product?.name}
                                                    style={{ fontSize: "16px", textAlign: "left" }}
                                                >
                                                    {product?.name}
                                                </p>
                                                <div className="pt-1">
                                                    <p className={productStyles.quantity_count}>
                                                        QTY: {quantity[idx]?.count ?? "0"}
                                                    </p>
                                                </div>
                                            </Checkbox>
                                        </div>
                                        <div className="ms-auto">
                                            <p
                                                className={productStyles.product_price}
                                                style={{ whiteSpace: "nowrap" }}
                                            >
                                                ₹ {Number(product?.price?.value)?.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {/* )} */}
                    </div>
                    {inlineError.selected_id_error && (
                        <ErrorMessage>{inlineError.selected_id_error}</ErrorMessage>
                    )}

                    {selectedIssueCategory && (
                        <div className="px-2">
                            <p className={styles.cancel_dropdown_label_text}>
                                Select Subcategory
                            </p>
                            <Dropdown
                                header={
                                    <div
                                        className={`${styles.cancel_dropdown_wrapper} d-flex align-items-center`}
                                    >
                                        <div className="px-2">
                                            <p className={styles.cancel_dropdown_text}>
                                                {selectedIssueSubcategory?.value
                                                    ? selectedIssueSubcategory?.value
                                                    : "Select issue subcategory"}
                                            </p>
                                        </div>
                                        <div className="px-2 ms-auto">
                                            <DropdownSvg
                                                width="15"
                                                height="10"
                                                color={ONDC_COLORS.ACCENTCOLOR}
                                            />
                                        </div>
                                    </div>
                                }
                                body_classes="dropdown-menu-right"
                                style={{ width: "100%", maxHeight: "250px", overflow: "auto" }}
                                click={(reasonValue) => {
                                    const REASONS = selectedIssueCategory.subCategory;
                                    const type = REASONS.find(
                                        ({ value }) =>
                                            value.toLowerCase() === reasonValue.toLowerCase()
                                    );
                                    setSelectedIssueSubcategory(type);
                                    setInlineError((error) => ({
                                        ...error,
                                        subcategory_error: "",
                                    }));
                                }}
                                options={selectedIssueCategory.subCategory.map(({ value }) => ({
                                    value,
                                }))}
                                show_icons={false}
                            />
                            {inlineError.subcategory_error && (
                                <ErrorMessage>{inlineError.subcategory_error}</ErrorMessage>
                            )}
                        </div>
                    )}
                    <div className="px-2">
                        <Input
                            label_name="Short dscription"
                            type="text"
                            placeholder="Enter short dscription"
                            id="shortDes"
                            value={shortDescription}
                            onChange={(event) => {
                                const name = event.target.value;
                                setShortDescription(name);
                                setInlineError((error) => ({
                                    ...error,
                                    shortDescription_error: "",
                                }));
                            }}
                            required
                            has_error={inlineError.shortDescription_error}

                        />

                        <Input
                            label_name="Long dscription"
                            type="text"
                            placeholder="Enter long dscription"
                            id="longDes"
                            value={longDescription}
                            onChange={(event) => {
                                const name = event.target.value;
                                setLongDescription(name);
                                setInlineError((error) => ({
                                    ...error,
                                    longDescription_error: "",
                                }));
                            }}
                            required
                            has_error={inlineError.longDescription_error}

                        />

                        <Input
                            label_name="Images"
                            type="file"
                            id="images"
                            accept='image/png'
                            multiple="multiple"
                            onChange={uploadImage}
                        />
                    </div>

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
                            button_text="Confirm"
                            onClick={() => { handleRaiseOrderIssue(); }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
