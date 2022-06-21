import React, { Fragment, useEffect, useState } from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import Navbar from "../../shared/navbar/navbar";
import styles from "../../../styles/cart/cartView.module.scss";
import PriceDetailsCard from "./price-details-card/priceDetailsCard";
import PaymentConfirmationCard from "./payment-method/paymentConfirmationCard";
import {
  checkout_steps,
  get_current_step,
} from "../../../constants/checkout-steps";
import { getValueFromCookie } from "../../../utils/cookies";
import { payment_methods } from "../../../constants/payment-methods";

export default function Checkout() {
  const location = useLocation();
  const [orderStatus, setOrderStatus] = useState("");
  const [activePaymentMethod, setActivePaymentMethod] = useState(
    payment_methods.COD
  );
  const { quote: productsQuote } = JSON.parse(
    getValueFromCookie("product-quote")
  );
  const [quote, setQuote] = useState({
    products: [],
    total_payable: 0,
  });

  // use this effect to handle callback from justpay
  useEffect(() => {
    if (location?.search) {
      let searchParams = new URLSearchParams(location.search);
      setOrderStatus(searchParams.get("status"));
      setActivePaymentMethod(payment_methods.JUSPAY);
    }
    fetchProductQuote();
    // eslint-disable-next-line
  }, [location]);

  // use this function to fetch the product quote
  function fetchProductQuote() {
    let products = [];
    let total_payable = 0;
    productsQuote?.forEach((data) => {
      data?.breakup?.forEach((quote) => {
        products = [
          ...products,
          { title: quote.title, price: quote.price.value },
        ];
      });
      total_payable = Math.round(total_payable + Number(data?.price?.value));
    });
    setQuote((prev) => ({
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
                  {" "}
                  <div className="col-12 pb-3">
                    <PaymentConfirmationCard
                      currentActiveStep={get_current_step(
                        checkout_steps.SELECT_PAYMENT_METHOD
                      )}
                      productsQuote={productsQuote}
                      orderStatus={orderStatus}
                      activePaymentMethod={activePaymentMethod}
                      setActivePaymentMethod={(value) =>
                        setActivePaymentMethod(value)
                      }
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
                      productsQuote={quote}
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
