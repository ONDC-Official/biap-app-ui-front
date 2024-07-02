import React, { useContext, useEffect, useRef, useState } from "react";
import useStyles from "./style";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import { getAllOutletsFromCategoryAndLocationRequest } from "../../../api/brand.api";
import useCancellablePromise from "../../../api/cancelRequest";

import { ToastContext } from "../../../context/toastContext";
import { toast_actions, toast_types } from "../../shared/toast/utils/toast";
import { useLocation } from "react-router-dom";
import { categoryList } from "../../../constants/categories";
import SingleBrand from "./singleBrand";
import { AddressContext } from "../../../context/addressContext";
import { getValueFromCookie } from "../../../utils/cookies";

import Loading from "../../shared/loading/loading";
import { SearchContext } from "../../../context/searchContext";
import Button from "../../shared/button/button";
import { Box, IconButton } from "@mui/material";
import { ReactComponent as PreviousIcon } from "../../../assets/images/previous.svg";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Brands = ({}) => {
  const observerTarget = useRef(null);

  const classes = useStyles();
  const { locationData: deliveryAddressLocation } = useContext(SearchContext);
  const [category, setCategory] = useState("");
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [afterKey, setAfterKey] = useState("");
  const [allRecordsFetched, setAllRecordsFetched] = useState(false);

  const dispatch = useContext(ToastContext);

  // HOOKS
  const { cancellablePromise } = useCancellablePromise();

  const locationData = useLocation();
  const useQuery = () => {
    const { search } = locationData;
    return React.useMemo(() => new URLSearchParams(search), [search]);
  };
  let query = useQuery();

  const resetStates = () => {
    setBrands([]);
    setAfterKey("");
    setAllRecordsFetched(false);
  };

  useEffect(() => {
    const categoryName = query.get("c");
    resetStates();
    if (categoryName) {
      getAllBrands(categoryName);
    }
  }, [locationData, deliveryAddressLocation]);

  const getAllBrands = async (categoryName) => {
    let sc = JSON.parse(getValueFromCookie("search_context") || {});
    let after_key = afterKey;
    let all_records_fetched = allRecordsFetched;
    if (categoryName !== category) {
      resetStates();
      setCategory(categoryName);
      after_key = "";
      all_records_fetched = false;
    }

    const findCategory = categoryList.find(
      (item) => item.routeName === categoryName
    );
    if (findCategory && !all_records_fetched) {
      try {
        let reqParams = {
          domain: findCategory.domain,
          lat: sc.location.lat,
          lng: sc.location.lng,
          afterKey: after_key,
        };
        const data = await cancellablePromise(
          getAllOutletsFromCategoryAndLocationRequest(reqParams)
        );
        if (data.data.length > 0) {
          setAfterKey(data.afterKey.location_id);
          setBrands((oldBrands) => {
            // Initially this fn gets called twice, to avoid duplicate data,
            // add data only if existing brands are empty
            if (afterKey ? true : oldBrands.length === 0) {
              return [...oldBrands, ...data.data];
            }
            return oldBrands;
          });
        } else {
          setAllRecordsFetched(true);
        }
      } catch (err) {
        dispatch({
          type: toast_actions.ADD_TOAST,
          payload: {
            id: Math.floor(Math.random() * 100),
            type: toast_types.error,
            message: err?.response?.data?.error?.message,
          },
        });
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getAllBrands(query.get("c"));
  }, [isLoading]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsLoading(true);
        }
      },
      { threshold: 1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [observerTarget]);

  return (
    <Grid container spacing={3} className={classes.brandContainer}>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <Typography variant="h4">Stores near you</Typography>
      </Grid>
      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        lg={12}
        xl={12}
        ml={"8%"}
        direction="column"
      >
        <Grid container spacing={3} direction={"row"}>
          <>
            {brands.length > 0 ? (
              <>
                {brands.map((item, ind) => (
                  <Grid
                    direction={"row"}
                    key={`sub-cat-item-${ind}`}
                    item
                    xs={10}
                    sm={10}
                    md={2.2}
                    lg={2.2}
                    xl={2.2}
                  >
                    <SingleBrand data={item} />
                  </Grid>
                ))}
              </>
            ) : (
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography variant="body1">
                  No store available near you
                </Typography>
              </Grid>
            )}
          </>
        </Grid>
        <Grid
          container
          spacing={3}
          justifyContent="center"
          alignItems="center"
          mt={2}
        >
          {isLoading && <Loading />}
          <div ref={observerTarget}></div>
        </Grid>
      </Grid>
    </Grid>
  );
};
export default Brands;
