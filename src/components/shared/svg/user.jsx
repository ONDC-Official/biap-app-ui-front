import React from "react";
import { ONDC_COLORS } from "../colors";

export default function User(props) {
  const {
    width = "20",
    height = "20",
    color = ONDC_COLORS.ACCENTCOLOR,
  } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24.466 26.913"
    >
      <path
        data-name="user icon"
        d="M122.782 29.45a6.117 6.117 0 1 1 1.792 4.325 6.117 6.117 0 0 1-1.792-4.325zm12.234 8.563h-12.234a6.116 6.116 0 0 0-6.116 6.117v2.447a3.67 3.67 0 0 0 3.67 3.67h17.126a3.67 3.67 0 0 0 3.67-3.67v-2.448a6.117 6.117 0 0 0-6.116-6.117z"
        transform="translate(-116.666 -23.333)"
        style={{ fill: color }}
      />
    </svg>
  );
}
