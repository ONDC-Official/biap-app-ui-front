import React, { useContext, useEffect, useState } from "react";
import useStyles from "./style";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import MuiLink from "@mui/material/Link";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";

import { ReactComponent as LikeIcon } from "../../../assets/images/like.svg";
import { ReactComponent as ShareIcon } from "../../../assets/images/share.svg";

import { useHistory, useParams, Link } from "react-router-dom";

import OrderSummary from "./orderSummary";
import TrackingMap from "./trackingMap";
import CustomerDetails from "./customerDetails";

import { getOrderDetailsRequest } from "../../../api/orders.api";
import useCancellablePromise from "../../../api/cancelRequest";

import Loading from "../../shared/loading/loading";
import { ToastContext } from "../../../context/toastContext";
import { toast_actions, toast_types } from "../../shared/toast/utils/toast";

const OrderDetails = () => {
  const classes = useStyles();
  const history = useHistory();
  const { orderId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const dispatch = useContext(ToastContext);

  // HOOKS
  const { cancellablePromise } = useCancellablePromise();

  useEffect(() => {
    if (orderId) {
      getOrderDetails();
    }
  }, [orderId]);
  const getOrderDetails = async () => {
    setIsLoading(true);
    try {
      const data = await cancellablePromise(getOrderDetailsRequest(orderId));
      console.log("getOrderDetails=====>", data);
      setOrderDetails(data[0]);
    } catch (err) {
      dispatch({
        type: toast_actions.ADD_TOAST,
        payload: {
          id: Math.floor(Math.random() * 100),
          type: toast_types.error,
          message: err?.response?.data?.error?.message,
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Grid container spacing={5} className={classes.orderDetailsContainer}>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <div role="presentation">
          <Breadcrumbs aria-label="breadcrumb">
            <MuiLink component={Link} underline="hover" color="inherit" to="/application/orders">
              Order History
            </MuiLink>
            {orderId && <Typography color="text.primary">Order Details</Typography>}
          </Breadcrumbs>
        </div>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <Typography variant="h4">
          Orders Details
          <IconButton className={classes.actionButtons}>
            <ShareIcon />
          </IconButton>
          <IconButton className={classes.actionButtons}>
            <LikeIcon />
          </IconButton>
        </Typography>
      </Grid>
      {isLoading ? (
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className={classes.loaderContainer}>
          <Loading />
        </Grid>
      ) : (
        <>
          <Grid item xs={12} sm={12} md={7} lg={7} xl={7}>
            <TrackingMap />
            <Box component={"div"} className={classes.divider} />
            <CustomerDetails orderDetails={orderDetails} />
          </Grid>
          <Grid item xs={12} sm={12} md={5} lg={5} xl={5}>
            <OrderSummary orderDetails={orderDetails} />
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default OrderDetails;
