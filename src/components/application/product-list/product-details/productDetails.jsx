import React, { useContext, useEffect, useState } from "react";
import useStyles from "./style";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import MuiLink from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import VariationsRenderer from "./VariationsRenderer";
import { getCall, postCall } from "../../../../api/axios";
import CustomizationRenderer from "./CustomizationRenderer";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getValueFromCookie } from "../../../../utils/cookies";
import { Link, useHistory, useParams } from "react-router-dom";
import useCancellablePromise from "../../../../api/cancelRequest";
import { Accordion, AccordionDetails, AccordionSummary, Button, Card, Divider, Grid } from "@mui/material";
import Loading from "../../../shared/loading/loading";
import { CartContext } from "../../../../context/cartContext";
import moment from "moment";
import { SearchContext } from "../../../../context/searchContext";

const ProductDetails = () => {
  const classes = useStyles();
  const history = useHistory();
  const params = useParams();
  const { fetchCartItems } = useContext(CartContext);
  const { locationData: deliveryAddressLocation } = useContext(SearchContext);
  const { cancellablePromise } = useCancellablePromise();

  const [productPayload, setProductPayload] = useState(null);
  const [productDetails, setProductDetails] = useState({});

  const [customization_state, setCustomizationState] = useState({});
  const [variationState, setVariationState] = useState([]);

  const [activeImage, setActiveImage] = useState("");
  const [activeSize, setActiveSize] = useState("");

  const [customizationPrices, setCustomizationPrices] = useState(0);

  const handleImageClick = (imageUrl) => {
    setActiveImage(imageUrl);
  };

  const getProductDetails = async (productId) => {
    try {
      const data = await cancellablePromise(getCall(`/clientApis/v2/items/${productId}`));
      const { item_details } = data.response;

      setProductPayload(data.response);
      setProductDetails(item_details);
      setActiveImage(item_details?.descriptor?.images[0]);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const calculateSubtotal = (groupId, customization_state) => {
    let group = customization_state[groupId];
    if (!group) return;

    let prices = group.selected.map((s) => s.price);
    setCustomizationPrices((prevState) => {
      return prevState + prices.reduce((a, b) => a + b, 0);
    });

    group?.childs?.map((child) => {
      calculateSubtotal(child, customization_state);
    });
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

    if (!customisation_items.length) return null;
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

  function findMinMaxSeq(customizationGroups) {
    if (!customizationGroups || customizationGroups.length === 0) {
      return { minSeq: undefined, maxSeq: undefined };
    }

    let minSeq = Infinity;
    let maxSeq = -Infinity;

    customizationGroups.forEach((group) => {
      const seq = group.seq;
      if (seq < minSeq) {
        minSeq = seq;
      }
      if (seq > maxSeq) {
        maxSeq = seq;
      }
    });

    return { minSeq, maxSeq };
  }

  const addToCart = async (navigate = false) => {
    const user = JSON.parse(getValueFromCookie("user"));
    const url = `/clientApis/v2/cart/${user.id}`;
    let subtotal = productPayload?.item_details?.price?.value;

    const customisations = getCustomizations();
    if (customisations) {
      calculateSubtotal(customization_state["firstGroup"].id, customization_state);
      subtotal += customizationPrices;
    }

    const payload = {
      id: productPayload.id,
      local_id: productPayload.local_id,
      bpp_id: productPayload.bpp_details.bpp_id,
      bpp_uri: productPayload.context.bpp_uri,
      domain: productPayload.context.domain,
      tags: productPayload.item_details.tags,
      customisationState: customization_state,
      quantity: {
        count: 1,
      },
      provider: {
        id: productPayload.bpp_details.bpp_id,
        locations: productPayload.locations,
        ...productPayload.provider_details,
      },
      product: {
        id: productPayload.id,
        subtotal,
        ...productPayload.item_details,
      },
      customisations,
      hasCustomisations: customisations ? true : false,
    };

    console.log(payload);
    const res = await postCall(url, payload);
    fetchCartItems();
    if (navigate) {
      history.push("/application/cart");
    }
  };

  // fetch product details
  useEffect(() => {
    let productId = params.id;
    getProductDetails(productId);
  }, [params, deliveryAddressLocation]);

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
        } else if (category == "non_veg") {
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
        <Grid container alignItems="center" sx={{ marginBottom: 1.5 }}>
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

  const renderStockStatus = () => {
    if (parseInt(productDetails?.quantity?.available?.count) >= 1) {
      return (
        <Typography variant="body" color="#419E6A" sx={{ marginBottom: 1 }}>
          <DoneIcon color="success" fontSize="small" /> In stock
        </Typography>
      );
    } else {
      return (
        <Grid container alignItems="center" sx={{ marginBottom: 1 }}>
          <CloseIcon color="error" fontSize="small" />
          <Typography variant="body1" color="#D83232">
            Out of Stock
          </Typography>
        </Grid>
      );
    }
  };

  const renderAttributeDetails = () => {
    return Object.keys(productPayload?.attributes).map((key) => (
      <Grid container className={classes.keyValueContainer}>
        <Grid xs={3}>
          <Typography variant="body1" color="#787A80" sx={{ fontWeight: 600 }} className={classes.key}>
            {key}
          </Typography>
        </Grid>
        <Grid xs={8}>
          <Typography variant="body" color="#1D1D1D" sx={{ fontWeight: 600 }} className={classes.value}>
            {productPayload?.attributes[key]}
          </Typography>
        </Grid>
      </Grid>
    ));
  };

  const renderItemDetails = () => {
    let returnWindowValue = 0;
    if (productPayload.item_details?.["@ondc/org/return_window"]) {
      // Create a duration object from the ISO 8601 string
      const duration = moment.duration(productPayload.item_details?.["@ondc/org/return_window"]);

      // Get the number of hours from the duration object
      const hours = duration.humanize();
      returnWindowValue = `${hours}`;
    }

    const data = {
      "Available on COD":
        productPayload.item_details?.["@ondc/org/available_on_cod"].toString() === "true" ? "Yes" : "No",
      Cancellable: productPayload.item_details?.["@ondc/org/cancellable"].toString() === "true" ? "Yes" : "No",
      "Return window value": returnWindowValue,
      Returnable: productPayload.item_details?.["@ondc/org/returnable"].toString() === "true" ? "Yes" : "No",
      "Customer care": productPayload.item_details?.["@ondc/org/contact_details_consumer_care"],
      "Manufacturer name":
        productPayload.item_details?.["@ondc/org/statutory_reqs_packaged_commodities"]?.["manufacturer_or_packer_name"],
      "Manufacturer address":
        productPayload.item_details?.["@ondc/org/statutory_reqs_packaged_commodities"]?.[
          "manufacturer_or_packer_address"
        ],
    };
    return Object.keys(data).map((key) => (
      <Grid container className={classes.keyValueContainer}>
        <Grid xs={3}>
          <Typography variant="body1" color="#787A80" sx={{ fontWeight: 600 }} className={classes.key}>
            {key}
          </Typography>
        </Grid>
        <Grid xs={8}>
          <Typography variant="body" color="#1D1D1D" sx={{ fontWeight: 600 }} className={classes.value}>
            {data[key]}
          </Typography>
        </Grid>
      </Grid>
    ));
  };

  return (
    <>
      {productPayload == null ? (
        <div className={classes.emptySpace}>
          <Loading />
        </div>
      ) : (
        <div>
          <div className={classes.breadCrumbs} onClick={() => {}}>
            <Breadcrumbs aria-label="breadcrumb">
              <MuiLink component={Link} underline="hover" color="inherit" to="/application/products">
                Home
              </MuiLink>
              {/* <MuiLink component={Link} underline="hover" color="inherit" to={""}>
            {productPayload?.item_details?.category_id}
          </MuiLink> */}
              <Typography color="text.primary">{productDetails?.descriptor?.name}</Typography>
            </Breadcrumbs>
          </div>

          <Grid container className={classes.detailsContainer}>
            <Grid item xs={7}>
              <div className={classes.imgContainer}>
                <img className={classes.productImg} src={activeImage} />
              </div>
              <div className={classes.moreImagesContainer}>
                {productDetails?.descriptor?.images.map((item, idx) => {
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
                {renderVegNonVegTag()}
                {renderStockStatus()}
                <Typography variant="h4" color="black" sx={{ marginBottom: 1, fontFamily: "inter", fontWeight: 600 }}>
                  {productDetails?.descriptor?.name}
                </Typography>
                <Typography variant="h4" color="black" sx={{ marginBottom: 1, fontFamily: "inter", fontWeight: 700 }}>
                  ₹ {productDetails?.price?.value}
                </Typography>
                <Divider sx={{ color: "#E0E0E0", marginBottom: 1.5 }} />
                <VariationsRenderer
                  productPayload={productPayload}
                  variationState={variationState}
                  setVariationState={setVariationState}
                  chartImage={productPayload?.attributes?.size_chart || ""}
                  isFashion={productPayload?.context?.domain === "ONDC:RET12"}
                />
                <>
                  {/* <Grid container alignItems="center" sx={{ marginBottom: 2 }}>
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
            </div> */}
                </>

                {!parseInt(productDetails?.quantity?.available?.count) >= 1 && (
                  <Grid container justifyContent="center" className={classes.outOfStock}>
                    <Typography variant="body" color="#D83232">
                      Item is out of Stock
                    </Typography>
                  </Grid>
                )}

                <CustomizationRenderer
                  productPayload={productPayload}
                  customization_state={customization_state}
                  setCustomizationState={setCustomizationState}
                />

                <Grid container alignItems="center" sx={{ marginTop: 2.5 }}>
                  <Button
                    variant="contained"
                    sx={{ flex: 1, marginRight: "16px", textTransform: "none" }}
                    onClick={() => addToCart(false)}
                    disabled={!parseInt(productDetails?.quantity?.available?.count) >= 1}
                  >
                    Add to cart
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{ flex: 1, textTransform: "none" }}
                    disabled={!parseInt(productDetails?.quantity?.available?.count) >= 1}
                    onClick={() => addToCart(true)}
                  >
                    Order now
                  </Button>
                </Grid>
              </Card>
            </Grid>
          </Grid>
          <Grid container className={classes.productDetailsSection}>
            <Grid item xs={7} className={classes.productDetailsLeft}>
              <Accordion elevation={0} square defaultExpanded>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ borderBottom: "1px solid #0000001F", padding: 0 }}
                >
                  <Typography variant="h4" color="black" sx={{ fontFamily: "inter", fontWeight: 600 }}>
                    Product Details
                  </Typography>
                  <Divider />
                </AccordionSummary>
                <AccordionDetails sx={{ padding: "20px 0" }}>
                  {renderAttributeDetails()}
                  {renderItemDetails()}
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
        </div>
      )}
    </>
  );
};

export default ProductDetails;
