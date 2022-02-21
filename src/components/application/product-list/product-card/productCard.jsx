import React from "react";
import styles from "../../../../styles/products/productCard.module.scss";
import no_image_found from "../../../../assets/images/no_image_found.png";
import IndianRupee from "../../../shared/svg/indian-rupee";

export default function ProductCard(props) {
  const {
    product,
    bpp_id,
    location_id,
    bpp_provider_id,
    bpp_descriptor,
    bpp_provider_descriptor,
  } = props;
  const { id, descriptor, price } = product;
  const { name: provider_name } = bpp_provider_descriptor;
  const { name: product_name, images } = descriptor;
  return (
    <div
      className={`${styles.product_card_background} d-flex align-items-start`}
    >
      <div className={styles.product_img_container}>
        <img
          src={images?.length > 0 ? images[0] : no_image_found}
          alt={product_name}
          className={styles.product_img}
          onError={(event) => {
            event.target.onerror = null;
            event.target.src = no_image_found;
          }}
        />
      </div>
      <div className="px-3 flex-grow-1">
        <div className={styles.product_name_and_description_wrapper}>
          <p className={styles.product_name} title={product_name}>
            {product_name}
          </p>
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
            <button className={styles.add_to_cart_button}>Add</button>
          </div>
        </div>
      </div>
    </div>
  );
}
