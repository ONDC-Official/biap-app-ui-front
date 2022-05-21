import React, { useState, useRef, useEffect } from "react";
import styles from "../../../../../styles/products/productFilters.module.scss";

export default function PriceRange({
  onUpdatePriceRange,
  error,
  resetError,
  MINIMUM_FILTER_VALUE,
  MAXIMUM_FILTER_VALUE,
}) {
  const [minValue, setMinValue] = useState(MINIMUM_FILTER_VALUE);
  const [maxValue, setMaxValue] = useState(MAXIMUM_FILTER_VALUE);
  const progressRef = useRef(null);

  useEffect(() => {
    if (progressRef?.current) {
      // how much to fill from left side
      let progressLeftStyle = `${Math.round(
        (Number(minValue) / MAXIMUM_FILTER_VALUE) * 100
      )}%`;
      // how much to fill from right side
      let progressRightStyle = `${Math.round(
        100 - (Number(maxValue) / MAXIMUM_FILTER_VALUE) * 100
      )}%`;
      progressRef.current.style.left = progressLeftStyle;
      progressRef.current.style.right = progressRightStyle;
    }
  }, [minValue, maxValue, MAXIMUM_FILTER_VALUE]);

  // use this function to reset to default state if any error occured.
  function resetToDefaultState() {
    setMinValue(() => MINIMUM_FILTER_VALUE);
    setMaxValue(() => MAXIMUM_FILTER_VALUE);
  }

  // use this function to change the min value
  function onChangeMinValue(event) {
    const value = Number(event.target.value);
    if (Number.isNaN(value)) {
      return;
    }
    if (value < MINIMUM_FILTER_VALUE || value > MAXIMUM_FILTER_VALUE) {
      resetToDefaultState();
      return;
    }
    resetError();
    setMinValue(() => value);
    onUpdatePriceRange({ minValue: value, maxValue });
  }

  // use this function to change the max value
  function onChangeMaxValue(event) {
    const value = Number(event.target.value);
    if (Number.isNaN(value)) {
      return;
    }
    if (value < MINIMUM_FILTER_VALUE || value > MAXIMUM_FILTER_VALUE) {
      resetToDefaultState();
      return;
    }
    resetError();
    setMaxValue(() => value);
    onUpdatePriceRange({ minValue, maxValue: value });
  }

  return (
    <>
      <p className={styles.filter_label}>Price Range</p>
      <div className="d-flex align-items-center pb-2">
        <div className="flex-fill pe-2">
          <label htmlFor="min" className={styles.min_and_max_input_label}>
            Min
          </label>
          <input
            type="text"
            pattern="[0-9]"
            className={styles.range_input_box}
            value={minValue}
            onClick={(event) => event.target.select()}
            onChange={(event) => onChangeMinValue(event)}
          />
        </div>
        <div className="flex-fill pe-2">
          <label htmlFor="min" className={styles.min_and_max_input_label}>
            Max
          </label>
          <input
            type="text"
            pattern="[0-9]"
            className={styles.range_input_box}
            value={maxValue}
            onClick={(event) => event.target.select()}
            onChange={(event) => onChangeMaxValue(event)}
          />
        </div>
      </div>
      <div className="py-2">
        <div className={styles.slider}>
          <div className={styles.progress} ref={progressRef}></div>
        </div>
        <div className={styles.range_input}>
          <input
            type="range"
            className={styles.range_min}
            min={MINIMUM_FILTER_VALUE}
            max={MAXIMUM_FILTER_VALUE}
            value={minValue}
            onChange={(event) => onChangeMinValue(event)}
          />
          <input
            type="range"
            className={styles.range_max}
            min={MINIMUM_FILTER_VALUE}
            max={MAXIMUM_FILTER_VALUE}
            value={maxValue}
            onChange={(event) => onChangeMaxValue(event)}
          />
        </div>
      </div>
      {error.minValueError && (
        <p className={styles.error_message}>{error.minValueError}</p>
      )}
      {error.maxValueError && (
        <p className={styles.error_message}>{error.maxValueError}</p>
      )}
    </>
  );
}
