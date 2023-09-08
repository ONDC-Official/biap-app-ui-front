import React, { useState, useEffect } from "react";
import useStyles from "./style";
import { Link, useHistory, useLocation } from "react-router-dom";

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
import { getCall, postCall } from "../../../api/axios";
import { getValueFromCookie } from "../../../utils/cookies";
import {
  formatCustomizationGroups,
  formatCustomizations,
  initializeCustomizationState,
} from "../../application/product-list/product-details/utils";
import { CartContext } from "../../../context/cartContext";

const ProductList = () => {
  const classes = useStyles();
  const locationData = useLocation();
  const history = useHistory();
  const { fetchCartItems } = useContext(CartContext);
  const [productPayload, setProductPayload] = useState(null);
  const [customization_state, setCustomizationState] = useState({});
  const [productLoading, setProductLoading] = useState(false);

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
      getAllProducts(searchName);
    }
  }, [locationData]);

  const getAllProducts = async (searchName) => {
    setIsLoading(true);
    try {
      let paginationData = Object.assign({}, JSON.parse(JSON.stringify(paginationModel)));
      paginationData.searchData = paginationData.searchData.filter((item) => item.selectedValues.length > 0);
      paginationData.searchData = paginationData.searchData.reduce(function (r, e) {
        r[e.code] = e.selectedValues.join();
        return r;
      }, {});
      paginationData.searchData.pageNumber = paginationData.page;
      paginationData.searchData.limit = paginationData.pageSize;
      if (searchName) {
        paginationData.searchData.productName = searchName || "";
      } else {
      }
      if (subCategoryName) {
        paginationData.searchData.categoryIds = subCategoryName || "";
      } else {
      }
      const data = await cancellablePromise(getAllProductRequest(paginationData.searchData));
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
      // getAllProducts();
      getAllFilters();
    }
  }, [subCategoryName]);

  useEffect(() => {
    getAllProducts();
  }, [paginationModel]);

  const handleChangeFilter = (filterIndex, value) => {
    const data = Object.assign({}, JSON.parse(JSON.stringify(paginationModel)));
    data.searchData[filterIndex].selectedValues = value;
    data.page = 1;
    data.pageSize = 10;
    setPaginationModel(data);
  };

  const getProductDetails = async (productId) => {
    try {
      setProductLoading(true);
      const data = await cancellablePromise(getCall(`/clientApis/v2/items/${productId}`));
      setProductPayload(data.response);
      return data.response;
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setProductLoading(false);
    }
  };

  const calculateSubtotal = () => {
    let subtotal = 0;

    for (const level in customization_state) {
      const selectedOptions = customization_state[level].selected;
      if (selectedOptions.length > 0) {
        subtotal += selectedOptions.reduce((acc, option) => acc + option.price, 0);
      }
    }
    return subtotal;
  };

  const getCustomizations = async (productPayload, customization_state) => {
    const { customisation_items } = productPayload;
    const customizations = [];
    const levels = Object.keys(customization_state);

    for (const level of levels) {
      const selectedItems = customization_state[level].selected;

      for (const selectedItem of selectedItems) {
        let customization = customisation_items.find((item) => item.local_id === selectedItem.id);

        if (customization) {
          customization = {
            ...customization,
            quantity: {
              count: 1,
            },
          };
          customizations.push(customization);
        }
      }
    }

    return customizations;
  };

  const addToCart = async (productPayload, isDefault = false) => {
    setProductLoading(true);
    const user = JSON.parse(getValueFromCookie("user"));
    const url = `/clientApis/v2/cart/${user.id}`;

    const subtotal = productPayload?.item_details?.price?.value + calculateSubtotal();

    const groups = await formatCustomizationGroups(productPayload.customisation_groups);
    const cus = await formatCustomizations(productPayload.customisation_items);
    const newState = await initializeCustomizationState(groups, cus, customization_state);

    getCustomizations(productPayload, isDefault ? newState : customization_state).then((customisations) => {
      const payload = {
        id: productPayload.id,
        local_id: productPayload.local_id,
        bpp_id: productPayload.bpp_details.bpp_id,
        bpp_uri: productPayload.context.bpp_uri,
        domain: productPayload.context.domain,
        quantity: {
          count: 1,
        },
        provider: {
          id: productPayload.bpp_details.bpp_id,
          locations: productPayload.locations,
          ...productPayload.provider_details,
        },
        product: {
          id: productPayload.id,
          subtotal,
          ...productPayload.item_details,
        },
      };

      if (customisations.length > 0) {
        payload.customisations = customisations;
      }

      postCall(url, payload)
        .then(() => {
          fetchCartItems();
          setCustomizationState({});
          setProductLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setProductLoading(false);
        });
    });
  };

  const updateQueryParams = () => {
    const params = new URLSearchParams({});
    if (searchProductName) {
      params.set("s", searchProductName);
    }
    if (categoryName) {
      params.set("c", categoryName);
    } else {
    }
    history.replace({ pathname: `/application/products`, search: params.toString() });
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
                component="div"
                underline="hover"
                color="inherit"
                // to={`/category/${categoryName}`}
                onClick={updateQueryParams}
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
                            getProductDetails={getProductDetails}
                            handleAddToCart={addToCart}
                            productLoading={productLoading}
                          />
                        </Grid>
                      );
                    } else {
                      return (
                        <Grid key={`product-item-${ind}`} item xs={12} sm={12} md={3} lg={3} xl={3}>
                          <ProductGridView
                            product={productItem?.item_details}
                            productId={productItem.id}
                            price={productItem?.item_details?.price}
                            bpp_provider_descriptor={productItem?.provider_details?.descriptor}
                            bpp_id={productItem?.bpp_details?.bpp_id}
                            location_id={productItem?.location_details ? productItem.location_details?.id : ""}
                            bpp_provider_id={productItem?.provider_details?.id}
                            getProductDetails={getProductDetails}
                            handleAddToCart={addToCart}
                            productLoading={productLoading}
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
