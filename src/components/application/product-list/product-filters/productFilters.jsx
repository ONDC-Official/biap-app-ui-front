import React from "react";
import styles from "../../../../styles/products/productFilters.module.scss";
import CrossIcon from "../../../shared/svg/cross-icon";
import { ONDC_COLORS } from "../../../shared/colors";

export default function ProductFilters({ onCloseFilter = () => {} }) {
  return (
    <div className={styles.filter_and_sort_wrapper}>
      <div className="d-flex align-items-center">
        <p className={styles.card_heading}>Filters</p>
        <div className="ms-auto d-sm-block d-lg-none">
          <CrossIcon
            width="15"
            height="15"
            color={ONDC_COLORS.SECONDARYCOLOR}
            style={{ cursor: "pointer" }}
            onClick={onCloseFilter}
          />
        </div>
      </div>
    </div>
  );
}
