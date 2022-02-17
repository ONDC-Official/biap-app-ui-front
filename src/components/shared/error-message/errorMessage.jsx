import React from "react";
import styles from "./errorMessage.module.scss";

export default function ErrorMessage(props) {
  return (
    <div className={`${styles.error_message_text} px-2 py-1`}>
      {props.children}
    </div>
  );
}
