import React from "react";
import Cart from "../../application/cart/cart";
import { Button } from "@mui/material";
import useStyles from "./style";

const StepCartContent = ({ isError, handleNext }) => {
  const classes = useStyles();
  return (
    <div>
      <Cart showOnlyItems={true} />
      <div className={classes.userActionContainer}>
        <Button variant="contained" onClick={handleNext} disabled={isError}>
          Continue
        </Button>
      </div>
    </div>
  );
};

export default StepCartContent;
