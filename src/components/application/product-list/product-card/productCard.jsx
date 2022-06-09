import React, { useContext, useEffect, useState } from "react";
import styles from "../../../../styles/products/productCard.module.scss";
import no_image_found from "../../../../assets/images/no_image_found.png";
import IndianRupee from "../../../shared/svg/indian-rupee";
import Subtract from "../../../shared/svg/subtract";
import Add from "../../../shared/svg/add";
import { CartContext } from "../../../../context/cartContext";
import { Link } from "react-router-dom";

export default function ProductCard(props) {
  const {
    product,
    price,
    bpp_id,
    location_id,
    bpp_provider_id,
    bpp_provider_descriptor,
  } = props;
  const { id, descriptor } = product;
  const {
    cartItems,
    onAddProduct,
    onAddQuantity,
    onReduceQuantity,
  } = useContext(CartContext);
  const { name: provider_name } = bpp_provider_descriptor;
  const { name: product_name, images } = descriptor;
  const [quantityCount, setQuantityCount] = useState(0);
  const [toggleAddToCart, setToggleAddToCart] = useState();
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
  return (
    <div
      className={`${styles.product_card_background} d-flex align-items-start`}
    >
      <div className={styles.product_img_container}>
        <img
          src={images?.length > 0 ? images[0] : no_image_found}
          alt={product_name}
          width="110"
          height="110"
          className={styles.product_img}
          onError={(event) => {
            event.target.onerror = null;
            event.target.src = no_image_found;
          }}
        />
      </div>
      <div className="px-3" style={{ flexBasis: "70%" }}>
        <div className={styles.product_name_and_description_wrapper}>
          <Link
            to={{
              pathname: `/application/products/${id}`,
              state: {
                product,
                price,
                bpp_provider_descriptor,
                bpp_provider_id,
                bpp_id,
                location_id,
              },
            }}
            className={styles.product_name}
            title={product_name}
          >
            {product_name}
          </Link>
          <p className={styles.ordered_from}>
            Ordering from <span className={styles.bold}>{provider_name}</span>
          </p>
        </div>
        <div className="d-flex align-items-center">
          <div className="d-flex align-items-center">
            <div className="pe-2">
              <IndianRupee width="10" height="14" />
            </div>
            <p className={styles.product_price}>{Math.round(price.value)}</p>
          </div>
          <div className="ms-auto">
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
                  <Subtract width="13" classes={styles.subtract_svg_color} />
                </div>
                <div className="d-flex align-items-center justify-content-center">
                  <p className={styles.quantity_count}>{quantityCount}</p>
                </div>
                <div
                  className={`${styles.add_svg_wrapper} d-flex align-items-center justify-content-center`}
                  onClick={() => {
                    setQuantityCount((quantityCount) => quantityCount + 1);
                    onAddQuantity(id);
                  }}
                >
                  <Add width="13" height="13" classes={styles.add_svg_color} />
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
  );
}
