import React, { useState } from "react";
import styles from "../../../../../styles/products/productFilters.module.scss";
import Checkbox from "../../../../shared/checkbox/checkbox";

export default function MultiAttributeFilter({
  filterAttributeName,
  filterAttributeArray,
  onUpdateAttributeFilter,
}) {
  const [selectedIds, setSelectedIds] = useState([]);

  // use this function to check if the provider is already selected
  function isProviderSelected(id) {
    return (
      selectedIds.filter(({ id: provider_id }) => provider_id === id).length > 0
    );
  }

  // use this function to add attribute in filter list
  function addProvider(attribute) {
    setSelectedIds([...selectedIds, attribute]);
    onUpdateAttributeFilter([...selectedIds, attribute]);
  }

  // use this function to remove the selected attribute from filter
  function removeProvider(attribute) {
    setSelectedIds(selectedIds.filter(({ id }) => id !== attribute.id));
    onUpdateAttributeFilter(
      selectedIds.filter(({ id }) => id !== attribute.id)
    );
  }

  return (
    <>
      <p className={styles.filter_label}>{filterAttributeName}</p>
      {filterAttributeArray.map((attribute) => {
        return (
          <div key={attribute.id}>
            <Checkbox
              id={attribute.id}
              checked={isProviderSelected(attribute.id)}
              onClick={() => {
                if (isProviderSelected(attribute.id)) {
                  removeProvider(attribute);
                  return;
                }
                addProvider(attribute);
              }}
            >
              <p
                className={
                  isProviderSelected(attribute.id)
                    ? styles.active_provider_name
                    : styles.provider_name
                }
              >
                {attribute.name}
              </p>
            </Checkbox>
          </div>
        );
      })}
    </>
  );
}
