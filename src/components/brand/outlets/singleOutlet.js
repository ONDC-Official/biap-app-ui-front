import React from "react";
import useStyles from "./style";

import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { useHistory, useParams } from "react-router-dom";

const SingleOutlet = ({ outletDetails, brandImageUrl }) => {
  const classes = useStyles();
  const { brandId } = useParams();
  const history = useHistory();

  const { id, address, circle } = outletDetails;
  const { radius } = circle;

  return (
    <div className={classes.outletItemContainer} onClick={() => history.push(`/application/brand/${brandId}/${id}`)}>
      <Card className={classes.outletCard}>
        <img className={classes.outletImage} src={brandImageUrl} alt={`outlet-img-${outletDetails.id}`} />
      </Card>
      <Typography component="div" variant="body" className={classes.outletNameTypo}>
        {`${address.street}, ${address.city}`}
      </Typography>
      {/*<Box*/}
      {/*    component={"div"}*/}
      {/*    className={classes.divider}*/}
      {/*/>*/}
      {/*<div className={classes.detailsContainer}>*/}
      {/*    <Typography color="success.main" className={classes.timeTypo}>*/}
      {/*        {`${outletDetails.time} min`}*/}
      {/*    </Typography>*/}
      {/*    <Typography variant="body1" className={classes.distanceTypo}>*/}
      {/*        {`${radius?.value} ${radius?.unit || "km"}`}*/}
      {/*    </Typography>*/}
      {/*</div>*/}
    </div>
  );
};

export default SingleOutlet;
