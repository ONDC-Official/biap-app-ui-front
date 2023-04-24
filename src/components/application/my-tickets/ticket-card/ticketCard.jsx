import React, { useState, useContext } from "react";
import moment from "moment";
import { getOrderStatus } from "../../../../constants/order-status";
import styles from "../../../../styles/orders/orders.module.scss";
import { ONDC_COLORS } from "../../../shared/colors";
import DropdownSvg from "../../../shared/svg/dropdonw";
import { ToastContext } from "../../../../context/toastContext";
import useCancellablePromise from "../../../../api/cancelRequest";
import Loading from "../../../shared/loading/loading";
import CallSvg from "../../../shared/svg/callSvg";
import CustomerPhoneCard from "../../orders/customer-phone-card/customerPhoneCard";

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
  } = props;

  // HELPERS
  const current_order_status = getOrderStatus(status);

  // STATES
  const [trackOrderLoading, setTrackOrderLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [supportOrderLoading, setSupportOrderLoading] = useState(false);
  const [supportOrderDetails, setSupportOrderDetails] = useState();
  const [toggleCustomerPhoneCard, setToggleCustomerPhoneCard] = useState(false);
  const [toggleCancelOrderModal, setToggleCancelOrderModal] = useState(false);
  const [toggleReturnOrderModal, setToggleReturnOrderModal] = useState(false);

  // REFS

  // CONTEXT

  // HOOKS
  const { cancellablePromise } = useCancellablePromise();

  // use this function to dispatch error
  console.log("props= ", props);
  return (
    <div className={styles.orders_card}>
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
            {category + "-" + sub_category ?? "NA"}
          </p>
          <p className={styles.address_type_label} style={{ fontSize: "12px" }}>
            {issue_type ?? "Issue"} raised on
            <span style={{ fontWeight: "500", padding: "0 5px" }}>
              {updated_at ? moment(updated_at).format("MMMM Do, YYYY") : "NA"}
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
          {description?.additional_desc?.url && (
            <div>
              <a
                href={description.additional_desc.url}
                rel="noreferrer"
                target="_blank"
              >
                <div>{description.additional_desc.url}</div>
              </a>
            </div>
          )}
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
        {issue_actions?.respondent_actions?.length > 0 && (
          <div
            className="container py-2 px-0"
            style={{ borderTop: "1px solid #ddd" }}
          >
            <p className={styles.product_name} style={{ fontSize: "16px" }}>
              Actions taken
            </p>
            {issue_actions?.respondent_actions?.map(
              (
                { respondent_action, remarks, updated_at, updated_by },
                index
              ) => {
                return (
                  <>
                    <div key={index} className="d-flex align-items-center pt-3">
                      <div style={{ width: "90%" }}>
                        <p
                          className={styles.product_name}
                          title={remarks}
                          style={{ fontSize: "16px" }}
                        >
                          {remarks}
                        </p>
                        <div className="pt-1">
                          <p className={styles.quantity_count}>
                            {`Updated by: ${updated_by?.person?.name}`}
                          </p>
                        </div>
                        <div className="pt-1">
                          <p className={styles.quantity_count}>
                            {`Updated at:  ${moment(updated_at).format(
                              "MMMM Do, YYYY"
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
                    {index < issue_actions?.respondent_actions?.length - 1 && (
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
          className="align-items-center mt-3 pt-3"
          style={{ borderTop: "1px solid #ddd" }}
        >
          <p className={styles.status_label}>
            Email:{" "}
            {issue_actions?.resolution_provider?.respondent_info
              ?.resolution_support?.respondentContact?.email ?? "N/A"}
          </p>
          <p className={styles.status_label}>
            Phone:{" "}
            {issue_actions?.resolution_provider?.respondent_info
              ?.resolution_support?.respondentContact?.phone ?? "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}
