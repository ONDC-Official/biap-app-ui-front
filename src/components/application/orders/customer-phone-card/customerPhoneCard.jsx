import React, { useContext, useState } from "react";
import CrossIcon from "../../../shared/svg/cross-icon";
import { ONDC_COLORS } from "../../../shared/colors";
import Button from "../../../shared/button/button";
import { buttonTypes } from "../../../shared/button/utils";
import styles from "../../../../styles/search-product-modal/searchProductModal.module.scss";
import ErrorMessage from "../../../shared/error-message/errorMessage";
import Input from "../../../shared/input/input";
import { toast_actions, toast_types } from "../../../shared/toast/utils/toast";
import axios from "axios";
import { getValueFromCookie } from "../../../../utils/cookies";
import { ToastContext } from "../../../../context/toastContext";
import validator from "validator";

export default function CustomerPhoneCard({
  supportOrderDetails,
  onClose,
  onSuccess,
}) {
  const token = getValueFromCookie("token");
  const [inlineError, setInlineError] = useState({
    phone_number_error: "",
  });
  const [loading, setLoading] = useState(false);
  const [customerPhoneNumber, setCustomerPhoneNumber] = useState("");
  const dispatch = useContext(ToastContext);

  // use this function to check the user entered phone number
  function checkPhoneNumber() {
    if (validator.isEmpty(customerPhoneNumber)) {
      setInlineError((error) => ({
        ...error,
        phone_number_error: "Please enter a phone number",
      }));
      return false;
    }
    if (!validator.isMobilePhone(customerPhoneNumber, "en-IN")) {
      setInlineError((error) => ({
        ...error,
        phone_number_error: "Please enter a valid phone number",
      }));
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
      const { data } = await axios.post(
        "knowlarity/api/call-patron",
        {
          customer_phone_number: `+91${customerPhoneNumber.trim()}`,
          seller_phone_number: supportOrderDetails?.phone?.includes("+91")
            ? supportOrderDetails?.phone
            : `+91${supportOrderDetails?.phone}`,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data?.error) {
        dispatch({
          type: toast_actions.ADD_TOAST,
          payload: {
            id: Math.floor(Math.random() * 100),
            type: toast_types.error,
            message: data?.error?.message || "Something went wrong!",
          },
        });
        return;
      }
      if (data?.success) {
        onSuccess();
        return;
      }
      dispatch({
        type: toast_actions.ADD_TOAST,
        payload: {
          id: Math.floor(Math.random() * 100),
          type: toast_types.error,
          message: "Something went wrong!",
        },
      });
    } catch (err) {
      dispatch({
        type: toast_actions.ADD_TOAST,
        payload: {
          id: Math.floor(Math.random() * 100),
          type: toast_types.error,
          message: err?.message,
        },
      });
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className={styles.overlay}>
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
            label_name="Enter your phone number"
            type="text"
            placeholder="Enter the phone number on which you want us to call."
            id="phone_number"
            has_error={inlineError.phone_number_error}
            onBlur={checkPhoneNumber}
            maxlength="10"
            value={customerPhoneNumber}
            onChange={(event) => {
              const phone_number = event.target.value;
              const regexp = /^[0-9]+$/;
              if (!regexp.test(phone_number) && phone_number !== "") return;
              setCustomerPhoneNumber(phone_number);
              setInlineError((inlineError) => ({
                ...inlineError,
                phone_number_error: "",
              }));
            }}
            required
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
