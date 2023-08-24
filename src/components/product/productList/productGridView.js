import React from 'react';
import useStyles from './style';

import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import {ReactComponent as CartIcon} from '../../../assets/images/cart.svg';

const ProductGridView = ({data, index}) => {
    const classes = useStyles();

    return (
        <div className={classes.productItemContainer}>
            <Card className={classes.productCard}>
                <img className={classes.productImage} src={data.imgUrl} alt={`sub-cat-img-${data.id}`}/>
                <Tooltip title="Add to cart">
                    <IconButton color="inherit" className={classes.cartIcon}>
                        <CartIcon />
                    </IconButton>
                </Tooltip>
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

export default ProductGridView;