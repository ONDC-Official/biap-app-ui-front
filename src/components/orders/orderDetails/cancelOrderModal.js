import React, { useContext, useRef, useState, useEffect } from "react";
import CrossIcon from "../../shared/svg/cross-icon";
import { ONDC_COLORS } from "../../shared/colors";
// import Button from "../../shared/button/button";
import { buttonTypes } from "../../shared/button/utils";
import styles from "../../../styles/search-product-modal/searchProductModal.module.scss";
import productCartStyles from "../../../styles/products/productCard.module.scss";
import cancelRadioStyles from "../../../styles/cart/cartView.module.scss";
import productStyles from "../../../styles/orders/orders.module.scss";
import ErrorMessage from "../../shared/error-message/errorMessage";
import { toast_actions, toast_types } from "../../shared/toast/utils/toast";
import { getValueFromCookie } from "../../../utils/cookies";
import { ToastContext } from "../../../context/toastContext";
import useCancellablePromise from "../../../api/cancelRequest";
import { SSE_TIMEOUT } from "../../../constants/sse-waiting-time";
import { postCall, getCall } from "../../../api/axios";
import AddressRadioButton from "../../../components/application/initialize-order/address-details/address-radio-button/addressRadioButton";
import Checkbox from "../../shared/checkbox/checkbox";
import Dropdown from "../../shared/dropdown/dropdown";
import Subtract from "../../shared/svg/subtract";
import Add from "../../shared/svg/add";
import { CANCELATION_REASONS } from "../../../constants/cancelation-reasons";
import { Button, Grid, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function CancelOrderModal(props) {
  const {
    bpp_id,
    transaction_id,
    order_id,
    order_status,
    partailsCancelProductList = [],
    onClose,
    onSuccess,
    quantity,
    domain,
    bpp_uri,
    handleFetchUpdatedStatus,
    onUpdateOrder,
  } = props;

  // CONSTANTS
  const CANCEL_ORDER_TYPES = {
    allOrder: "ALL_ORDERS",
    partialOrders: "PARTIAL_ORDERS",
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
  const [orderQty, setOrderQty] = useState([]);
  const [reasons, setReasons] = useState([]);

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
      onUpdateOrder();
    });

    const timer = setTimeout(() => {
      es.close();
      if (cancelEventSourceResponseRef.current.length <= 0) {
        dispatchToast("Cannot proceed with you request now! Please try again", toast_types.error);
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
        postCall("/clientApis/v2/cancel_order", {
          context: {
            domain,
            bpp_id,
            bpp_uri,
            transaction_id,
          },
          message: {
            order_id,
            cancellation_reason_id: selectedCancelReasonId?.key,
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
      const data = await cancellablePromise(getCall(`/clientApis/v2/on_cancel_order?messageId=${message_id}`));
      cancelEventSourceResponseRef.current = [...cancelEventSourceResponseRef.current, data];
      setLoading(false);
      if (data?.message) {
        onSuccess();
      } else {
        dispatchToast("Something went wrong!, product status cannot be updated", toast_types.error);
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
        dispatchToast("Cannot proceed with you request now! Please try again", toast_types.error);
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
    const allCheckPassed = [checkReason(), checkIsOrderSelected()].every(Boolean);
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
        count: item.quantity.count,
      },
      tags: {
        update_type: "cancel",
        reason_code: selectedCancelReasonId?.key,
        ttl_approval: item?.["@ondc/org/return_window"] ? item?.["@ondc/org/return_window"] : "",
        ttl_reverseqc: "P3D",
        image: "",
      },
    }));

    try {
      const data = await cancellablePromise(
        postCall(
          "clientApis/v2/update",
          requestObject?.map((item, index) => {
            return {
              context: {
                domain,
                bpp_id,
                bpp_uri,
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

  // on Update api
  async function getPartialCancelOrderDetails(message_id) {
    try {
      const data = await cancellablePromise(getCall(`/clientApis/v2/on_update?messageId=${message_id}`));
      cancelPartialEventSourceResponseRef.current = [...cancelPartialEventSourceResponseRef.current, data];
      setLoading(false);
      if (data?.message) {
        onSuccess();
      } else {
        dispatchToast("Something went wrong!, product status cannot be updated", toast_types.error);
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
    return selectedIds.filter(({ id: provider_id }) => provider_id === id).length > 0;
  }

  // use this function to add attribute in filter list
  function addProductToCancel(attribute, qty) {
    let latestAttribute = JSON.parse(JSON.stringify(Object.assign({}, attribute)));
    latestAttribute.quantity.count = qty;
    setSelectedIds([...selectedIds, latestAttribute]);
  }

  // use this function to remove the selected attribute from filter
  function removeProductToCancel(attribute) {
    setSelectedIds(selectedIds.filter(({ id }) => id !== attribute.id));
  }

  // use this function to update quantity of the selected product
  function updateQtyForSelectedProduct(pId, qty) {
    let data = JSON.parse(JSON.stringify(Object.assign([], selectedIds)));
    data = data.map((item) => {
      if (item.id === pId) {
        item.quantity.count = qty;
      } else {
      }
      return item;
    });
    setSelectedIds(data);
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
    if (areProductsToBeCancled() && partailsCancelProductList.length !== 1) {
      setSelectedCancelType(CANCEL_ORDER_TYPES.partialOrders);
      return;
    }
    setSelectedCancelType(CANCEL_ORDER_TYPES.allOrder);
    // eslint-disable-next-line
  }, []);

  // useEffect(() => {
  //   if(selectedIds.length > 0){
  //     const findCancellableItem = selectedIds.find((p) => p?.["@ondc/org/cancellable"]);
  //     if(findCancellableItem){
  //       const data = CANCELATION_REASONS.filter((r) => r.isApplicableForCancellation);
  //       setReasons(data);
  //     }else{
  //       setReasons(CANCELATION_REASONS);
  //     }
  //   };
  // }, [selectedIds]);

  useEffect(() => {
    if (selectedCancelType === CANCEL_ORDER_TYPES.allOrder) {
      const data = CANCELATION_REASONS.filter((r) => !r.isApplicableForCancellation);
      setReasons(data);
    } else if (selectedCancelType === CANCEL_ORDER_TYPES.partialOrders) {
      setReasons(CANCELATION_REASONS);
    } else {
      setReasons([]);
    }
  }, [selectedCancelType]);

  useEffect(() => {
    if (quantity) {
      setOrderQty(JSON.parse(JSON.stringify(Object.assign(quantity))));
    }
  }, [quantity]);

  const onUpdateQty = (qty, idx, pId) => {
    let qtyData = Object.assign([], orderQty);
    qtyData[idx].count = qty;
    setOrderQty(qtyData);
    updateQtyForSelectedProduct(pId, qty);
  };

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
                <p className={cancelRadioStyles.address_name_and_phone}>Cancel Complete Orders</p>
              </div>
            </AddressRadioButton>
            <AddressRadioButton
              disabled={loading || !areProductsToBeCancled() || partailsCancelProductList.length === 1}
              checked={selectedCancelType === CANCEL_ORDER_TYPES.partialOrders}
              onClick={() => {
                setSelectedCancelType(CANCEL_ORDER_TYPES.partialOrders);
              }}
            >
              <div className="px-3">
                <p className={cancelRadioStyles.address_name_and_phone}>Cancel Selected</p>
              </div>
            </AddressRadioButton>
          </div>
          <div style={{ maxHeight: "250px", overflow: "auto" }}>
            {areProductsToBeCancled() && selectedCancelType === CANCEL_ORDER_TYPES.partialOrders && (
              <div className="px-1 py-2">
                {partailsCancelProductList?.map((product, idx) => {
                  return (
                    <div className="d-flex mb-4">
                      <div style={{ width: 100, height: 80 }}>
                        <img src={product?.descriptor?.symbol} alt="" style={{ width: "100%", height: "100%" }} />
                      </div>
                      <div className="d-flex px-2" style={{ flex: 1, justifyContent: "space-between" }}>
                        <div className="d-flex" style={{ flex: 1, flexDirection: "column" }}>
                          <Typography
                            className={productStyles.product_name}
                            title={product?.name}
                            style={{ fontSize: "16px", textAlign: "left" }}
                          >
                            {product?.name}
                          </Typography>
                          <div className="my-1">
                            <Typography variant="subtitle1" color="#686868">
                              QTY: {quantity?.[idx]?.count ?? "0"} X ₹{" "}
                              {Number(product?.price?.value)?.toFixed(2) || "Price Not Available"}
                            </Typography>
                            {Object.keys(product?.customizations || {}).map((key, idx) => {
                              const isLastItem = idx === Object.keys(product.customizations || {}).length - 1;
                              return (
                                <Grid container key={key}>
                                  <Typography variant="subtitle1" color="#686868">
                                    {product.customizations[key].title || "Customization Title"} (₹
                                    {product.customizations[key].price.value || "0"}) {isLastItem ? "" : "+"}
                                  </Typography>
                                </Grid>
                              );
                            })}
                          </div>
                        </div>
                        <div style={{ width: 100 }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Typography className={productStyles.quantity_count}>
                              ₹{Number(product?.price?.value)?.toFixed(2)}
                            </Typography>
                            <Checkbox
                              style={{
                                padding: 0,
                              }}
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
                            />
                          </div>
                          <div>
                            {isProductSelected(product?.id) && (
                              <div>
                                <div className={productCartStyles.quantity_count_wrapper}>
                                  <div
                                    className={`${
                                      orderQty[idx]?.count > 1 ? productCartStyles.subtract_svg_wrapper : ""
                                    } d-flex align-items-center justify-content-center`}
                                    onClick={() => {
                                      if (orderQty[idx]?.count > 1) {
                                        onUpdateQty(orderQty[idx]?.count - 1, idx, product?.id);
                                      }
                                    }}
                                  >
                                    {orderQty[idx]?.count > 1 && (
                                      <Subtract width="13" classes={productCartStyles.subtract_svg_color} />
                                    )}
                                  </div>
                                  <div className="d-flex align-items-center justify-content-center">
                                    <p className={productCartStyles.quantity_count}>
                                      {orderQty[idx]?.count ?? "0"}
                                      {/* {quantityCount} */}
                                    </p>
                                  </div>
                                  <div
                                    className={`${
                                      orderQty[idx]?.count < quantity[idx]?.count
                                        ? productCartStyles.add_svg_wrapper
                                        : ""
                                    } d-flex align-items-center justify-content-center`}
                                    onClick={() => {
                                      //   setQuantityCount((quantityCount) => quantityCount + 1);
                                      //   onAddQuantity(id);
                                      if (orderQty[idx]?.count < quantity[idx]?.count) {
                                        onUpdateQty(orderQty[idx]?.count + 1, idx, product?.id);
                                      }
                                    }}
                                  >
                                    {orderQty[idx]?.count < quantity[idx]?.count && (
                                      <Add width="13" height="13" classes={productCartStyles.add_svg_color} />
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {inlineError.selected_id_error && <ErrorMessage>{inlineError.selected_id_error}</ErrorMessage>}

          {selectedCancelType === CANCEL_ORDER_TYPES.allOrder && (
            <div className="px-2">
              <p className={styles.cancel_dropdown_label_text}>Select your Reason</p>
              <Dropdown
                header={
                  <div className={`${styles.cancel_dropdown_wrapper} d-flex align-items-center`}>
                    <div className="px-2">
                      <p className={styles.cancel_dropdown_text}>
                        {selectedCancelReasonId?.value
                          ? selectedCancelReasonId?.value
                          : "Select reason for cancellation"}
                      </p>
                    </div>
                    <div className="px-2 ms-auto">
                      <ExpandMoreIcon sx={{ color: "#979797" }} />
                    </div>
                  </div>
                }
                body_classes="dropdown-menu-right"
                style={{ width: "100%", maxHeight: "250px", overflow: "auto", margin: "180px 0" }}
                click={(reasonValue) => {
                  const REASONS = reasons;
                  const type = REASONS.find(({ value }) => value.toLowerCase() === reasonValue.toLowerCase());
                  setSelectedCancelReasonId(type);
                  setInlineError((error) => ({
                    ...error,
                    reason_error: "",
                  }));
                }}
                options={reasons.map(({ value }) => ({
                  value,
                }))}
                show_icons={false}
              />
              {inlineError.reason_error && <ErrorMessage>{inlineError.reason_error}</ErrorMessage>}
            </div>
          )}
          {selectedCancelType === CANCEL_ORDER_TYPES.partialOrders && selectedIds && selectedIds.length > 0 && (
            <div className="px-2">
              <p className={styles.cancel_dropdown_label_text}>Select your Reason</p>
              <Dropdown
                header={
                  <div className={`${styles.cancel_dropdown_wrapper} d-flex align-items-center`}>
                    <div className="px-2">
                      <p className={styles.cancel_dropdown_text}>
                        {selectedCancelReasonId?.value
                          ? selectedCancelReasonId?.value
                          : "Select reason for cancellation"}
                      </p>
                    </div>
                    <div className="px-2 ms-auto">
                      <ExpandMoreIcon sx={{ color: "#979797" }} />
                    </div>
                  </div>
                }
                body_classes="dropdown-menu-right"
                style={{ width: "100%", maxHeight: "250px", overflow: "auto" }}
                click={(reasonValue) => {
                  const REASONS = reasons;
                  const type = REASONS.find(({ value }) => value.toLowerCase() === reasonValue.toLowerCase());
                  setSelectedCancelReasonId(type);
                  setInlineError((error) => ({
                    ...error,
                    reason_error: "",
                  }));
                }}
                options={reasons.map(({ value }) => ({
                  value,
                }))}
                show_icons={false}
              />
              {inlineError.reason_error && <ErrorMessage>{inlineError.reason_error}</ErrorMessage>}
            </div>
          )}
        </div>
        <div className={`${styles.card_footer} d-flex align-items-center`}>
          <div className="px-3">
            <Button
              sx={{ paddingLeft: 4, paddingRight: 4 }}
              disabled={loading}
              variant="outlined"
              onClick={() => {
                onClose();
              }}
            >
              Cancel
            </Button>
          </div>
          <div>
            <Button
              sx={{ paddingLeft: 4, paddingRight: 4 }}
              isloading={loading ? 1 : 0}
              disabled={loading}
              variant="contained"
              onClick={() => {
                if (selectedCancelType === CANCEL_ORDER_TYPES.allOrder) {
                  handleFetchCancelOrderDetails();
                } else {
                  handlePartialOrderCancel();
                }
              }}
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
