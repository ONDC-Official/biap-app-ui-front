import React from "react";
import { usePagination, DOTS } from "./usePagination";
import DropdonwSvg from "../svg/dropdonw";
import styles from "./pagination.module.scss";
import { ONDC_COLORS } from "../colors";

export default function Pagination({
  onPageChange,
  totalCount,
  siblingCount = 1,
  currentPage,
  pageSize,
  className = "",
}) {
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  let lastPage = paginationRange[paginationRange.length - 1];
  return (
    <ul className={`d-flex align-items-center ${className}`}>
      <div className="px-1">
        <li
          className={currentPage === 1 ? styles.disabled : styles.page_anchor}
          onClick={onPrevious}
        >
          <div className={styles.arrow_left}>
            <DropdonwSvg
              width="11"
              height="8"
              color={ONDC_COLORS.ACCENTCOLOR}
            />
          </div>
        </li>
      </div>
      <div className="px-1 d-flex align-items-center">
        {paginationRange.map((pageNumber) => {
          if (pageNumber === DOTS) {
            return (
              <div className="px-2">
                <li className="pagination-item dots">&#8230;</li>
              </div>
            );
          }

          return (
            <div className="px-1">
              <li
                className={
                  currentPage === pageNumber
                    ? styles.active_page
                    : styles.page_wrapper
                }
                onClick={() => onPageChange(pageNumber)}
              >
                <p className={`mb-0 ${styles.page_number}`}>{pageNumber}</p>
              </li>
            </div>
          );
        })}
      </div>
      <div className="px-1">
        <li
          className={
            currentPage === lastPage ? styles.disabled : styles.page_anchor
          }
          onClick={onNext}
        >
          <div className={styles.arrow_right}>
            <DropdonwSvg
              width="11"
              height="8"
              color={ONDC_COLORS.ACCENTCOLOR}
            />
          </div>
        </li>
      </div>
    </ul>
  );
}
