import React, { useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Button, Card, Divider, Grid } from "@mui/material";
import useStyles from "./style";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import MuiLink from "@mui/material/Link";
import { Link } from "react-router-dom";
import DoneIcon from "@mui/icons-material/Done";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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

const ProductDetails = () => {
  const classes = useStyles();
  const [activeImage, setActiveImage] = useState(moreImages[0]);
  const [activeSize, setActiveSize] = useState(availabeSizes[0].size);

  const handleImageClick = (imageUrl) => {
    setActiveImage(imageUrl);
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
                <div className={classes.moreImages} onClick={() => handleImageClick(item)}>
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
            <Typography variant="body" color="#419E6A" sx={{ marginBottom: 1 }}>
              <DoneIcon color="success" /> In stock
            </Typography>
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
                  onClick={() => setActiveSize(item.size)}
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
            <Typography variant="body1" color="#1D1D1D" sx={{ marginBottom: 2.5 }}>
              Colours Available
            </Typography>
            <div className={classes.moreImagesContainer} style={{ marginBottom: 16 }}>
              {moreImages.map((item, idx) => {
                return (
                  <Grid container justifyContent="center">
                    <div className={classes.availableColors} onClick={() => handleImageClick(item)}>
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

            <Grid container alignItems="center">
              <Button>Add to cart</Button>
              <Button>Order now</Button>
            </Grid>
          </Card>
        </Grid>
      </Grid>
      <Grid container className={classes.productDetailsSection}>
        <Grid item xs={7} className={classes.productDetailsLeft}>
          <Accordion elevation={0} square>
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
