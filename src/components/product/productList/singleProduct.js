import React from 'react';
import useStyles from './style';
import {useParams} from "react-router-dom";

import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const SingleProduct = ({data, index}) => {
    let { categoryName } = useParams();
    const classes = useStyles();

    return (
        <div className={classes.productItemContainer}>
            <Card className={classes.productCard}>
                <img className={classes.productImage} src={data.imgUrl} alt={`sub-cat-img-${data.id}`}/>
            </Card>
            <Typography component="div" variant="body" className={classes.productNameTypo}>
                {data.name}
            </Typography>
            <Typography variant="body1" className={classes.providerTypo}>
                {data.provider}
            </Typography>
            <Box
                component={"div"}
                className={classes.divider}
            />
            <Typography variant="h5" className={classes.priceTypo}>
                {`₹${data.price}`}
            </Typography>
        </div>
    )

};

export default SingleProduct;