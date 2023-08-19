import React from 'react';
import useStyles from './style';
import {useParams, Link} from "react-router-dom";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import MuiLink from '@mui/material/Link';


import SingleProduct from "./singleProduct";

import product1 from '../../../assets/images/product/product1.png';
import product2 from '../../../assets/images/product/product2.png';
import product3 from '../../../assets/images/product/product3.png';
import product4 from '../../../assets/images/product/product4.png';
import product5 from '../../../assets/images/product/product5.png';
import product6 from '../../../assets/images/product/product6.png';
import product7 from '../../../assets/images/product/product7.png';
import product8 from '../../../assets/images/product/product8.png';

const Products = [
    {id: 1, name: 'Embroidered Handloom Cotton Silk Saree (Black)', price: '2999', provider: 'CHHABRA 555 Sarees', imgUrl: product1},
    {id: 2, name: 'Embroidered Handloom Cotton Silk Saree (Black)', price: '2999', provider: 'CHHABRA 555 Sarees', imgUrl: product2},
    {id: 3, name: 'Embroidered Handloom Cotton Silk Saree (Black)', price: '2999', provider: 'CHHABRA 555 Sarees', imgUrl: product3},
    {id: 4, name: 'Embroidered Handloom Cotton Silk Saree (Black)', price: '2999', provider: 'CHHABRA 555 Sarees', imgUrl: product4},
    {id: 5, name: 'Embroidered Handloom Cotton Silk Saree (Black)', price: '2999', provider: 'CHHABRA 555 Sarees', imgUrl: product5},
    {id: 6, name: 'Embroidered Handloom Cotton Silk Saree (Black)', price: '2999', provider: 'CHHABRA 555 Sarees', imgUrl: product6},
    {id: 7, name: 'Embroidered Handloom Cotton Silk Saree (Black)', price: '2999', provider: 'CHHABRA 555 Sarees', imgUrl: product7},
    {id: 8, name: 'Embroidered Handloom Cotton Silk Saree (Black)', price: '2999', provider: 'CHHABRA 555 Sarees', imgUrl: product8},
];
const ProductList = () => {
    const classes = useStyles();
    let { categoryName, subCategoryName } = useParams();

    const handleClick = (event) => {
        event.preventDefault();
        console.info('You clicked a breadcrumb.');
    }

    return (
        <Grid container spacing={3} className={classes.productContainer}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <div role="presentation" onClick={handleClick}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <MuiLink component={Link} underline="hover" color="inherit" to="/">
                            Home
                        </MuiLink>
                        <MuiLink
                            component={Link}
                            underline="hover"
                            color="inherit"
                            to={`/category/${categoryName}`}
                        >
                            {categoryName}
                        </MuiLink>
                        <Typography color="text.primary">{subCategoryName}</Typography>
                    </Breadcrumbs>
                </div>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography variant="h4">
                    Women’s Sarees
                </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Grid container spacing={4}>
                    {
                        Products.map((item, ind) => (
                            <Grid key={`product-item-${ind}`} item xs={12} sm={12} md={3} lg={3} xl={3}>
                                <SingleProduct
                                    data={item}
                                />
                            </Grid>
                        ))
                    }
                </Grid>
            </Grid>
        </Grid>
    )

};

export default  ProductList;