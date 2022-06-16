import React from "react";
import styles from "./input.module.scss";

export default function Input(props) {
  const { has_error = "", required = false } = props;
  return (
    <div className="py-2">
      <label
        htmlFor={props.name}
        className={`${styles.form_label} ${required ? styles.required : ""}`}
      >
        {props.label_name}
      </label>
      <input
        {...props}
        className={`${has_error ? styles.error : styles.formControl}`}
      />
    </div>
  );
}
