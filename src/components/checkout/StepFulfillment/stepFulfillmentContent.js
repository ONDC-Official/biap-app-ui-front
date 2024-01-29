import React from "react";
import useStyles from "./style";

import { isLoggedIn, getUser } from "../../../utils/validateToken";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import moment from "moment";

function stringToColor(string) {
  let hash = 0;
  let i;
  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */
  return color;
}

const StepFulfillmentContent = ({
  handleNext,
  isError,
  fulfillments,
  selectedFulfillment,
  setSelectedFulfillment,
}) => {
  const classes = useStyles();
  const user = getUser();
  const stringAvatar = (name) => {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  };

  const should_allow_fulfillment_selection = () => {
    // by default is different fulfillments are selected for diff items, we don't allow fulfillment selection
    let unique_default_selected_fulfillments = Object.values(
      selectedFulfillment
    ).filter((value, index, array) => array.indexOf(value) === index);
    return unique_default_selected_fulfillments.length === 1;
  };

  const renderFulfillmentSelection = () => {
    return (
      <RadioGroup
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        xs={{ mt: 20 }}
        value={Object.values(selectedFulfillment)[0]}
        onChange={(event) => {
          let selected_fulfillments = {};
          Object.keys(selectedFulfillment).forEach((itemId) => {
            selected_fulfillments[itemId] = event.target.value;
          });
          setSelectedFulfillment(selected_fulfillments);
        }}
        defaultValue={Object.values(selectedFulfillment)[0]}
      >
        {fulfillments?.map((fulfillment) => {
          let deliveryTime = fulfillment["@ondc/org/TAT"];
          // Create a duration object from the ISO 8601 string
          const duration = moment.duration(fulfillment["@ondc/org/TAT"]);

          // Get the number of hours from the duration object
          const hours = duration.humanize();
          deliveryTime = `${hours}`;
          return (
            <div className={classes.fulfillment} key={fulfillment.id}>
              <FormControlLabel
                value={fulfillment.id}
                control={<Radio style={{ paddingRight: "20px" }} />}
                label={`${fulfillment["@ondc/org/category"]} - Delivery in ${deliveryTime}`}
              />
            </div>
          );
        })}
      </RadioGroup>
    );
  };

  const renderSelectedFulfillments = () => { };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        {should_allow_fulfillment_selection()
          ? renderFulfillmentSelection()
          : renderSelectedFulfillments()}

        <div className={classes.userActionContainer}>
          <Button variant="contained" onClick={handleNext} disabled={isError}>
            Continue
          </Button>
        </div>
      </Grid>
    </Grid>
  );
};

export default StepFulfillmentContent;
