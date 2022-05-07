import React, { useState, useRef } from "react";
import moment from "moment";
import {
  getOrderStatus,
  order_statuses,
} from "../../../../constants/order-status";
import styles from "../../../../styles/orders/orders.module.scss";
import { ONDC_COLORS } from "../../../shared/colors";
import IndianRupee from "../../../shared/svg/indian-rupee";
import { postCall, getCall } from "../../../../api/axios";
import Loading from "../../../shared/loading/loading";
import Toast from "../../../shared/toast/toast";
import { toast_types } from "../../../../utils/toast";

export default function OrderCard(props) {
  const {
    product,
    address,
    status,
    created_at,
    order_id,
    transaction_id,
    bpp_id,
    onFetchUpdatedOrder,
  } = props;
  const current_order_status = getOrderStatus(status);
  const [cancelOrderLoading, setCancelOrderLoading] = useState(false);
  const cancel_order_polling = useRef(0);
  const [toast, setToast] = useState({
    toggle: false,
    type: "",
    message: "",
  });

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
      callApiMultipleTimes(context.message_id);
    } catch (err) {
      setCancelOrderLoading(false);
      console.log(err);
    }
  }

  // on get quote Api
  async function onCancelOrder(array_of_id) {
    try {
      const data = await getCall(
        `/clientApis/v1/on_cancel_order?messageId=${array_of_id}`
      );
      if (data[0]?.error) {
        setToast((toast) => ({
          ...toast,
          toggle: true,
          type: toast_types.error,
          message: "Something went wrong!",
        }));
        setCancelOrderLoading(false);
        clearInterval(cancel_order_polling.current);
        return;
      }
      setCancelOrderLoading(false);
      clearInterval(cancel_order_polling.current);
      onFetchUpdatedOrder();
    } catch (err) {
      console.log(err);
      setCancelOrderLoading(false);
    }
  }

  // use this function to call on get quote call multiple times
  function callApiMultipleTimes(message_id) {
    let counter = 3;
    cancel_order_polling.current = setInterval(async () => {
      if (counter <= 0) {
        setCancelOrderLoading(false);
        clearInterval(cancel_order_polling.current);
        return;
      }
      await onCancelOrder(message_id).finally(() => {
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
      <div className="container">
        <div className="row">
          <div className="col-lg-3 col-md-6 col-sm-12 p-2">
            <p
              className={`${styles.product_name} ${styles.card_header_title} pe-3`}
              title={product?.name}
            >
              {product?.name}
            </p>
            <p
              className={styles.address_type_label}
              style={{ fontSize: "12px" }}
            >
              Ordered on
              <span style={{ fontWeight: "500", padding: "0 5px" }}>
                {moment(created_at).format("MMMM Do, YYYY")}
              </span>
            </p>
            <div className="d-flex align-items-center">
              <div className="pe-2">
                <IndianRupee
                  width="8"
                  height="13"
                  color={ONDC_COLORS.SECONDARYCOLOR}
                />
              </div>
              <p className={styles.product_price}>{product?.price}</p>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12 p-2">
            <p className={styles.address_type_label}>Deliveing to:</p>
            <p className={styles.address_name_and_phone}>{address?.name}</p>
            <p className={styles.address_line_1}>
              {address?.location?.street
                ? address.location.street
                : address?.location?.door}
              , {address?.location?.city}, {address?.location?.state}
            </p>
            <p className={styles.address_line_2}>
              {address?.location?.area_code}
            </p>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12 p-2">
            <p className={styles.address_type_label}>Status:</p>
            {status !== order_statuses.canceled ? (
              <div className="pt-3 d-flex align-items-start">
                {/* ORDERED */}
                <div className="px-1">
                  <div className="text-center">
                    <div
                      className={styles.status_indicator}
                      style={{
                        backgroundColor:
                          current_order_status.step_value >= 1
                            ? ONDC_COLORS.SUCCESS
                            : ONDC_COLORS.BACKGROUNDCOLOR,
                      }}
                    ></div>
                    <p
                      className={styles.status_value}
                      style={{
                        color:
                          current_order_status.step_value >= 1
                            ? ONDC_COLORS.SUCCESS
                            : ONDC_COLORS.PRIMARYCOLOR,
                      }}
                    >
                      Ordered
                    </p>
                  </div>
                </div>
                <div className="px-1">
                  <div
                    className={styles.status_bar}
                    style={{
                      backgroundColor:
                        current_order_status.step_value > 1
                          ? ONDC_COLORS.SUCCESS
                          : ONDC_COLORS.BACKGROUNDCOLOR,
                    }}
                  ></div>
                </div>
                {/* SHIPPED */}
                <div className="px-1">
                  <div className="text-center">
                    <div
                      className={styles.status_indicator}
                      style={{
                        backgroundColor:
                          current_order_status.step_value >= 2
                            ? ONDC_COLORS.SUCCESS
                            : ONDC_COLORS.BACKGROUNDCOLOR,
                      }}
                    ></div>
                    <p
                      className={styles.status_value}
                      style={{
                        color:
                          current_order_status.step_value >= 2
                            ? ONDC_COLORS.SUCCESS
                            : ONDC_COLORS.PRIMARYCOLOR,
                      }}
                    >
                      Shipped
                    </p>
                  </div>
                </div>
                <div className="px-1">
                  <div
                    className={styles.status_bar}
                    style={{
                      backgroundColor:
                        current_order_status.step_value > 2
                          ? ONDC_COLORS.SUCCESS
                          : ONDC_COLORS.BACKGROUNDCOLOR,
                    }}
                  ></div>
                </div>
                {/* DELIVERED */}
                <div className="px-1">
                  <div className="text-center">
                    <div
                      className={styles.status_indicator}
                      style={{
                        backgroundColor:
                          current_order_status.step_value >= 3
                            ? ONDC_COLORS.SUCCESS
                            : ONDC_COLORS.BACKGROUNDCOLOR,
                      }}
                    ></div>
                    <p
                      className={styles.status_value}
                      style={{
                        color:
                          current_order_status.step_value >= 3
                            ? ONDC_COLORS.SUCCESS
                            : ONDC_COLORS.PRIMARYCOLOR,
                      }}
                    >
                      Delivered
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="d-flex align-items-center justify-content-start flex-wrap py-2">
                <div className={styles.canceled_order_back}>
                  <p className="mb-0">Canceled</p>
                </div>
              </div>
            )}
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12 p-2">
            {status !== order_statuses.canceled && (
              <div className="h-100 d-flex align-items-center justify-content-center flex-wrap">
                <div className="pe-3 py-1">
                  <button
                    disabled={cancelOrderLoading}
                    className={styles.return_button}
                    onClick={() => console.log("will return order")}
                  >
                    Return
                  </button>
                </div>
                <div className="pe-3 py-1">
                  <button
                    disabled={cancelOrderLoading}
                    className={styles.cancel_button}
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
        </div>
      </div>
    </div>
  );
}
