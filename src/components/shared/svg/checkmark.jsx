import React from "react";
import { ONDC_COLORS } from "../colors";

export default function Checkmark(props) {
  const { width = "32", height = "23", color = ONDC_COLORS.SUCCESS } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 32.843 23.049"
      {...props}
    >
      <path
        d="m129.187 156.761 9.794 9.794a1.731 1.731 0 0 0 2.448 0l19.587-19.587a1.731 1.731 0 1 0-2.448-2.448L140.2 162.884l-8.57-8.57a1.731 1.731 0 1 0-2.448 2.448z"
        transform="translate(-128.68 -144.013)"
        style={{ fill: color, fillRule: "evenodd" }}
      />
    </svg>
  );
}
