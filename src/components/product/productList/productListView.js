import React from 'react';
import useStyles from './style';
import {Link, useParams} from "react-router-dom";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MuiLink from "@mui/material/Link";


const ProductListView = ({data, index}) => {
    let { categoryName } = useParams();
    const classes = useStyles();

    return (
        // <div className={classes.productItemContainerList}>
        //     <Card className={classes.productCardList}>
        //         <img className={classes.productImage} src={data.imgUrl} alt={`sub-cat-img-${data.id}`}/>
        //     </Card>
        //     <Typography component="div" variant="body" className={classes.productNameTypo}>
        //         {data.name}
        //     </Typography>
        //     <Typography variant="body1" className={classes.providerTypo}>
        //         {data.provider}
        //     </Typography>
        //     <Box
        //         component={"div"}
        //         className={classes.divider}
        //     />
        //     <Typography variant="h5" className={classes.priceTypo}>
        //         {`₹${data.price}`}
        //     </Typography>
        // </div>
        <Grid container spacing={0} className={classes.productItemContainerList}>
            <Grid item xs={12} sm={12} md={2.5} lg={2.5} xl={2.5}>
                <Card className={classes.productCardList}>
                    <img className={classes.productImage} src={data.imgUrl} alt={`sub-cat-img-${data.id}`}/>
                </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={9.5} lg={9.5} xl={9.5} className={classes.productDetailsTypo}>
                <Typography component="div" variant="h5" className={classes.productNameTypoList}>
                    {data.name}
                </Typography>
                <Typography variant="body1" className={classes.providerTypoList}>
                    {data.provider}
                </Typography>
                <Typography variant="h4" className={classes.priceTypoList}>
                    {`₹${data.price}`}
                </Typography>
                <Typography component="div" variant="body" className={classes.descriptionTypoList}>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                    tempor incididunt ut labore et dolore magna aliqua
                </Typography>
                <div className={classes.footerActions}>
                    <MuiLink
                        component={Link}
                        to={"/"}
                    >
                        View details
                    </MuiLink>

                    <Button
                        className={classes.addToCartBtn}
                        variant="contained"
                    >
                        Buy Now
                    </Button>
                    <Button
                        className={classes.addToCartBtn}
                        variant="outlined"
                    >
                        Add to cart
                    </Button>
                </div>
            </Grid>
        </Grid>
    )

};

export default ProductListView;