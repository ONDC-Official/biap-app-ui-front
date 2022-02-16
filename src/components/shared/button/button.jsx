import React, { useState } from "react";
import { getButtonStyle } from "../../../utils/button";
import styles from "./button.module.scss";

export default function Button(props) {
  const [buttonStyle, setButtonStyle] = useState(
    getButtonStyle(props.button_type)
  );
  return (
    <button
      className={styles.btn_back}
      style={buttonStyle}
      onMouseOver={() =>
        setButtonStyle(getButtonStyle(props.button_hover_type))
      }
      onMouseOut={() => setButtonStyle(getButtonStyle(props.button_type))}
    >
      <p
        className={styles.button_text}
        style={{ color: buttonStyle.buttonTextColor }}
      >
        {props.button_text}
      </p>
    </button>
  );
}
