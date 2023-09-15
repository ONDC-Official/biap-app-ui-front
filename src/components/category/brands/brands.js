import React, {useContext, useEffect, useState} from 'react';
import useStyles from './style';

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import {getAllOutletsFromCategoryAndLocationRequest} from "../../../api/brand.api";
import useCancellablePromise from "../../../api/cancelRequest";

import {ToastContext} from "../../../context/toastContext";
import {toast_actions, toast_types} from "../../shared/toast/utils/toast";
import {useLocation} from "react-router-dom";
import {categoryList} from "../../../constants/categories";
import SingleBrand from "./singleBrand";
import {AddressContext} from "../../../context/addressContext";
import {getValueFromCookie} from "../../../utils/cookies";

import Loading from "../../shared/loading/loading";

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
        let sc = JSON.parse(getValueFromCookie("search_context") || {});
        const findCategory = categoryList.find((item) => item.routeName === categoryName);
        if(findCategory){
            setIsLoading(true);
            try {
                const reqParams = {
                    domain: findCategory.domain,
                    lat: '77.0692', //sc.location.lat,
                    lng: '28.679', //sc.location.lng
                };
                const data = await cancellablePromise(
                    getAllOutletsFromCategoryAndLocationRequest(reqParams)
                );
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
                        isLoading
                        ?<Grid item xs={12} sm={12} md={1} lg={1} xl={1}><Loading /></Grid>
                        :(
                            <>
                                {
                                    brands.length > 0
                                    ?(
                                        <>
                                            {
                                                brands.map((item, ind) => (
                                                    <Grid key={`sub-cat-item-${ind}`} item xs={12} sm={12} md={2} lg={2} xl={2}>
                                                        <SingleBrand
                                                            data={item}
                                                        />
                                                    </Grid>
                                                ))
                                            }
                                        </>
                                    ):(
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <Typography variant="body1">No store available near you</Typography>
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

}
export default  Brands;