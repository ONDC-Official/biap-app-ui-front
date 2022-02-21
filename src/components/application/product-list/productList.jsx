import React, {
  Fragment,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "../../../styles/products/productList.module.scss";
import Navbar from "../../shared/navbar/navbar";
import search_empty_illustration from "../../../assets/images/search_prod_illustration.png";
import no_result_empty_illustration from "../../../assets/images/empty-state-illustration.svg";
import Button from "../../shared/button/button";
import { buttonTypes } from "../../../utils/button";
import SearchProductModal from "../search-product-modal/searchProductModal";
import { getCall } from "../../../api/axios";
import { ONDC_COLORS } from "../../shared/colors";
import Loading from "../../shared/loading/loading";
import ProductCard from "./product-card/productCard";
import { CartContext } from "../../../context/cartContext";
import OrderSummary from "./order-summary/orderSummary";
import Cookies from "js-cookie";

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
  const [toggleSearchProductModal, setToggleSearchProductModal] = useState();
  const [searchProductLoading, setSearchProductLoading] = useState(false);
  const search_polling_timer = useRef(0);
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
        `/client/v1/on_search?messageId=${message_id}`
      );
      const filteredProducts = data?.message?.catalogs.map((catalog) => {
        if (catalog?.bpp_providers) {
          return { ...catalog };
        } else {
          return { ...catalog, bpp_providers: [] };
        }
      });
      setProducts(filteredProducts);
      setSearchProductLoading(false);
    } catch (err) {
      console.log(err);
      setSearchProductLoading(false);
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
      className={`${styles.playground_height} d-flex align-items-center justify-content-center`}
    >
      <Loading backgroundColor={ONDC_COLORS.ACCENTCOLOR} />
    </div>
  );

  const search_empty_state = (
    <div
      className={`${styles.playground_height} d-flex align-items-center justify-content-center`}
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
            Search what you are looking fro by clicking on the button below
          </p>
        </div>
        <div className="py-3">
          <Button
            button_type={buttonTypes.primary}
            button_hover_type={buttonTypes.primary_hover}
            button_text="Search"
            onClick={() => setToggleSearchProductModal(true)}
          />
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
        <div className="py-3">
          <Button
            button_type={buttonTypes.primary}
            button_hover_type={buttonTypes.primary_hover}
            button_text="Search"
            onClick={() => setToggleSearchProductModal(true)}
          />
        </div>
      </div>
    </div>
  );

  return (
    <Fragment>
      <Navbar />
      {toggleSearchProductModal && (
        <SearchProductModal
          onClose={() => setToggleSearchProductModal(false)}
          onSearch={({ search, location, message_id }) => {
            setSearchedProduct(search?.value);
            setToggleSearchProductModal(false);
            setSearchedLocation(location);
            // call On Search api
            callApiMultipleTimes(message_id);
          }}
        />
      )}
      {searchProductLoading ? (
        loadingSpin
      ) : !searchedProduct || !searchedLocation ? (
        search_empty_state
      ) : (
        <div className={styles.playground_height}>
          {/* change search banner html  */}
          <div className={styles.searched_history_banner}>
            <div className="px-2">
              <p className={styles.searched_history_text}>
                Searching
                <span className={`px-2 ${styles.semibold}`}>
                  {searchedProduct}
                </span>
                in
                <span className={`px-2 ${styles.semibold}`}>
                  {searchedLocation.name}
                </span>
              </p>
            </div>
            <div className="px-2">
              <Button
                button_type={buttonTypes.primary}
                button_hover_type={buttonTypes.primary_hover}
                button_text="Change"
                onClick={() => {
                  clearInterval(search_polling_timer.current);
                  setToggleSearchProductModal(true);
                }}
              />
            </div>
          </div>
          {/* list of product view  */}
          {products.length > 0 ? (
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
                          ({ id, items, locations, descriptor }) => {
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
                                        location_id={locations[0].id}
                                        bpp_provider_id={id}
                                      />
                                    </div>
                                  );
                                })}
                              </Fragment>
                            );
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
