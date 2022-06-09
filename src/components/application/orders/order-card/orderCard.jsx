import React, { useState, useRef } from "react";
import moment from "moment";
import { getOrderStatus } from "../../../../constants/order-status";
import styles from "../../../../styles/orders/orders.module.scss";
import { ONDC_COLORS } from "../../../shared/colors";
import { postCall, getCall } from "../../../../api/axios";
import Loading from "../../../shared/loading/loading";
import Toast from "../../../shared/toast/toast";
import { toast_types } from "../../../../utils/toast";
import DropdownSvg from "../../../shared/svg/dropdonw";
import CallSvg from "../../../shared/svg/callSvg";
import CustomerPhoneCard from "../customer-phone-card/customerPhoneCard";

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
    supportOrderLoading,
    setSupportOrderLoading,
  } = props;
  const current_order_status = getOrderStatus(status);
  const [cancelOrderLoading, setCancelOrderLoading] = useState(false);
  const [trackOrderLoading, setTrackOrderLoading] = useState(false);
  const [supportOrderDetails, setSupportOrderDetails] = useState();
  const [toggleCustomerPhoneCard, setToggleCustomerPhoneCard] = useState(false);
  const trackOrderRef = useRef(null);
  const support_order_timer = useRef();
  const [toast, setToast] = useState({
    toggle: false,
    type: "",
    message: "",
  });

  // use this api to cancel an order
  async function handleCancelOrder() {
    setCancelOrderLoading(true);
    try {
      const { context } = await postCall("/clientApis/v1/cancel_order", {
        context: {
          bpp_id,
          transaction_id,
        },
        message: {
          order_id,
          cancellation_reason_id: "item",
        },
      });
      onCancelOrder(context.message_id);
    } catch (err) {
      setCancelOrderLoading(false);
      setToast((toast) => ({
        ...toast,
        toggle: true,
        type: toast_types.error,
        message: err?.response?.data?.error?.message,
      }));
    }
  }

  // on cancel Api
  async function onCancelOrder(array_of_id) {
    try {
      const data = await getCall(
        `/clientApis/v1/on_cancel_order?messageId=${array_of_id}`
      );
      if (data[0]?.error) {
        const err = data[0]?.error;
        setToast((toast) => ({
          ...toast,
          toggle: true,
          type: toast_types.error,
          message: err?.message,
        }));
        setCancelOrderLoading(false);
        return;
      }
      setCancelOrderLoading(false);
      setCurrentSelectedAccordion("");
      onFetchUpdatedOrder();
    } catch (err) {
      setCancelOrderLoading(false);
      setToast((toast) => ({
        ...toast,
        toggle: true,
        type: toast_types.error,
        message: err.message,
      }));
    }
  }

  // use this api to track and order
  async function handleTrackOrder() {
    setTrackOrderLoading(true);
    try {
      const data = await postCall("/clientApis/v2/track", [
        {
          context: {
            transaction_id,
            bpp_id,
          },
          message: {
            order_id,
          },
        },
      ]);
      onTrackOrder(data[0]?.context?.message_id);
    } catch (err) {
      setTrackOrderLoading(false);
      setToast((toast) => ({
        ...toast,
        toggle: true,
        type: toast_types.error,
        message: err.message,
      }));
    }
  }

  // on track order
  async function onTrackOrder(array_of_id) {
    try {
      const data = await getCall(
        `/clientApis/v2/on_track?messageIds=${array_of_id}`
      );
      if (data[0]?.message?.tracking?.url === "" || data[0]?.error?.message) {
        setToast((toast) => ({
          ...toast,
          toggle: true,
          type: toast_types.error,
          message: "Tracking information not available for this product",
        }));
        setTrackOrderLoading(false);
        return;
      }
      trackOrderRef.current.href = data[0]?.message?.tracking?.url;
      trackOrderRef.current.target = "_blank";
      trackOrderRef.current.click();
      setTrackOrderLoading(false);
    } catch (err) {
      setTrackOrderLoading(false);
      setToast((toast) => ({
        ...toast,
        toggle: true,
        type: toast_types.error,
        message: err.message,
      }));
    }
  }

  // use this api to call support
  async function handleSupportForOrder() {
    if (supportOrderDetails) {
      setToggleCustomerPhoneCard(true);
      return;
    }
    setSupportOrderLoading(true);
    try {
      const data = await postCall("/clientApis/v2/get_support", [
        {
          context: {
            transaction_id,
            bpp_id,
          },
          message: {
            ref_id: order_id,
          },
        },
      ]);
      callApiMultipleTimes(data[0]?.context?.message_id);
    } catch (err) {
      setToast((toast) => ({
        ...toast,
        toggle: true,
        type: toast_types.error,
        message: err.message,
      }));
    }
  }

  // on support order
  async function onSupportOrder(array_of_id) {
    try {
      const data = await getCall(
        `/clientApis/v2/on_support?messageIds=${array_of_id}`
      );
      if (data[0]?.error) {
        setToast((toast) => ({
          ...toast,
          toggle: true,
          type: toast_types.error,
          message: "Could not get data for this order!",
        }));
        setSupportOrderLoading(false);
        clearInterval(support_order_timer.current);
        return;
      }
      setSupportOrderDetails(data[0]?.message);
    } catch (err) {
      setSupportOrderLoading(false);
      setToast((toast) => ({
        ...toast,
        toggle: true,
        type: toast_types.error,
        message: err.message,
      }));
    }
  }

  // use this function to call on get quote call multiple times
  function callApiMultipleTimes(message_ids) {
    let counter = 3;
    support_order_timer.current = setInterval(async () => {
      if (counter <= 0) {
        setToggleCustomerPhoneCard(true);
        setSupportOrderLoading(false);
        clearInterval(support_order_timer.current);
        return;
      }
      await onSupportOrder(message_ids).finally(() => {
        counter -= 1;
      });
    }, 2000);
  }

  return (
    <div className={styles.orders_card}>
      {toast.toggle && (
        <Toast
          type={toast.type}
          message={toast.message}
          onRemove={() =>
            setToast((toast) => ({
              ...toast,
              toggle: false,
            }))
          }
        />
      )}
      {toggleCustomerPhoneCard && (
        <CustomerPhoneCard
          supportOrderDetails={supportOrderDetails}
          onClose={() => setToggleCustomerPhoneCard(false)}
          onSuccess={() => {
            setToast((toast) => ({
              ...toast,
              toggle: true,
              type: toast_types.success,
              message: "Call successfully placed",
            }));
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
        <div>
          <p className={styles.card_header_title}>{order_id ?? "NA"}</p>
          <p className={styles.address_type_label} style={{ fontSize: "12px" }}>
            Ordered on
            <span style={{ fontWeight: "500", padding: "0 5px" }}>
              {created_at ? moment(created_at).format("MMMM Do, YYYY") : "NA"}
            </span>
          </p>
        </div>
        <div className="ms-auto px-3">
          <p className={styles.status_label}>Status:</p>
          <div className="pt-1">
            <div
              className={styles.status_chip}
              style={{
                background: `rgba(${current_order_status.color}, 0.05)`,
                border: `1px solid ${current_order_status.border}`,
              }}
            >
              <p
                className={styles.status_text}
                style={{ color: current_order_status.border }}
              >
                {current_order_status.status}
              </p>
            </div>
          </div>
        </div>
        <div className="px-2">
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
                <div style={{ width: '90%' }}>
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
                  <p className={styles.product_price}>₹ {price}</p>
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
            <CallSvg
              style={{ cursor: "pointer" }}
              click={handleSupportForOrder}
            />
          )}
          <div className="ms-auto">
            {/* IF ORDER STATUS IS NOT CANCEL  */}
            {current_order_status.status !== "Cancled" && (
              <div className="d-flex align-items-center justify-content-center flex-wrap">
                <div className="pe-3 py-1">
                  <button
                    disabled={
                      trackOrderLoading ||
                      cancelOrderLoading ||
                      supportOrderLoading
                    }
                    className={
                      trackOrderLoading
                        ? styles.secondary_action_loading
                        : styles.secondary_action
                    }
                    onClick={() => handleTrackOrder()}
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
                      supportOrderLoading
                    }
                    className={
                      cancelOrderLoading
                        ? styles.primary_action_loading
                        : styles.primary_action
                    }
                    onClick={() => handleCancelOrder()}
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
