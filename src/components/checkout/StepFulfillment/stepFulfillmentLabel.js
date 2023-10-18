import React from "react";
import useStyles from "./style";

import Typography from "@mui/material/Typography";

import { getUser, isLoggedIn } from "../../../utils/validateToken";

const StepFulfillmentLabel = ({ activeStep, fulfillment }) => {
  const classes = useStyles();
  return (
    <div>
      <Typography variant="h4" className={classes.labelTypo}>
        Fulfillment
      </Typography>
      {activeStep > 1 && (
        <div className={classes.userLabelTypo}>
          <Typography
            className={classes.nameLabelTypo}
            component="div"
            variant="body"
          >
            {fulfillment["@ondc/org/category"]}
          </Typography>
        </div>
      )}
    </div>
  );
};

export default StepFulfillmentLabel;
