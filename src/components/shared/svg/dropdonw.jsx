import React from "react";
import { ONDC_COLORS } from "../colors";

export default function DropdonwSvg(props) {
  const {
    width = "18",
    height = "11",
    color = ONDC_COLORS.SECONDARYCOLOR,
  } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 18.856 11.253"
    >
      <path
        d="M301.382 246.959h-15.139a1.866 1.866 0 0 0-1.289 3.221l7.65 7.489a1.9 1.9 0 0 0 2.657 0l7.409-7.569a1.835 1.835 0 0 0-1.289-3.141z"
        transform="translate(-284.376 -246.959)"
        style={{ fill: color }}
      />
    </svg>
  );
}
