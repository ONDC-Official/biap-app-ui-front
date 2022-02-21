import React from "react";

export default function Subtract(props) {
  const { width = "20", height = "2", classes } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 20 2"
      {...props}
    >
      <path transform="rotate(90 10 10)" className={classes} d="M0 0h2v20H0z" />
    </svg>
  );
}
