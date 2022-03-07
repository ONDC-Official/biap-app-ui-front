import React from "react";
import styles from "../../../../styles/cart/cartView.module.scss";
import { ONDC_COLORS } from "../../../shared/colors";
import IndianRupee from "../../../shared/svg/indian-rupee";

export default function PriceDetailsCard(props) {
  const { productsQuote } = props;

  function getTotalPayable(products) {
    let sum = 0;
    products.forEach((product) => {
      return (sum += Number(product.price));
    });
    return sum;
  }

  return (
    <div className={styles.price_summary_card}>
      <div className={styles.card_header}>
        <p className={styles.card_header_title}>Price Details</p>
      </div>
      <div className={styles.card_body}>
        {productsQuote.products.map((quote, index) => {
          return (
            <div
              className="py-2 d-flex align-items-center"
              key={`quote-item-${index}`}
            >
              <div className="pe-2">
                <p className={styles.product_name}>{quote.title}</p>
                <p className={styles.ordered_from}>
                  Ordering from
                  <span className={`px-2 ${styles.bold}`}>
                    {quote.provided_by}
                  </span>
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
                <p className={styles.sub_total_text}>{quote.price}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className={`${styles.card_footer} d-flex align-items-center`}>
        <p className={styles.card_body_text}>Total Payable</p>
        <div className="ms-auto d-flex align-items-center">
          <div className="px-1">
            <IndianRupee
              width="8"
              height="13"
              color={ONDC_COLORS.PRIMARYCOLOR}
            />
          </div>
          <p className={styles.sub_total_text}>{productsQuote.total_payable}</p>
        </div>
      </div>
    </div>
  );
}
