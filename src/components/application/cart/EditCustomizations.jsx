import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import useStyles from "../product-list/product-details/style";
import { Button, Divider, Grid, Typography } from "@mui/material";
import CustomizationRenderer from "../product-list/product-details/CustomizationRenderer";

const EditCustomizations = (props) => {
  const { productPayload, customization_state, setCustomizationState, setOpenDrawer } = props;
  const classes = useStyles();

  const renderVegNonVegTag = () => {
    const FnB = "ONDC:RET11";
    const grocery = "ONDC:RET10";

    if (productPayload?.context?.domain == grocery || productPayload?.context?.domain == FnB) {
      const tags = productPayload.item_details.tags;
      let category = "veg";

      for (let i = 0; i < tags.length; i++) {
        if (tags[i].code === "veg_nonveg") {
          const vegNonVegValue = tags[i].list[0].value;

          if (vegNonVegValue === "yes") {
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
          <CloseIcon sx={{ cursor: "pointer" }} onClick={() => setOpenDrawer(false)} />
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
          />
        </div>
      </Grid>
      <div className={classes.editBtns}>
        <Button fullWidth variant="outlined" sx={{ marginRight: 1.4 }}>
          View Details
        </Button>
        <Button fullWidth variant="contained">
          Save
        </Button>
      </div>
    </Grid>
  );
};

export default EditCustomizations;
