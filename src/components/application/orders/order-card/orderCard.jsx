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

export default function OrderCard(props) {
  const {
    product = [],
    billing_address,
    delivery_address,
    status,
    created_at,
    order_id,
    transaction_id,
    bpp_id,
    onFetchUpdatedOrder,
    accoodion_id,
    currentSelectedAccordion,
    setCurrentSelectedAccordion,
  } = props;

  // HELPERS
  const current_order_status = getOrderStatus(status);

  // STATES
  const [cancelOrderLoading, setCancelOrderLoading] = useState(false);
  const [trackOrderLoading, setTrackOrderLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [supportOrderLoading, setSupportOrderLoading] = useState(false);
  const [supportOrderDetails, setSupportOrderDetails] = useState();
  const [toggleCustomerPhoneCard, setToggleCustomerPhoneCard] = useState(false);

  // REFS
  const trackOrderRef = useRef(null);
  const cancelEventSourceResponseRef = useRef(null);
  const trackEventSourceResponseRef = useRef(null);
  const supportEventSourceResponseRef = useRef(null);
  const statusEventSourceResponseRef = useRef(null);
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
        setCancelOrderLoading(false);
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
    cancelEventSourceResponseRef.current = [];
    setCancelOrderLoading(true);
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
      setCancelOrderLoading(false);
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
      setCancelOrderLoading(false);
      if (data?.message) {
        setCurrentSelectedAccordion("");
        onFetchUpdatedOrder();
      } else {
        dispatchToast(
          "Something went wrong!, product status cannot be updated",
          toast_types.error
        );
      }
    } catch (err) {
      setCancelOrderLoading(false);
      dispatchToast(err?.message, toast_types.error);
    }
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
      if (message?.tracking?.url === "") {
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
              ref_id: order_id,
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
      fetchStatusDataThroughEvents(data[0]?.context?.message_id);
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
          {product.map(({ id, name, price, quantity }) => {
            return (
              <div key={id} className="d-flex align-items-start py-2">
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
                      QTY: {quantity ?? "0"}
                    </p>
                  </div>
                </div>
                <div className="ms-auto">
                  <p
                    className={styles.product_price}
                    style={{ whiteSpace: "nowrap" }}
                  >
                    ₹ {Number(price)?.toFixed(2)}
                  </p>
                </div>
              </div>
            );
          })}
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
                trackOrderLoading ||
                cancelOrderLoading ||
                statusLoading ||
                supportOrderLoading
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
                  <button
                    disabled={
                      trackOrderLoading ||
                      cancelOrderLoading ||
                      statusLoading ||
                      supportOrderLoading
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
                      trackOrderLoading ||
                      cancelOrderLoading ||
                      statusLoading ||
                      supportOrderLoading
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
                <div className="py-1">
                  <button
                    disabled={
                      cancelOrderLoading ||
                      trackOrderLoading ||
                      statusLoading ||
                      supportOrderLoading
                    }
                    className={
                      cancelOrderLoading
                        ? styles.primary_action_loading
                        : styles.primary_action
                    }
                    onClick={() => handleFetchCancelOrderDetails()}
                  >
                    {cancelOrderLoading ? (
                      <Loading backgroundColor={ONDC_COLORS.ACCENTCOLOR} />
                    ) : (
                      "Cancel"
                    )}
                  </button>
                </div>
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
