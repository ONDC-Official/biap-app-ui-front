import React, { useState } from 'react';
import useStyles from './style';

import Categories from './categories/categories';
import Products from './products/products';
import Outlets from './outlets/outlets';

import CircularProgress from '@mui/material/CircularProgress';

const Brand = () => {
    const classes = useStyles();
    const [brandIsFromFAndBCategory, setBrandIsFromFAndBCategory] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    if(isLoading){
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
            return <Outlets />
        }else{
            return (
                <>
                    <Categories />
                    <Products />
                </>
            )
        }
    }

};

export default Brand;