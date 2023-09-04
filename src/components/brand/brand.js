import React, {useEffect, useState} from 'react';
import useStyles from './style';

import Categories from './categories/categories';
import Products from './products/products';
import Outlets from './outlets/outlets';

import CircularProgress from '@mui/material/CircularProgress';

import {getBrandDetailsRequest} from "../../api/brand.api";
import useCancellablePromise from "../../api/cancelRequest";
import {useParams} from "react-router-dom";

const Brand = () => {
    const classes = useStyles();
    const {brandId} = useParams();

    const [brandDetails, setBrandDetails] = useState(null);
    const [brandIsFromFAndBCategory, setBrandIsFromFAndBCategory] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // HOOKS
    const { cancellablePromise } = useCancellablePromise();

    const getBrandDetails = async() => {
        setIsLoading(true);
        try {
            const data = await cancellablePromise(
                getBrandDetailsRequest(brandId)
            );
            if(data.domain === "ONDC:RET11"){
                setBrandIsFromFAndBCategory(true);
            }else{
                setBrandIsFromFAndBCategory(false);
            }
            setBrandDetails(data);
        } catch (err) {
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getBrandDetails();
    }, [brandId]);

    if(isLoading || brandDetails === null){
        return (
            <div
                className={classes.loader}
            >
                <CircularProgress />
                <div>Loading...</div>
            </div>
        )
    }else{
        if(brandIsFromFAndBCategory){
            return (
                <Outlets
                    brandDetails={brandDetails}
                />
            )
        }else{
            return (
                <>
                    <Categories
                        brandDetails={brandDetails}
                    />
                    <Products
                        brandDetails={brandDetails}
                    />
                </>
            )
        }
    }

};

export default Brand;