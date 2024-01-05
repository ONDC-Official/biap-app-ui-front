import React from "react";
import useStyles from "./style";
import { useHistory, useLocation, useParams } from "react-router-dom";

import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import no_image_found from "../../../assets/images/no_image_found.png";

const SingleBrand = ({ data, onMouseOver }) => {
  const { id, provider, domain, provider_descriptor } = data;
  const { name: brand_name, images } = provider_descriptor;

  const classes = useStyles();
  const history = useHistory();

  const redirectBasedOnDomain = () => {
    if (domain === "ONDC:RET11") {
      history.push(`/application/brand?brandId=${provider}&outletId=${id}`);
    } else {
      history.push(`/application/brand?brandId=${provider}`);
    }
  };

  return (
    <div className={classes.brandItemContainer} onMouseOver={onMouseOver} onClick={() => redirectBasedOnDomain()}>
      <Card className={classes.brandCard}>
        <img
          className={classes.brandImage}
          src={images?.length > 0 ? images[0] : no_image_found}
          alt={`sub-cat-img-${data.value}`}
        />
      </Card>
      <Typography component="div" variant="body" className={classes.brandNameTypo}>
        {brand_name || ""}
      </Typography>
    </div>
  );
};

export default SingleBrand;
