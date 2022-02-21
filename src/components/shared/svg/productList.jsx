import React from "react";
import { ONDC_COLORS } from "../colors";

export default function ProductList(props) {
  const {
    width = "35",
    height = "25",
    color = ONDC_COLORS.ACCENTCOLOR,
  } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 35.778 25.211"
    >
      <g data-name="products icon">
        <path
          data-name="Path 66"
          d="M168.287 206.21v23.825l-14.7-4.213v-12.14l11.489.658z"
          transform="translate(-150.877 -204.824)"
          style={{ fill: color, fillRule: "evenodd" }}
        />
        <path
          data-name="Path 67"
          d="m378.441 188.609-13.791-.842 3.418 8.752 13.791-.842z"
          transform="translate(-346.081 -187.767)"
          style={{ fill: color, fillRule: "evenodd" }}
        />
        <path
          data-name="Path 68"
          d="m361.968 206.21 3.207 8.13 11.489-.658v12.139l-14.7 4.213z"
          transform="translate(-343.6 -204.824)"
          style={{ fill: color, fillRule: "evenodd" }}
        />
        <path
          data-name="Path 69"
          d="m120.9 188.6-3.418 7.069 13.791.842 3.418-8.752z"
          transform="translate(-117.478 -187.763)"
          style={{ fill: color, fillRule: "evenodd" }}
        />
      </g>
    </svg>
  );
}
