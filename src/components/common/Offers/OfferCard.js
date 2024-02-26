import React from "react";
import useStyles from "./styles";
import { Button } from "@mui/material";

const OfferCard = (props) => {
  const classes = useStyles();
  const { title, offerText, link, brandImage } = props;

  return (
    <div className={classes.offerCard}>
      <div className={classes.left}>
        <p className={classes.offerTitle}>{title}</p>
        <p className={classes.offerText}>{offerText}</p>
        <Button size="small" variant="contained">
          Order now
        </Button>
      </div>
      <div className={classes.right}>
        <img className={classes.brandImage} src={brandImage} alt="brand-image" />
      </div>
    </div>
  );
};

export default OfferCard;
