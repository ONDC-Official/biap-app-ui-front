import React from "react";
import { ONDC_COLORS } from "../colors";

export default function CallSvg({
  width = "34",
  height = "34",
  color = ONDC_COLORS.ACCENTCOLOR,
  style,
  click,
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 33 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      onClick={click}
    >
      <path
        d="M16.4061 0C7.34401 0 0 7.60986 0 17C0 26.3901 7.34401 34 16.4061 34C25.4682 34 32.8122 26.3901 32.8122 17C32.8122 7.60986 25.4682 0 16.4061 0V0ZM18.8653 25.2382C11.7571 21.6079 9.90425 15.0801 9.63474 12.7064C9.36521 10.3328 13.3406 8.23819 13.3406 8.23819L15.8335 12.6365C15.8335 12.6365 13.1384 14.1374 13.509 14.9405C15.4965 19.2691 18.057 20.8747 18.057 20.8747C18.8992 21.1888 20.7521 19.0594 20.7521 19.0594L24.323 22.5502C24.3564 22.5502 21.3581 26.4948 18.8651 25.2381L18.8653 25.2382Z"
        fill={color}
      />
    </svg>
  );
}
