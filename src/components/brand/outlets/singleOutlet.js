import React from 'react';
import useStyles from './style';

import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import no_image_found from "../../../assets/images/no_image_found.png";
import {useHistory, useParams} from "react-router-dom";

const SingleOutlet = ({outletDetails}) => {
    const classes = useStyles();
    const {brandId} = useParams();
    const history = useHistory();

    return (
        <div
            className={classes.outletItemContainer}
            onClick={() => history.push(`/application/brand/${brandId}/${outletDetails.id}`)}
        >
            <Card className={classes.outletCard}>
                <img
                    className={classes.outletImage}
                    src={outletDetails?.imageUrl ? outletDetails.imageUrl : no_image_found}
                    alt={`outlet-img-${outletDetails.id}`}
                />
            </Card>
            <Typography component="div" variant="body" className={classes.outletNameTypo}>
                {outletDetails.outletName}
            </Typography>
            <Box
                component={"div"}
                className={classes.divider}
            />
            <div className={classes.detailsContainer}>
                <Typography color="success.main" className={classes.timeTypo}>
                    {`${outletDetails.time} min`}
                </Typography>
                <Typography variant="body1" className={classes.distanceTypo}>
                    {`${outletDetails.distance} km`}
                </Typography>
            </div>
        </div>
    )

};

export default SingleOutlet;