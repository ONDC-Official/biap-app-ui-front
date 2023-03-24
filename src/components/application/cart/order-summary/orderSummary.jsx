import React, { Fragment, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { CartContext } from "../../../../context/cartContext";
import styles from "../../../../styles/products/orderSummary.module.scss";
import modalStyles from "../../../../styles/search-product-modal/searchProductModal.module.scss";
import { buttonTypes } from "../../../shared/button/utils";
import { getSubTotal } from "../utils/getSubTotal";
import Button from "../../../shared/button/button";
import { ONDC_COLORS } from "../../../shared/colors";
import DropdownSvg from "../../../shared/svg/dropdonw";
import IndianRupee from "../../../shared/svg/indian-rupee";
import CrossIcon from "../../../shared/svg/cross-icon";
import CartItems from "./cart-items/cartItems";

export default function OrderSummary() {
  const { cartItems, setCartItems } = useContext(CartContext);
  const history = useHistory();
  const [toggleCollapse, setToggleCollapse] = useState(false);
  const [toggleClearCartModal, setToggleClearCartModal] = useState(false);

  return (
    <Fragment>
      <div className={`${styles.order_summary_background}`}>
        <div className="container h-100">
          <div className="row align-items-center h-100">
            <div className="col-xl-8 col-md-6 d-flex align-items-center">
              <div className="px-1">
                <div
                  className={styles.collapse_button_wrapper}
                  onClick={() => setToggleCollapse(!toggleCollapse)}
                >
                  {toggleCollapse ? (
                    <div
                      style={{
                        transform: "rotate(180deg)",
                        transition: "transform 0.7s",
                      }}
                    >
                      <DropdownSvg
                        width="15"
                        height="15"
                        color={ONDC_COLORS.WHITE}
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        transform: "rotate(0)",
                        transition: "transform 0.7s",
                      }}
                    >
                      <DropdownSvg
                        width="15"
                        height="15"
                        color={ONDC_COLORS.WHITE}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="px-2">
                <p className={styles.total_items_in_cart_text}>
                  Items in cart ({cartItems.length})
                </p>
              </div>
              <div className="ms-auto">
                <p className={styles.sub_total_text}>
                  SubTotal:
                  <span className="ps-2 pe-1">
                    <IndianRupee
                      height="13"
                      width="8"
                      color={ONDC_COLORS.PRIMARYCOLOR}
                    />
                  </span>
                  <span>{getSubTotal(cartItems)}</span>
                </p>
              </div>
            </div>
            <div
              className={`col-xl-4 col-md-6 d-flex align-items-center ${styles.checkout_button_placement}`}
            >
              <div className="pe-3">
                <Button
                  button_type={buttonTypes.secondary}
                  button_hover_type={buttonTypes.secondary_hover}
                  button_text="Clear Cart"
                  onClick={() => setToggleClearCartModal(true)}
                />
              </div>
              <div className="pe-3">
                <Button
                  button_type={buttonTypes.primary}
                  button_hover_type={buttonTypes.primary_hover}
                  button_text="Checkout"
                  onClick={() => history.push("/application/initialize")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {toggleCollapse && (
        <CartItems onClose={() => setToggleCollapse(!toggleCollapse)} />
      )}

      {
        toggleClearCartModal && (
          <div className={modalStyles.overlay}>
            <div className={modalStyles.popup_card} style={{ minWidth: "auto !important" }}>
              <div className={`${modalStyles.card_header} d-flex align-items-center`}>
                <p className={modalStyles.card_header_title}>
                  Clear Cart
                </p>
                <div className="ms-auto">
                  <CrossIcon
                    width="20"
                    height="20"
                    color={ONDC_COLORS.SECONDARYCOLOR}
                    style={{ cursor: "pointer" }}
                    onClick={() => setToggleClearCartModal(false)}
                  />
                </div>
              </div>
              <div className={modalStyles.card_body}>
                <div className={`container-fluid pt-2`}>
                  <p>Do you really want to clear the cart?</p>
                </div>
              </div>
              <div
                className={`${modalStyles.card_footer} d-flex align-items-center justify-content-center`}
              >
                <Button
                  button_type={buttonTypes.secondary}
                  button_hover_type={buttonTypes.secondary_hover}
                  button_text="Cancel"
                  onClick={() => setToggleClearCartModal(false)}
                />
                <Button
                  button_type={buttonTypes.primary}
                  button_hover_type={buttonTypes.primary_hover}
                  button_text="Clear"
                  onClick={() => setCartItems([])}
                />
              </div>
            </div>
          </div>
        )
      }
    </Fragment>
  );
}
