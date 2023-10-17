import React, { useContext } from "react";
import useStyles from "./style";

import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

import { AddressContext } from "../../../context/addressContext";

const StepAddressLabel = ({ activeStep, onUpdateActiveStep }) => {
  const classes = useStyles();
  const { deliveryAddress, billingAddress } = useContext(AddressContext);

  return (
    <div>
      <Typography variant="h4" className={classes.labelTypo}>
        Add Address
        {activeStep > 1 && (
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
      {activeStep > 1 && billingAddress && deliveryAddress && (
        <div className={classes.addressLabelTypo}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
              <Typography
                className={classes.addressHeaderTypo}
                component="div"
                variant="body"
              >
                Billing Address
              </Typography>
              <Typography
                className={classes.addressTextTypo}
                component="div"
                variant="body"
              >
                {billingAddress.name}
              </Typography>
              <Typography
                className={classes.addressTextTypo}
                component="div"
                variant="body"
              >
                {billingAddress.phone}
              </Typography>
              <Typography
                className={classes.addressTextTypo}
                component="div"
                variant="body"
              >
                {`${billingAddress.address.street}, ${billingAddress.address.door}`}
              </Typography>
              <Typography
                className={classes.addressTextTypo}
                component="div"
                variant="body"
              >
                {billingAddress.address.state}
              </Typography>
              <Typography
                className={classes.addressTextTypo}
                component="div"
                variant="body"
              >
                {billingAddress.address.areaCode}
              </Typography>
              <Typography
                className={classes.addressTextTypo}
                component="div"
                variant="body"
              >
                {billingAddress.address.country}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
              <Typography
                className={classes.addressHeaderTypo}
                component="div"
                variant="body"
              >
                Shipping Address
              </Typography>
              <Typography
                className={classes.addressTextTypo}
                component="div"
                variant="body"
              >
                {deliveryAddress.name}
              </Typography>
              <Typography
                className={classes.addressTextTypo}
                component="div"
                variant="body"
              >
                {deliveryAddress.phone}
              </Typography>
              <Typography
                className={classes.addressTextTypo}
                component="div"
                variant="body"
              >
                {`${deliveryAddress.location.address.street}, ${deliveryAddress.location.address.door}`}
              </Typography>
              <Typography
                className={classes.addressTextTypo}
                component="div"
                variant="body"
              >
                {deliveryAddress.location.address.state}
              </Typography>
              <Typography
                className={classes.addressTextTypo}
                component="div"
                variant="body"
              >
                {deliveryAddress.location.address.areaCode}
              </Typography>
              <Typography
                className={classes.addressTextTypo}
                component="div"
                variant="body"
              >
                {deliveryAddress.location.address.country}
              </Typography>
            </Grid>
          </Grid>
        </div>
      )}
    </div>
  );
};

export default StepAddressLabel;
