import React, {useEffect, useState} from 'react';
import useStyles from './style';

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import MuiLink from '@mui/material/Link';
import Button from '@mui/material/Button';
import Box from "@mui/material/Box";

import {Link, useHistory, useParams} from "react-router-dom";
import OutletImage from '../../../assets/images/outlet.png';
import no_image_found from "../../../assets/images/no_image_found.png";
import map from "../../../assets/images/map.png";

import CustomMenu from './customMenu/customMenu';

import {getBrandDetailsRequest, getOutletDetailsRequest} from "../../../api/brand.api";
import useCancellablePromise from "../../../api/cancelRequest";

const OutletDetails = () => {
    const classes = useStyles();
    const {brandId, outletId} = useParams();
    const history = useHistory();

    const [brandDetails, setBrandDetails] = useState(null);
    const [outletDetails, setOutletDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // HOOKS
    const { cancellablePromise } = useCancellablePromise();

    const getBrandDetails = async() => {
        setIsLoading(true);
        try {
            const data = await cancellablePromise(
                getBrandDetailsRequest(brandId)
            );
            setBrandDetails(data);
            if(outletId){
                await getOutletDetails()
            }
        } catch (err) {
        } finally {
            setIsLoading(false);
        }
    };

    const getOutletDetails = async() => {
        setIsLoading(true);
        try {
            const data = await cancellablePromise(
                getOutletDetailsRequest(outletId)
            );
            setOutletDetails(data);
        } catch (err) {
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if(brandId){
            getBrandDetails();
        }
        // if(outletId){
        //     getOutletDetails()
        // }
    }, [brandId, outletId]);

    return (
        <Grid container spacing={4} className={classes.outletDetailsContainer}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <div role="presentation">
                    <Breadcrumbs aria-label="breadcrumb">
                        <MuiLink component={Link} underline="hover" color="inherit" to="/application/products">
                            Home
                        </MuiLink>
                        <MuiLink component={Link} underline="hover" color="inherit" to={`/application/brand/${brandId}`}>
                            {brandDetails?.descriptor?.name}
                        </MuiLink>
                        {
                            brandId && (
                                <Typography color="text.primary">{`${brandDetails?.descriptor?.name} Details`}</Typography>
                            )
                        }
                    </Breadcrumbs>
                </div>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className={classes.outletDetailsHeaderContainer}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
                        <Card className={classes.outletDetailsCard}>
                            <img
                                className={classes.outletImage}
                                src={brandDetails?.descriptor?.images?.length > 0 ? brandDetails?.descriptor?.images[0] : no_image_found}
                                alt={`outlet-img-${outletDetails?.id}`}
                            />
                        </Card>
                        <div className={classes.detailsContainer}>
                            <Typography variant="h2">
                                {brandDetails?.descriptor?.name}
                            </Typography>
                            <Typography component="div" variant="body" className={classes.descriptionTypo}>
                                {outletDetails?.description}
                            </Typography>
                            <Typography color="error.dark" component="div" variant="body" className={classes.outletNameTypo}>
                                {`${outletDetails?.address?`${outletDetails?.address?.street || "-"}, ${outletDetails?.address?.city || "-"}`:"-"}`}
                            </Typography>
                            <Typography component="div" variant="body" className={classes.outletOpeningTimeTypo}>
                                <span className={classes.isOpen}>Open now</span>
                                - 12 midnight – 1am, 9am – 12 midnight (Today)
                            </Typography>
                            <div
                                className={classes.actionButtonContainer}
                            >
                                <Button className={classes.actionButton} variant="outlined" color="error">Get Direction</Button>
                                <Button className={classes.actionButton} variant="outlined" color="primary">Call Now</Button>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                        <Card className={classes.outletContactInfoCard}>
                            <Typography variant="h4">
                                Call
                            </Typography>
                            <Typography component="div" variant="body" className={classes.contactNumbers}>
                                +91 92729282982, +91 92729282982
                            </Typography>
                            <Typography variant="h4" className={classes.directionTypo}>
                                Direction
                            </Typography>
                            <div>
                                <img
                                    className={classes.mapImage}
                                    src={map}
                                    alt={`map-img-${outletDetails?.id}`}
                                />
                            </div>
                            <Typography color="error.dark" component="div" variant="body" className={classes.outletNameTypo}>
                                {`${outletDetails?.address?`${outletDetails?.address?.street || "-"}, ${outletDetails?.address?.city || "-"}`:"-"}`}
                            </Typography>
                            <Typography
                                color="primary.main" component="div" variant="body"
                                className={classes.seeAllOutletTypo}
                                onClick={() => {
                                    history.push(`/application/brand/${brandId}`)
                                }}
                            >
                                {`See all 78 ${brandDetails?.descriptor?.name} outlets in ${outletDetails?.address?.city} >`}
                            </Typography>
                        </Card>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
                        <Box
                            component={"div"}
                            className={classes.divider}
                        />
                        <CustomMenu
                            brandDetails={brandDetails}
                            outletDetails={outletDetails}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4} xl={4}></Grid>
                </Grid>
            </Grid>
        </Grid>
    )

};

export default  OutletDetails;