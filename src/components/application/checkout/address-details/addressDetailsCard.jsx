import React from "react";
import { buttonTypes } from "../../../../utils/button";
import styles from "../../../../styles/cart/cartView.module.scss";
import Button from "../../../shared/button/button";
import { ONDC_COLORS } from "../../../shared/colors";

export default function AddressDetailsCard() {
  return (
    <div className={styles.price_summary_card}>
      <div className={styles.card_header}>
        <p className={styles.card_header_title}>Address</p>
      </div>
      <div className={styles.card_body}>
        {/* delivery address list card */}
        delivery address card
        <hr style={{ background: ONDC_COLORS.SECONDARYCOLOR }} />
        {/* billing address list card */}
        delBillingivery address card
      </div>
      <div
        className={`${styles.card_footer} d-flex align-items-center justify-content-center`}
      >
        <Button
          button_type={buttonTypes.primary}
          button_hover_type={buttonTypes.primary_hover}
          button_text="Proceed"
          onClick={() => console.log("will proceed ahead")}
        />
      </div>
    </div>
  );
}
