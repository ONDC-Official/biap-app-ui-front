import React from "react";
import useStyles from "./style";
import { Link, useParams } from "react-router-dom";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MuiLink from "@mui/material/Link";

import no_image_found from "../../../assets/images/no_image_found.png";

const ProductListView = (props) => {
  const classes = useStyles();
  const {
    product,
    productId,
    price,
    bpp_id,
    location_id,
    bpp_provider_id,
    bpp_provider_descriptor,
    show_quantity_button = true,
    onUpdateCart = () => {},
    handleAddToCart = () => {},
  } = props;
  const { id, descriptor, provider_details } = product;
  const { name: provider_name } = bpp_provider_descriptor;
  const { name: product_name, images, short_desc: product_description } = descriptor;

  return (
    <Grid container spacing={0} className={classes.productItemContainerList}>
      <Grid item xs={12} sm={12} md={2.5} lg={2.5} xl={2.5}>
        <Card className={classes.productCardList}>
          <img
            className={classes.productImage}
            src={images?.length > 0 ? images[0] : no_image_found}
            alt={`sub-cat-img-${bpp_id}`}
          />
        </Card>
      </Grid>
      <Grid item xs={12} sm={12} md={9.5} lg={9.5} xl={9.5} className={classes.productDetailsTypo}>
        <Typography component="div" variant="h5" className={classes.productNameTypoList}>
          {product_name}
        </Typography>
        <Typography variant="body1" className={classes.providerTypoList}>
          {provider_name}
        </Typography>
        <Typography variant="h4" className={classes.priceTypoList}>
          {`₹${
            Number.isInteger(Number(price?.value)) ? Number(price?.value).toFixed(2) : Number(price?.value).toFixed(2)
          }`}
        </Typography>
        <Typography component="div" variant="body" className={classes.descriptionTypoList}>
          {product_description}
        </Typography>
        <div className={classes.footerActions}>
          <MuiLink component={Link} to={`/application/products/${productId}`}>
            View details
          </MuiLink>

          <Button className={classes.addToCartBtn} variant="contained">
            Buy Now
          </Button>
          <Button className={classes.addToCartBtn} variant="outlined" onClick={handleAddToCart}>
            Add to cart
          </Button>
        </div>
      </Grid>
    </Grid>
  );
};

export default ProductListView;
