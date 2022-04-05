import React from "react";
import moment from "moment";
import { getOrderStatus } from "../../../../constants/order-status";
import styles from "../../../../styles/orders/orders.module.scss";
import { buttonTypes } from "../../../../utils/button";
import Button from "../../../shared/button/button";
import { ONDC_COLORS } from "../../../shared/colors";
import IndianRupee from "../../../shared/svg/indian-rupee";

export default function OrderCard(props) {
  const {
    product,
    address,
    order_id,
    status,
    transaction_id,
    created_at,
  } = props;
  const current_order_status = getOrderStatus(status);
  return (
    <div className={styles.orders_card}>
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
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12 p-2">
            <div className="h-100 d-flex align-items-center justify-content-center flex-wrap">
              <div className="pe-3 py-1">
                <button
                  className={styles.return_button}
                  onClick={() => console.log("will return order")}
                >
                  Return
                </button>
              </div>
              <div className="pe-3 py-1">
                <button
                  className={styles.cancel_button}
                  onClick={() => console.log("will cancel order")}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
