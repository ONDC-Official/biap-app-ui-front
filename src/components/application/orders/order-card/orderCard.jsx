import React, { useState, useRef, useContext, useEffect } from "react";
import moment from "moment";
import {
  getOrderStatus,
  order_statuses,
} from "../../../../constants/order-status";
import styles from "../../../../styles/orders/orders.module.scss";
import { ONDC_COLORS } from "../../../shared/colors";
import { postCall, getCall } from "../../../../api/axios";
import Loading from "../../../shared/loading/loading";
import { toast_actions, toast_types } from "../../../shared/toast/utils/toast";
import DropdownSvg from "../../../shared/svg/dropdonw";
import CallSvg from "../../../shared/svg/callSvg";
import CustomerPhoneCard from "../customer-phone-card/customerPhoneCard";
import { ToastContext } from "../../../../context/toastContext";
import useCancellablePromise from "../../../../api/cancelRequest";
import { getValueFromCookie } from "../../../../utils/cookies";
import { SSE_TIMEOUT } from "../../../../constants/sse-waiting-time";
import CancelOrderModal from "../cancel-order-modal/cancelOrderModal";
import ReturnOrderModal from "../return-order-modal/returnOrderModal";
import IssueOrderModal from "../issue-order-modal/issueOrderModal";
import { useHistory } from "react-router-dom";
export default function OrderCard(props) {
  const {
    product = [],
    quantity = [],
    quote = [],
    fulfillments = [],
    billing_address,
    delivery_address,
    status,
    created_at,
    order_id,
    transaction_id,
    bpp_id,
    bpp_uri,
    onFetchUpdatedOrder,
    accoodion_id,
    currentSelectedAccordion,
    setCurrentSelectedAccordion,
  } = props;

  // HELPERS
  const current_order_status = getOrderStatus(status);

  // STATES
  const [trackOrderLoading, setTrackOrderLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [issueLoading, setIssueLoading] = useState(false);
  const [isIssueRaised, setIsIssueRaised] = useState(false);
  const [supportOrderLoading, setSupportOrderLoading] = useState(false);
  const [supportOrderDetails, setSupportOrderDetails] = useState();
  const [toggleCustomerPhoneCard, setToggleCustomerPhoneCard] = useState(false);
  const [toggleCancelOrderModal, setToggleCancelOrderModal] = useState(false);
  const [toggleReturnOrderModal, setToggleReturnOrderModal] = useState(false);
  const [toggleIssueModal, setToggleIssueModal] = useState(false);

  // REFS
  const trackOrderRef = useRef(null);
  const trackEventSourceResponseRef = useRef(null);
  const supportEventSourceResponseRef = useRef(null);
  const statusEventSourceResponseRef = useRef(null);
  const eventTimeOutRef = useRef([]);

  // CONTEXT
  const dispatch = useContext(ToastContext);
  const history = useHistory();

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

  // TRACK APIS
  // use this function to fetch tracking info through events
  function fetchTrackingDataThroughEvents(message_id) {
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
    es.addEventListener("on_track", (e) => {
      const { messageId } = JSON.parse(e?.data);
      getTrackOrderDetails(messageId);
    });

    const timer = setTimeout(() => {
      es.close();
      if (trackEventSourceResponseRef.current.length <= 0) {
        dispatchToast(
          "Cannot proceed with you request now! Please try again",
          toast_types.error
        );
        setTrackOrderLoading(false);
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

  // use this api to track and order
  async function handleFetchTrackOrderDetails() {
    trackEventSourceResponseRef.current = [];
    setTrackOrderLoading(true);
    try {
      const data = await cancellablePromise(
        postCall("/clientApis/v2/track", [
          {
            context: {
              transaction_id,
              bpp_id,
            },
            message: {
              order_id,
            },
          },
        ])
      );
      fetchTrackingDataThroughEvents(data[0]?.context?.message_id);
    } catch (err) {
      setTrackOrderLoading(false);
      dispatchToast(err?.message, toast_types.error);
    }
  }

  // on track order
  async function getTrackOrderDetails(message_id) {
    try {
      const data = await cancellablePromise(
        getCall(`/clientApis/v2/on_track?messageIds=${message_id}`)
      );
      trackEventSourceResponseRef.current = [
        ...trackEventSourceResponseRef.current,
        data[0],
      ];
      const { message } = data[0];
      if (message.tracking.status === "active" && message.tracking.url === "") {
        setTrackOrderLoading(false);
        dispatchToast(
          "Tracking information is not provided by the provider.",
          toast_types.error
        );
        return;
      } else if (message?.tracking?.url === "") {
        setTrackOrderLoading(false);
        dispatchToast(
          "Tracking information not available for this product",
          toast_types.error
        );
        return;
      }
      setTrackOrderLoading(false);
      trackOrderRef.current.href = message?.tracking?.url;
      trackOrderRef.current.target = "_blank";
      trackOrderRef.current.click();
    } catch (err) {
      setTrackOrderLoading(false);
      dispatchToast(err?.message, toast_types.error);
      eventTimeOutRef.current.forEach(({ eventSource, timer }) => {
        eventSource.close();
        clearTimeout(timer);
      });
    }
  }

  // get issue status
  async function getTrackIssueDetails() {
    try {
      if (currentSelectedAccordion !== accoodion_id) return
      setIssueLoading(true)
      const data = await cancellablePromise(
        getCall(`/issueApis/v1/issue?transactionId=${transaction_id}`)
      );

      const { issueExistance } = data[0];
      if (issueExistance) {
        setIssueLoading(false);
        setIsIssueRaised(true)
      } else {
        setIssueLoading(false);
      }

    } catch (err) {
      setIssueLoading(false);
      dispatchToast(err?.message, toast_types.error);
    }
  }

  // SUPPORT APIS
  // use this function to fetch support info through events
  function fetchSupportDataThroughEvents(message_id) {
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
    es.addEventListener("on_support", (e) => {
      const { messageId } = JSON.parse(e?.data);
      getSupportOrderDetails(messageId);
    });

    const timer = setTimeout(() => {
      es.close();
      if (supportEventSourceResponseRef.current.length <= 0) {
        dispatchToast(
          "Cannot proceed with you request now! Please try again",
          toast_types.error
        );
        setSupportOrderLoading(false);
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

  // use this api to call support
  async function handleFetchSupportOrderDetails() {
    if (supportOrderDetails) {
      setToggleCustomerPhoneCard(true);
      return;
    }
    supportEventSourceResponseRef.current = [];
    setSupportOrderLoading(true);
    try {
      const data = await cancellablePromise(
        postCall("/clientApis/v2/get_support", [
          {
            context: {
              transaction_id,
              bpp_id,
            },
            message: {
              ref_id: transaction_id,
            },
          },
        ])
      );
      fetchSupportDataThroughEvents(data[0]?.context?.message_id);
    } catch (err) {
      setSupportOrderLoading(false);
      dispatchToast(err?.message, toast_types.error);
    }
  }

  // on support order
  async function getSupportOrderDetails(message_id) {
    try {
      const data = await cancellablePromise(
        getCall(`/clientApis/v2/on_support?messageIds=${message_id}`)
      );
      supportEventSourceResponseRef.current = [
        ...supportEventSourceResponseRef.current,
        data[0],
      ];
      const { message } = data[0];

      if (message) {
        setToggleCustomerPhoneCard(true);
        setSupportOrderLoading(false);
        setSupportOrderDetails(message);
      } else {
        dispatchToast("Could not get data for this order!", toast_types.error);
        setSupportOrderLoading(false);
      }
    } catch (err) {
      setSupportOrderLoading(false);
      dispatchToast(err?.message, toast_types.error);
      eventTimeOutRef.current.forEach(({ eventSource, timer }) => {
        eventSource.close();
        clearTimeout(timer);
      });
    }
  }

  // STATUS APIS
  // use this function to fetch support info through events
  function fetchStatusDataThroughEvents(message_id) {
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
    es.addEventListener("on_status", (e) => {
      const { messageId } = JSON.parse(e?.data);
      getUpdatedStatus(messageId);
    });

    const timer = setTimeout(() => {
      es.close();
      if (statusEventSourceResponseRef.current.length <= 0) {
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

  // use this api to get updated status of the order
  async function handleFetchUpdatedStatus() {
    statusEventSourceResponseRef.current = [];
    setStatusLoading(true);
    try {
      const data = await cancellablePromise(
        postCall("/clientApis/v2/order_status", [
          {
            context: {
              transaction_id,
              bpp_id,
            },
            message: {
              order_id,
            },
          },
        ])
      );
      //Error handling workflow eg, NACK
      if (data[0].error && data[0].message.ack.status === "NACK") {
        setStatusLoading(false);
        dispatchToast(data[0].error.message, toast_types.error);
      } else {
        fetchStatusDataThroughEvents(data[0]?.context?.message_id);
      }
    } catch (err) {
      setStatusLoading(false);
      dispatchToast(err?.message, toast_types.error);
    }
  }

  // on status
  async function getUpdatedStatus(message_id) {
    try {
      const data = await cancellablePromise(
        getCall(`/clientApis/v2/on_order_status?messageIds=${message_id}`)
      );
      statusEventSourceResponseRef.current = [
        ...statusEventSourceResponseRef.current,
        data[0],
      ];
      const { message, error = {} } = data[0];
      if (error?.message) {
        dispatchToast("Cannot get status for this product", toast_types.error);
        setStatusLoading(false);
        return;
      }
      if (message?.order) {
        onFetchUpdatedOrder();
      }
      setStatusLoading(false);
    } catch (err) {
      setStatusLoading(false);
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

  useEffect(() => {
    getTrackIssueDetails()
  }, [currentSelectedAccordion === accoodion_id])


  return (
    <div className={styles.orders_card}>
      {toggleCustomerPhoneCard && (
        <CustomerPhoneCard
          supportOrderDetails={supportOrderDetails}
          onClose={() => setToggleCustomerPhoneCard(false)}
          onSuccess={() => {
            dispatchToast("Call successfully placed", toast_types.success);
            setSupportOrderDetails();
            setToggleCustomerPhoneCard(false);
          }}
        />
      )}
      {toggleCancelOrderModal && (
        <CancelOrderModal
          onClose={() => setToggleCancelOrderModal(false)}
          onSuccess={() => {
            setToggleCancelOrderModal(false);
            setCurrentSelectedAccordion("");
            onFetchUpdatedOrder();
          }}
          quantity={quantity}
          partailsCancelProductList={product.filter(
            (p) => p.return_status !== "Cancelled"
          )}
          // partailsCancelProductList={product?.filter(
          //   (p) => p?.["@ondc/org/cancellable"] && p?.cancellation_status === ""
          // )}
          order_status={status}
          bpp_id={bpp_id}
          transaction_id={transaction_id}
          order_id={order_id}
        />
      )}
      {toggleReturnOrderModal && (
        <ReturnOrderModal
          onClose={() => setToggleReturnOrderModal(false)}
          onSuccess={() => {
            setToggleReturnOrderModal(false);
            setCurrentSelectedAccordion("");
            onFetchUpdatedOrder();
          }}
          quantity={quantity}
          partailsReturnProductList={product}
          // partailsReturnProductList={product?.filter(
          //   (p) => p?.["@ondc/org/returnable"] && p?.return_status === ""
          // )}
          order_status={status}
          bpp_id={bpp_id}
          transaction_id={transaction_id}
          order_id={order_id}
        />
      )}

      {toggleIssueModal && (
        <IssueOrderModal
          onClose={() => setToggleIssueModal(false)}
          onSuccess={() => {
            setToggleIssueModal(false);
            setCurrentSelectedAccordion("");
            onFetchUpdatedOrder();
          }}
          quantity={quantity}
          partailsCancelProductList={product}
          order_status={status}
          billing_address={billing_address}
          delivery_address={delivery_address}
          transaction_id={transaction_id}
          order_id={order_id}
          bpp_id={bpp_id}
          bpp_uri={bpp_uri}
          fulfillments={fulfillments}
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
          <p className={styles.card_header_title}>{order_id ?? "NA"}</p>
          <p className={styles.address_type_label} style={{ fontSize: "12px" }}>
            Ordered on
            <span style={{ fontWeight: "500", padding: "0 5px" }}>
              {created_at ? moment(created_at).format("MMMM Do, YYYY") : "NA"}
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
          {product?.map(
            (
              {
                id,
                name,
                price,
                cancellation_status,
                return_status,
                fulfillment_status,
              },
              index
            ) => {
              const totalPriceOfProduct =
                Number(price?.value) * Number(quantity[index]?.count);
              return (
                <div key={id} className="d-flex align-items-center pt-3">
                  <div style={{ width: "90%" }}>
                    <p
                      className={styles.product_name}
                      title={name}
                      style={{ fontSize: "16px" }}
                    >
                      {name}
                    </p>
                    <div className="pt-1">
                      <p className={styles.quantity_count}>
                        {/* QTY: {quantity[index]?.count ?? "0"} */}
                        {`QTY: ${quantity[index]?.count ?? "0"}  X  ₹ ${Number(
                          price?.value
                        )?.toFixed(2)}`}
                      </p>
                    </div>
                    <div className="pt-2 d-flex align-items-center">
                      {cancellation_status ? (
                        <div className="me-3">
                          <div className={styles.label_chip}>
                            <p className={styles.label_chip_text}>
                              {cancellation_status}
                            </p>
                          </div>
                        </div>
                      ) : return_status ? (
                        <div className="me-3">
                          <div className={styles.label_chip}>
                            <p className={styles.label_chip_text}>
                              {return_status}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="me-3">
                            <div className={styles.label_chip}>
                              <p className={styles.label_chip_text}>
                                {product?.[index]?.["@ondc/org/returnable"]
                                  ? "returnable"
                                  : "non returnable"}
                              </p>
                            </div>
                          </div>
                          <div className="me-3">
                            <div className={styles.label_chip}>
                              <p className={styles.label_chip_text}>
                                {product?.[index]?.["@ondc/org/cancellable"]
                                  ? "cancelable"
                                  : "non cancelable"}
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                      {fulfillment_status && (
                        <div className="me-3">
                          <div className={styles.label_chip}>
                            <p className={styles.label_chip_text}>
                              {fulfillment_status}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* {product?.length - 1 !== index && (
                      <hr
                        className="mt-3 mb-0"
                        style={{ border: "1px solid #ddd" }}
                      />
                    )} */}
                    <hr
                      className="mt-3 mb-0"
                      style={{ border: "1px solid #ddd" }}
                    />
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
              );
            }
          )}
          {quote &&
            quote?.breakup?.length > 0 &&
            quote?.breakup.map((item) => {
              return (
                <div
                  key={item["@ondc/org/item_id"]}
                  className="d-flex align-items-center pt-3"
                >
                  <div style={{ width: "90%" }}>
                    <p
                      className={styles.product_name}
                      title={item.title}
                      style={{ fontSize: "16px" }}
                    >
                      {item.title}
                    </p>
                    <hr
                      className="mt-3 mb-0"
                      style={{ border: "1px solid #ddd" }}
                    />
                  </div>
                  <div className="ms-auto">
                    <p
                      className={styles.product_price}
                      style={{ whiteSpace: "nowrap" }}
                    >
                      ₹ {Number(item?.price?.value)?.toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })}
          {quote && quote?.price && (
            <div className="d-flex align-items-center pt-3">
              <div style={{ width: "90%" }}>
                <p
                  className={styles.product_name}
                  title="Total Paid"
                  style={{ fontSize: "16px" }}
                >
                  Total Amount
                </p>
              </div>
              <div className="ms-auto">
                <p
                  className={styles.product_price}
                  style={{ whiteSpace: "nowrap" }}
                >
                  ₹ {Number(quote?.price?.value)?.toFixed(2)}
                </p>
              </div>
            </div>
          )}
        </div>
        {/* BILLING AND S+DELIVERY ADDRESS  */}
        <div className="container py-2 px-0">
          <div className="row">
            <div className="col-md-6 py-2">
              {/* DELIVERY ADDRESS  */}
              <p className={styles.address_type_label}>Shipped to:</p>
              <p className={styles.address_name_and_phone}>
                {delivery_address?.name ?? "NA"}
              </p>
              <p className={`${styles.address_line_2} pb-2`}>
                {delivery_address?.email ?? "NA"} -{" "}
                {delivery_address?.phone ?? "NA"}
              </p>
              <p className={styles.address_line_1}>
                {delivery_address?.location?.street
                  ? delivery_address.location.street
                  : delivery_address?.location?.door ?? "NA"}
                , {delivery_address?.location?.city ?? "NA"}
              </p>
              <p className={styles.address_line_2}>
                {delivery_address?.location?.state ?? "NA"},{" "}
                {delivery_address?.location?.areaCode ?? "NA"}
              </p>
            </div>
            <div className="col-md-6 py-2">
              {/* SHIPPING ADDRESS  */}
              <p className={styles.address_type_label}>Billed to:</p>
              <p className={styles.address_name_and_phone}>
                {billing_address?.name ?? "NA"}
              </p>
              <p className={`${styles.address_line_2} pb-2`}>
                {billing_address?.email ?? "NA"} -{" "}
                {billing_address?.phone ?? "NA"}
              </p>
              <p className={styles.address_line_1}>
                {billing_address?.location?.street
                  ? billing_address.location.street
                  : billing_address?.location?.door ?? "NA"}
                , {billing_address?.location?.city ?? "NA"}
              </p>
              <p className={styles.address_line_2}>
                {billing_address?.location?.state ?? "NA"},{" "}
                {billing_address?.location?.areaCode ?? "NA"}
              </p>
            </div>
          </div>
        </div>
        {/* ACTIONS FOR AN ORDER  */}
        <div
          className="d-flex align-items-center mt-3 pt-3"
          style={{ borderTop: "1px solid #ddd" }}
        >
          {supportOrderLoading ? (
            <Loading backgroundColor={ONDC_COLORS.ACCENTCOLOR} />
          ) : (
            <button
              className="border-0 p-0"
              style={{ background: "transparent" }}
              onClick={handleFetchSupportOrderDetails}
              disabled={
                trackOrderLoading || statusLoading || supportOrderLoading
              }
            >
              <CallSvg />
            </button>
          )}
          <div className="ms-auto">
            {/* IF ORDER STATUS IS NOT CANCEL  */}
            {current_order_status?.status !== order_statuses.cancelled && (
              <div className="d-flex align-items-center justify-content-center flex-wrap">
                <div className="pe-3 py-1">
                  {isIssueRaised ? (
                    <button
                      disabled={
                        trackOrderLoading ||
                        statusLoading ||
                        supportOrderLoading ||
                        issueLoading
                      }
                      className={
                        statusLoading
                          ? styles.secondary_action_loading
                          : styles.secondary_action
                      }
                      onClick={() => history.push("/application/tickets")}
                    >
                      {issueLoading ? (
                        <Loading backgroundColor={ONDC_COLORS.SECONDARYCOLOR} />
                      ) : (
                        "Track Issue"
                      )}
                    </button>
                  ) : (
                    <button
                      disabled={
                        trackOrderLoading ||
                        statusLoading ||
                        supportOrderLoading ||
                        issueLoading
                      }
                      className={
                        statusLoading
                          ? styles.secondary_action_loading
                          : styles.secondary_action
                      }
                      onClick={() => setToggleIssueModal(true)}
                    >
                      {issueLoading ? (
                        <Loading backgroundColor={ONDC_COLORS.SECONDARYCOLOR} />
                      ) : (
                        "Raise Issue"
                      )}
                    </button>
                  )}
                </div>

                <div className="pe-3 py-1">
                  <button
                    disabled={
                      trackOrderLoading || statusLoading || supportOrderLoading
                    }
                    className={
                      statusLoading
                        ? styles.secondary_action_loading
                        : styles.secondary_action
                    }
                    onClick={() => handleFetchUpdatedStatus()}
                  >
                    {statusLoading ? (
                      <Loading backgroundColor={ONDC_COLORS.SECONDARYCOLOR} />
                    ) : (
                      "Get Status"
                    )}
                  </button>
                </div>
                <div className="pe-3 py-1">
                  <button
                    disabled={
                      trackOrderLoading || statusLoading || supportOrderLoading
                    }
                    className={
                      trackOrderLoading
                        ? styles.secondary_action_loading
                        : styles.secondary_action
                    }
                    onClick={() => handleFetchTrackOrderDetails()}
                  >
                    {trackOrderLoading ? (
                      <Loading backgroundColor={ONDC_COLORS.SECONDARYCOLOR} />
                    ) : (
                      "Track"
                    )}
                  </button>
                </div>
                {(status === "Accepted" || status === "Created") && (
                  <div className="pe-3 py-1">
                    <button
                      disabled={
                        trackOrderLoading ||
                        statusLoading ||
                        supportOrderLoading
                      }
                      className={`${styles.primary_action} ${styles.cancel_return_button}`}
                      onClick={() => setToggleCancelOrderModal(true)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
                {status === "Completed" && (
                  <div className="py-1">
                    <button
                      disabled={
                        trackOrderLoading ||
                        statusLoading ||
                        supportOrderLoading
                      }
                      className={`${styles.primary_action} ${styles.cancel_return_button}`}
                      onClick={() => setToggleReturnOrderModal(true)}
                    >
                      Return
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          {/* eslint-disable-next-line */}
          <a
            ref={trackOrderRef}
            style={{ visibility: "hidden", display: "none" }}
          >
            navigate
          </a>
        </div>
      </div>
    </div>
  );
}
