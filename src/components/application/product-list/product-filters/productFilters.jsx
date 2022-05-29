import React, { useState } from "react";
import styles from "../../../../styles/products/productFilters.module.scss";
import CrossIcon from "../../../shared/svg/cross-icon";
import { ONDC_COLORS } from "../../../shared/colors";
import Loading from "../../../shared/loading/loading";
import PriceRange from "./price-range-filter/priceRange";
import MultiAttributeFilter from "./multi-attribute-filter/multiAttributeFilter";
import { AddCookie } from "../../../../utils/cookies";

export default function ProductFilters({
  selectedFilters,
  messageId,
  fetchFilterLoading,
  filters,
  onCloseFilter = () => {},
  onUpdateFilters,
}) {
  const MINIMUM_FILTER_VALUE = 0;
  const MAXIMUM_FILTER_VALUE = 100000;
  const [productFilters, setProductFilters] = useState(selectedFilters);
  const [error, setError] = useState({
    minValueError: "",
    maxValueError: "",
  });

  // use this function to reset the errors
  function resetError() {
    setError({
      minValueError: "",
      maxValueError: "",
    });
  }

  // basic checking of min and max value and updating the parent.
  function handleSearchFilter() {
    // check if the max value entered is less than min value
    if (productFilters?.maxPrice < productFilters?.minPrice) {
      setError({
        maxValueError: `max value cannot be less than ${productFilters?.minPrice}`,
      });
      return;
    }
    resetError();
    AddCookie("product_filters", JSON.stringify(productFilters));
    // update parent
    onUpdateFilters({
      ...productFilters,
      messageId,
      minPrice: productFilters?.minPrice,
      maxPrice: productFilters?.maxPrice,
      providers: productFilters?.providers,
      categories: productFilters?.categories,
      fulfillments: productFilters?.fulfillments,
    });
  }

  function renderFilters() {
    if (fetchFilterLoading) {
      return (
        <div
          className={`${styles.filter_and_sort_wrapper} d-flex align-items-center justify-content-center`}
        >
          <Loading backgroundColor={ONDC_COLORS.ACCENTCOLOR} />
        </div>
      );
    }
    return (
      <div className={styles.filter_and_sort_wrapper}>
        <div className={styles.header_area}>
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
        <div className={styles.playground_area}>
          <div className="py-2">
            <PriceRange
              error={error}
              selectedMaxValue={productFilters?.maxPrice}
              selectedMinValue={productFilters?.minPrice}
              MAXIMUM_FILTER_VALUE={MAXIMUM_FILTER_VALUE}
              MINIMUM_FILTER_VALUE={MINIMUM_FILTER_VALUE}
              resetError={() => resetError()}
              onUpdatePriceRange={({ minValue, maxValue }) => {
                setProductFilters({
                  ...productFilters,
                  minPrice: minValue,
                  maxPrice: maxValue,
                });
              }}
            />
          </div>
          {filters?.providers?.length > 0 && (
            <div className="py-2">
              <MultiAttributeFilter
                filterAttributeName="Providers"
                filterAttributeArray={filters?.providers}
                selectedAttributes={selectedFilters.providers}
                onUpdateAttributeFilter={(selectedProviders) => {
                  setProductFilters({
                    ...productFilters,
                    providers: selectedProviders,
                  });
                }}
              />
            </div>
          )}
          {filters?.categories?.length > 0 && (
            <div className="py-2">
              <MultiAttributeFilter
                filterAttributeName="Categories"
                filterAttributeArray={filters?.categories}
                selectedAttributes={selectedFilters.categories}
                onUpdateAttributeFilter={(selectedCategories) => {
                  setProductFilters({
                    ...productFilters,
                    categories: selectedCategories,
                  });
                }}
              />
            </div>
          )}
          {filters?.fulfillment?.length > 0 && (
            <div className="py-2">
              <MultiAttributeFilter
                filterAttributeName="FullFillments"
                filterAttributeArray={filters?.fulfillment}
                selectedAttributes={selectedFilters.fulfillment}
                onUpdateAttributeFilter={(selectedFulfillments) => {
                  setProductFilters({
                    ...productFilters,
                    fulfillments: selectedFulfillments,
                  });
                }}
              />
            </div>
          )}
        </div>
        <div className={`${styles.action_area} justify-content-center`}>
          <button className={styles.apply_filter} onClick={handleSearchFilter}>
            Apply Filter
          </button>
        </div>
      </div>
    );
  }

  return renderFilters();
}
