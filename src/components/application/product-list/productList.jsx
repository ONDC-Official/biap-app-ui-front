import React, {
  Fragment,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "../../../styles/products/productList.module.scss";
import Navbar from "../../shared/navbar/navbar";
import search_empty_illustration from "../../../assets/images/search_prod_illustration.svg";
import no_result_empty_illustration from "../../../assets/images/empty-state-illustration.svg";
import { getCall } from "../../../api/axios";
import { ONDC_COLORS } from "../../shared/colors";
import Loading from "../../shared/loading/loading";
import ProductCard from "./product-card/productCard";
import { CartContext } from "../../../context/cartContext";
import OrderSummary from "./order-summary/orderSummary";
import Cookies from "js-cookie";
import SearchBanner from "./search-banner/searchBanner";
import Toast from "../../shared/toast/toast";
import { toast_types } from "../../../utils/toast";
import ProductFilters from "./product-filters/productFilters";
import ProductSort from "./product-sort/productSort";
import Button from "../../shared/button/button";
import { buttonTypes } from "../../../utils/button";

export default function ProductList() {
  const { cartItems } = useContext(CartContext);
  const search_context = JSON.parse(Cookies.get("search_context") || "{}");
  const [products, setProducts] = useState([]);
  const [messageId, setMessageId] = useState("");
  const [searchedLocation, setSearchedLocation] = useState({
    name: "",
    lat: "",
    lng: "",
  });
  const [searchedProduct, setSearchedProduct] = useState();
  const [searchProductLoading, setSearchProductLoading] = useState(false);
  const [fetchFilterLoading, setFetchFilterLoading] = useState(false);
  const [filters, setFilters] = useState();
  const [toggleFiltersOnMobile, setToggleFiltersOnMobile] = useState(false);
  const search_polling_timer = useRef(0);
  const [sortType, setSortType] = useState({});
  const [selectedFilters, setSelectedFilters] = useState({});
  const [toast, setToast] = useState({
    toggle: false,
    type: "",
    message: "",
  });

  useEffect(() => {
    if (Object.keys(search_context).length > 0) {
      setMessageId(search_context?.message_id);
      setSearchedProduct(search_context?.search?.value);
      setSearchedLocation(search_context?.location);
      callApiMultipleTimes(search_context?.message_id);
    }
    return () => {
      clearInterval(search_polling_timer.current);
    };
    // eslint-disable-next-line
  }, []);

  // on search Api
  async function onSearchPolling(message_id) {
    try {
      const data = await getCall(
        `/clientApis/v1/on_search?messageId=${message_id}`
      );
      setProducts(data?.message?.catalogs);
      setSearchProductLoading(false);
    } catch (err) {
      setSearchProductLoading(false);
      clearInterval(search_polling_timer.current);
      setToast((toast) => ({
        ...toast,
        toggle: true,
        type: toast_types.error,
        message: err.response.data.error,
      }));
    }
  }

  // use this to poll for multiple times
  function callApiMultipleTimes(message_id) {
    setSearchProductLoading(true);
    setFetchFilterLoading(true);
    let counter = 1;
    search_polling_timer.current = setInterval(async () => {
      if (counter <= 0) {
        fetchAllFilters(message_id);
        clearInterval(search_polling_timer.current);
        return;
      }
      await onSearchPolling(message_id).finally(() => {
        counter -= 1;
      });
    }, 2000);
  }

  // use this api to fetch the filters.
  async function fetchAllFilters(messageId) {
    try {
      const data = await getCall(
        `/clientApis/v1/getFilterParams?messageId=${messageId}`
      );
      setFilters(data);
    } catch (err) {
      setToast((toast) => ({
        ...toast,
        toggle: true,
        type: toast_types.error,
        message: err.response.data.error,
      }));
    } finally {
      setFetchFilterLoading(false);
    }
  }

  // use this function to generate query params for filters
  function generateQueryForFilters(applied_filters, sort_options) {
    let query = "";

    if (messageId) {
      query += `?messageId=${messageId}`;
    }
    if (!isNaN(applied_filters.minPrice) && !isNaN(applied_filters.maxPrice)) {
      query += `&priceMin=${applied_filters.minPrice}&priceMax=${applied_filters.maxPrice}`;
    }
    if (applied_filters?.providers?.length > 0) {
      query += `&providerId=${applied_filters.providers.map(
        (provider) => provider.id
      )}`;
    }
    if (applied_filters?.categories?.length > 0) {
      query += `&categoryId=${applied_filters.categories.map(
        (provider) => provider.id
      )}`;
    }
    if (applied_filters?.fulfillments?.length > 0) {
      query += `&fulfillmentId=${applied_filters.fulfillments.map(
        (provider) => provider.id
      )}`;
    }
    if (Object.keys(sort_options).length > 0) {
      query += `&sortField=${sort_options?.sortField}&sortOrder=${sort_options?.sortOrder}`;
    }
    return query;
  }

  // use this function to handle filtering and sorting
  async function onSearchBasedOnFilter(applied_filters, sort_types) {
    setSearchProductLoading(true);
    const query = generateQueryForFilters(applied_filters, sort_types);
    try {
      const { message } = await getCall(`/clientApis/v1/on_search${query}`);
      setProducts(message.catalogs);
    } catch (err) {
      setToast((toast) => ({
        ...toast,
        toggle: true,
        type: toast_types.error,
        message: err.response.data.error,
      }));
    } finally {
      setSearchProductLoading(false);
    }
  }

  // loader for loading products
  const loadingSpin = (
    <div
      className={`d-flex align-items-center justify-content-center ${styles.product_list_container_width}`}
    >
      <Loading backgroundColor={ONDC_COLORS.ACCENTCOLOR} />
    </div>
  );

  // empty state if user havent searhed anything
  const search_empty_state = (
    <div
      className={"d-flex align-items-center justify-content-center"}
      style={{ height: "85%" }}
    >
      <div className="text-center">
        <div className="py-2">
          <img
            src={search_empty_illustration}
            alt="empty_search"
            style={{ height: "150px" }}
          />
        </div>
        <div className="py-2">
          <p className={styles.illustration_header}>Looking for Something</p>
          <p className={styles.illustration_body}>
            Search what you are looking on the top search bar
          </p>
        </div>
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
            No Products found with the given name try searching for something
            else by clicking the button
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <Fragment>
      <Navbar />
      {toast.toggle && (
        <Toast
          type={toast.type}
          message={toast.message}
          onRemove={() =>
            setToast((toast) => ({
              ...toast,
              toggle: false,
            }))
          }
        />
      )}
      {toggleFiltersOnMobile && (
        <div className={styles.filter_on_mobile_wrapper}>
          <ProductFilters
            messageId={messageId}
            fetchFilterLoading={fetchFilterLoading}
            filters={filters}
            onCloseFilter={() => setToggleFiltersOnMobile(false)}
            onUpdateFilters={(applied_filters) => {
              setToggleFiltersOnMobile(false);
              setSelectedFilters(applied_filters);
              onSearchBasedOnFilter(applied_filters, sortType);
            }}
          />
        </div>
      )}
      <div className={styles.playground_height}>
        {/* change search banner html  */}
        <SearchBanner
          location={searchedLocation}
          onSearch={({ search, location, message_id }) => {
            clearInterval(search_polling_timer.current);
            setSearchedProduct(search?.value);
            setSearchedLocation(location);
            setMessageId(message_id);
            // call On Search api
            callApiMultipleTimes(message_id);
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
            <div className="d-flex h-100">
              <div
                className={`${styles.filter_container_width} p-2 d-none d-lg-block`}
              >
                <ProductFilters
                  messageId={messageId}
                  fetchFilterLoading={fetchFilterLoading}
                  filters={filters}
                  onUpdateFilters={(applied_filters) => {
                    setSelectedFilters(applied_filters);
                    onSearchBasedOnFilter(applied_filters, sortType);
                  }}
                />
              </div>
              {searchProductLoading ? (
                loadingSpin
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
                      <ProductSort
                        sortType={sortType?.name}
                        onUpdateSortType={(sort_type) => {
                          setSortType(sort_type);
                          onSearchBasedOnFilter(selectedFilters, sort_type);
                        }}
                      />
                    </div>
                  </div>
                  <div className="container-fluid">
                    <div className="row">
                      {products.map(
                        ({
                          bpp_details,
                          descriptor,
                          id,
                          location_details,
                          provider_details,
                          price,
                        }) => {
                          return (
                            <div
                              key={id}
                              className="col-xl-4 col-lg-6 col-md-6 col-sm-6 p-2"
                            >
                              <ProductCard
                                product={{ id, descriptor }}
                                price={price}
                                bpp_provider_descriptor={
                                  provider_details?.descriptor
                                }
                                bpp_id={bpp_details?.bpp_id}
                                location_id={
                                  location_details ? location_details?.id : ""
                                }
                                bpp_provider_id={provider_details?.id}
                              />
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {cartItems.length > 0 && <OrderSummary />}
      </div>
    </Fragment>
  );
}
