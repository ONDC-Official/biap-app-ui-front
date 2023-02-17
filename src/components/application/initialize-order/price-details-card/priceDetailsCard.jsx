import React from "react";
import styles from "../../../../styles/cart/cartView.module.scss";
import { ONDC_COLORS } from "../../../shared/colors";
import Loading from "../../../shared/loading/loading";
import IndianRupee from "../../../shared/svg/indian-rupee";

export default function PriceDetailsCard(props) {
  const {
    productsQuote,
    show_order_from = true,
    totalLabel = "Total Payable",
    updateCartLoading = false,
  } = props;

  return (
    <div className={styles.price_summary_card}>
      <div className={styles.card_header}>
        <p className={styles.card_header_title}>Price Details</p>
      </div>
      {updateCartLoading ? (
        <div
          style={{ height: "150px" }}
          className="d-flex align-items-center justify-content-center"
        >
          <Loading backgroundColor={ONDC_COLORS.ACCENTCOLOR} />
        </div>
      ) : (
        <>
          <div className={styles.card_body}>
            {productsQuote?.providers
              .map((provider, index) => (
                <div className={styles.provider} key={`${provider.name}${index}`}>
                  <div>{provider.name}</div>
                  {provider.products.filter((quote) => quote?.title !== "").map((quote, index) => (
                    <div
                      className="py-2 d-flex align-items-center"
                      key={`quote-item-${index}`}
                    >
                      <div className="pe-2 flex-grow-1">
                        {quote?.title && (
                          <p className={`${styles.product_name} ${quote.textClass}`}>{quote?.title}</p>
                        )}
                        <p className={`${styles.ordered_from} ${quote.textClass}`}>
                          {quote.quantityMessage}
                        </p>
                      </div>
                      {quote?.price && (
                        <div className="ms-auto d-flex align-items-center">
                          <div className="px-1">
                            <IndianRupee
                              width="8"
                              height="13"
                              color={ONDC_COLORS.PRIMARYCOLOR}
                            />
                          </div>
                          <p className={`${styles.sub_total_text} ${quote.textClass}`}>{quote?.price}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  {provider.error && (
                    <p className={styles.error}>{provider.error}</p>
                  )}
                </div>
              ))}
          </div>
          <div className={`${styles.card_footer} d-flex align-items-center`}>
            <p className={styles.card_body_text}>{totalLabel}</p>
            <div className="ms-auto d-flex align-items-center">
              <div className="px-1">
                <IndianRupee
                  width="8"
                  height="13"
                  color={ONDC_COLORS.PRIMARYCOLOR}
                />
              </div>
              <p className={styles.sub_total_text}>
                {productsQuote?.total_payable}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
