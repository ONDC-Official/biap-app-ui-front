import React from "react";
import useStyles from "../style";

import Typography from "@mui/material/Typography";

const StepPaymentLabel = () => {
  const classes = useStyles();
  return (
    <div>
      <Typography variant="h4" className={classes.labelTypo}>
        Payment
      </Typography>
    </div>
  );
};

export default StepPaymentLabel;
