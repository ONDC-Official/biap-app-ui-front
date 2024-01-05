import React from "react";
import useStyles from "./style";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const StepCartLabel = ({ activeStep, onUpdateActiveStep }) => {
  const classes = useStyles();
  return (
    <div>
      <Typography variant="h4" className={classes.labelTypo}>
        Cart
        {(activeStep !== 0 && activeStep < 4) && (
          <Button
            className={classes.editAddress}
            variant="text"
            color="primary"
            onClick={() => onUpdateActiveStep()}
          >
            EDIT
          </Button>
        )}
      </Typography>
    </div>
  );
};

export default StepCartLabel;
