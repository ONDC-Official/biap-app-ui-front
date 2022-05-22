import React from "react";
import styles from "./checkbox.module.scss";
import Checkmark from "../svg/checkmark";
import { ONDC_COLORS } from "../colors";

export default function Checkbox({ checked, ...props }) {
  return (
    <button className={`${styles.checkbox_wrapper} my-1`} {...props}>
      <div className={styles.box_basis}>
        <div className={styles.checkbox_background}>
          <div className={checked ? styles.active : ""}>
            {checked && (
              <Checkmark width="10" height="6" color={ONDC_COLORS.WHITE} />
            )}
          </div>
        </div>
      </div>
      <div className={styles.name_basis}>{props.children}</div>
    </button>
  );
}
