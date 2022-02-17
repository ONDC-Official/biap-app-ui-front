import React from "react";
import { ONDC_COLORS } from "../colors";

export default function Cart(props) {
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
      viewBox="0 0 33.831 26.666"
    >
      <g data-name="cart icon">
        <path
          data-name="Path 47"
          d="M130.176 161.372h-19.632l-.238-.874a4.387 4.387 0 0 0-4.212-3.139h-5.683a2.006 2.006 0 0 0-1.987 2.225 2.074 2.074 0 0 0 2.106 1.788h3.219a2.3 2.3 0 0 1 2.186 1.628l.676 2.265v.08l2.861 9.458a3.708 3.708 0 0 0 3.537 2.623h12.32a3.618 3.618 0 0 0 3.537-2.742l1.987-9.419a2.022 2.022 0 0 0 1.391-1.669 2.115 2.115 0 0 0-2.067-2.226z"
          transform="translate(-98.413 -157.358)"
          style={{ fill: color }}
        />
        <path
          data-name="Path 48"
          d="M274.85 466.145a2.464 2.464 0 1 1-2.464-2.464 2.464 2.464 0 0 1 2.464 2.464"
          transform="translate(-257.751 -441.943)"
          style={{ fill: color }}
        />
        <path
          data-name="Path 49"
          d="M434.446 466.145a2.464 2.464 0 1 1-2.464-2.464 2.464 2.464 0 0 1 2.464 2.464"
          transform="translate(-406.021 -441.943)"
          style={{ fill: color }}
        />
      </g>
    </svg>
  );
}
