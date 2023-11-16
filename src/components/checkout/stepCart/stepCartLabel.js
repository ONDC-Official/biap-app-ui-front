import React from "react";
import useStyles from "./style";
import Typography from "@mui/material/Typography";

const StepCartLabel = ({ activeStep }) => {
  const classes = useStyles();
  return (
    <div>
      <Typography variant="h4" className={classes.labelTypo}>
        Cart
      </Typography>
    </div>
  );
};

export default StepCartLabel;
