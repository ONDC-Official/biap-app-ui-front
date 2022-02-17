import React from "react";
import { ONDC_COLORS } from "../colors";

export default function Orders(props) {
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
      viewBox="0 0 32.041 26.701"
    >
      <g data-name="order icon">
        <path
          data-name="Path 59"
          d="M106.8 11.75h17.089a3.208 3.208 0 0 0 3.2-3.2v-3.2h-4.272V3.206a3.2 3.2 0 0 0-3.2-3.2h-8.544a3.2 3.2 0 0 0-3.2 3.2v2.136H103.6v3.2a3.208 3.208 0 0 0 3.2 3.208zm3.2-8.544a1.068 1.068 0 0 1 1.068-1.068h8.544a1.068 1.068 0 0 1 1.068 1.068v2.136H110z"
          transform="translate(-99.329 -.002)"
          style={{ fill: color }}
        />
        <path
          data-name="Path 60"
          d="M43.907 116.12v3.008a5.346 5.346 0 0 1-5.34 5.34h-6.409v3.2a1.067 1.067 0 0 1-1.068 1.068h-2.136a1.068 1.068 0 0 1-1.068-1.068v-3.2h-6.408a5.346 5.346 0 0 1-5.34-5.34v-3.008A3.193 3.193 0 0 0 14 119.128v14.952a3.2 3.2 0 0 0 3.2 3.2h25.639a3.2 3.2 0 0 0 3.2-3.2v-14.952a3.193 3.193 0 0 0-2.136-3.008z"
          transform="translate(-14.002 -110.584)"
          style={{ fill: color }}
        />
      </g>
    </svg>
  );
}
