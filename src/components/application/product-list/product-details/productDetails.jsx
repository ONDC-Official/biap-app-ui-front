import React, { Fragment, useState, useEffect } from "react";
import styles from "../../../../styles/products/productDetails.module.scss";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import no_image_found from "../../../../assets/images/no_image_found.png";
import Navbar from "../../../shared/navbar/navbar";
import OrderSummary from "../../cart/order-summary/orderSummary";
import { useContext } from "react";
import { CartContext } from "../../../../context/cartContext";
import Subtract from "../../../shared/svg/subtract";
import Add from "../../../shared/svg/add";

export default function ProductDetails() {
  const location = useLocation();
  const { product, bpp_id, location_id } = location.state;
  const { id, descriptor, price, provider_details } = product;
  const {
    name: product_name,
    images,
    short_desc: product_description,
  } = descriptor;
  const { descriptor: provider_descriptor, id: bpp_provider_id } =
    provider_details;
  const { name: provider_name } = provider_descriptor;
  const [quantityCount, setQuantityCount] = useState(0);
  const [toggleAddToCart, setToggleAddToCart] = useState();
  const { cartItems, onReduceQuantity, onAddQuantity, onAddProduct } =
    useContext(CartContext);

  useEffect(() => {
    const isProductPresent = cartItems.find(({ product }) => product.id === id);
    if (isProductPresent) {
      setToggleAddToCart(true);
      setQuantityCount(isProductPresent.quantity.count);
    } else {
      setToggleAddToCart(false);
      setQuantityCount(0);
    }
  }, [cartItems, id]);

  const renderProductDetails = (detail) => {
    const obj = product?.["@ondc/org/statutory_reqs_packaged_commodities"];
    switch (detail) {
      case "manufacturer_or_packer_name":
        return {
          key: "Manufacturer Name:",
          value: obj?.["manufacturer_or_packer_name"],
        };
      case "net_quantity_or_measure_of_commodity_in_pkg":
        return {
          key: "Net Quantity:",
          value: obj?.["net_quantity_or_measure_of_commodity_in_pkg"],
        };
      case "month_year_of_manufacture_packing_import":
        return {
          key: "Manufacturing Date:",
          value: obj?.["month_year_of_manufacture_packing_import"],
        };
      case "imported_product_country_of_origin":
        return {
          key: "Country of Origin:",
          value: obj?.["imported_product_country_of_origin"],
        };
      default:
        return {
          key: null,
          value: null,
        };
    }
  };

  return (
    <Fragment>
      <Navbar />

      <div className={styles.playground_height}>
        <div
          className={`py-2 ${
            cartItems.length > 0
              ? styles.product_list_with_summary_wrapper
              : styles.product_list_without_summary_wrapper
          }`}
        >
          <div className="container">
            <div className="row py-3 px-2">
              <div className="d-inline-flex">
                <Link to={{ pathname: "/application/products" }}>
                  <p className={styles.back_text}>back</p>
                </Link>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 col-lg-4 p-3">
                {/* PRODUCT IMAGE  */}
                <div className={styles.product_img_container}>
                  <img
                    src={images?.length > 0 ? images[0] : no_image_found}
                    alt={product_name}
                    width="300"
                    height="300"
                    className={styles.product_img}
                    onError={(event) => {
                      event.target.onerror = null;
                      event.target.src = no_image_found;
                    }}
                  />
                </div>
              </div>
              <div className="col-md-12 col-lg-8 p-3">
                {/* NAME AND ORDERING FROM  */}
                <div className="pb-2">
                  <p className={`${styles.product_name} ${styles.width}`}>
                    {product_name}
                  </p>
                  <p className={styles.ordered_from}>
                    Ordering from{" "}
                    <span className={styles.bold}>{provider_name}</span>
                  </p>
                </div>
                {/* DESCRIPTION  */}
                <div className="pb-3">
                  <p
                    className={`${styles.product_description} ${styles.width}`}
                  >
                    {product_description}
                  </p>
                </div>
                {/* PRICE  */}
                <div className="pb-2">
                  <p className={styles.product_price}>
                    ₹{" "}
                    {Number.isInteger(price.value)
                      ? price.value
                      : price.value.toFixed(2)}
                  </p>
                </div>
                {/* DIVIDER  */}
                <div className={styles.width}>
                  <hr style={{ border: "1px solid #aaa" }} />
                  {/* AVAILABLE QUANTITY  */}
                  {Number(product?.AvailableQuantity > 0) ? (
                    <div className="d-flex align-items-center py-1">
                      <p className={styles.prodcut_details_key}>
                        Available Quantity:
                      </p>
                      <p className={styles.prodcut_details_value}>
                        {product?.AvailableQuantity}
                      </p>
                    </div>
                  ) : null}
                  {/* RETURNABLE  */}
                  {typeof product?.["@ondc/org/returnable"] !== "undefined" ? (
                    <div className="d-flex align-items-center py-1">
                      <p className={styles.prodcut_details_key}>Returnable:</p>
                      <p className={styles.prodcut_details_value}>
                        {product?.["@ondc/org/returnable"] == true
                          ? "Yes"
                          : "No"}
                      </p>
                    </div>
                  ) : null}
                  {/* CANCELABLE  */}
                  {typeof product?.["@ondc/org/cancellable"] !== "undefined" ? (
                    <div className="d-flex align-items-center py-1">
                      <p className={styles.prodcut_details_key}>Cancelable:</p>
                      <p className={styles.prodcut_details_value}>
                        {product?.["@ondc/org/cancellable"] == true
                          ? "Yes"
                          : "No"}
                      </p>
                    </div>
                  ) : null}
                  {/* COD  */}
                  {typeof product?.["@ondc/org/available_on_cod"] !==
                  "undefined" ? (
                    <div className="d-flex align-items-center py-1">
                      <p className={styles.prodcut_details_key}>
                        Cash On Delivery:
                      </p>
                      <p className={styles.prodcut_details_value}>
                        {product?.["@ondc/org/available_on_cod"] == true
                          ? "Yes"
                          : "No"}
                      </p>
                    </div>
                  ) : null}
                </div>
                {/* PRODUCT DETAILS  */}
                {Object.keys(
                  product?.["@ondc/org/statutory_reqs_packaged_commodities"] ||
                    {}
                ).length > 0 && (
                  <div className="pt-4 pb-2">
                    <p className={styles.product_details_header}>
                      Product Details
                    </p>
                    <div className={`${styles.width} pt-2`}>
                      {Object.keys(
                        product?.[
                          "@ondc/org/statutory_reqs_packaged_commodities"
                        ]
                      ).map((commodity, index) => {
                        const { key, value } = renderProductDetails(commodity);
                        if (key && value) {
                          return (
                            <div
                              className="d-flex align-items-center py-1"
                              key={`id-${index}`}
                            >
                              <p className={styles.prodcut_details_key}>
                                {key}
                              </p>
                              <p className={styles.prodcut_details_value}>
                                {value}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                )}
                {/* ADD TO CART BUTTON  */}
                <div className="py-3">
                  {toggleAddToCart && quantityCount > 0 ? (
                    <div className={styles.quantity_count_wrapper}>
                      <div
                        className={`${styles.subtract_svg_wrapper} d-flex align-items-center justify-content-center`}
                        onClick={() => {
                          setQuantityCount(quantityCount - 1);
                          onReduceQuantity(id);
                          if (quantityCount - 1 === 0) {
                            setToggleAddToCart(false);
                            return;
                          }
                        }}
                      >
                        <Subtract
                          width="13"
                          classes={styles.subtract_svg_color}
                        />
                      </div>
                      <div className="d-flex align-items-center justify-content-center">
                        <p className={styles.quantity_count}>{quantityCount}</p>
                      </div>
                      <div
                        className={`${styles.add_svg_wrapper} d-flex align-items-center justify-content-center`}
                        onClick={() => {
                          setQuantityCount(
                            (quantityCount) => quantityCount + 1
                          );
                          onAddQuantity(id);
                        }}
                      >
                        <Add
                          width="13"
                          height="13"
                          classes={styles.add_svg_color}
                        />
                      </div>
                    </div>
                  ) : (
                    <button
                      className={styles.add_to_cart_button}
                      onClick={() => {
                        setToggleAddToCart(true);
                        setQuantityCount((quantityCount) => quantityCount + 1);
                        onAddProduct({
                          id,
                          quantity: { count: quantityCount + 1 },
                          bpp_id,
                          provider: {
                            id: bpp_provider_id,
                            locations: [location_id],
                          },
                          product,
                        });
                      }}
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {cartItems.length > 0 && <OrderSummary />}
      </div>
    </Fragment>
  );
}
