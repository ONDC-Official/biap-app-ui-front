import React, { useState } from "react";
import { Grid } from "@mui/material";
import useStyles from "./style";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import MuiLink from "@mui/material/Link";
import { Link } from "react-router-dom";

const moreImages = [
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR69qJNmanHDgPydPaWabIDeSLgK0HfC1d8XyVX41SL9ZnKmBFzt2BH_LjGfJhCziHfWbU&usqp=CAU",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9IjH0aznHBG2PCq3QdvS8k2NjJ3bIz6QuFTXSc9sJXhHENZ6ciBFpg1bIbrRhrS709Lw&usqp=CAU",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlGfIuMOFK-0A6pMAadMCNyAeMhRl5wNWuJHTyg2_ReQza1zkHfXD7nh9lWfd1zUkLCfA&usqp=CAU",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoeUWZOLfBQQO5ycC7RP7tJkzh01Lw2J9Ybr-Wf0BR1E4CI8d_e9IvbIxapZx7E3plWhk&usqp=CAU",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQw6S87D3OGBBOFEUmza4Dv5DSWWuTAVUTM-XMDIq_V9yj8mfty-ZGWnrh1s2KCoOE8LdQ&usqp=CAU",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTIpkpNh1LVgjHDjZiqtOVATD11btJgAAqi7zXYvgBQKTZarKlmqX2kczHQ9qmYIERy7s&usqp=CAU",
];

const ProductDetails = () => {
  const classes = useStyles();
  const [activeImage, setActiveImage] = useState(moreImages[0]);

  const handleImageClick = (imageUrl) => {
    setActiveImage(imageUrl);
  };

  return (
    <div>
      <div className={classes.breadCrumbs} onClick={() => {}}>
        <Breadcrumbs aria-label="breadcrumb">
          <MuiLink component={Link} underline="hover" color="darkgrey" to="/">
            Home
          </MuiLink>
          <MuiLink component={Link} underline="hover" color="darkgrey" to={""}>
            abc
          </MuiLink>
          <Typography color="grey">def</Typography>
        </Breadcrumbs>
      </div>

      <Grid container className={classes.detailsContainer}>
        <Grid item xs={8}>
          <div className={classes.imgContainer}>
            <img className={classes.productImg} src={activeImage} />
          </div>
          <div className={classes.moreImagesContainer}>
            {moreImages.map((item, idx) => {
              return (
                <div className={classes.moreImages} onClick={() => handleImageClick(item)}>
                  <img className={classes.moreImage} src={item} />
                </div>
              );
            })}
          </div>
        </Grid>
        <Grid item xs={4}>
          CARD
        </Grid>
      </Grid>
      <Grid></Grid>
    </div>
  );
};

export default ProductDetails;
