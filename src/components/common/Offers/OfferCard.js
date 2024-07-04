import React from "react";
import useStyles from "./styles";
import { useHistory } from "react-router-dom";
import { Button } from "@mui/material";
import { ReactComponent as OfferIcon } from "../../../assets/images/offer.svg";
import ThemePalette from "../../../utils/Theme/theme.json";

const OfferCard = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const {
    id,
    title,
    offerText,
    link,
    brandImage,
    isDisplayOnStorePage,
    isDisplayOnCartPage,
  } = props;

  if (isDisplayOnCartPage) {
    return (
      <div className={`${classes.checkoutOfferCardContainer} `}>
        <div className={classes.checkoutOfferIconContainer}>
          <OfferIcon width="30" height="30" fill={ThemePalette.primaryColor} />
        </div>
        <div className={classes.checkoutOfferTextContainer}>
          <p className={classes.checkoutOfferTitle}>{title}</p>
          <div className={classes.checkoutOfferCode}>Use code {offerText}</div>
        </div>
      </div>
    );
  }

  if (isDisplayOnStorePage) {
    return (
      <div className={classes.offerCardContainer}>
        <div className={classes.offerIconContainer}>
          <OfferIcon width="50" height="50" fill={ThemePalette.primaryColor} />
        </div>
        <div className={classes.offerTextContainer}>
          <p className={classes.offerCode}>{offerText}</p>
        </div>
      </div>
    );
  } else {
    return (
      <div className={classes.offerCard}>
        <div className={classes.left}>
          {!isDisplayOnStorePage && (
            <p className={classes.offerTitle}>{title}</p>
          )}
          <p className={classes.offerText}>{offerText}</p>
          {!isDisplayOnStorePage && (
            <Button
              size="small"
              variant="contained"
              onClick={() =>
                id ? history.push(`/application/brand?brandId=${id}`) : ""
              }
            >
              Order now
            </Button>
          )}
        </div>
        {!isDisplayOnStorePage && (
          <div className={classes.right}>
            <img
              className={classes.brandImage}
              src={brandImage}
              alt="brand-image"
            />
          </div>
        )}
      </div>
    );
  }
};

export default OfferCard;
