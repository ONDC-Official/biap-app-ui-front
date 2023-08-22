import React, { useState } from "react";
import { Button, Card, Divider, Grid } from "@mui/material";
import useStyles from "./style";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import MuiLink from "@mui/material/Link";
import { Link } from "react-router-dom";
import DoneIcon from "@mui/icons-material/Done";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const moreImages = [
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR69qJNmanHDgPydPaWabIDeSLgK0HfC1d8XyVX41SL9ZnKmBFzt2BH_LjGfJhCziHfWbU&usqp=CAU",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9IjH0aznHBG2PCq3QdvS8k2NjJ3bIz6QuFTXSc9sJXhHENZ6ciBFpg1bIbrRhrS709Lw&usqp=CAU",
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

const ProductDetails = () => {
  const classes = useStyles();
  const [activeImage, setActiveImage] = useState(moreImages[0]);
  const [activeSize, setActiveSize] = useState(availabeSizes[0].size);

  const handleImageClick = (imageUrl) => {
    setActiveImage(imageUrl);
  };

  return (
    <div>
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
      <Grid>Product Details</Grid>
    </div>
  );
};

export default ProductDetails;
