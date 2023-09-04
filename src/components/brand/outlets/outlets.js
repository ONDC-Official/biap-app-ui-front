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
import no_image_found from "../../../assets/images/no_image_found.png";

const Outlets = ({brandDetails}) => {
    const classes = useStyles();
    const {brandId} = useParams();
    const {descriptor} = brandDetails;
    const {name: brandName, images} = descriptor;

    const [isLoading, setIsLoading] = useState(false);
    const [outlets, setOutlets] = useState([]);

    // HOOKS
    const { cancellablePromise } = useCancellablePromise();

    const getAllOutlets = async() => {
        setIsLoading(true);
        try {
            const data = await cancellablePromise(
                getAllOutletsRequest(brandId)
            );
            console.log("getAllOutlets=====>", data.data);
            setOutlets(data.data);
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
                                        outlets.length > 0
                                            ?(
                                                <>
                                                    {
                                                        outlets.map((outlet, ind) => (
                                                            <Grid key={`outlet-item-${ind}`} item xs={12} sm={12} md={3} lg={3} xl={3}>
                                                                <SingleOutlet
                                                                    outletDetails={outlet}
                                                                    brandImageUrl={images?.length > 0 ? images[0] : no_image_found}
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