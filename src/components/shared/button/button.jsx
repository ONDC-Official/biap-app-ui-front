import React, { useState } from "react";
import { getButtonStyle } from "../../../utils/button";
import Loading from "../loading/loading";
import styles from "./button.module.scss";

export default function Button(props) {
  let buttonProps = {};
  const [buttonStyle, setButtonStyle] = useState(
    getButtonStyle(props.button_type)
  );
  if (!props.disabled) {
    buttonProps = {
      ...buttonProps,
      onMouseOver: () =>
        setButtonStyle(getButtonStyle(props.button_hover_type)),
      onMouseOut: () => setButtonStyle(getButtonStyle(props.button_type)),
    };
  }
  const loading = (
    <div className="d-flex align-items-center justify-content-center">
      <Loading backgroundColor={buttonStyle.buttonTextColor} />
    </div>
  );
  return (
    <button
      className={styles.btn_back}
      style={buttonStyle}
      {...buttonProps}
      {...props}
    >
      {props.isloading === 1 ? (
        loading
      ) : (
        <p
          className={styles.button_text}
          style={{ color: buttonStyle.buttonTextColor }}
        >
          {props.button_text}
        </p>
      )}
    </button>
  );
}
