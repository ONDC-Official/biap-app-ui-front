import React, {useEffect, useState} from 'react';
import useStyles from './style';

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import MuiLink from '@mui/material/Link';
import CircularProgress from '@mui/material/CircularProgress';

import {Link, useParams} from "react-router-dom";
import OutletImage from '../../../assets/images/outlet.png';
import SingleOutlet from "./singleOutlet";

import {getAllOutletsRequest} from "../../../api/brand.api";
import useCancellablePromise from "../../../api/cancelRequest";

const OutletLists = [
    {id: '1', name: 'Burger King', outletName: 'Industrial Area, Chandigarh', time: '20-25', distance: '1', imageUrl: OutletImage},
    {id: '2', name: 'Burger King', outletName: 'Sector 35, Chandigarh', time: '35-40', distance: '3', imageUrl: OutletImage},
    {id: '3', name: 'Burger King', outletName: 'Sector 8, Chandigarh', time: '45-50', distance: '4', imageUrl: OutletImage},
    {id: '4', name: 'Burger King', outletName: 'Phase 11, Mohali', time: '40-50', distance: '4.5', imageUrl: OutletImage},
    {id: '5', name: 'Burger King', outletName: 'Sector 9, Panchkula', time: '55-60', distance: '7', imageUrl: OutletImage},
    {id: '6', name: 'Burger King', outletName: 'Sector 20, Chandigarh', time: '45-50', distance: '6', imageUrl: OutletImage},
    {id: '7', name: 'Burger King', outletName: 'Phase 8, Mohali', time: '50-55', distance: '6.5', imageUrl: OutletImage},
]
const Outlets = ({brandDetails}) => {
    const classes = useStyles();
    const {brandId} = useParams();
    const {descriptor} = brandDetails;
    const {name: brandName, images} = descriptor;

    const [isLoading, setIsLoading] = useState(false);

    // HOOKS
    const { cancellablePromise } = useCancellablePromise();

    const getAllOutlets = async() => {
        setIsLoading(true);
        try {
            const data = await cancellablePromise(
                getAllOutletsRequest(brandId)
            );
            console.log("getAllOutlets=====>", data);
            // setBrandDetails(data);
        } catch (err) {
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getAllOutlets();
    }, [brandId]);

    return (
        <Grid container spacing={4} className={classes.outletsContainer}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <div role="presentation">
                    <Breadcrumbs aria-label="breadcrumb">
                        <MuiLink component={Link} underline="hover" color="inherit" to="/application/products">
                            Home
                        </MuiLink>
                        {
                            brandId && (
                                <Typography color="text.primary">{brandName}</Typography>
                            )
                        }
                    </Breadcrumbs>
                </div>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography variant="h4" color={"success"}>
                    All Outlets near you
                </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Grid container spacing={2}>
                    {
                        isLoading
                            ?(
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <CircularProgress />
                                </Grid>
                            ):(
                                <>
                                    {
                                        OutletLists.length > 0
                                            ?(
                                                <>
                                                    {
                                                        OutletLists.map((outlet, ind) => (
                                                            <Grid key={`outlet-item-${ind}`} item xs={12} sm={12} md={3} lg={3} xl={3}>
                                                                <SingleOutlet
                                                                    outletDetails={outlet}
                                                                />
                                                            </Grid>
                                                        ))
                                                    }
                                                </>
                                            ):(
                                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                                    <Typography variant="body1">
                                                        No Outlets available
                                                    </Typography>
                                                </Grid>
                                            )
                                    }
                                </>
                            )
                    }
                </Grid>
            </Grid>
        </Grid>
    )

};

export default Outlets;