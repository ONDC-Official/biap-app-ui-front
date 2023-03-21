import React, {useState} from "react";
import styles from "./input.module.scss";

import EyeVisible from "../../../assets/images/eye_visible.png";
import EyeHidden from "../../../assets/images/eye_hidden.png";
import { buttonTypes } from "../../shared/button/utils";
import Button from "../../shared/button/button";

export default function Input(props) {
  const { has_error = "", required = false } = props;
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="py-2">
      <label
        htmlFor={props.name}
        className={`${styles.form_label} ${required ? styles.required : ""}`}
      >
        {props.label_name}
      </label>
      <div className={`${styles.password_input_container} ${has_error ? styles.error : styles.formControl}`}>
        <input
          type={showPassword?'text':'password'}
          {...props}
          className={`${has_error ? styles.error : styles.formControl}`}
        />
        <Button
          button_type={buttonTypes.secondary}
          // className={styles.eye_button}
          className={`${styles.eye_button} ${has_error ? "" : ""}`}
          button_text={showPassword ? <img src={EyeHidden} alt="logo" style={{ height: "20px" }} /> : <img src={EyeVisible} alt="logo" style={{ height: "20px" }} />}
          type="button"
          onClick={() => setShowPassword(!showPassword)}
        />
      </div>
    </div>
  );
}
