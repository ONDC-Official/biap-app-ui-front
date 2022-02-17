import React, { useEffect } from "react";
import { toast_types } from "../../../utils/toast";
import { ONDC_COLORS } from "../colors";
import CrossIcon from "../svg/cross-icon";
import ToastError from "../svg/toast-error";
import ToastSuccess from "../svg/toast-success";
import styles from "./toast.module.scss";
export default function Toast(props) {
  const { message, type, onRemove } = props;
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove();
    }, 4000);
    return () => {
      clearTimeout(timer);
    };
  });
  return (
    <div className={`${styles.toast_position} d-flex align-items-center`}>
      <div
        className={styles.toast_type_wrapper}
        style={{
          backgroundColor:
            type === toast_types.error
              ? ONDC_COLORS.ERROR
              : ONDC_COLORS.SUCCESS,
        }}
      >
        {type === toast_types.error ? (
          <ToastError width="25" height="25" color={ONDC_COLORS.WHITE} />
        ) : (
          <ToastSuccess width="25" height="25" color={ONDC_COLORS.WHITE} />
        )}
      </div>
      <div className={styles.toast_message_wrapper}>
        <p className={styles.toast_message}>{message}</p>
      </div>
      <div className={styles.toast_remove_wrapper}>
        <CrossIcon
          style={{ cursor: "pointer" }}
          onClick={() => {
            onRemove();
          }}
        />
      </div>
    </div>
  );
}
