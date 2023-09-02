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

import CustomeMenu from './customMenu/customMenu';

const OutletLists = [
    {id: '1', name: 'Burger King', outletName: 'Industrial Area, Chandigarh', time: '20-25', distance: '1', imageUrl: OutletImage, description: 'Burger, Fast Food, Desserts, Shake'},
    {id: '2', name: 'Burger King', outletName: 'Sector 35, Chandigarh', time: '35-40', distance: '3', imageUrl: OutletImage, description: 'Burger, Fast Food, Desserts, Shake'},
    {id: '3', name: 'Burger King', outletName: 'Sector 8, Chandigarh', time: '45-50', distance: '4', imageUrl: OutletImage, description: 'Burger, Fast Food, Desserts, Shake'},
    {id: '4', name: 'Burger King', outletName: 'Phase 11, Mohali', time: '40-50', distance: '4.5', imageUrl: OutletImage, description: 'Burger, Fast Food, Desserts, Shake'},
    {id: '5', name: 'Burger King', outletName: 'Sector 9, Panchkula', time: '55-60', distance: '7', imageUrl: OutletImage, description: 'Burger, Fast Food, Desserts, Shake'},
    {id: '6', name: 'Burger King', outletName: 'Sector 20, Chandigarh', time: '45-50', distance: '6', imageUrl: OutletImage, description: 'Burger, Fast Food, Desserts, Shake'},
    {id: '7', name: 'Burger King', outletName: 'Phase 8, Mohali', time: '50-55', distance: '6.5', imageUrl: OutletImage, description: 'Burger, Fast Food, Desserts, Shake'},
];

const OutletDetails = () => {
    const classes = useStyles();
    const {brandId, outletId} = useParams();
    const history = useHistory();

    const [outletDetails, setOutletDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if(outletId){
            const findOutlet = OutletLists.find((outlet) => outlet.id === outletId);
            if(findOutlet){
                setOutletDetails(findOutlet);
            }else{
                setOutletDetails(null)
            }
        }
    }, [outletId]);
    return (
        <Grid container spacing={4} className={classes.outletDetailsContainer}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <div role="presentation">
                    <Breadcrumbs aria-label="breadcrumb">
                        <MuiLink component={Link} underline="hover" color="inherit" to="/application/products">
                            Home
                        </MuiLink>
                        <MuiLink component={Link} underline="hover" color="inherit" to={`/application/brand/${brandId}`}>
                            {outletDetails?.name}
                        </MuiLink>
                        {
                            brandId && (
                                <Typography color="text.primary">{`${outletDetails?.name} Details`}</Typography>
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
                                src={outletDetails?.imageUrl ? outletDetails.imageUrl : no_image_found}
                                alt={`outlet-img-${outletDetails?.id}`}
                            />
                        </Card>
                        <div className={classes.detailsContainer}>
                            <Typography variant="h2">
                                {outletDetails?.name}
                            </Typography>
                            <Typography component="div" variant="body" className={classes.descriptionTypo}>
                                {outletDetails?.description}
                            </Typography>
                            <Typography color="error.dark" component="div" variant="body" className={classes.outletNameTypo}>
                                {outletDetails?.outletName}
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
                                {outletDetails?.outletName}
                            </Typography>
                            <Typography
                                color="primary.main" component="div" variant="body"
                                className={classes.seeAllOutletTypo}
                                onClick={() => {
                                    history.push(`/application/brand/${brandId}`)
                                }}
                            >
                                See all 78 Burger King outlets in Chandigarh >
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
                        <CustomeMenu />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4} xl={4}></Grid>
                </Grid>
            </Grid>
        </Grid>
    )

};

export default  OutletDetails;