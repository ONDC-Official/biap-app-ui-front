import React, { useContext, useEffect, useState } from "react";
import useStyles from "./style";

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";

import { useHistory } from "react-router-dom";
import { getAllBrandsRequest } from "../../../api/brand.api";
import { getAllOffersRequest } from "../../../api/offer.api";
import useCancellablePromise from "../../../api/cancelRequest";
import no_image_found from "../../../assets/images/no_image_found.png";
import { ToastContext } from "../../../context/toastContext";
import { toast_actions, toast_types } from "../../shared/toast/utils/toast";

import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import IconButton from "@mui/material/IconButton";
import { ReactComponent as PreviousIcon } from "../../../assets/images/previous.svg";
import { ReactComponent as NextIcon } from "../../../assets/images/next.svg";

import Loading from "../../shared/loading/loading";
import Offers from "../../common/Offers/Offers";

import { AddCookie, getValueFromCookie } from "../../../utils/cookies";

const BrandCard = ({ data, index, onMouseOver }) => {
  const classes = useStyles();
  const history = useHistory();
  const { id, descriptor } = data;
  const { name: brand_name, symbol } = descriptor;

  return (
    <>
      <Tooltip title={brand_name}>
        <Card
          className={classes.brandCard}
          onMouseOver={onMouseOver}
          onClick={() => history.push(`/application/brand?brandId=${id}`)}
        >
          <img
            className={classes.brandImage}
            src={symbol ? symbol : no_image_found}
            alt={`brand-${index}`}
          />
        </Card>
      </Tooltip>
    </>
  );
};

const TopBrands = () => {
  const classes = useStyles();
  const [activeBrandIndex, setActiveBrandIndex] = useState(1);
  const [brands, setBrands] = useState([]);
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const dispatch = useContext(ToastContext);

  function handleResize() {
    const width = window.innerWidth;
    setScreenWidth(width);
  }
  useEffect(() => {
    window.addEventListener("resize", handleResize);
  }, []);

  // HOOKS
  const { cancellablePromise } = useCancellablePromise();

  const getAllBrands = async (searchName) => {
    setIsLoading(true);
    try {
      const data = await cancellablePromise(getAllBrandsRequest());
      setBrands(data.data);
    } catch (err) {
      dispatch({
        type: toast_actions.ADD_TOAST,
        payload: {
          id: Math.floor(Math.random() * 100),
          type: toast_types.error,
          message: err?.response?.data?.error?.message,
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getAllOffers = async () => {
    setIsLoading(true);
    try {
      // const lat = "12.992906760898983";
      // const lng = "77.76323574850733";
      const latLongInfo = JSON.parse(getValueFromCookie("LatLongInfo"));
      console.log("LAT", latLongInfo);
      const lat = latLongInfo.lat;
      const lng = latLongInfo.lng;
      const data = await cancellablePromise(getAllOffersRequest("", lat, lng));
      setOffers(data);
    } catch (err) {
      dispatch({
        type: toast_actions.ADD_TOAST,
        payload: {
          id: Math.floor(Math.random() * 100),
          type: toast_types.error,
          message: err?.response?.data?.error?.message,
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllBrands();
    getAllOffers();
  }, []);

  const rowsPerPage = parseInt(screenWidth / 120) - 7;
  const totalPageCount = Math.ceil(brands.length / rowsPerPage);
  return (
    <>
      {offers && offers.length > 0 && <Offers offersList={offers} />}
      <Grid container spacing={3} className={classes.topBrandsContainer}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Typography variant="h4">All Providers</Typography>
        </Grid>
        {isLoading ? (
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            className={classes.brandsContainer}
          >
            <Loading />
          </Grid>
        ) : (
          <>
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              className={classes.brandsContainer}
            >
              <div
                style={{
                  marginLeft: "auto",
                  marginTop: "auto",
                  marginBottom: "auto",
                }}
              >
                <IconButton
                  color="inherit"
                  className={classes.actionButton}
                  onClick={() => {
                    setPage(page - 1);
                    // setActiveSubCatIndex(activeSubCatIndex-1)
                  }}
                  disabled={page === 0}
                >
                  <PreviousIcon />
                </IconButton>
              </div>
              {brands
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((brand, brandIndex) => (
                  <BrandCard
                    key={`btand-index-${brandIndex}`}
                    data={brand}
                    index={brandIndex}
                    // isActive={brandIndex === activeBrandIndex}
                    onMouseOver={() => {
                      setActiveBrandIndex(brandIndex);
                    }}
                  />
                ))}
              <div
                style={{
                  marginRight: "auto",
                  marginTop: "auto",
                  marginBottom: "auto",
                }}
              >
                <IconButton
                  color="inherit"
                  className={classes.actionButton}
                  onClick={() => {
                    setPage(page + 1);
                    // setActiveSubCatIndex(activeSubCatIndex+1)
                  }}
                  disabled={page === totalPageCount - 1}
                >
                  <NextIcon />
                </IconButton>
              </div>
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
};
export default TopBrands;
