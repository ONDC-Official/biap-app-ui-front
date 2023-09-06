import React, { useState, useEffect } from "react";
import useStyles from "./style";
import { Link, useLocation } from "react-router-dom";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import MuiLink from "@mui/material/Link";
import Button from "@mui/material/Button";
import Pagination from "@mui/material/Pagination";
import CircularProgress from "@mui/material/CircularProgress";

import ProductGridView from "./productGridView";
import ProductListView from "./productListView";
import MultiSelctFilter from "../../common/Filters/MultiSelctFilter";

import { ReactComponent as ListViewIcon } from "../../../assets/images/listView.svg";
import { ReactComponent as GridViewIcon } from "../../../assets/images/gridView.svg";

import useCancellablePromise from "../../../api/cancelRequest";
import { getAllProductRequest, getAllFiltersRequest, getAllFilterValuesRequest } from "../../../api/product.api";

const ProductList = () => {
  const classes = useStyles();
  const locationData = useLocation();

  const [viewType, setViewType] = useState("grid");
  const [products, setProducts] = useState([]);
  const [totalProductCount, setTotalProductCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 1,
    pageSize: 10,
    searchData: [],
  });

  // HOOKS
  const { cancellablePromise } = useCancellablePromise();

  const useQuery = () => {
    const { search } = locationData;
    return React.useMemo(() => new URLSearchParams(search), [search]);
  };
  let query = useQuery();
  const categoryName = query.get("c");
  const subCategoryName = query.get("sc");
  const searchProductName = query.get("s");

  useEffect(() => {
    if (locationData) {
      const searchName = query.get("s");
      console.log("history.location.search again=====>", searchName);
      getAllProducts(searchName);
    }
  }, [locationData]);
  const getAllProducts = async (searchName) => {
    setIsLoading(true);
    try {
      const paginationData = Object.assign({}, JSON.parse(JSON.stringify(paginationModel)));
      paginationData.searchData.productName = searchName || "";
      paginationData.searchData.subCategoryName = subCategoryName || "";
      const data = await cancellablePromise(getAllProductRequest(paginationData));
      console.log("getAllProducts=====>", data);
      setProducts(data.data);
      setTotalProductCount(data.count);
    } catch (err) {
      // dispatch({
      //     type: toast_actions.ADD_TOAST,
      //     payload: {
      //         id: Math.floor(Math.random() * 100),
      //         type: toast_types.error,
      //         message: err?.message,
      //     },
      // });
    } finally {
      setIsLoading(false);
    }
  };

  const getFilterValues = async (attributeCode) => {
    try {
      const data = await cancellablePromise(getAllFilterValuesRequest(attributeCode, subCategoryName));
      console.log("getFilterValues=====>", data);
      let filterValues = data.data;
      filterValues = filterValues.map((value) => {
        const createObj = {
          id: value,
          name: value,
        };
        return createObj;
      });
      return filterValues;
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  const getAllFilters = async () => {
    setIsLoading(true);
    try {
      const data = await cancellablePromise(getAllFiltersRequest(subCategoryName));
      console.log("getAllFilters=====>", data);
      let filtersData = data.data;
      filtersData = Object.values(filtersData.reduce((acc, obj) => ({ ...acc, [obj.code]: obj }), {}));

      for (let filter of filtersData) {
        const values = await getFilterValues(filter.code);
        const findIndex = filtersData.findIndex((item) => item.code === filter.code);
        if (findIndex > -1) {
          filtersData[findIndex].options = values;
          filtersData[findIndex].selectedValues = [];
        }
      }
      let paginationData = Object.assign(JSON.parse(JSON.stringify(paginationModel)));
      paginationData.searchData = filtersData;
      setPaginationModel(paginationData);
    } catch (err) {
      // dispatch({
      //     type: toast_actions.ADD_TOAST,
      //     payload: {
      //         id: Math.floor(Math.random() * 100),
      //         type: toast_types.error,
      //         message: err?.message,
      //     },
      // });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (subCategoryName) {
      getAllProducts();
      getAllFilters();
    }
  }, [subCategoryName]);

  const handleChangeFilter = (filterIndex, value) => {
    const data = Object.assign({}, JSON.parse(JSON.stringify(paginationModel)));
    data.searchData[filterIndex].selectedValues = value;
    data.page = 0;
    data.pageSize = 10;
    setPaginationModel(data);
  };

  return (
    <Grid container spacing={3} className={classes.productContainer}>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <div role="presentation">
          <Breadcrumbs aria-label="breadcrumb">
            <MuiLink component={Link} underline="hover" color="inherit" to="/application/products">
              Home
            </MuiLink>
            {categoryName && (
              <MuiLink
                // component={Link}
                underline="hover"
                color="inherit"
                // to={`/category/${categoryName}`}
                href={`/application/products?${searchProductName ? `s=${searchProductName}&` : ""}${
                  categoryName ? `c=${categoryName}` : ""
                }`}
              >
                {categoryName}
              </MuiLink>
            )}
            {(subCategoryName || searchProductName) && (
              <Typography color="text.primary">{subCategoryName || searchProductName}</Typography>
            )}
          </Breadcrumbs>
        </div>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className={classes.catNameTypoContainer}>
        <Typography variant="h4" className={classes.catNameTypo} color={"success"}>
          {subCategoryName}
        </Typography>
        {products.length > 0 && (
          <>
            <Button
              className={classes.viewTypeButton}
              variant={viewType === "grid" ? "contained" : "outlined"}
              color={viewType === "grid" ? "primary" : "inherit"}
              onClick={() => setViewType("grid")}
            >
              <GridViewIcon />
            </Button>
            <Button
              className={classes.viewTypeButton}
              variant={viewType === "list" ? "contained" : "outlined"}
              color={viewType === "list" ? "primary" : "inherit"}
              onClick={() => setViewType("list")}
            >
              <ListViewIcon />
            </Button>
          </>
        )}
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        {paginationModel.searchData &&
          paginationModel.searchData.length > 0 &&
          paginationModel.searchData.map((filter, filterIndex) => {
            return (
              <MultiSelctFilter
                key={`filter-${filter.code}-${filterIndex}`}
                arrayList={filter?.options || []}
                filterName={filter.code}
                title={filter.code}
                filterOn="id"
                saveButtonText="Apply"
                value={filter?.selectedValues || []}
                onChangeFilter={(value) => handleChangeFilter(filterIndex, value)}
                clearButtonText="Clear"
                disabled={false}
              />
            );
          })}
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <Grid container spacing={4}>
          {isLoading ? (
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <CircularProgress />
            </Grid>
          ) : (
            <>
              {products.length > 0 ? (
                <>
                  {products.map((productItem, ind) => {
                    if (viewType === "list") {
                      return (
                        <Grid
                          key={`product-item-${ind}`}
                          item
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          xl={12}
                          className={classes.listViewContainer}
                        >
                          <ProductListView
                            product={productItem?.item_details}
                            productId={productItem.id}
                            price={productItem?.item_details?.price}
                            bpp_provider_descriptor={productItem?.provider_details?.descriptor}
                            bpp_id={productItem?.bpp_details?.bpp_id}
                            location_id={productItem?.location_details ? productItem.location_details?.id : ""}
                            bpp_provider_id={productItem?.provider_details?.id}
                          />
                        </Grid>
                      );
                    } else {
                      return (
                        <Grid key={`product-item-${ind}`} item xs={12} sm={12} md={3} lg={3} xl={3}>
                          <ProductGridView
                            productPayload={productItem}
                            product={productItem?.item_details}
                            productId={productItem.id}
                            price={productItem?.item_details?.price}
                            bpp_provider_descriptor={productItem?.provider_details?.descriptor}
                            bpp_id={productItem?.bpp_details?.bpp_id}
                            location_id={productItem?.location_details ? productItem.location_details?.id : ""}
                            bpp_provider_id={productItem?.provider_details?.id}
                          />
                        </Grid>
                      );
                    }
                  })}
                </>
              ) : (
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Typography variant="body1">No Products available</Typography>
                </Grid>
              )}
            </>
          )}
        </Grid>
      </Grid>
      {products.length > 0 && (
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className={classes.paginationContainer}>
          <Pagination
            className={classes.pagination}
            count={Math.ceil(totalProductCount / paginationModel.pageSize)}
            shape="rounded"
            color="primary"
            page={paginationModel.page}
            onChange={(evant, page) => {
              let paginationData = Object.assign({}, paginationModel);
              paginationData.page = page;
              setPaginationModel(paginationData);
            }}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default ProductList;
