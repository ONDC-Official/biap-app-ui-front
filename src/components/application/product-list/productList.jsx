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

export default function ProductList() {
  const { cartItems } = useContext(CartContext);
  const search_context = JSON.parse(Cookies.get("search_context") || "{}");
  const [products, setProducts] = useState([]);
  const [searchedLocation, setSearchedLocation] = useState({
    name: "",
    lat: "",
    lng: "",
  });
  const [searchedProduct, setSearchedProduct] = useState();
  const [searchProductLoading, setSearchProductLoading] = useState(false);
  const search_polling_timer = useRef(0);
  const [toast, setToast] = useState({
    toggle: false,
    type: "",
    message: "",
  });
  useEffect(() => {
    if (Object.keys(search_context).length > 0) {
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
      const filteredProducts = data?.message?.catalogs.map((catalog) => {
        if (catalog?.bpp_providers && catalog?.bpp_id) {
          return { ...catalog };
        } else {
          return { ...catalog, bpp_providers: [], bpp_id: "" };
        }
      });
      setProducts(filteredProducts);
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

  function callApiMultipleTimes(message_id) {
    setSearchProductLoading(true);
    let counter = 6;
    search_polling_timer.current = setInterval(async () => {
      if (counter <= 0) {
        clearInterval(search_polling_timer.current);
        return;
      }
      await onSearchPolling(message_id).finally(() => {
        counter -= 1;
      });
    }, 2000);
  }

  const loadingSpin = (
    <div
      className={"d-flex align-items-center justify-content-center"}
      style={{ height: "85%" }}
    >
      <Loading backgroundColor={ONDC_COLORS.ACCENTCOLOR} />
    </div>
  );

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

  const no_prodcut_found_empty_state = (
    <div
      className={`${styles.playground_height} d-flex align-items-center justify-content-center`}
    >
      <div className="text-center">
        <div className="py-2">
          <img
            src={no_result_empty_illustration}
            alt="empty_search"
            style={{ height: "130px" }}
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
      {searchProductLoading ? (
        loadingSpin
      ) : (
        <div className={styles.playground_height}>
          {/* change search banner html  */}
          <SearchBanner
            location={searchedLocation}
            onSearch={({ search, location, message_id }) => {
              clearInterval(search_polling_timer.current);
              setSearchedProduct(search?.value);
              setSearchedLocation(location);
              // call On Search api
              callApiMultipleTimes(message_id);
            }}
          />
          {/* list of product view  */}
          {!searchedProduct || !searchedLocation ? (
            search_empty_state
          ) : products.filter((catalog) => catalog?.bpp_providers?.length > 0)
              .length > 0 ? (
            <div
              className={`py-2 ${
                cartItems.length > 0
                  ? styles.product_list_with_summary_wrapper
                  : styles.product_list_without_summary_wrapper
              }`}
            >
              <div className="container">
                <div className="row">
                  {products?.map(({ bpp_id, bpp_providers }, index) => {
                    return (
                      <Fragment key={`${bpp_id}-id-${index}`}>
                        {bpp_providers.map(
                          ({ id, items, locations = "", descriptor }) => {
                            if (locations && bpp_id) {
                              return (
                                <Fragment>
                                  {items.map((item) => {
                                    return (
                                      <div
                                        key={item.id}
                                        className="col-lg-4 col-md-6 col-sm-6 p-2"
                                      >
                                        <ProductCard
                                          product={item}
                                          bpp_provider_descriptor={descriptor}
                                          bpp_id={bpp_id}
                                          location_id={
                                            locations.length > 0
                                              ? locations[0].id
                                              : ""
                                          }
                                          bpp_provider_id={id}
                                        />
                                      </div>
                                    );
                                  })}
                                </Fragment>
                              );
                            }
                            return null;
                          }
                        )}
                      </Fragment>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            no_prodcut_found_empty_state
          )}
          {cartItems.length > 0 && <OrderSummary />}
        </div>
      )}
    </Fragment>
  );
}

// !searchedProduct || !searchedLocation ? (
//   search_empty_state
// ) : (
// )
