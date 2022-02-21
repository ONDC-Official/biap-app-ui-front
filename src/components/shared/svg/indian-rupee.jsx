import React from "react";
import { ONDC_COLORS } from "../colors";

export default function IndianRupee(props) {
  const {
    width = "14",
    height = "21",
    color = ONDC_COLORS.ACCENTCOLOR,
  } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 14.197 21.103"
    >
      <path
        data-name="ruppe icon"
        d="M237.334 92.074a.639.639 0 0 0-.639-.639h-12.918a.639.639 0 0 0 0 1.279h3.709a4.924 4.924 0 0 1 4.828 4.157h-8.537a.64.64 0 0 0 0 1.279h8.537a4.925 4.925 0 0 1-4.828 4.476h-3.709a.6.6 0 0 0-.448 1.023l9.24 8.729a.768.768 0 0 0 .448.16.639.639 0 0 0 .448-1.055l-8.089-7.578h2.11a6.318 6.318 0 0 0 6.139-5.755h3.069a.64.64 0 0 0 0-1.279h-3.07a6.2 6.2 0 0 0-2.4-4.157h5.468a.639.639 0 0 0 .639-.64z"
        transform="translate(-223.137 -91.434)"
        style={{ fill: color }}
      />
    </svg>
  );
}
