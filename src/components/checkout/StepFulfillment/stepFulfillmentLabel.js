import React from "react";
import useStyles from "./style";

import Typography from "@mui/material/Typography";

import { getUser, isLoggedIn } from "../../../utils/validateToken";

const StepFulfillmentLabel = ({
  activeStep,
  fulfillments,
  products,
  selectedFulfillments,
}) => {
  const classes = useStyles();

  const should_allow_fulfillment_selection = () => {
    // by default is different fulfillments are selected for diff items, we don't allow fulfillment selection
    let unique_default_selected_fulfillments = Object.values(
      selectedFulfillments
    ).filter((value, index, array) => array.indexOf(value) === index);
    return unique_default_selected_fulfillments.length === 1;
  };

  const renderCommonFulfillment = () => {
    const fulfillment = fulfillments.find(
      (fulfillment) => fulfillment.id === Object.values(selectedFulfillments)[0]
    );
    return fulfillment["@ondc/org/category"];
  };

  const renderAllFulfillments = () => {
    return (
      <div>
        {products.map((product) => {
          const fulfillment = fulfillments.find(
            (fulfillment) => fulfillment.id === selectedFulfillments[product.id]
          );
          return (
            <div>
              {product.name + " : " + fulfillment["@ondc/org/category"]}
            </div>
          );
        })}
      </div>
    );
  };

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
            {should_allow_fulfillment_selection()
              ? renderCommonFulfillment()
              : renderAllFulfillments()}
          </Typography>
        </div>
      )}
    </div>
  );
};

export default StepFulfillmentLabel;
