import React from "react";
import styles from "./addressRadioButton.module.scss";
export default function AddressRadioButton(props) {
  const { checked } = props;
  return (
    <button className={`${styles.radio_button_wrapper} p-2 my-1`} {...props}>
      <div className={styles.radio_button_background}>
        <div className={checked ? styles.active : styles.non_active}></div>
      </div>
      {props.children}
    </button>
  );
}
