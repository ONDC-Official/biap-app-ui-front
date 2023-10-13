import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import useStyles from "../product-list/product-details/style";
import { Button, Divider, Grid, IconButton, Typography } from "@mui/material";
import CustomizationRenderer from "../product-list/product-details/CustomizationRenderer";
import { getValueFromCookie } from "../../../utils/cookies";
import { CartContext } from "../../../context/cartContext";
import { putCall } from "../../../api/axios";

const EditCustomizations = (props) => {
  const {
    cartItems,
    productPayload,
    setProductPayload,
    customization_state,
    setCustomizationState,
    setOpenDrawer,
    currentCartItem,
  } = props;

  const classes = useStyles();
  const history = useHistory();
  const { fetchCartItems } = useContext(CartContext);
  let user = {};
  const userCookie = getValueFromCookie("user");
  const [itemOutOfStock, setItemOutOfStock] = useState(false);

  if (userCookie) {
    try {
      user = JSON.parse(userCookie);
    } catch (error) {
      console.log("Error parsing user cookie:", error);
    }
  }

  const calculateSubtotal = () => {
    let subtotal = 0;

    for (const level in customization_state) {
      const selectedOptions = customization_state[level].selected;
      if (selectedOptions.length > 0) {
        subtotal += selectedOptions.reduce((acc, option) => acc + option.price, 0);
      }
    }
    return subtotal;
  };

  let selectedCustomizationIds = [];

  const getCustomization_ = (groupId) => {
    let group = customization_state[groupId];
    if (!group) return;

    let customizations = group.selected.map((s) => selectedCustomizationIds.push(s.id));
    group?.childs?.map((child) => {
      getCustomization_(child);
    });
  };

  const getCustomizations = () => {
    const { customisation_items } = productPayload;
    const customizations = [];
    const levels = Object.keys(customization_state);
    const firstGroupId = customization_state["firstGroup"].id;

    getCustomization_(firstGroupId);

    for (const cId of selectedCustomizationIds) {
      let c = customisation_items.find((item) => item.local_id === cId);
      if (c) {
        c = {
          ...c,
          quantity: {
            count: 1,
          },
        };
        customizations.push(c);
      }
    }

    return customizations;
  };

  const updateCustomizations = async () => {
    const url = `/clientApis/v2/cart/${user.id}/${currentCartItem._id}`;
    const items = cartItems.concat([]);
    const itemIndex = items.findIndex((item) => item._id === currentCartItem._id);
    if (itemIndex !== -1) {
      let updatedCartItem = items[itemIndex];
      const updatedCustomizations = getCustomizations();
      updatedCartItem.id = updatedCartItem.item.id;
      updatedCartItem.item.customisations = updatedCustomizations;
      updatedCartItem = updatedCartItem.item;
      updatedCartItem.customisationState = customization_state;

      const res = await putCall(url, updatedCartItem);
      setOpenDrawer(false);
      fetchCartItems();
    }
  };

  const renderVegNonVegTag = () => {
    const FnB = "ONDC:RET11";
    const grocery = "ONDC:RET10";

    if (productPayload?.context?.domain == grocery || productPayload?.context?.domain == FnB) {
      const tags = productPayload.item_details.tags;
      let category = "veg";

      for (let i = 0; i < tags.length; i++) {
        if (tags[i].code === "veg_nonveg") {
          const vegNonVegValue = tags[i].list[0].value;

          if (vegNonVegValue === "yes" || vegNonVegValue === "Yes") {
            category = "veg";
          } else if (vegNonVegValue === "no") {
            category = "nonveg";
          } else if (vegNonVegValue === "egg") {
            category = "egg";
          }
        }
      }

      const getTagColor = () => {
        if (category === "veg") {
          return "#008001";
        } else if (category == "nonveg") {
          return "red";
        } else {
          return "#008001";
        }
      };

      const getTextColor = () => {
        if (category === "veg") {
          return "#419E6A";
        } else if (category == "nonVeg") {
          return "red";
        } else {
          return "red";
        }
      };

      const map = {
        veg: "Veg",
        nonveg: "Non Veg",
        egg: "EGG",
      };

      return (
        <Grid container alignItems="center" sx={{ marginBottom: 0.8 }}>
          <div className={classes.square} style={{ borderColor: getTagColor() }}>
            <div className={classes.circle} style={{ backgroundColor: getTagColor() }}></div>
          </div>
          <Typography variant="body" color={getTextColor()} sx={{ fontWeight: "600" }}>
            {map[category]}
          </Typography>
        </Grid>
      );
    }

    return null;
  };

  return (
    <Grid className={classes.editContainer}>
      <Grid className={classes.editDetails}>
        <Grid container alignItems="center" justifyContent="space-between" sx={{ marginBottom: "20px" }}>
          <Typography variant="h4">Customise your food</Typography>
          <IconButton
            color="inherit"
            onClick={() => {
              setProductPayload(null);
              setCustomizationState({});
              setOpenDrawer(false);
            }}
          >
            <CloseIcon sx={{ cursor: "pointer" }} />
          </IconButton>
        </Grid>
        {renderVegNonVegTag()}
        <Typography variant="h4" color="black" sx={{ marginBottom: 1, fontFamily: "inter", fontWeight: 600 }}>
          {productPayload?.item_details?.descriptor?.name}
        </Typography>
        <Typography variant="h4" color="black" sx={{ marginBottom: 1, fontFamily: "inter", fontWeight: 700 }}>
          ₹ {productPayload?.item_details?.price?.value}
        </Typography>
        <Divider sx={{ marginBottom: 1.5 }} />
        <div>
          <CustomizationRenderer
            productPayload={productPayload}
            customization_state={customization_state}
            setCustomizationState={setCustomizationState}
            setItemOutOfStock={setItemOutOfStock}
            isEditFlow={true}
          />
        </div>
      </Grid>
      <div className={classes.editBtns}>
        <Button
          fullWidth
          variant="outlined"
          sx={{ marginRight: 1.4 }}
          onClick={() => history.push(`/application/products?productId=${productPayload.id}`)}
          disabled={itemOutOfStock}
        >
          View Details
        </Button>
        <Button
          fullWidth
          variant="contained"
          onClick={() => {
            updateCustomizations();
          }}
          disabled={itemOutOfStock}
        >
          Save
        </Button>
      </div>
    </Grid>
  );
};

export default EditCustomizations;
