import React from "react";
import useStyles from "./style";

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import ItemImage from "../../../../assets/images/item.png";
import VegIcon from "../../../../assets/images/veg.svg";
import NonVegIcon from "../../../../assets/images/nonveg.svg";
import { ReactComponent as CustomiseIcon } from "../../../../assets/images/customise.svg";
import { ReactComponent as PlusIcon } from "../../../../assets/images/plus.svg";
import no_image_found from "../../../../assets/images/no_image_found.png";
import { useHistory } from "react-router-dom";

const MenuItem = (props) => {
  const classes = useStyles();
  const {
    productPayload,
    setProductPayload,
    product,
    productId,
    price,
    bpp_id,
    location_id,
    bpp_provider_id,
    bpp_provider_descriptor,
    show_quantity_button = true,
    onUpdateCart = () => {},
    handleAddToCart,
    setCustomizationModal,
    getProductDetails,
    productLoading,
  } = props;
  const { descriptor, isVeg } = product;

  const { name: product_name, images, short_desc: product_description } = descriptor;
  const history = useHistory();

  const renderVegNonvegIcon = (isVeg) => {
    const tags = product.tags;
    let category = "veg";

    for (let i = 0; i < tags.length; i++) {
      if (tags[i].code === "veg_nonveg") {
        category = tags[i].list[0].code;
      }
    }

    if (category == "veg") {
      return <img src={VegIcon} alt={"veg-icon"} className={classes.vegNonvegIcon} />;
    } else {
      return <img src={NonVegIcon} alt={"nonveg-icon"} className={classes.vegNonvegIcon} />;
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12} md={9.5} lg={9.5} xl={9.5}>
        <Typography variant="h6" className={classes.itemNameTypo}>
          {product_name}
        </Typography>
        <Typography variant="h5" className={classes.itemPriceTypo}>
          {`₹${
            Number.isInteger(Number(price?.value)) ? Number(price?.value).toFixed(2) : Number(price?.value).toFixed(2)
          }`}
        </Typography>
        <Typography variant="body1" className={classes.itemDescriptionTypo}>
          {product_description}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={12} md={2.5} lg={2.5} xl={2.5}>
        <Card className={classes.itemCard}>
          <img
            className={classes.itemImage}
            src={images?.length > 0 ? images[0] : no_image_found}
            alt={`item-ind-${productId}`}
            style={{ cursor: "pointer" }}
            onClick={() => history.push(`/application/products/${productId}`)}
          />
          {renderVegNonvegIcon(isVeg)}
        </Card>
        <div className={classes.cardAction}>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            endIcon={<PlusIcon />}
            className={classes.addToCartIcon}
            onClick={() => {
              getProductDetails(productId).then((data) => handleAddToCart(data, true));
            }}
            disabled={productLoading}
          >
            Add to cart
          </Button>
          <Button
            fullWidth
            variant="text"
            color="success"
            endIcon={<CustomiseIcon />}
            onClick={() => {
              getProductDetails(productId);
              setCustomizationModal(true);
            }}
          >
            Customise
          </Button>
        </div>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <Box component={"div"} className={classes.divider} />
      </Grid>
    </Grid>
  );
};

export default MenuItem;
