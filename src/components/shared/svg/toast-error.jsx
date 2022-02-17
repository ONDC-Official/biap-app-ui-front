import React from "react";
import { ONDC_COLORS } from "../colors";

export default function ToastError(props) {
  const { width = "20", height = "20", color = ONDC_COLORS.ERROR } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 30 30"
    >
      <path
        data-name="error toast"
        d="M159.373 74.375a15.013 15.013 0 1 0 10.6 4.4 15 15 0 0 0-10.6-4.4zm.676 23.016a.969.969 0 0 1-.676.281.956.956 0 0 1-.676-.281.969.969 0 0 1-.281-.676.956.956 0 0 1 .281-.676.989.989 0 0 1 1.353 0 .956.956 0 0 1 .281.676.969.969 0 0 1-.281.676zm.281-4.506a.957.957 0 0 1-1.915 0V82.034a.957.957 0 1 1 1.915 0z"
        transform="translate(-144.373 -74.375)"
        style={{ fill: color }}
      />
    </svg>
  );
}
