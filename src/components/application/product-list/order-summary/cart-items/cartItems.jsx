import React, { useContext } from "react";
import { CartContext } from "../../../../../context/cartContext";
import CrossIcon from "../../../../shared/svg/cross-icon";
import cartItemStyles from "../../../../../styles/products/cartItemsOrderSummary.module.scss";
import styles from "../../../../../styles/products/productCard.module.scss";
import no_image_found from "../../../../../assets/images/no_image_found.png";
import { ONDC_COLORS } from "../../../../shared/colors";
import IndianRupee from "../../../../shared/svg/indian-rupee";
import Subtract from "../../../../shared/svg/subtract";
import Add from "../../../../shared/svg/add";

export default function CartItems(props) {
  const { onClose } = props;
  const { cartItems, onAddQuantity, onReduceQuantity, onRemoveProduct } =
    useContext(CartContext);
  return (
    <div className={cartItemStyles.cart_items_order_summary_wrapper}>
      <div className="container">
        <div className="row">
          <div className="d-flex align-items-center py-3">
            <p className={cartItemStyles.label}>Cart</p>
            <div className="ms-auto">
              <CrossIcon
                width="25"
                height="25"
                style={{ cursor: "pointer" }}
                color={ONDC_COLORS.SECONDARYCOLOR}
                onClick={onClose}
              />
            </div>
          </div>
        </div>
        <div className={`row ${cartItemStyles.items_wrapper}`}>
          {cartItems.map((item) => {
            const { product, id, quantity, provider } = item;
            return (
              <div className="col-lg-4 col-md-6 col-sm-6 p-2" key={id}>
                <div
                  className={`${cartItemStyles.product_card} d-flex align-items-start`}
                  style={{ position: "relative" }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      cursor: "pointer",
                    }}
                    onClick={() => onRemoveProduct(id)}
                  >
                    <CrossIcon
                      width="20"
                      height="20"
                      color={ONDC_COLORS.SECONDARYCOLOR}
                    />
                  </div>
                  <div className="px-2">
                    {/* PRODUCT IMAGE  */}
                    <div className={styles.product_img_container}>
                      <img
                        src={product.descriptor.images[0] ?? no_image_found}
                        alt={product.descriptor.name}
                        className={styles.product_img}
                        onError={(event) => {
                          event.target.onerror = null;
                          event.target.src = no_image_found;
                        }}
                      />
                    </div>
                    {/* REMOVE PRODUCT  */}
                    {/* <p
                      className={styles.remove_product_text}
                      onClick={() => onRemoveProduct(id)}
                    >
                      remove
                    </p> */}
                  </div>
                  <div className="px-2 flex-grow-1">
                    {/* PRODUCT DESCRIPTION  */}
                    <div
                      className={styles.product_name_and_description_wrapper}
                    >
                      <p
                        className={styles.product_name}
                        title={product.descriptor.name}
                      >
                        {product.descriptor.name}
                      </p>
                      <p className={styles.ordered_from}>
                        Ordering from{" "}
                        <span className={styles.bold}>{provider.name}</span>
                      </p>
                    </div>
                    <div className="d-flex align-items-center">
                      <div className="d-flex align-items-center">
                        <div className="pe-2">
                          <IndianRupee width="10" height="14" />
                        </div>
                        <p className={styles.product_price}>
                          {product.price.value}
                        </p>
                      </div>
                      <div className="ms-auto">
                        <div className={styles.quantity_count_wrapper}>
                          <div
                            className={`${styles.subtract_svg_wrapper} d-flex align-items-center justify-content-center`}
                            onClick={() => {
                              onReduceQuantity(id);
                            }}
                          >
                            <Subtract
                              width="13"
                              classes={styles.subtract_svg_color}
                            />
                          </div>
                          <div className="d-flex align-items-center justify-content-center">
                            <p className={styles.quantity_count}>
                              {quantity.count}
                            </p>
                          </div>
                          <div
                            className={`${styles.add_svg_wrapper} d-flex align-items-center justify-content-center`}
                            onClick={() => {
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
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
