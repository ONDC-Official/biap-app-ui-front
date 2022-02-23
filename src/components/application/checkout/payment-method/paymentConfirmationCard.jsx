import React from "react";
import { buttonTypes } from "../../../../utils/button";
import styles from "../../../../styles/cart/cartView.module.scss";
import Button from "../../../shared/button/button";

export default function PaymentConfirmationCard() {
  return (
    <div className={styles.price_summary_card}>
      <div className={styles.card_header}>
        <p className={styles.card_header_title}>Payment Options</p>
      </div>
      <div className={styles.card_body}>
        {/* payment optios list will come here */}
        payment optios list will come here
      </div>
      <div
        className={`${styles.card_footer} d-flex align-items-center justify-content-center`}
      >
        <Button
          button_type={buttonTypes.primary}
          button_hover_type={buttonTypes.primary_hover}
          button_text="Checkout"
          onClick={() => console.log("will checkout here")}
        />
      </div>
    </div>
  );
}
