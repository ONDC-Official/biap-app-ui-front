import React from "react";
import useStyles from "./styles";
import { Button } from "@mui/material";
import { ReactComponent as OfferIcon } from "../../../assets/images/offer.svg";
import ThemePalette from "../../../utils/Theme/theme.json";

const OfferCard = (props) => {
  const classes = useStyles();
  const { title, offerText, link, brandImage, isDisplayOnStorePage } = props;

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
    )
  } else {
    return (
      <div className={classes.offerCard}>
        <div className={classes.left}>
          {
            !isDisplayOnStorePage && (
              <p className={classes.offerTitle}>{title}</p>
            )
          }
          <p className={classes.offerText}>{offerText}</p>
          {
            !isDisplayOnStorePage && (
              <Button size="small" variant="contained">
                Order now
              </Button>
            )
          }
        </div>
        {
          !isDisplayOnStorePage && (
            <div className={classes.right}>
              <img className={classes.brandImage} src={brandImage} alt="brand-image" />
            </div>
          )
        }
      </div>
    );
  }
};

export default OfferCard;
