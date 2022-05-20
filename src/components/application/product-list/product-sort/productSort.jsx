import React, { useState } from "react";
import styles from "../../../../styles/search-product-modal/searchProductModal.module.scss";
import Dropdown from "../../../shared/dropdown/dropdown";
import DropdownSvg from "../../../shared/svg/dropdonw";
import { ONDC_COLORS } from "../../../shared/colors";

export default function ProductSort() {
  const SORT_OPTIONS = [
    {
      key: "price_low_to_high",
      sortField: "price",
      sortOrder: "asc",
      name: "Price Low To High",
    },
    {
      key: "price_high_to_low",
      sortField: "price",
      sortOrder: "desc",
      name: "Price High To Low",
    },
    {
      key: "rating_low_to_high",
      sortField: "rating",
      sortOrder: "asc",
      name: "Rating Low To High",
    },
    {
      key: "rating_high_to_low",
      sortField: "rating",
      sortOrder: "desc",
      name: "Rating High To Low",
    },
  ];
  const [sortType, setSortType] = useState("");
  return (
    <Dropdown
      header={
        <div
          className={`${styles.category_drodpwon_wrapper} d-flex align-items-center`}
        >
          <div className="px-2">
            <p className={styles.search_type_text}>
              {sortType ? sortType : "Sort Products"}
            </p>
          </div>
          <div className="px-2">
            <DropdownSvg width="10" height="7" color={ONDC_COLORS.WHITE} />
          </div>
        </div>
      }
      body_classes="dropdown-menu-right"
      style={{ width: "100%", minWidth: "200px" }}
      click={(sort_type) => {
        setSortType(sort_type);
      }}
      options={SORT_OPTIONS.map(({ name }) => ({
        value: name,
      }))}
      show_icons={false}
    />
  );
}
