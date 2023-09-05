import React, { useEffect, useRef, useState } from "react";
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
import { Link, useLocation, useHistory, useParams } from "react-router-dom";
import useCancellablePromise from "../../../../api/cancelRequest";
import { Accordion, AccordionDetails, AccordionSummary, Button, Card, Divider, Grid } from "@mui/material";

const additionalProductDetails = {
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

const ProductDetails = () => {
  const top = useRef(null);
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const params = useParams();
  const { cancellablePromise } = useCancellablePromise();

  const [productPayload, setProductPayload] = useState(null);
  const [productDetails, setProductDetails] = useState({});

  const [customization_state, setCustomizationState] = useState({
    1: { options: [], selected: [] },
  });
  const [variationState, setVariationState] = useState([]);

  const [activeImage, setActiveImage] = useState("");
  const [activeSize, setActiveSize] = useState("");

  const handleImageClick = (imageUrl) => {
    setActiveImage(imageUrl);
  };

  const getProductDetails = async (productId) => {
    const data = await cancellablePromise(getCall(`/clientApis/v2/items/${productId}`));
    const { item_details } = data.response;

    setProductPayload(data.response);
    setProductDetails(item_details);
    setActiveImage(item_details?.descriptor?.images[0]);
  };

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

  const addToCart = async () => {
    const user = JSON.parse(getValueFromCookie("user"));
    const url = `/clientApis/v2/cart/${user.id}`;

    const subtotal = productDetails.price.value + calculateSubtotal();
    const payload = {
      id: productPayload.id,
      bpp_id: productPayload.bpp_details.bpp_id,
      bpp_uri: productPayload.context.bpp_uri,
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
    };

    //  console.log(payload);

    const res = await postCall(url, payload);
    history.push("/application/cart");
  };

  //   fetch product details
  useEffect(() => {
    //  let pathname = location.pathname;
    //  let parts = pathname.split("/");
    let productId = params.id;
    getProductDetails(productId);
    top.current?.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
  }, [params]);

  const renderVegNonVegTag = () => {
    const category = "veg";

    const getTagColor = () => {
      if (category === "veg") {
        return "#008001";
      } else if (category == "nonVeg") {
        return "red";
      } else {
        return "red";
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

    const FnB = "ONDC:RET11";
    const grocery = "ONDC:RET10";

    if (productPayload?.context?.domain == grocery || productPayload?.context?.domain == FnB) return null;

    return (
      <Grid container alignItems="center" sx={{ marginBottom: 1.5 }}>
        <div className={classes.square} style={{ borderColor: getTagColor() }}>
          <div className={classes.circle} style={{ backgroundColor: getTagColor() }}></div>
        </div>
        <Typography variant="body" color={getTextColor()} sx={{ fontWeight: "600" }}>
          Veg
        </Typography>
      </Grid>
    );
  };

  const renderStockStatus = () => {
    if (parseInt(productDetails?.quantity?.available?.count) > 1) {
      return (
        <Typography variant="body" color="#419E6A" sx={{ marginBottom: 1 }}>
          <DoneIcon color="success" fontSize="small" /> In stock
        </Typography>
      );
    } else {
      return (
        <Grid container alignItems="center">
          <CloseIcon color="error" fontSize="small" />
          <Typography variant="body" color="#D83232">
            Out of Stock
          </Typography>
        </Grid>
      );
    }
  };

  return (
    <div ref={top}>
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
            />
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

            {!true && (
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
                onClick={addToCart}
              >
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
              <Typography variant="h4" color="black" sx={{ fontFamily: "inter", fontWeight: 600 }}>
                Product Details
              </Typography>
              <Divider />
            </AccordionSummary>
            <AccordionDetails sx={{ padding: "20px 0" }}>
              {Object.keys(additionalProductDetails).map((key) => (
                <Grid container className={classes.keyValueContainer}>
                  <Grid xs={3}>
                    <Typography variant="body1" color="#787A80" sx={{ fontWeight: 600 }} className={classes.key}>
                      {key}
                    </Typography>
                  </Grid>
                  <Grid xs={8}>
                    <Typography variant="body" color="#1D1D1D" sx={{ fontWeight: 600 }} className={classes.value}>
                      {additionalProductDetails[key]}
                    </Typography>
                  </Grid>
                </Grid>
              ))}
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </div>
  );
};

export default ProductDetails;
