import React, { useState } from "react";
import useStyles from "./style";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useHistory, useLocation } from "react-router-dom";
import Fashion1 from "../../assets/images/category/Fashion1.png";
import Fashion2 from "../../assets/images/category/Fashion2.png";

import Electronics1 from "../../assets/images/category/Electronics1.png";
import Electronics2 from "../../assets/images/category/Electronics2.png";
import Electronics3 from "../../assets/images/category/Electronics3.png";
import Electronics4 from "../../assets/images/category/Electronics4.png";

import Grocery from "../../assets/images/category/Grocery.png";

import Food from "../../assets/images/category/Food.png";

import Health1 from "../../assets/images/category/Health1.png";
import Health2 from "../../assets/images/category/Health2.png";

import Home1 from "../../assets/images/category/Home1.png";
import Home2 from "../../assets/images/category/Home2.png";

import BPC from "../../assets/images/category/BPC.png";

import Agriculture from "../../assets/images/category/Agriculture.png";

import Auto1 from "../../assets/images/category/Auto1.png";
import Auto2 from "../../assets/images/category/Auto2.png";

import TopBrands from "./topBrands/topBrands";

const Home = () => {
  const history = useHistory();
  const classes = useStyles();
  const locationData = useLocation();
  const useQuery = () => {
    const { search } = locationData;
    return React.useMemo(() => new URLSearchParams(search), [search]);
  };
  let query = useQuery();
  const [isViewAllCategories, setIsViewAllCategories] = useState(false);

  const updateQueryParams = (catName) => {
    const params = new URLSearchParams({});
    params.set("c", catName);
    if (locationData.search === "" && query.get("c") === null) {
      history.push({
        pathname: locationData.pathname,
        search: params.toString(),
      });
    } else {
    }
  };

  return (
    <Box className={classes.homeContainer}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Card
                className={classes.fashionCategory}
                onClick={() => updateQueryParams(`Fashion`)}
              >
                <div className={classes.fashionImages}>
                  <img src={Fashion1} alt="Fashio 1" />
                  <img
                    className={classes.fashionImage2}
                    src={Fashion2}
                    alt="Fashio 2"
                  />
                </div>
                <Typography variant={"h5"} className={classes.categoryTypo}>
                  Fashion
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Card
                className={classes.electronicsCategory}
                onClick={() => updateQueryParams(`Electronics`)}
              >
                <Grid container spacing={0}>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={8}
                    lg={8}
                    xl={8}
                    className={classes.electronicsImages}
                  >
                    <img
                      className={classes.electronicsImage}
                      src={Electronics1}
                      alt="Electronics 1"
                    />
                    <img
                      className={`${classes.electronicsImage} ${classes.tvImage}`}
                      src={Electronics2}
                      alt="Electronics 2"
                    />
                    <img
                      className={`${classes.electronicsImage} ${classes.mobileImage}`}
                      src={Electronics3}
                      alt="Electronics 3"
                    />
                    <img
                      className={`${classes.electronicsImage} ${classes.tabImage}`}
                      src={Electronics4}
                      alt="Electronics 4"
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={4}
                    lg={4}
                    xl={4}
                    className={classes.typoContainer}
                  >
                    <Typography
                      variant={"h5"}
                      className={`${classes.categoryTypo} ${classes.electronicsTypo}`}
                    >
                      Electronics
                    </Typography>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Card
                className={classes.groceryCategory}
                onClick={() => updateQueryParams(`Grocery`)}
              >
                <Grid container spacing={0}>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={8}
                    lg={8}
                    xl={8}
                    className={classes.groceryImages}
                  >
                    <img
                      className={classes.groceryImage}
                      src={Grocery}
                      alt="Grocery 1"
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={4}
                    lg={4}
                    xl={4}
                    className={classes.typoContainer}
                  >
                    <Typography
                      variant={"h5"}
                      className={`${classes.categoryTypo} ${classes.groceryTypo}`}
                    >
                      Grocery
                    </Typography>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Card
                className={classes.foodCategory}
                onClick={() => updateQueryParams(`F&B`)}
              >
                <div className={classes.foodImages}>
                  <img src={Food} alt="Food 1" />
                </div>
                <Typography variant={"h5"} className={classes.categoryTypo}>
                  Food & <br />
                  Beverage
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Card
                className={classes.homeCategory}
                onClick={() => updateQueryParams(`Home & Kitchen`)}
              >
                <div className={classes.homeImages}>
                  <img
                    src={Home1}
                    alt="Home 1"
                    className={classes.homeImage1}
                  />
                  <img
                    className={classes.homeImage2}
                    src={Home2}
                    alt="Home 2"
                  />
                </div>
                <Typography variant={"h5"} className={classes.categoryTypo}>
                  Home & Kitchen
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Card
                className={classes.bpcCategory}
                onClick={() => updateQueryParams(`BPC`)}
              >
                <Grid container spacing={0}>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={6}
                    lg={6}
                    xl={6}
                    className={classes.bpcImages}
                  >
                    <img className={classes.bpcImage} src={BPC} alt="BPC 1" />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={6}
                    lg={6}
                    xl={6}
                    className={classes.typoContainer}
                  >
                    <Typography
                      variant={"h5"}
                      className={`${classes.categoryTypo} ${classes.bpcTypo} ${classes.textAlignLeft}`}
                    >
                      Beauty & <br />
                      Personal Care
                    </Typography>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Card
                className={classes.healthCategory}
                onClick={() => updateQueryParams(`Health & Wellness`)}
              >
                <div className={classes.healthImages}>
                  <img src={Health1} alt="Health 1" />
                  <img
                    className={classes.healthImage2}
                    src={Health2}
                    alt="Health 2"
                  />
                </div>
                <Typography
                  variant={"h5"}
                  className={`${classes.categoryTypo} ${classes.healthTypo}`}
                >
                  Health & Wellness
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Grid container spacing={3}>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  style={{ height: "100%" }}
                >
                  <Card
                    className={classes.agricultureCategory}
                    onClick={() => updateQueryParams(`Appliances`)}
                  >
                    <div className={classes.agricultureImages}>
                      <img
                        className={classes.agricultureImage}
                        src={Agriculture}
                        alt="Appliances 1"
                      />
                    </div>
                    <Typography
                      variant={"h5"}
                      className={classes.agricultureCategoryTypo}
                    >
                      Appliances
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {isViewAllCategories && (
          <>
            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Card
                    className={classes.foodCategory}
                    onClick={() => updateQueryParams(`Auto1`)}
                  >
                    <div className={classes.foodImages}>
                      <img src={Auto1} alt="Auto-1" />
                    </div>
                    <Typography variant={"h5"} className={classes.categoryTypo}>
                      Auto - 1
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Card
                    className={classes.agricultureCategory}
                    onClick={() => updateQueryParams(`Auto2`)}
                  >
                    <div className={classes.agricultureImages}>
                      <img
                        className={classes.agricultureImage}
                        src={Auto2}
                        alt="Auto-2"
                      />
                    </div>
                    <Typography
                      variant={"h5"}
                      className={classes.agricultureCategoryTypo}
                    >
                      Auto - 2
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Card
                    className={classes.agricultureCategory}
                    onClick={() => updateQueryParams(`Agriculture`)}
                  >
                    <div className={classes.agricultureImages}>
                      <img
                        className={classes.agricultureImage}
                        src={Agriculture}
                        alt="Agriculture 1"
                      />
                    </div>
                    <Typography
                      variant={"h5"}
                      className={classes.agricultureCategoryTypo}
                    >
                      Agriculture
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </>
        )}
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          className={classes.viewAllLessButtonContainer}
        >
          <Button
            variant="outlined"
            onClick={() => {
              setIsViewAllCategories(!isViewAllCategories);
            }}
          >
            {isViewAllCategories ? "View Less" : "View All"}
          </Button>
        </Grid>
      </Grid>

      <TopBrands />
    </Box>
  );
};

export default Home;
