import React, { useState } from "react";
import styles from "../../../../styles/products/productFilters.module.scss";
import CrossIcon from "../../../shared/svg/cross-icon";
import { ONDC_COLORS } from "../../../shared/colors";
import Loading from "../../../shared/loading/loading";
import PriceRange from "./price-range-filter/priceRange";
import ProviderListFilter from "./provider-list-filter/providerListFilter";

export default function ProductFilters({
  messageId,
  fetchFilterLoading,
  filters,
  onCloseFilter = () => {},
  onUpdateFilters,
}) {
  const [productFilters, setProductFilters] = useState({});
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
    // update parent
    onUpdateFilters({
      ...productFilters,
      messageId,
      minPrice: productFilters?.minPrice,
      maxPrice: productFilters?.maxPrice,
      providers: productFilters?.providers,
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
              resetError={() => resetError()}
              onUpdatePriceRange={({ minValue, maxValue }) => {
                setProductFilters({
                  ...productFilters,
                  messageId,
                  minPrice: minValue,
                  maxPrice: maxValue,
                });
              }}
            />
          </div>
          {filters?.providers?.length > 0 && (
            <div className="py-2">
              <ProviderListFilter
                providers={filters?.providers}
                onUpdateProviderFilter={(selectedProviders) => {
                  setProductFilters({
                    ...productFilters,
                    messageId,
                    providers: selectedProviders,
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
