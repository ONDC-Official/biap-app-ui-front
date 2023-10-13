import React, { useEffect, useState } from "react";
import useStyles from "./style";

import Categories from "./categories/categories";
import Products from "./products/products";
import Outlets from "./outlets/outlets";

import { getBrandDetailsRequest } from "../../api/brand.api";
import useCancellablePromise from "../../api/cancelRequest";
import { useParams } from "react-router-dom";

import Loading from "../shared/loading/loading";
const Brand = ({ brandId }) => {
  const classes = useStyles();

  const [brandDetails, setBrandDetails] = useState(null);
  const [brandIsFromFAndBCategory, setBrandIsFromFAndBCategory] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // HOOKS
  const { cancellablePromise } = useCancellablePromise();

  const getBrandDetails = async () => {
    setIsLoading(true);
    try {
      const data = await cancellablePromise(getBrandDetailsRequest(brandId));
      if (data.domain === "ONDC:RET11") {
        setBrandIsFromFAndBCategory(true);
      } else {
        setBrandIsFromFAndBCategory(false);
      }
      setBrandDetails(data);
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (brandId) {
      getBrandDetails();
    }
  }, [brandId]);

  if (isLoading || brandDetails === null) {
    return (
      <div className={classes.loader}>
        <Loading />
      </div>
    );
  } else {
    if (brandIsFromFAndBCategory) {
      return <Outlets brandId={brandId} brandDetails={brandDetails} />;
    } else {
      return (
        <>
          <Categories brandId={brandId} brandDetails={brandDetails} />
          <Products brandId={brandId} brandDetails={brandDetails} />
        </>
      );
    }
  }
};

export default Brand;
