import React from "react";

export default function Add(props) {
  const { width = "20", height = "20", classes } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 20 20"
      {...props}
    >
      <path
        d="M9 20v-9H0V9h9V0h2v9h9v2h-9v9z"
        transform="translate(.001)"
        className={classes}
      />
    </svg>
  );
}
