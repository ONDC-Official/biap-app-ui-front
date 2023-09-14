import React, {useContext, useEffect, useState} from 'react';
import useStyles from './style';

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import {getAllBrandsRequest} from "../../../api/brand.api";
import useCancellablePromise from "../../../api/cancelRequest";
import no_image_found from "../../../assets/images/no_image_found.png";
import {ToastContext} from "../../../context/toastContext";
import {toast_actions, toast_types} from "../../shared/toast/utils/toast";
import {useLocation} from "react-router-dom";
import {PRODUCT_SUBCATEGORY} from "../../../constants/categories";
import SingleBrand from "./singleBrand";

const Brands = () => {
    const classes = useStyles();
    const [brands, setBrands] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useContext(ToastContext);

    // HOOKS
    const { cancellablePromise } = useCancellablePromise();

    const locationData = useLocation();
    const useQuery = () => {
        const { search } = locationData;
        return React.useMemo(() => new URLSearchParams(search), [search]);
    };
    let query = useQuery();

    useEffect(() => {
        const categoryName = query.get("c");
        if(categoryName){
            getAllBrands(categoryName);
        }
    }, [locationData]);
    const getAllBrands = async(categoryName) => {
        setIsLoading(true);
        try {
            const data = await cancellablePromise(
                getAllBrandsRequest()
            );
            console.log("getAllBrandsRequest=====>", data)
            setBrands(data.data);
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
        <Grid container spacing={3} className={classes.brandContainer}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography variant="h4">
                    Stores near you
                </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Grid container spacing={3}>
                    {
                        brands.map((item, ind) => (
                            <Grid key={`sub-cat-item-${ind}`} item xs={12} sm={12} md={2} lg={2} xl={2}>
                                <SingleBrand
                                    data={item}
                                />
                            </Grid>
                        ))
                    }
                </Grid>
            </Grid>
        </Grid>
    )

}
export default  Brands;