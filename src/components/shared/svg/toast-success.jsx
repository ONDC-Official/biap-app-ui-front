import React from "react";
import { ONDC_COLORS } from "../colors";

export default function ToastSuccess(props) {
  const { width = "20", height = "20", color = ONDC_COLORS.ERROR } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 30 30"
    >
      <path
        data-name="success toast"
        d="M113 28a15 15 0 1 0 15 15 15 15 0 0 0-15-15zm7.567 11.067-9.5 9.5a.645.645 0 0 1-.933 0l-4.667-4.667a.66.66 0 0 1 .933-.933l4.2 4.2 9.033-9.033a.66.66 0 1 1 .933.934z"
        transform="translate(-98 -28)"
        style={{ fill: color }}
      />
    </svg>
  );
}
