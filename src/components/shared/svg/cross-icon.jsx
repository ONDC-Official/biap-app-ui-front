import React from "react";
import { ONDC_COLORS } from "../colors";

export default function CrossIcon(props) {
  const {
    width = "20",
    height = "20",
    color = ONDC_COLORS.ERROR,
    style,
  } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 28.284 28.284"
      style={style}
      {...props}
    >
      <path
        data-name="cross icon"
        d="M-4100.952 1293.048v-8.095h-8.1a.952.952 0 0 1-.948-.953.952.952 0 0 1 .952-.953h8.1v-8.095a.952.952 0 0 1 .948-.952.953.953 0 0 1 .953.952v8.095h8.094a.953.953 0 0 1 .953.953.953.953 0 0 1-.953.952h-8.094v8.095a.953.953 0 0 1-.953.952.952.952 0 0 1-.952-.951z"
        transform="rotate(45 -510.074 5615.28)"
        style={{ fill: color }}
      />
    </svg>
  );
}
