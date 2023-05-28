import React, { Fragment, useContext } from "react";
import { useHistory } from "react-router-dom";
import { CartContext } from "../../../context/cartContext";
import styles from "../../../styles/cart/cartView.module.scss";
import { buttonTypes } from "../../shared/button/utils";
import { getSubTotal } from "./utils/getSubTotal";
import Button from "../../shared/button/button";
import { ONDC_COLORS } from "../../shared/colors";
import Navbar from "../../shared/navbar/navbar";
import IndianRupee from "../../shared/svg/indian-rupee";
import ProductCard from "../product-list/product-card/productCard";
import no_result_empty_illustration from "../../../assets/images/empty-state-illustration.svg";

export default function Cart() {
  const { cartItems } = useContext(CartContext);
  const history = useHistory();
  const empty_cart_state = (
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
          <p className={styles.illustration_header}>Your cart is empty</p>
          <p className={styles.illustration_body}>
            Looks like your shopping cart is empty, you can shop now by clicking on below button
          </p>
        </div>
        <div className="py-3">
          <Button
            button_type={buttonTypes.primary}
            button_hover_type={buttonTypes.primary_hover}
            button_text="Shop now"
            onClick={() => history.push("/application/")}
          />
        </div>
      </div>
    </div>
  );
  return (
    <Fragment>
      <Navbar />
      {cartItems.length <= 0 ? (
        empty_cart_state
      ) : (
        <div className={styles.playground_height}>
          <div className="container">
            <div className="row py-3">
              <div className="col-12">
                <p className={styles.cart_label}>Cart</p>
              </div>
            </div>
            <div className="row py-2">
              <div className="col-lg-8">
                <div className="container-fluid p-0">
                  <div className="row">
                    {cartItems.map(({ id, bpp_id, product, provider }) => {
                      const { locations } = provider;
                      return (
                        <div
                          className="col-lg-6 col-md-12 p-2"
                          key={id}
                          id={id}
                        >
                          <ProductCard
                            product={product}
                            price={product?.price}
                            bpp_provider_descriptor={{
                              name: product?.provider_details?.descriptor?.name,
                            }}
                            bpp_id={bpp_id}
                            location_id={locations ? locations[0] : ""}
                            bpp_provider_id={provider?.id}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="container-fluid p-0">
                  <div className="row">
                    <div className="col-12 p-2">
                      <div className={styles.price_summary_card}>
                        <div className={styles.card_header}>
                          <p className={styles.card_header_title}>
                            Price Details
                          </p>
                        </div>
                        <div className={styles.card_body}>
                          <div className="py-2 d-flex align-items-center">
                            <div className="pe-2">
                              <p className={styles.card_body_text}>
                                Items in cart({cartItems.length})
                              </p>
                            </div>
                            <div className="ms-auto d-flex align-items-center">
                              <div className="px-1">
                                <IndianRupee
                                  width="8"
                                  height="13"
                                  color={ONDC_COLORS.PRIMARYCOLOR}
                                />
                              </div>
                              <p className={styles.sub_total_text}>
                                {getSubTotal(cartItems)}
                              </p>
                            </div>
                          </div>
                          <div className="pt-4 text-center">
                            <Button
                              button_type={buttonTypes.primary}
                              button_hover_type={buttonTypes.primary_hover}
                              button_text="Checkout"
                              onClick={() =>
                                history.push("/application/initialize")
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}
