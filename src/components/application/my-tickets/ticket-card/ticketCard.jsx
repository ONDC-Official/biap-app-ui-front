import React, { useState, useContext } from "react";
import moment from "moment";
import {
    getOrderStatus,
} from "../../../../constants/order-status";
import styles from "../../../../styles/orders/orders.module.scss";
import { ONDC_COLORS } from "../../../shared/colors";
import DropdownSvg from "../../../shared/svg/dropdonw";
import { ToastContext } from "../../../../context/toastContext";
import useCancellablePromise from "../../../../api/cancelRequest";

export default function TicketCard(props) {
    const {
        billing_address,
        delivery_address,
        status,
        created_at,
        order_id,
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
            </div>
        </div>
    );
}
