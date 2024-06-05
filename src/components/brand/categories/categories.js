import React, { useContext, useEffect, useState } from "react";
import useStyles from "./style";
import { useHistory, useLocation, useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import IconButton from "@mui/material/IconButton";
import { ReactComponent as PreviousIcon } from "../../../assets/images/previous.svg";
import { ReactComponent as NextIcon } from "../../../assets/images/next.svg";
import { getBrandCustomMenuRequest } from "../../../api/brand.api";
import useCancellablePromise from "../../../api/cancelRequest";
import no_image_found from "../../../assets/images/no_image_found.png";
import { SearchContext } from "../../../context/searchContext";

const SingleCategory = ({ data, index }) => {
  const classes = useStyles();
  const history = useHistory();
  const locationData = useLocation();
  const useQuery = () => {
    const { search } = locationData;
    return React.useMemo(() => new URLSearchParams(search), [search]);
  };
  let query = useQuery();
  const brandId = query.get("brandId");
  const customMenuId = query.get("cm");
  const { id, descriptor } = data;
  const { name, images } = descriptor;
  const updateSearchParams = (cmId) => {
    const params = new URLSearchParams({ ["brandId"]: brandId, ["cm"]: cmId });
    history.replace({ pathname: locationData.pathname, search: params.toString() });
  };

  return (
    <div className={classes.categoryItem} onClick={() => updateSearchParams(id)}>
      <div className={`${classes.categoryItemImageContainer} ${customMenuId === id ? classes.selectedCategory : ""}`}>
        <img
          className={classes.categoryImage}
          src={images && images.length > 0 && images[0] ? images[0] : no_image_found}
          alt={`sub-category-img-${index}`}
        />
      </div>
      <Typography variant="body1" className={classes.categoryNameTypo}>
        {name}
      </Typography>
    </div>
  );
};

const CategoriesComponent = ({ brandDetails, brandId }) => {
  const classes = useStyles();
  //  const {brandId} = useParams();
  const history = useHistory();
  const locationData = useLocation();
  const { locationData: deliveryAddressLocation } = useContext(SearchContext);

  const useQuery = () => {
    const { search } = locationData;
    return React.useMemo(() => new URLSearchParams(search), [search]);
  };
  let query = useQuery();
  const customMenuId = query.get("cm");
  const [subCatList, setSubCatList] = useState([]);
  const [page, setPage] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  // HOOKS
  const { cancellablePromise } = useCancellablePromise();

  const getCustomMenu = async (domain) => {
    setIsLoading(true);
    try {
      const data = await cancellablePromise(getBrandCustomMenuRequest(domain, brandId));
      setSubCatList(data.data);
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (brandDetails) {
      getCustomMenu(brandDetails.domain);
    }
  }, [brandDetails, deliveryAddressLocation]);

  useEffect(() => {
    if (customMenuId && subCatList.length > 0) {
      const findsubCatIndex = subCatList.findIndex((item) => item.id === customMenuId);
      setPage(findsubCatIndex);
    }
  }, [customMenuId, subCatList, locationData]);

  if (subCatList && subCatList.length > 0) {
    return (
      <Grid container spacing={3} className={classes.categoriesRootContainer}>
        <Grid item xs={12} sm={12} md={1.5} lg={1.5} xl={1.5}></Grid>
        <Grid item xs={12} sm={12} md={9} lg={9} xl={9}>
          <Pagination
            count={subCatList.length}
            page={page}
            className={classes.categoriesContainer}
            onChange={(event, page) => {
              const subCat = subCatList[page];
              const params = new URLSearchParams({});
              if (customMenuId) {
                params.set("cm", subCat.id);
                history.replace({ pathname: locationData.pathname, search: params.toString() });
              } else {
                params.set("cm", subCat.id);
                history.push({ pathname: locationData.pathname, search: params.toString() });
              }
            }}
            boundaryCount={2}
            renderItem={(item) => {
              if (item.type === "page") {
                const subCatIndex = item.page - 1;
                const subCat = subCatList[subCatIndex];
                return <SingleCategory data={subCat} index={subCatIndex} />;
              } else if (item.type === "next") {
                return (
                  <IconButton
                    color="inherit"
                    className={classes.actionButton}
                    onClick={() => {
                      const subCat = subCatList[item.page];
                      const params = new URLSearchParams({});
                      if (customMenuId) {
                        params.set("cm", subCat.id);
                        history.replace({ pathname: locationData.pathname, search: params.toString() });
                      } else {
                        params.set("cm", subCat.id);
                        history.push({ pathname: locationData.pathname, search: params.toString() });
                      }
                    }}
                    disabled={subCatList.length === item.page}
                  >
                    <NextIcon />
                  </IconButton>
                );
              } else if (item.type === "previous") {
                return (
                  <IconButton
                    color="inherit"
                    className={classes.actionButton}
                    onClick={() => {
                      const subCat = subCatList[item.page];
                      const params = new URLSearchParams({});
                      if (customMenuId) {
                        params.set("cm", subCat.id);
                        history.replace({ pathname: locationData.pathname, search: params.toString() });
                      } else {
                        params.set("cm", subCat.id);
                        history.push({ pathname: locationData.pathname, search: params.toString() });
                      }
                    }}
                    disabled={item.page < 0}
                  >
                    <PreviousIcon />
                  </IconButton>
                );
              } else {
                return <PaginationItem {...item} />;
              }
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={1.5} lg={1.5} xl={1.5}></Grid>
      </Grid>
    );
  } else {
    return <></>;
  }
};

export default CategoriesComponent;
