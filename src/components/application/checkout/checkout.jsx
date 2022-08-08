import React, { Fragment, useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import Navbar from "../../shared/navbar/navbar";
import styles from "../../../styles/cart/cartView.module.scss";
import PriceDetailsCard from "./price-details-card/priceDetailsCard";
import PaymentConfirmationCard from "./payment-method/paymentConfirmationCard";
import {
  checkout_steps,
  get_current_step,
} from "../../../constants/checkout-steps";
import { payment_methods } from "../../../constants/payment-methods";
import { CartContext } from "../../../context/cartContext";
import ProductCard from "../product-list/product-card/productCard";
import { getValueFromCookie } from "../../../utils/cookies";

export default function Checkout() {
  // LOCATION
  const location = useLocation();

  // CONSTANTS
  const { productQuotes, successOrderIds } = JSON.parse(
    getValueFromCookie("checkout_details") || "{}"
  );

  // STATES
  const [orderStatus, setOrderStatus] = useState("");
  const [activePaymentMethod, setActivePaymentMethod] = useState(
    payment_methods.COD
  );
  const [productsQuote, setProductsQoute] = useState({
    products: [],
    total_payable: 0,
  });

  // CONTEXT
  const { cartItems } = useContext(CartContext);

  // use this effect to handle callback from justpay
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setOrderStatus(searchParams.get("status"));
    if (searchParams.get("status")) {
      setActivePaymentMethod(payment_methods.JUSPAY);
    }
    fetchProductQuote();
    // eslint-disable-next-line
  }, [location]);

  // use this function to fetch the product productsQuote
  function fetchProductQuote() {
    let products = [];
    let total_payable = 0;
    productQuotes?.forEach((data) => {
      data?.breakup?.forEach((quote) => {
        products = [
          ...products,
          {
            title: quote?.title,
            price: Number(quote?.price?.value)?.toFixed(2),
          },
        ];
      });
      total_payable = Math.round(
        total_payable + Number(data?.price?.value)
      ).toFixed(2);
    });
    setProductsQoute((prev) => ({
      ...prev,
      products,
      total_payable,
    }));
  }

  return (
    <Fragment>
      <Navbar />
      <div className={styles.playground_height}>
        <div className="container">
          <div className="row py-3">
            <div className="col-12">
              <p className={styles.cart_label}>Checkout</p>
            </div>
          </div>
          <div className="row py-2">
            <div className="col-lg-8">
              <div className="container-fluid p-0">
                <div className="row">
                  <div className="col-12 pb-3">
                    <div className={styles.price_summary_card}>
                      <div
                        className={`${styles.card_header} d-flex align-items-center`}
                      >
                        <p className={styles.card_header_title}>Cart Info</p>
                      </div>
                      <div className={styles.card_body}>
                        {/* List of items will come here */}
                        <div className="container-fluid">
                          <div className="row">
                            {cartItems.map(
                              ({ id, bpp_id, product, provider }) => {
                                const { id: provider_id, locations } = provider;
                                return (
                                  <div
                                    className="col-lg-6 col-sm-12 p-2"
                                    key={id}
                                  >
                                    <div style={{ position: "relative" }}>
                                      <ProductCard
                                        product={product}
                                        price={product?.price}
                                        bpp_provider_descriptor={{
                                          name: product?.provider_details
                                            ?.descriptor?.name,
                                        }}
                                        bpp_id={bpp_id}
                                        location_id={
                                          locations ? locations[0] : ""
                                        }
                                        bpp_provider_id={provider?.id}
                                        show_quantity_button={false}
                                      />
                                      {!successOrderIds.includes(
                                        provider_id.toString()
                                      ) && (
                                        <div
                                          className={styles.product_disabled}
                                          style={{ height: "100%" }}
                                        />
                                      )}
                                    </div>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 pb-3">
                    <PaymentConfirmationCard
                      currentActiveStep={get_current_step(
                        checkout_steps.SELECT_PAYMENT_METHOD
                      )}
                      productsQuote={productQuotes}
                      orderStatus={orderStatus}
                      activePaymentMethod={activePaymentMethod}
                      setActivePaymentMethod={(value) =>
                        setActivePaymentMethod(value)
                      }
                      successOrderIds={successOrderIds}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="container-fluid p-0">
                <div className="row">
                  <div className="col-12">
                    <PriceDetailsCard
                      show_order_from={false}
                      productsQuote={productsQuote}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
