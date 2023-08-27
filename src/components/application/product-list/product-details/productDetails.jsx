import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  Divider,
  Grid,
  MenuItem,
  Select,
} from "@mui/material";
import useStyles from "./style";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import MuiLink from "@mui/material/Link";
import { Link } from "react-router-dom";
import DoneIcon from "@mui/icons-material/Done";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";

const moreImages = [
  "https://assets.shopkund.com/media/catalog/product/cache/3/image/9df78eab33525d08d6e5fb8d27136e95/a/c/acu7601-1-embroidered-lace-silk-green-saree-with-blouse-sr23275_1_.jpg",
  "https://assets.ajio.com/medias/sys_master/root/20230605/vTcw/647de83042f9e729d7234ec6/-473Wx593H-466235200-green-MODEL.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlGfIuMOFK-0A6pMAadMCNyAeMhRl5wNWuJHTyg2_ReQza1zkHfXD7nh9lWfd1zUkLCfA&usqp=CAU",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoeUWZOLfBQQO5ycC7RP7tJkzh01Lw2J9Ybr-Wf0BR1E4CI8d_e9IvbIxapZx7E3plWhk&usqp=CAU",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQw6S87D3OGBBOFEUmza4Dv5DSWWuTAVUTM-XMDIq_V9yj8mfty-ZGWnrh1s2KCoOE8LdQ&usqp=CAU",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTIpkpNh1LVgjHDjZiqtOVATD11btJgAAqi7zXYvgBQKTZarKlmqX2kczHQ9qmYIERy7s&usqp=CAU",
];

const availabeSizes = [
  {
    size: "S",
  },
  {
    size: "M",
  },
  {
    size: "XL",
  },
  {
    size: "XS",
  },
];

const productDetails = {
  "style code": "Bell & Ross Nightlum",
  pattern: "Embroidered",
  "pack of": 1,
  ocassion: "Party & Festive, Wedding",
  "Decorative Material": "zari",
  "fabric care": "Dry Clean for the first wash, thereafter Hand Wash",
  "Construction Type": "Woven",
  "other details":
    "Make a distinct style statement wearing this Cotton silk woven Saree from the Villagius. Designed to perfection, this saree will soon become your favorite . The stylishly designed saree Solid prints makes it a true value for money. Made from Cotton Silk this saree measures 5.5 m and comes with a 0.80 m blouse piece.",
};

const customizationGroups = [
  {
    id: "CG1",
    name: "Crust(Select any 1)",
    inputType: "select",
    minQuantity: 1,
    maxQuantity: 1,
    seq: 1,
  },
  {
    id: "CG2",
    name: "Size(Select any 1)",
    inputType: "select",
    minQuantity: 0,
    maxQuantity: 1,
    seq: 2,
  },
  {
    id: "CG3",
    name: "Size(Select any 1)",
    inputType: "select",
    minQuantity: 0,
    maxQuantity: 1,
    seq: 2,
  },
  {
    id: "CG4",
    name: "Toppings(Select any 1)",
    inputType: "select",
    minQuantity: 1,
    maxQuantity: 2,
    seq: 3,
  },
  {
    id: "CG5",
    name: "Toppings(Select any 1)",
    inputType: "select",
    minQuantity: 0,
    maxQuantity: 2,
    seq: 3,
  },
];

const customizations = [
  {
    id: "C1",
    name: "Hand tossed",
    price: 299,
    inStock: true,
    parent: "CG1",
    child: "CG2",
  },
  {
    id: "C2",
    name: "Thin crust",
    price: 349,
    inStock: true,
    parent: "CG1",
    child: "CG3",
  },
  {
    id: "C3",
    name: "Regular",
    price: 50,
    inStock: true,
    parent: "CG2",
    child: "CG4",
  },
  {
    id: "C4",
    name: "Large",
    price: 100,
    inStock: true,
    parent: "CG2",
    isDefault: true,
  },
  {
    id: "C5",
    name: "Small",
    price: 30,
    inStock: true,
    parent: "CG3",
  },
  {
    id: "C6",
    name: "Large",
    price: 120,
    inStock: true,
    parent: "CG3",
  },
  {
    id: "C10",
    name: "Extra Large",
    price: 120,
    inStock: true,
    parent: "CG3",
    child: "CG5",
    isDefault: true,
  },
  {
    id: "C7",
    name: "Olives",
    price: 120,
    inStock: true,
    parent: "CG4",
  },
  {
    id: "C8",
    name: "Paneer",
    price: 120,
    inStock: true,
    parent: "CG4",
    isDefault: true,
  },
  {
    id: "C9",
    name: "Onion",
    price: 120,
    inStock: true,
    parent: "CG4",
  },
  {
    id: "C11",
    name: "Onion",
    price: 120,
    inStock: true,
    parent: "CG5",
  },
  {
    id: "C12",
    name: "Cheese",
    price: 220,
    inStock: true,
    parent: "CG5",
    isDefault: true,
  },
];

const ProductDetails = () => {
  const classes = useStyles();
  const [activeImage, setActiveImage] = useState(moreImages[0]);
  const [activeSize, setActiveSize] = useState(availabeSizes[0].size);
  const [highestSeq, setHighestSeq] = useState(0);
  const [customization_state, setCustomizationState] = useState({
    1: { options: [], selected: [] },
  });

  const handleImageClick = (imageUrl) => {
    setActiveImage(imageUrl);
  };

  const handleOptionSelect = (selectedOption, level) => {
    const newState = { ...customization_state };

    // Check if the parent's customization group has minQuantity === 0
    const parentGroup = customizationGroups.find((group) => group.id === selectedOption.parent);
    const parentAllowsUnselecting = parentGroup && parentGroup.minQuantity === 0;

    if (parentGroup.seq === highestSeq) {
      if (
        newState[level].selected.length < parentGroup.maxQuantity &&
        !newState[level].selected.includes(selectedOption)
      ) {
        newState[level].id = parentGroup.id;
        newState[level].seq = parentGroup.seq;
        newState[level].selected = [...newState[level].selected, selectedOption];
      } else {
        newState[level].selected = newState[level].selected.filter((item) => item.id !== selectedOption.id);
        setCustomizationState(newState);
        return;
      }
    }

    // If the option is already selected and unselecting is allowed, deselect it
    else if (
      (parentAllowsUnselecting && newState[level].selected.includes(selectedOption)) ||
      !newState[level].selected.includes(selectedOption)
    ) {
      if (newState[level].selected.includes(selectedOption)) {
        newState[level].selected = [];
        for (let i = level + 1; i <= Object.keys(newState).length; i++) {
          delete newState[i];
        }
        setCustomizationState(newState);
        return;
      } else {
        newState[level].id = parentGroup.id;
        newState[level].seq = parentGroup.seq;
        newState[level].selected = [selectedOption];
      }
    }

    // Reset subsequent groups' selections
    for (let i = level + 1; i <= Object.keys(newState).length; i++) {
      delete newState[i];
    }

    let currentSelectedOption = selectedOption; // Store the current selectedOption
    while (currentSelectedOption.child) {
      const nextGroup = customizationGroups.find((group) => group.id === currentSelectedOption.child);
      if (nextGroup) {
        // Render options for non-mandatory group, but don't select any option
        if (nextGroup.minQuantity === 0) {
          newState[level + 1] = {
            id: nextGroup.id,
            seq: nextGroup.seq,
            name: nextGroup.name,
            options: customizations.filter((c) => c.parent === nextGroup.id),
            selected: [],
          };

          for (let i = level + 2; i <= Object.keys(newState).length; i++) {
            delete newState[i];
          }

          setCustomizationState(newState); // Set state after rendering options
          return; // Exit loop after rendering options
        }

        const nextGroupOptions = customizations.filter((customization) => customization.parent === nextGroup.id);
        const nextSelectedOption = nextGroupOptions.find((opt) => opt.isDefault && opt.inStock) || nextGroupOptions[0];

        if (nextSelectedOption) {
          level++;
          newState[level] = {
            id: nextGroup.id,
            name: nextGroup.name,
            options: nextGroupOptions,
            selected: [nextSelectedOption],
          };

          // Reset selections for subsequent groups under the new selection
          for (let i = level + 1; i <= Object.keys(newState).length; i++) {
            delete newState[i];
          }

          currentSelectedOption = nextSelectedOption; // Update the current selectedOption
        } else {
          break;
        }
      } else {
        break;
      }
    }

    setCustomizationState(newState);
  };

  useEffect(() => {
    const initializeCustomizationState = () => {
      let currentGroup = "CG1";
      let level = 1;
      const newState = { ...customization_state };

      while (currentGroup) {
        const group = customizationGroups.find((group) => group.id === currentGroup);
        if (group) {
          newState[level] = {
            id: group.id,
            seq: group.seq,
            name: group.name,
            options: [],
            selected: [],
          };
          newState[level].options = customizations.filter((customization) => customization.parent === currentGroup);

          // Skip selecting an option for non-mandatory groups (minQuantity === 0)
          if (group.minQuantity === 1) {
            const selectedCustomization = newState[level].options.find((opt) => opt.isDefault && opt.inStock);

            // If no default option, select the first available option
            if (!selectedCustomization) {
              newState[level].selected = [newState[level].options.find((opt) => opt.inStock)];
            } else {
              newState[level].selected = [selectedCustomization];
            }
          }

          currentGroup = newState[level].selected[0]?.child || null;
          level++;

          // If a non-mandatory group is encountered, break the loop
          if (group.minQuantity === 0) {
            break;
          }
        } else {
          currentGroup = null;
        }
      }

      setCustomizationState(newState);
    };

    setHighestSeq(Math.max(...customizationGroups.map((group) => group.seq)));
    initializeCustomizationState();
  }, []);

  const renderCustomizations = () => {
    return Object.keys(customization_state).map((level) => {
      const cg = customization_state[level];

      // console.log(cg.selected.includes(c));
      return (
        <>
          <>
            <Typography variant="body" color="black" sx={{ margin: "12px 0" }}>
              {cg.name}
            </Typography>
            <Grid container>
              {cg.options.map((c) => (
                <>
                  <div
                    className={cg.selected.includes(c) ? classes.selectedCustomization : classes.customization}
                    onClick={() => handleOptionSelect(c, parseInt(level))}
                  >
                    {cg.seq == highestSeq && cg.selected.includes(c) && (
                      <CloseIcon fontSize="small" className={classes.cross} />
                    )}
                    <Typography variant="body1" color={cg.selected.includes(c) ? "white" : "#686868"}>
                      {c.name}
                    </Typography>
                    <Typography variant="body1" color={cg.selected.includes(c) ? "white" : "#222"}>
                      ₹{c.price}
                    </Typography>
                  </div>
                </>
              ))}
            </Grid>
          </>
        </>
      );
    });
  };

  return (
    <>
      <div className={classes.breadCrumbs} onClick={() => {}}>
        <Breadcrumbs aria-label="breadcrumb">
          <MuiLink component={Link} underline="hover" color="inherit" to="/">
            Home
          </MuiLink>
          <MuiLink component={Link} underline="hover" color="inherit" to={""}>
            abc
          </MuiLink>
          <Typography color="text.primary">def</Typography>
        </Breadcrumbs>
      </div>

      <Grid container className={classes.detailsContainer}>
        <Grid item xs={7}>
          <div className={classes.imgContainer}>
            <img className={classes.productImg} src={activeImage} />
          </div>
          <div className={classes.moreImagesContainer}>
            {moreImages.map((item, idx) => {
              return (
                <div
                  style={{ borderColor: item === activeImage ? "#008ECC" : "lightgrey" }}
                  className={classes.moreImages}
                  onClick={() => handleImageClick(item)}
                >
                  <div className={classes.greyContainer}>
                    <img className={classes.moreImage} src={item} />
                  </div>
                </div>
              );
            })}
          </div>
        </Grid>
        <Grid item xs={5}>
          <Card className={classes.productCard}>
            {true ? (
              <Typography variant="body" color="#419E6A" sx={{ marginBottom: 1 }}>
                <DoneIcon color="success" fontSize="small" /> In stock
              </Typography>
            ) : (
              <Grid container alignItems="center">
                <CloseIcon color="error" fontSize="small" />
                <Typography variant="body" color="#D83232">
                  Out of Stock
                </Typography>
              </Grid>
            )}
            <Typography variant="h4" color="black" sx={{ marginBottom: 1 }}>
              Embroidered Handloom Cotton Silk Saree (Black)
            </Typography>
            <Typography variant="h4" color="black" sx={{ marginBottom: 1 }}>
              ₹ 2000
            </Typography>
            <Divider sx={{ color: "#E0E0E0", marginBottom: 1.5 }} />
            <Grid container alignItems="center" sx={{ marginBottom: 2 }}>
              <Typography variant="body" color="#1D1D1D">
                Select size
              </Typography>
              <Typography variant="body" color="secondary" sx={{ marginLeft: 2.5, cursor: "pointer" }}>
                Size Guide <ArrowForwardIcon color="secondary" />
              </Typography>
            </Grid>
            <Grid container sx={{ marginBottom: 2.5 }}>
              {availabeSizes.map((item) => (
                <div
                  className={item.size === activeSize ? classes.activeSizeContainer : classes.sizeContainer}
                  onClick={() => {
                    console.log(item);
                    setActiveSize(item.size);
                  }}
                >
                  <Typography
                    variant="body1"
                    color={item.size === activeSize ? "#ffffff" : "#3C4242"}
                    sx={{ fontWeight: 700 }}
                  >
                    {item.size}
                  </Typography>
                </div>
              ))}
            </Grid>
            <Grid sx={{ marginBottom: 2.5 }}>
              <Typography color="#1d1d1d" variant="body1">
                Not getting your style? Create your custom design now
              </Typography>
              <Button variant="outlined" sx={{ marginTop: 1, textTransform: "none" }}>
                <Typography color="#419E6A">
                  Customize Now &nbsp;
                  <ArrowForwardIcon fontSize="small" />
                </Typography>
              </Button>
            </Grid>
            <Typography variant="body1" color="#1D1D1D" sx={{ marginBottom: 2.5 }}>
              Colours Available
            </Typography>
            <div className={classes.moreImagesContainer} style={{ marginBottom: 16 }}>
              {moreImages.map((item, idx) => {
                return (
                  <Grid container justifyContent="center">
                    <div
                      style={{ borderColor: item === activeImage ? "#008ECC" : "lightgrey" }}
                      className={classes.availableColors}
                      onClick={() => handleImageClick(item)}
                    >
                      <div className={classes.greyContainer}>
                        <img className={classes.availableColorImg} src={item} />
                      </div>
                    </div>
                    <Typography variant="body" color="black" sx={{ fontWeight: 600, marginRight: "14px" }}>
                      ₹ 3999
                    </Typography>
                  </Grid>
                );
              })}
            </div>

            {!true && (
              <Grid container justifyContent="center" className={classes.outOfStock}>
                <Typography variant="body" color="#D83232">
                  Item is out of Stock
                </Typography>
              </Grid>
            )}

            {renderCustomizations()}

            <Grid container alignItems="center" sx={{ marginTop: 2.5 }}>
              <Button variant="contained" sx={{ flex: 1, marginRight: "16px", textTransform: "none" }}>
                Add to cart
              </Button>
              <Button variant="outlined" sx={{ flex: 1, textTransform: "none" }}>
                Order now
              </Button>
            </Grid>
          </Card>
        </Grid>
      </Grid>
      <Grid container className={classes.productDetailsSection}>
        <Grid item xs={7} className={classes.productDetailsLeft}>
          <Accordion elevation={0} square defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ borderBottom: "1px solid #0000001F", padding: 0 }}>
              <Typography variant="h4" color="black">
                Product Details
              </Typography>
              <Divider />
            </AccordionSummary>
            <AccordionDetails sx={{ padding: "20px 0" }}>
              {Object.keys(productDetails).map((key) => (
                <Grid container className={classes.keyValueContainer}>
                  <Grid xs={3}>
                    <Typography variant="body1" color="#787A80" sx={{ fontWeight: 600 }} className={classes.key}>
                      {key}
                    </Typography>
                  </Grid>
                  <Grid xs={8}>
                    <Typography variant="body" color="#1D1D1D" sx={{ fontWeight: 600 }} className={classes.value}>
                      {productDetails[key]}
                    </Typography>
                  </Grid>
                </Grid>
              ))}
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </>
  );
};

export default ProductDetails;
