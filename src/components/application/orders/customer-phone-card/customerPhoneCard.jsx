import React, { useState } from "react";
import CrossIcon from "../../../shared/svg/cross-icon";
import { ONDC_COLORS } from "../../../shared/colors";
import Button from "../../../shared/button/button";
import { buttonTypes } from "../../../../utils/button";
import styles from "../../../../styles/search-product-modal/searchProductModal.module.scss";
import ErrorMessage from "../../../shared/error-message/errorMessage";
import Input from "../../../shared/input/input";
import Toast from "../../../shared/toast/toast";
import { toast_types } from "../../../../utils/toast";
import axios from "axios";
import { getValueFromCookie } from "../../../../utils/cookies";

export default function CustomerPhoneCard({
  supportOrderDetails,
  onClose,
  onSuccess,
}) {
  const token = getValueFromCookie("token");
  //eslint-disable-next-line
  const PHONE_REGEXP = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  const [inlineError, setInlineError] = useState({
    phone_number_error: "",
  });
  const [loading, setLoading] = useState(false);
  const [customerPhoneNumber, setCustomerPhoneNumber] = useState("");
  const [toast, setToast] = useState({
    toggle: false,
    type: "",
    message: "",
  });
  function checkPhoneNumber() {
    if (!customerPhoneNumber) {
      setInlineError({
        phone_number_error: "Phone Number is required",
      });
      return false;
    }
    if (!PHONE_REGEXP.test(customerPhoneNumber)) {
      setInlineError({
        phone_number_error: "Please enter a valid phone number",
      });
      return false;
    }
    return true;
  }
  async function contactSupport() {
    if (!checkPhoneNumber()) {
      return;
    }
    setLoading(true);
    try {
      const { status } = await axios.post(
        "knowlarity/api/call-patron",
        {
          customer_phone_number: `+91${customerPhoneNumber.trim()}`,
          seller_phone_number: supportOrderDetails?.phone,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (status === 200) {
        onSuccess();
        return;
      }
      setToast((toast) => ({
        ...toast,
        toggle: true,
        type: toast_types.error,
        message: "Something went wrong!",
      }));
    } catch (err) {
      setToast((toast) => ({
        ...toast,
        toggle: true,
        type: toast_types.error,
        message: err.message,
      }));
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className={styles.overlay}>
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
      <div className={styles.popup_card}>
        <div className={`${styles.card_header} d-flex align-items-center`}>
          <p className={styles.card_header_title}>Phone number</p>
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
          <Input
            label_name="Phone Number"
            type="text"
            placeholder="Enter Phone Number"
            id="phone_number"
            has_error={inlineError.phone_number_error}
            onBlur={checkPhoneNumber}
            onChange={(event) => {
              const phone_number = event.target.value;
              setCustomerPhoneNumber(phone_number);
              setInlineError((inlineError) => ({
                ...inlineError,
                phone_number_error: "",
              }));
            }}
          />
          {inlineError.phone_number_error && (
            <ErrorMessage>{inlineError.phone_number_error}</ErrorMessage>
          )}
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
              button_text="Contact"
              onClick={() => {
                contactSupport();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
