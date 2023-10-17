import React from "react";
import useStyles from "./style";

import { isLoggedIn, getUser } from "../../../utils/validateToken";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

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
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <RadioGroup
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          xs={{ mt: 20 }}
          value={selectedFulfillment}
          onChange={(event) => setSelectedFulfillment(event.target.value)}
        >
          {fulfillments?.map((fulfillment) => {
            return (
              <div className={classes.fulfillment}>
                <FormControlLabel
                  value={fulfillment.id}
                  control={<Radio />}
                  label={fulfillment["@ondc/org/category"]}
                />
              </div>
            );
          })}
        </RadioGroup>
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
