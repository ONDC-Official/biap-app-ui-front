import React, { useState } from "react";
import axios from "axios";
import { search_types } from "../../../constants/searchTypes";
import styles from "../../../styles/search-product-modal/searchProductModal.module.scss";
import { buttonTypes } from "../../../utils/button";
import Button from "../../shared/button/button";
import { ONDC_COLORS } from "../../shared/colors";
import Dropdown from "../../shared/dropdown/dropdown";
import ErrorMessage from "../../shared/error-message/errorMessage";
import Loading from "../../shared/loading/loading";
import CrossIcon from "../../shared/svg/cross-icon";
import DropdonwSvg from "../../shared/svg/dropdonw";
import { debounce } from "../../../utils/search";

export default function SearchProductModal({
  onClose,
  onSearch,
  searchedLocation,
  setSearchedLocation,
}) {
  const [toggleLocationListCard, setToggleLocationListCard] = useState(false);
  const [search, setSearch] = useState({
    type: search_types.PRODUCT,
    value: "",
  });
  const [inlineError, setInlineError] = useState({
    location_error: "",
    search_error: "",
  });
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
  async function getAllLocations(query) {
    try {
      const { data } = await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&key=${API_KEY}`
      );
      const formattedLocations = data.predictions.map((location) => ({
        place_id: location.place_id,
        name: location.structured_formatting.main_text,
        description: location.structured_formatting.secondary_text,
      }));
      setLocations(formattedLocations);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function getPlaceFromPlaceId(location) {
    try {
      const { data } = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${location.place_id}&key=${API_KEY}`
      );
      setSearchedLocation({
        ...searchedLocation,
        name: data?.result?.formatted_address,
        lat: data?.result?.geometry.location.lat,
        lng: data?.result?.geometry.location.lng,
      });
      setToggleLocationListCard(false);
    } catch (err) {
      console.log(err);
    }
  }

  function onChange(event) {
    const searched_location = event.target.value.trim();
    setToggleLocationListCard(true);
    setSearchedLocation({
      ...searchedLocation,
      name: searched_location,
    });
    setInlineError((inlineError) => ({
      ...inlineError,
      location_error: "",
    }));
    setLoading(true);
    debounce(() => {
      // this check required so that when the input is cleared
      // we do not need to call the search driver api
      if (searched_location) {
        getAllLocations(searched_location);
        return;
      }
      setLocations([]);
      setLoading(false);
    }, 800)();
  }
  function checkLocation() {
    if (!searchedLocation) {
      setInlineError((error) => ({
        ...error,
        location_error: "Location cannot be empty",
      }));
      return false;
    }
    return true;
  }
  function checkSearch() {
    if (!search?.value) {
      setInlineError((error) => ({
        ...error,
        search_error: `${search?.type} cannot be empty`,
      }));
      return false;
    }
    return true;
  }

  function clearSearch() {
    setSearchedLocation({
      name: "",
      lat: "",
      lng: "",
    });
  }

  const loadingSpin = (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ height: "100px" }}
    >
      <Loading backgroundColor={ONDC_COLORS.ACCENTCOLOR} />
    </div>
  );

  return (
    <div className={styles.overlay}>
      <div className={styles.popup_card}>
        <div className="p-4 d-flex align-items-center">
          <p className={styles.modal_header}>Search Product</p>
          <div className="ms-auto">
            <CrossIcon
              width="20"
              height="20"
              color={ONDC_COLORS.SECONDARYCOLOR}
              style={{ cursor: "pointer" }}
              onClick={onClose}
            />
          </div>
        </div>
        <div className="p-4">
          <div className="pb-4" style={{ position: "relative" }}>
            <div
              className={`${styles.modal_input_wrappper} d-flex align-items-center`}
            >
              <input
                id="location"
                name="location"
                type="text"
                placeholder="Search Location"
                autoComplete="off"
                value={searchedLocation.name}
                onChange={(event) => onChange(event)}
                className={
                  inlineError.location_error ? styles.error : styles.formControl
                }
              />
              <div className="px-3">
                {searchedLocation ? (
                  <CrossIcon
                    width="20"
                    height="20"
                    color={ONDC_COLORS.SECONDARYCOLOR}
                    style={{ cursor: "pointer" }}
                    onClick={clearSearch}
                  />
                ) : (
                  <DropdonwSvg width="13" height="8" />
                )}
              </div>
            </div>
            {inlineError.location_error && (
              <ErrorMessage>{inlineError.location_error}</ErrorMessage>
            )}
            {toggleLocationListCard && (
              <div className={styles.location_list_wrapper}>
                {loading
                  ? loadingSpin
                  : // loop thorugh location here }
                    locations.map((location) => {
                      return (
                        <div
                          className={styles.dropdown_link_wrapper}
                          key={location.place_id}
                          onClick={() => {
                            getPlaceFromPlaceId(location);
                          }}
                        >
                          <p className={styles.dropdown_link}>
                            {location.name}
                          </p>
                          <p
                            className={styles.location_description}
                            style={{ color: ONDC_COLORS.SECONDARYCOLOR }}
                          >
                            {location.description}
                          </p>
                        </div>
                      );
                    })}
              </div>
            )}
          </div>
          <div className="pb-4">
            <div
              className={`${styles.modal_input_wrappper} d-flex align-items-center`}
            >
              <Dropdown
                header={
                  <div
                    className={`${styles.category_drodpwon_wrapper} d-flex align-items-center`}
                  >
                    <div className="px-2">
                      <p className={styles.search_type_text}>{search.type}</p>
                    </div>
                    <div className="px-2">
                      <DropdonwSvg
                        width="10"
                        height="7"
                        color={ONDC_COLORS.WHITE}
                      />
                    </div>
                  </div>
                }
                body_classes="dropdown-menu-right"
                click={(search_type) => {
                  setSearch((search) => ({
                    ...search,
                    type: search_type,
                    value: "",
                  }));
                }}
                options={Object.values(search_types).map((type) => ({
                  value: type,
                }))}
                show_icons={false}
              />
              <div className={styles.category_name_input_wrapper}>
                <input
                  id="search"
                  name="search"
                  type="text"
                  placeholder={`Search ${search.type}`}
                  autoComplete="off"
                  value={search.value}
                  onChange={(event) => {
                    const searchValue = event.target.value.trim();
                    setSearch((search) => ({
                      ...search,
                      value: searchValue,
                    }));
                    setInlineError((inlineError) => ({
                      ...inlineError,
                      search_error: "",
                    }));
                  }}
                  className={
                    inlineError.location_error
                      ? styles.error
                      : styles.formControl
                  }
                />
              </div>
            </div>
            {inlineError.search_error && (
              <ErrorMessage>{inlineError.search_error}</ErrorMessage>
            )}
          </div>
          <div className="py-3 text-center">
            <Button
              // isloading={signInUsingEmailAndPasswordloading ? 1 : 0}
              disabled={!searchedLocation || !search?.value}
              button_type={buttonTypes.primary}
              button_hover_type={buttonTypes.primary_hover}
              button_text="Search"
              onClick={() => onSearch({ search, location: searchedLocation })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
