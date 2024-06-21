import React, { useContext, useEffect, useState } from "react";
import useStyles from "./style";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import MuiLink from "@mui/material/Link";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import moment from "moment";
import { Link, useHistory, useParams } from "react-router-dom";
import no_image_found from "../../../assets/images/no_image_found.png";

import CustomMenu from "./customMenu/customMenu";
import PlacePickerMap from "../../common/PlacePickerMap/PlacePickerMap";
import ViewOnlyMap from "../../common/ViewOnlyMap/ViewOnlyMap";

import { getBrandDetailsRequest, getOutletDetailsRequest } from "../../../api/brand.api";
import useCancellablePromise from "../../../api/cancelRequest";
import { SearchContext } from "../../../context/searchContext";
import ModalComponent from "../../common/Modal";

const OutletDetails = (props) => {
  const { brandId, outletId } = props;
  const classes = useStyles();
  const history = useHistory();
  const { locationData: deliveryAddressLocation } = useContext(SearchContext);

  const [brandDetails, setBrandDetails] = useState(null);
  const [outletDetails, setOutletDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [callNowModal, setCallNowModal] = useState(false);

  const [isStoreDelivering, setIsStoreDelivering] = useState(true);

  // HOOKS
  const { cancellablePromise } = useCancellablePromise();

  const getBrandDetails = async () => {
    setIsLoading(true);
    try {
      const data = await cancellablePromise(getBrandDetailsRequest(brandId));
      setBrandDetails(data);
      if (outletId) {
        await getOutletDetails();
      }
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  const getOutletDetails = async () => {
    setIsLoading(true);
    try {
      let data = await cancellablePromise(getOutletDetailsRequest(outletId));
      data.timings = ``;
      data.isOpen = false;
      data.circle.gps = data.circle.gps.split(",");
      data.circle.gps = {
        lat: data.circle.gps[0],
        lng: data.circle.gps[1],
      };
      if (data.time.range.start && data.time.range.end) {
        data.timings = `${moment(data.time.range.start, "hhmm").format("h:mm a")} - ${moment(
          data.time.range.end,
          "hhmm"
        ).format("h:mm a")}`;
        const time = moment(new Date(), "hh:mm");
        const startTime = moment(data.time.range.start, "hh:mm");
        const endTime = moment(data.time.range.end, "hh:mm");
        data.isOpen = time.isBetween(startTime, endTime);
      } else {
      }
      setOutletDetails(data);
      if (data.time.label === "enable") {
        setIsStoreDelivering(true);
      } else {
        setIsStoreDelivering(false);
      }
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (brandId) {
      getBrandDetails();
    }
  }, [brandId, outletId, deliveryAddressLocation]);

  return (
    <Grid container spacing={4} className={classes.outletDetailsContainer}>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <div role="presentation">
          <Breadcrumbs aria-label="breadcrumb">
            <MuiLink component={Link} underline="hover" color="inherit" to="/application/products">
              Home
            </MuiLink>
            <MuiLink component={Link} underline="hover" color="inherit" to={`/application/brand?brandId=${brandId}`}>
              {brandDetails?.descriptor?.name}
            </MuiLink>
            {brandId && <Typography color="text.primary">{`${brandDetails?.descriptor?.name} Details`}</Typography>}
          </Breadcrumbs>
        </div>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className={classes.outletDetailsHeaderContainer}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
            <Card className={classes.outletDetailsCard}>
              <img
                className={classes.outletImage}
                src={brandDetails?.descriptor?.symbol ? brandDetails?.descriptor?.symbol : no_image_found}
                alt={`outlet-img-${outletDetails?.id}`}
              />
            </Card>
            <div className={classes.detailsContainer}>
              <Typography variant="h2">{brandDetails?.descriptor?.name}</Typography>
              <Typography component="div" variant="body" className={classes.descriptionTypo}>
                {outletDetails?.description}
              </Typography>
              <Typography color="error.dark" component="div" variant="body" className={classes.outletNameTypo}>
                {`${
                  outletDetails?.address
                    ? `${outletDetails?.address?.street || "-"}, ${outletDetails?.address?.city || "-"}`
                    : "-"
                }`}
              </Typography>
              <Typography component="div" variant="body" className={classes.outletOpeningTimeTypo}>
                {outletDetails?.isOpen && <span className={classes.isOpen}>Open now</span>}
                {outletDetails?.isOpen ? ` - ` : ""} {outletDetails?.timings}
              </Typography>
              <div className={classes.actionButtonContainer}>
                <Button className={classes.actionButton} variant="outlined" color="error">
                  Get Direction
                </Button>
                <Button
                  className={classes.actionButton}
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    setCallNowModal(true);
                  }}
                >
                  Call Now
                </Button>
              </div>

              {!isStoreDelivering && (
                <Grid container justifyContent="start" style={{ marginTop: 30, marginBottom: 10 }}>
                  <Typography variant="body" color="#D83232" style={{ fontSize: 20 }}>
                    {brandDetails?.descriptor?.name} is not delivering at the moment
                  </Typography>
                </Grid>
              )}
            </div>
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
            <Card className={classes.outletContactInfoCard}>
              {/* <Typography variant="h4">Call</Typography>
              <Typography component="div" variant="body" className={classes.contactNumbers}>
                +91 92729282982, +91 92729282982
              </Typography> */}
              <Typography variant="h4" className={classes.directionTypo}>
                Direction
              </Typography>
              <div style={{ height: "275px" }} className={classes.mapImage}>
                {/*<img*/}
                {/*    className={classes.mapImage}*/}
                {/*    src={map}*/}
                {/*    alt={`map-img-${outletDetails?.id}`}*/}
                {/*/>*/}
                {outletDetails?.circle?.gps && (
                  <ViewOnlyMap
                    location={
                      outletDetails?.circle?.gps
                        ? [parseFloat(outletDetails?.circle?.gps?.lat), parseFloat(outletDetails?.circle?.gps?.lng)]
                        : null
                    }
                  />
                )}
              </div>
              <Typography color="error.dark" component="div" variant="body" className={classes.outletNameTypo}>
                {`${
                  outletDetails?.address
                    ? `${outletDetails?.address?.street || "-"}, ${outletDetails?.address?.city || "-"}`
                    : "-"
                }`}
              </Typography>
              {/* <Typography
                                color="primary.main" component="div" variant="body"
                                className={classes.seeAllOutletTypo}
                                onClick={() => {
                                    history.push(`/application/brand/${brandId}`)
                                }}
                            >
                                {`See all 78 ${brandDetails?.descriptor?.name} outlets in ${outletDetails?.address?.city} >`}
                            </Typography> */}
            </Card>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
            <Box component={"div"} className={classes.divider} />
            <CustomMenu
              brandId={brandId}
              brandDetails={brandDetails}
              outletDetails={outletDetails}
              isStoreDelivering={isStoreDelivering}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4} xl={4}></Grid>
        </Grid>
      </Grid>
      <ModalComponent
        open={callNowModal}
        onClose={() => {
          setCallNowModal(false);
        }}
        title="Call Now"
      >
        <Typography component="div" variant="body" className={classes.contactNumbers}>
          +91 92729282982, +91 92729282982
        </Typography>
      </ModalComponent>
    </Grid>
  );
};

export default OutletDetails;
