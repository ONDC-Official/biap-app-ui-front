import React, { useState, useEffect } from "react";
import useStyles from "./style";

import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { ReactComponent as CartIcon } from "../../../assets/images/cart.svg";
import no_image_found from "../../../assets/images/no_image_found.png";
import { useHistory } from "react-router-dom";
import { postCall } from "../../../api/axios";
import { getValueFromCookie } from "../../../utils/cookies";
import { Button } from "@mui/material";

const ProductGridView = (props) => {
  const classes = useStyles();
  const history = useHistory();
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
    getProductDetails,
    productLoading,
  } = props;
  const { id, descriptor, provider_details } = product;
  const { name: provider_name } = bpp_provider_descriptor;
  const { name: product_name, images, symbol } = descriptor;

  return (
    <div
      className={classes.productItemContainer}
      onClick={() => history.push(`/application/products?productId=${productId}`)}
    >
      <Card className={classes.productCard}>
        <img className={classes.productImage} src={symbol ? symbol : no_image_found} alt={`sub-cat-img-${bpp_id}`} />
        <Tooltip title="Add to cart">
          {/* <IconButton
            onClick={(e) => {
              e.stopPropagation();
              // getProductDetails(productId).then((data) => handleAddToCart(data, true));
            }}
            color="inherit"
            className={classes.cartIcon}
          >
            <CartIcon />
          </IconButton> */}
        </Tooltip>
        {/* <Button
          fullWidth
          className={classes.buyNowButton}
          variant="contained"
          onClick={(e) => {
            e.stopPropagation();
            // getProductDetails(productId).then((data) => handleAddToCart(data, true, true));
          }}
        >
          Buy Now
        </Button> */}
      </Card>
      <Typography component="div" variant="body" className={classes.productNameTypo}>
        {product_name}
      </Typography>
      <Typography variant="body1" className={classes.providerTypo}>
        {provider_name}
      </Typography>
      <Box component={"div"} className={classes.divider} />
      <Typography variant="h5" className={classes.priceTypo}>
        {`₹${
          Number.isInteger(Number(price?.value)) ? Number(price?.value).toFixed(2) : Number(price?.value).toFixed(2)
        }`}
      </Typography>
    </div>
  );
};

export default ProductGridView;
