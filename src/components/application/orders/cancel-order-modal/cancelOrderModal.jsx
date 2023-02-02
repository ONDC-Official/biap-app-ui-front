import React, { useContext, useRef, useState, useEffect } from "react";
import CrossIcon from "../../../shared/svg/cross-icon";
import { ONDC_COLORS } from "../../../shared/colors";
import Button from "../../../shared/button/button";
import { buttonTypes } from "../../../shared/button/utils";
import styles from "../../../../styles/search-product-modal/searchProductModal.module.scss";
import cancelRadioStyles from "../../../../styles/cart/cartView.module.scss";
import productStyles from "../../../../styles/orders/orders.module.scss";
import ErrorMessage from "../../../shared/error-message/errorMessage";
import { toast_actions, toast_types } from "../../../shared/toast/utils/toast";
import { getValueFromCookie } from "../../../../utils/cookies";
import { ToastContext } from "../../../../context/toastContext";
import useCancellablePromise from "../../../../api/cancelRequest";
import { SSE_TIMEOUT } from "../../../../constants/sse-waiting-time";
import { postCall, getCall } from "../../../../api/axios";
import AddressRadioButton from "../../initialize-order/address-details/address-radio-button/addressRadioButton";
import Checkbox from "../../../shared/checkbox/checkbox";
import Dropdown from "../../../shared/dropdown/dropdown";
import DropdownSvg from "../../../shared/svg/dropdonw";
import { CANCELATION_REASONS, RETURN_REASONS } from "../../../../constants/cancelation-reasons";

export default function CancelOrderModal({
  bpp_id,
  transaction_id,
  order_id,
  order_status,
  partailsCancelProductList = [],
  onClose,
  onSuccess,
  quantity,
}) {
  // CONSTANTS
  const CANCEL_ORDER_TYPES = {
    allOrder: "ALL_ORDERS",
    partialOrders: "PARTIAL_ORDERS",
    returnOrders: "RETURN_ORDERS",
  };

  // STATES
  const [inlineError, setInlineError] = useState({
    selected_id_error: "",
    reason_error: "",
  });
  const [loading, setLoading] = useState(false);
  const [selectedCancelType, setSelectedCancelType] = useState();
  const [selectedCancelReasonId, setSelectedCancelReasonId] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);

  // REFS
  const cancelEventSourceResponseRef = useRef(null);
  const cancelPartialEventSourceResponseRef = useRef(null);
  const eventTimeOutRef = useRef([]);

  // CONTEXT
  const dispatch = useContext(ToastContext);

  // HOOKS
  const { cancellablePromise } = useCancellablePromise();

  // use this function to check if the list exist or not for partial products
  // to be cancled
  function areProductsToBeCancled() {
    return partailsCancelProductList?.length > 0;
  }

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

  // CANCEL APIS
  // use this function to fetch cancel product through events
  function fetchCancelOrderDataThroughEvents(message_id) {
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
    es.addEventListener("on_cancel", (e) => {
      const { messageId } = JSON.parse(e?.data);
      getCancelOrderDetails(messageId);
    });

    const timer = setTimeout(() => {
      es.close();
      if (cancelEventSourceResponseRef.current.length <= 0) {
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

  // use this api to cancel an order
  async function handleFetchCancelOrderDetails() {
    const allCheckPassed = [checkReason()].every(Boolean);
    if (!allCheckPassed) return;

    cancelEventSourceResponseRef.current = [];
    setLoading(true);
    try {
      const { context } = await cancellablePromise(
        postCall("/clientApis/v1/cancel_order", {
          context: {
            bpp_id,
            transaction_id,
          },
          message: {
            order_id,
            cancellation_reason_id: "1",
          },
        })
      );
      fetchCancelOrderDataThroughEvents(context.message_id);
    } catch (err) {
      setLoading(false);
      dispatchToast(err?.message, toast_types.error);
    }
  }

  // on cancel Api
  async function getCancelOrderDetails(message_id) {
    try {
      const data = await cancellablePromise(
        getCall(`/clientApis/v1/on_cancel_order?messageId=${message_id}`)
      );
      cancelEventSourceResponseRef.current = [
        ...cancelEventSourceResponseRef.current,
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

  // use this api to partial update orders
  async function handlePartialOrderCancel() {
    const allCheckPassed = [checkReason(), checkIsOrderSelected()].every(
      Boolean
    );
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
    const payload = selectedIds?.map((item) => ({
      id: item?.id,
      quantity: {
        count: quantity[0]?.count,
      },
      tags: {
        update_type: selectedCancelType === CANCEL_ORDER_TYPES.returnOrders ? "return" : "cancel",
        reason_code: selectedCancelReasonId?.key,
        ttl_approval: item?.["@ondc/org/return_window"]
          ? item?.["@ondc/org/return_window"]
          : "",
        ttl_reverseqc: "P3D",
        image: "",
      },
    }));
    try {
      const data = await cancellablePromise(
        postCall(
          "clientApis/v1/update",
          requestObject?.map((item, index) => {
            return {
              context: {
                bpp_id,
                transaction_id,
              },
              message: {
                update_target: "item",
                order: {
                  id: order_id,
                  state: order_status,
                  provider: {
                    id: item?.[index]?.provider_details?.id,
                  },
                  items: payload,
                },
              },
            };
          })
        )
      );
      //Error handling workflow eg, NACK
      if (data[0].error && data[0].message.ack.status === "NACK") {
        setLoading(false);
        dispatchToast(data[0].error.message);
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

  // on Update api
  async function getPartialCancelOrderDetails(message_id) {
    try {
      const data = await cancellablePromise(
        getCall(`/clientApis/v2/on_update?messageId=${message_id}`)
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

  // use this function to check if any order is selected
  function checkIsOrderSelected() {
    if (selectedIds.length <= 0) {
      setInlineError((error) => ({
        ...error,
        selected_id_error: "Please select a product to cancel",
      }));
      return false;
    }
    return true;
  }

  // use this function to check if any reason is selected
  function checkReason() {
    if (Object.keys(selectedCancelReasonId).length <= 0) {
      setInlineError((error) => ({
        ...error,
        reason_error: "Please Select Reason",
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
  function addProductToCancel(attribute) {
    setSelectedIds([...selectedIds, attribute]);
  }

  // use this function to remove the selected attribute from filter
  function removeProductToCancel(attribute) {
    setSelectedIds(selectedIds.filter(({ id }) => id !== attribute.id));
  }

  useEffect(() => {
    return () => {
      eventTimeOutRef.current.forEach(({ eventSource, timer }) => {
        eventSource.close();
        clearTimeout(timer);
      });
    };
  }, []);

  // use this effect to promatically navigate between the radio button
  useEffect(() => {
    if (areProductsToBeCancled()) {
      setSelectedCancelType(CANCEL_ORDER_TYPES.partialOrders);
      return;
    }
    setSelectedCancelType(CANCEL_ORDER_TYPES.allOrder);
    // eslint-disable-next-line
  }, []);

  return (
    <div className={styles.overlay}>
      <div className={styles.popup_card} style={{ width: "700px" }}>
        <div className={`${styles.card_header} d-flex align-items-center`}>
          <p className={styles.card_header_title}>Cancel Order</p>
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
          <div className="py-2 d-flex align-items-center">
            <AddressRadioButton
              disabled={loading}
              checked={selectedCancelType === CANCEL_ORDER_TYPES.allOrder}
              onClick={() => {
                setSelectedCancelType(CANCEL_ORDER_TYPES.allOrder);
              }}
            >
              <div className="px-3">
                <p className={cancelRadioStyles.address_name_and_phone}>
                  Cancel Complete Orders
                </p>
              </div>
            </AddressRadioButton>
            <AddressRadioButton
              disabled={loading || !areProductsToBeCancled()}
              checked={selectedCancelType === CANCEL_ORDER_TYPES.partialOrders}
              onClick={() => {
                setSelectedCancelType(CANCEL_ORDER_TYPES.partialOrders);
              }}
            >
              <div className="px-3">
                <p className={cancelRadioStyles.address_name_and_phone}>
                  Cancel Selected
                </p>
              </div>
            </AddressRadioButton>

            <AddressRadioButton
              disabled={loading || !areProductsToBeCancled()}
              checked={selectedCancelType === CANCEL_ORDER_TYPES.returnOrders}
              onClick={() => {
                setSelectedCancelType(CANCEL_ORDER_TYPES.returnOrders);
              }}
            >
              <div className="px-3">
                <p className={cancelRadioStyles.address_name_and_phone}>
                  Return
                </p>
              </div>
            </AddressRadioButton>
          </div>
          <div style={{ maxHeight: "250px", overflow: "auto" }}>
            {areProductsToBeCancled() &&
              (selectedCancelType === CANCEL_ORDER_TYPES.partialOrders || selectedCancelType === CANCEL_ORDER_TYPES.returnOrders) && (
                <div className="px-1 py-2">
                  {partailsCancelProductList?.map((product, idx) => {
                    return (
                      <div
                        key={product?.id}
                        className="d-flex align-items-center"
                      >
                        <div style={{ width: "90%" }}>
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
                              addProductToCancel(product);
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
              )}
          </div>
          {inlineError.selected_id_error && (
            <ErrorMessage>{inlineError.selected_id_error}</ErrorMessage>
          )}
          <div className="px-2">
            <p className={styles.cancel_dropdown_label_text}>
              Select your Reason
            </p>
            <Dropdown
              header={
                <div
                  className={`${styles.cancel_dropdown_wrapper} d-flex align-items-center`}
                >
                  <div className="px-2">
                    <p className={styles.cancel_dropdown_text}>
                      {selectedCancelReasonId?.value
                        ? selectedCancelReasonId?.value
                        : "Select reason for cancelation"}
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
                const REASONS = selectedCancelType === CANCEL_ORDER_TYPES.returnOrders ? RETURN_REASONS : CANCELATION_REASONS
                const type = REASONS.find(
                  ({ value }) =>
                    value.toLowerCase() === reasonValue.toLowerCase()
                );
                setSelectedCancelReasonId(type);
                setInlineError((error) => ({
                  ...error,
                  reason_error: "",
                }));
              }}
              options={selectedCancelType === CANCEL_ORDER_TYPES.returnOrders ? RETURN_REASONS.map(({ value }) => ({
                value,
              })) : CANCELATION_REASONS.map(({ value }) => ({
                value,
              }))}
              show_icons={false}
            />
            {inlineError.reason_error && (
              <ErrorMessage>{inlineError.reason_error}</ErrorMessage>
            )}
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
              onClick={() => {
                if (selectedCancelType === CANCEL_ORDER_TYPES.allOrder) {
                  handleFetchCancelOrderDetails();
                } else {
                  handlePartialOrderCancel();
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
