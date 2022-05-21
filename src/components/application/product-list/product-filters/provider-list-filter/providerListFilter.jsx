import React, { useState } from "react";
import styles from "../../../../../styles/products/productFilters.module.scss";
import Checkbox from "../../../../shared/checkbox/checkbox";

export default function ProviderListFilter({
  providers,
  onUpdateProviderFilter,
}) {
  const [selectedProviders, setSelectedProviders] = useState([]);

  // use this function to check if the provider is already selected
  function isProviderSelected(id) {
    return (
      selectedProviders.filter(({ id: provider_id }) => provider_id === id)
        .length > 0
    );
  }

  // use this function to add provider in filter list
  function addProvider(provider) {
    setSelectedProviders([...selectedProviders, provider]);
    onUpdateProviderFilter([...selectedProviders, provider]);
  }

  // use this function to remove the selected provider from filter
  function removeProvider(provider) {
    setSelectedProviders(
      selectedProviders.filter(({ id }) => id !== provider.id)
    );
    onUpdateProviderFilter(
      selectedProviders.filter(({ id }) => id !== provider.id)
    );
  }

  return (
    <>
      <p className={styles.filter_label}>Providers</p>
      {providers.map((provider) => {
        return (
          <div key={provider.id}>
            <Checkbox
              id={provider.id}
              checked={isProviderSelected(provider.id)}
              onClick={() => {
                if (isProviderSelected(provider.id)) {
                  removeProvider(provider);
                  return;
                }
                addProvider(provider);
              }}
            >
              <p
                className={
                  isProviderSelected(provider.id)
                    ? styles.active_provider_name
                    : styles.provider_name
                }
              >
                {provider.name}
              </p>
            </Checkbox>
          </div>
        );
      })}
    </>
  );
}
