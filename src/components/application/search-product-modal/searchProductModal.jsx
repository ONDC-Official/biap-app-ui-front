import React, { useEffect, useState } from "react";
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
import { postCall } from "../../../api/axios";
import Cookies from "js-cookie";

export default function SearchProductModal({ onClose, onSearch }) {
  const [searchedLocation, setSearchedLocation] = useState({
    name: "",
    lat: "",
    lng: "",
  });
  const [toggleLocationListCard, setToggleLocationListCard] = useState(false);
  const [search, setSearch] = useState({
    type: search_types.PRODUCT,
    value: "",
  });
  const [inlineError, setInlineError] = useState({
    location_error: "",
    search_error: "",
  });
  const [searchedLocationLoading, setSearchLocationLoading] = useState(false);
  const [searchProductLoading, setSearchProductLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

  useEffect(() => {
    return () => {
      setSearchLocationLoading(false);
      setSearchProductLoading(false);
    };
  }, []);

  // get all the suggested location api
  async function getAllLocations(query) {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}maps/api/place/autocomplete/json?input=${query}&key=${API_KEY}`
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
      setSearchLocationLoading(false);
    }
  }

  // get the lat and long of a place
  async function getPlaceFromPlaceId(location) {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}maps/api/place/details/json?place_id=${location.place_id}&key=${API_KEY}`
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

  async function searchProduct() {
    const allCheckPassed = [checkLocation(), checkSearch()].every(Boolean);
    if (!allCheckPassed) {
      return;
    }
    setSearchProductLoading(true);
    try {
      const { context } = await postCall("/client/v1/search", {
        context: {},
        message: {
          criteria: {
            search_string: search.value,
            delivery_location: `${searchedLocation.lat},${searchedLocation.lng}`,
          },
        },
      });
      // generating context for search
      const search_context = {
        search,
        location: searchedLocation,
        message_id: context.message_id,
      };
      // stroing transaction_id in cookie;
      const cookie_expiry_time = new Date();
      cookie_expiry_time.setTime(cookie_expiry_time.getTime() + 3600 * 1000); // expires in 1 hour
      Cookies.set("transaction_id", context.transaction_id, {
        expires: cookie_expiry_time,
      });
      Cookies.set("search_context", JSON.stringify(search_context), {
        expires: cookie_expiry_time,
      });
      onSearch(search_context);
    } catch (err) {
      console.log(err);
    } finally {
      setSearchProductLoading(false);
    }
  }

  // on change when input is change for location
  function onChange(event) {
    const searched_location = event.target.value;
    setToggleLocationListCard(true);
    setSearchedLocation({
      ...searchedLocation,
      name: searched_location,
    });
    setInlineError((inlineError) => ({
      ...inlineError,
      location_error: "",
    }));
    setSearchLocationLoading(true);
    debounce(() => {
      // this check required so that when the input is cleared
      // we do not need to call the search location api
      if (searched_location.trim()) {
        getAllLocations(searched_location.trim());
        return;
      }
      setLocations([]);
      setSearchLocationLoading(false);
    }, 800)();
  }

  // use this function to validate the location value
  function checkLocation() {
    if (!searchedLocation.name) {
      setInlineError((error) => ({
        ...error,
        location_error: "Location cannot be empty",
      }));
      return false;
    }
    return true;
  }

  // use this function to validate the search value
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
        <div className={`${styles.card_header} d-flex align-items-center`}>
          <p className={styles.card_header_title}>Search Product</p>
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
        <div className={styles.card_body}>
          <div className="py-3" style={{ position: "relative" }}>
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
                onBlur={checkLocation}
                className={styles.formControl}
              />
              <div className="px-3">
                {searchedLocation.name !== "" ? (
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
            {toggleLocationListCard && searchedLocation.name !== "" && (
              <div className={styles.location_list_wrapper}>
                {searchedLocationLoading ? (
                  loadingSpin
                ) : // loop thorugh location here }
                locations.length > 0 ? (
                  locations.map((location) => {
                    return (
                      <div
                        className={styles.dropdown_link_wrapper}
                        key={location.place_id}
                        onClick={() => {
                          getPlaceFromPlaceId(location);
                        }}
                      >
                        <p className={styles.dropdown_link}>{location.name}</p>
                        <p
                          className={styles.location_description}
                          style={{ color: ONDC_COLORS.SECONDARYCOLOR }}
                        >
                          {location.description}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <div
                    style={{ height: "100px" }}
                    className="d-flex align-items-center justify-content-center"
                  >
                    <p className={styles.empty_state_text}>
                      No Location found <br /> Please double check your search
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="py-3">
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
                  onBlur={checkSearch}
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
                  className={styles.formControl}
                />
              </div>
            </div>
            {inlineError.search_error && (
              <ErrorMessage>{inlineError.search_error}</ErrorMessage>
            )}
          </div>
        </div>
        <div
          className={`${styles.card_footer} d-flex align-items-center justify-content-center`}
        >
          <Button
            isloading={searchProductLoading ? 1 : 0}
            disabled={
              !searchedLocation.name || !search?.value || searchProductLoading
            }
            button_type={buttonTypes.primary}
            button_hover_type={buttonTypes.primary_hover}
            button_text="Search"
            onClick={() => {
              searchProduct();
            }}
          />
        </div>
      </div>
    </div>
  );
}
