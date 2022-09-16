import React, { Fragment, useContext, useEffect, useState } from "react";
import styles from "../../../styles/products/productList.module.scss";
import Navbar from "../../shared/navbar/navbar";
import no_result_empty_illustration from "../../../assets/images/empty-state-illustration.svg";
import { getCall } from "../../../api/axios";
import { ONDC_COLORS } from "../../shared/colors";
import Loading from "../../shared/loading/loading";
import ProductCard from "./product-card/productCard";
import { CartContext } from "../../../context/cartContext";
import OrderSummary from "../cart/order-summary/orderSummary";
import SearchBanner from "./search-banner/searchBanner";
import { toast_actions, toast_types } from "../../shared/toast/utils/toast";
import ProductFilters from "./product-filters/productFilters";
import ProductSort from "./product-sort/productSort";
import Button from "../../shared/button/button";
import { buttonTypes } from "../../shared/button/utils";
import Pagination from "../../shared/pagination/pagination";
import { getValueFromCookie, AddCookie } from "../../../utils/cookies";
import { ToastContext } from "../../../context/toastContext";
import EmptySearchCategory from "../../../assets/images/empty_search_category.jpg";
import { useRef } from "react";
import useCancellablePromise from "../../../api/cancelRequest";
export default function ProductList() {
  // CONSTANTS
  const search_context = JSON.parse(
    getValueFromCookie("search_context") || "{}"
  );
  const product_list = JSON.parse(localStorage.getItem("product_list") || "{}");
  const selected_filters = JSON.parse(
    getValueFromCookie("product_filters") || "{}"
  );
  const selected_sort_options = JSON.parse(
    getValueFromCookie("sort_options") || "{}"
  );

  // STATES
  const [eventData, setEventData] = useState();
  const [products, setProducts] = useState([]);
  const [messageId, setMessageId] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalCount: 0,
    postPerPage: 10,
  });
  const [searchedLocation, setSearchedLocation] = useState({
    name: "",
    lat: "",
    lng: "",
  });
  const [loading, setLoading] = useState();
  const [searchedProduct, setSearchedProduct] = useState();
  const [searchProductLoading, setSearchProductLoading] = useState(false);
  const [fetchFilterLoading, setFetchFilterLoading] = useState(false);
  const [filters, setFilters] = useState();
  const [toggleFiltersOnMobile, setToggleFiltersOnMobile] = useState(false);
  const [sortType, setSortType] = useState({});
  const [selectedFilters, setSelectedFilters] = useState({});

  // CONTEXT
  const { cartItems } = useContext(CartContext);
  const dispatch = useContext(ToastContext);

  // REF
  const eventSourceRef = useRef(null);

  // HOOKS
  const { cancellablePromise } = useCancellablePromise();

  // use this function to fetch products
  function fetchProducts(message_id) {
    setLoading(true);
    setFetchFilterLoading(true);
    //  removeCookie("product_filters");
    setFilters({
      categories: [],
      fulfillment: [],
      maxPrice: 0,
      minPrice: 1000,
      providers: [],
    });
    setProducts([]);
    const token = getValueFromCookie("token");
    let header = {
      headers: {
        ...(token && {
          Authorization: `Bearer ${token}`,
        }),
      },
    };
    eventSourceRef.current = new window.EventSourcePolyfill(
      `${process.env.REACT_APP_BASE_URL}clientApis/events?messageId=${message_id}`,
      header
    );
    eventSourceRef.current.addEventListener("on_search", (e) => {
      setEventData(() => JSON.parse(e.data));
    });
  }

  useEffect(() => {
    return () => {
      eventSourceRef.current?.close();
    };
  }, []);

  useEffect(() => {
    if (!search_context?.message_id) {
      return;
    }
    if (Object.keys(search_context).length > 0) {
      setMessageId(search_context?.message_id);
      setSearchedProduct(search_context?.search?.value);
      setSearchedLocation(search_context?.location);
    }
    if (Object.keys(product_list).length > 0) {
      setProducts(product_list);
      setLoading(false);
      fetchAllFilters(search_context?.message_id);
    }
    if (Object.keys(selected_filters).length > 0) {
      setSelectedFilters(selected_filters);
    }
    if (Object.keys(selected_sort_options).length > 0) {
      setSortType(selected_sort_options);
    }
    onSearchBasedOnFilter(
      selected_filters,
      search_context?.message_id,
      selected_sort_options,
      1
    );
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (eventData?.filters && Object.keys(eventData?.filters).length > 0) {
      const filterSet = eventData?.filters;
      setFilters((filters) => ({
        ...filters,
        categories: [...filters?.categories, ...filterSet?.categories],
        fulfillment: [...filters?.fulfillment, ...filterSet?.fulfillment],
        maxPrice:
          filters?.maxPrice > filterSet?.maxPrice
            ? filters?.maxPrice
            : filterSet?.maxPrice,
        minPrice:
          filters?.minPrice < filterSet?.minPrice
            ? filters?.minPrice
            : filterSet?.minPrice,
        providers: [...filters?.providers, ...filterSet?.providers],
      }));
      setFetchFilterLoading(false);
    }
    if (eventData?.messageId) {
      setPagination((prev) => ({
        ...prev,
        totalCount: eventData?.count,
        currentPage: 1,
      }));
      onSearch(eventData?.messageId);
    }
    // eslint-disable-next-line
  }, [eventData]);

  // on search Api
  async function onSearch(message_id) {
    try {
      const data = await cancellablePromise(
        getCall(
          `/clientApis/v1/on_search?messageId=${message_id}&limit=10&pageNumber=1`
        )
      );
      localStorage.setItem(
        "product_list",
        JSON.stringify(data?.message?.catalogs)
      );
      setLoading(false);
      setProducts(data?.message?.catalogs);
    } catch (err) {
      setLoading(false);
      dispatch({
        type: toast_actions.ADD_TOAST,
        payload: {
          id: Math.floor(Math.random() * 100),
          type: toast_types.error,
          message: err?.message,
        },
      });
    }
  }
  // use this api to fetch the filters.
  async function fetchAllFilters(messageId) {
    try {
      const data = await cancellablePromise(
        getCall(`/clientApis/v1/getFilterParams?messageId=${messageId}`)
      );
      setFilters((filters) => ({
        ...filters,
        minPrice: selected_filters.minPrice
          ? selected_filters?.minPrice
          : data.minPrice,
        maxPrice: selected_filters?.maxPrice
          ? selected_filters?.maxPrice
          : data.maxPrice,
        categories:
          selected_filters?.categories?.length > 0
            ? selected_filters?.categories
            : data?.categories,
        providers:
          selected_filters?.providers?.length > 0
            ? selected_filters?.providers
            : data?.providers,
      }));
    } catch (err) {
      dispatch({
        type: toast_actions.ADD_TOAST,
        payload: {
          id: Math.floor(Math.random() * 100),
          type: toast_types.error,
          message: err?.message,
        },
      });
    } finally {
      setFetchFilterLoading(false);
    }
  }

  // use this function to generate query params for filters
  function generateQueryForFilters(
    applied_filters,
    message_id,
    sort_options,
    page_number
  ) {
    let query = `?messageId=${message_id}&limit=10`;
    if (page_number) {
      query += `&pageNumber=${page_number}`;
    }
    if (!isNaN(applied_filters.minPrice) && !isNaN(applied_filters.maxPrice)) {
      query += `&priceMin=${applied_filters.minPrice}&priceMax=${applied_filters.maxPrice}`;
    }
    if (applied_filters?.providers?.length > 0) {
      query += `&providerIds=${applied_filters.providers.map(
        (provider) => provider.id
      )}`;
    }
    if (applied_filters?.categories?.length > 0) {
      query += `&categoryIds=${applied_filters.categories.map(
        (provider) => provider.id
      )}`;
    }
    if (applied_filters?.fulfillments?.length > 0) {
      query += `&fulfillmentIds=${applied_filters.fulfillments.map(
        (provider) => provider.id
      )}`;
    }
    if (Object.keys(sort_options)?.length > 0) {
      query += `&sortField=${sort_options?.sortField}&sortOrder=${sort_options?.sortOrder}`;
    }
    return query;
  }

  // use this function to handle filtering and sorting
  async function onSearchBasedOnFilter(
    applied_filters,
    message_id,
    sort_types,
    page_number
  ) {
    setSearchProductLoading(true);
    const query = generateQueryForFilters(
      applied_filters,
      message_id,
      sort_types,
      page_number
    );
    try {
      const { message } = await cancellablePromise(
        getCall(`/clientApis/v1/on_search${query}`)
      );
      setPagination((prev) => ({
        ...prev,
        totalCount: message?.count,
      }));
      localStorage.setItem("product_list", JSON.stringify(message?.catalogs));
      setProducts(message?.catalogs);
    } catch (err) {
      dispatch({
        type: toast_actions.ADD_TOAST,
        payload: {
          id: Math.floor(Math.random() * 100),
          type: toast_types.error,
          message: err?.message,
        },
      });
    } finally {
      setSearchProductLoading(false);
    }
  }

  // loader for loading products
  const loadingSpin = (width, height) => (
    <div
      className={`d-flex align-items-center justify-content-center ${styles.product_list_container_width}`}
      style={{ width, height }}
    >
      <Loading backgroundColor={ONDC_COLORS.ACCENTCOLOR} />
    </div>
  );

  // empty state if user havent searhed anything
  const search_empty_state = (
    <div
      className="d-flex align-items-center justify-content-center p-4"
      style={{ height: "85%", width: "100%", overflow: "auto" }}
    >
      <div className="py-4">
        <img
          src={EmptySearchCategory}
          alt="empty_search_category"
          style={{ width: "350px" }}
        />
      </div>
    </div>
  );

  // empty state if no products are found
  const no_prodcut_found_empty_state = (
    <div
      className={`d-flex align-items-center justify-content-center ${styles.product_list_container_width}`}
    >
      <div className="text-center">
        <div className="py-2">
          <img
            src={no_result_empty_illustration}
            alt="empty_search"
            style={{ height: "120px" }}
          />
        </div>
        <div className="py-2">
          <p className={styles.illustration_header}>Your search is empty</p>
          <p className={styles.illustration_body}>
            No products found with the given name. Try searching for something
            else.
          </p>
        </div>
      </div>
    </div>
  );

  {
    console.log("=====<ProductFilters />", selectedFilters);
  }
  return (
    <Fragment>
      <Navbar />
      {toggleFiltersOnMobile && (
        <div className={styles.filter_on_mobile_wrapper}>
          <ProductFilters
            selectedFilters={selectedFilters}
            messageId={messageId}
            fetchFilterLoading={fetchFilterLoading}
            filters={filters}
            onCloseFilter={() => setToggleFiltersOnMobile(false)}
            onUpdateFilters={(applied_filters) => {
              setPagination((prev) => ({
                ...prev,
                currentPage: 1,
              }));
              setToggleFiltersOnMobile(false);
              setSelectedFilters(applied_filters);
              onSearchBasedOnFilter(applied_filters, messageId, sortType, 1);
            }}
          />
        </div>
      )}
      <div
        className={styles.playground_height}
        style={{
          background:
            !searchedProduct || !searchedLocation
              ? ONDC_COLORS.WHITE
              : ONDC_COLORS.BACKGROUNDCOLOR,
        }}
      >
        {/* change search banner html  */}
        <SearchBanner
          location={searchedLocation}
          onSearch={({ search, location, message_id }) => {
            setSelectedFilters({});
            setSortType({});
            setSearchedProduct(search?.value);
            setSearchedLocation(location);
            setMessageId(message_id);
            // call On Search api
            fetchProducts(message_id);
          }}
        />
        {/* list of product view  */}
        {!searchedProduct || !searchedLocation ? (
          search_empty_state
        ) : (
          <div
            className={`py-2 ${
              cartItems.length > 0
                ? styles.product_list_with_summary_wrapper
                : styles.product_list_without_summary_wrapper
            }`}
          >
            {loading ? (
              loadingSpin("100%", "100%")
            ) : (
              <div className="d-flex h-100 px-2">
                <div
                  className={`${styles.filter_container_width} p-2 d-none d-lg-block`}
                >
                  <ProductFilters
                    selectedFilters={selectedFilters}
                    messageId={messageId}
                    fetchFilterLoading={fetchFilterLoading}
                    filters={filters}
                    onUpdateFilters={(applied_filters) => {
                      setPagination((prev) => ({
                        ...prev,
                        currentPage: 1,
                      }));
                      setSelectedFilters(applied_filters);
                      onSearchBasedOnFilter(
                        applied_filters,
                        messageId,
                        sortType,
                        1
                      );
                    }}
                  />
                </div>
                {searchProductLoading ? (
                  loadingSpin("", "100%")
                ) : products.length <= 0 ? (
                  no_prodcut_found_empty_state
                ) : (
                  <div className={`${styles.product_list_container_width}`}>
                    <div className="py-2 px-3 d-flex align-items-center">
                      <div className="d-sm-block d-lg-none">
                        <Button
                          button_type={buttonTypes.primary}
                          button_hover_type={buttonTypes.primary_hover}
                          button_text="Filters"
                          onClick={() => setToggleFiltersOnMobile(true)}
                        />
                      </div>
                      <div className="ms-auto">
                        {fetchFilterLoading ? (
                          <Loading backgroundColor={ONDC_COLORS.ACCENTCOLOR} />
                        ) : (
                          <ProductSort
                            sortType={sortType?.name}
                            onUpdateSortType={(sort_type) => {
                              AddCookie(
                                "sort_options",
                                JSON.stringify(sort_type)
                              );
                              setPagination((prev) => ({
                                ...prev,
                                currentPage: 1,
                              }));
                              setSortType(sort_type);
                              onSearchBasedOnFilter(
                                selectedFilters,
                                messageId,
                                sort_type,
                                1
                              );
                            }}
                          />
                        )}
                      </div>
                    </div>
                    <div className="container">
                      <div className="row pe-2">
                        {products.map((product) => {
                          return (
                            <div
                              key={product?.id}
                              className="col-xl-4 col-lg-6 col-md-6 col-sm-6 p-2"
                            >
                              <ProductCard
                                product={product}
                                price={product?.price}
                                bpp_provider_descriptor={
                                  product?.provider_details?.descriptor
                                }
                                bpp_id={product?.bpp_details?.bpp_id}
                                location_id={
                                  product?.location_details
                                    ? product.location_details?.id
                                    : ""
                                }
                                bpp_provider_id={product?.provider_details?.id}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    {!fetchFilterLoading && (
                      <div
                        className="d-flex align-items-center justify-content-center"
                        style={{ height: "60px" }}
                      >
                        <Pagination
                          className="m-0"
                          currentPage={pagination.currentPage}
                          totalCount={pagination.totalCount}
                          pageSize={pagination.postPerPage}
                          onPageChange={(page) => {
                            setPagination((prev) => ({
                              ...prev,
                              currentPage: page,
                            }));
                            onSearchBasedOnFilter(
                              selectedFilters,
                              messageId,
                              sortType,
                              page
                            );
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {cartItems.length > 0 && <OrderSummary />}
      </div>
    </Fragment>
  );
}
