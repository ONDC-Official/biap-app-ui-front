import React, { useState, useEffect, useRef, useContext } from "react";
import { search_types } from "../../../../constants/searchTypes";
import axios from "axios";
import { postCall } from "../../../../api/axios";
import { AddCookie } from "../../../../utils/cookies";
import { debounce } from "../../../../utils/search";
import Loading from "../../../shared/loading/loading";
import { ONDC_COLORS } from "../../../shared/colors";
import styles from "../../../../styles/search-product-modal/searchProductModal.module.scss";
import bannerStyles from "../../../../styles/products/productList.module.scss";
import ErrorMessage from "../../../shared/error-message/errorMessage";
import DropdownSvg from "../../../shared/svg/dropdonw";
import CrossIcon from "../../../shared/svg/cross-icon";
import MMI_LOGO from "../../../../assets/images/mmi_logo.svg";
import LocationSvg from "../../../shared/svg/location";
import Dropdown from "../../../shared/dropdown/dropdown";
import { toast_actions, toast_types } from "../../../shared/toast/utils/toast";
import { ToastContext } from "../../../../context/toastContext";
import useCancellablePromise from "../../../../api/cancelRequest";

export default function SearchBanner({ onSearch, location }) {
  // STATES
  const [inlineError, setInlineError] = useState({
    location_error: "",
    search_error: "",
  });

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
  const criteria = useRef();
  const [searchedLocationLoading, setSearchLocationLoading] = useState(false);
  const [searchProductLoading, setSearchProductLoading] = useState(false);
  const [locations, setLocations] = useState([]);

  // CONTEXT
  const dispatch = useContext(ToastContext);

  // HOOKS
  const { cancellablePromise } = useCancellablePromise();

  useEffect(() => {
    setSearchedLocation(location);
  }, [location]);

  useEffect(() => {
    return () => {
      setSearchLocationLoading(false);
      setSearchProductLoading(false);
    };
  }, []);

  useEffect(() => {
    if (search.type === search_types.PRODUCT) {
      criteria.current = {
        search_string: search.value.trim(),
        delivery_location: `${searchedLocation?.lat},${searchedLocation?.lng}`,
      };
    }
    if (search.type === search_types.CATEGORY) {
      criteria.current = {
        category_id: search.value.trim(),
        delivery_location: `${searchedLocation?.lat},${searchedLocation?.lng}`,
      };
    }
    if (search.type === search_types.PROVIDER) {
      criteria.current = {
        provider_id: search.value.trim(),
        delivery_location: `${searchedLocation?.lat},${searchedLocation?.lng}`,
      };
    }
    // eslint-disable-next-line
  }, [search]);

  // get all the suggested location api
  async function getAllLocations(query) {
    try {
      const { data } = await cancellablePromise(
        axios.get(
          `${process.env.REACT_APP_MMI_BASE_URL}mmi/api/mmi_query?query=${query}`
        )
      );
      const formattedLocations = data.map((location) => ({
        place_id: location?.eLoc,
        name: location?.placeName,
        description: location?.placeAddress,
      }));
      setLocations(formattedLocations);
    } catch (err) {
      dispatch({
        type: toast_actions.ADD_TOAST,
        payload: {
          id: Math.floor(Math.random() * 100),
          type: toast_types.error,
          message: err?.message,
        },
      });
    } finally {
      setSearchLocationLoading(false);
    }
  }

  // get the lat and long of a place
  async function getPlaceFromPlaceId(location) {
    try {
      const { data } = await cancellablePromise(
        axios.get(
          `${process.env.REACT_APP_MMI_BASE_URL}mmi/api/mmi_place_info?eloc=${location.place_id}`
        )
      );
      if (data?.latitude && data?.longitude) {
        setSearchedLocation({
          ...searchedLocation,
          name: location?.name,
          lat: data?.latitude,
          lng: data?.longitude,
        });
      } else {
        setInlineError((error) => ({
          ...error,
          location_error: "Unable to get location, Please try again!",
        }));
      }
      setToggleLocationListCard(false);
    } catch (err) {
      dispatch({
        type: toast_actions.ADD_TOAST,
        payload: {
          id: Math.floor(Math.random() * 100),
          type: toast_types.error,
          message: err?.message,
        },
      });
    }
  }

  async function searchProduct(e) {
    e.preventDefault();
    const allCheckPassed = [checkLocation(), checkSearch()].every(Boolean);
    if (!allCheckPassed) {
      return;
    }
    setSearchProductLoading(true);
    try {
      const { context } = await cancellablePromise(
        postCall("/clientApis/v1/search", {
          context: {},
          message: {
            criteria: criteria.current,
          },
        })
      );
      // generating context for search
      const search_context = {
        search,
        location: searchedLocation,
        message_id: context.message_id,
      };
      // stroing transaction_id in cookie;
      AddCookie("transaction_id", context.transaction_id);
      AddCookie("search_context", JSON.stringify(search_context));
      onSearch(search_context);
    } catch (err) {
      dispatch({
        type: toast_actions.ADD_TOAST,
        payload: {
          id: Math.floor(Math.random() * 100),
          type: toast_types.error,
          message: err?.message,
        },
      });
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
    if (!searchedLocation?.name) {
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
    <div
      className={bannerStyles.searched_history_banner}
      style={{ boxShadow: "0 5px 10px 0 rgba(0,0,0,0.15)" }}
    >
      <div className="container">
        <div className="row">
          <div
            className="col-md-6 col-lg-3 col-xl-3 px-4 py-1"
            style={{ position: "relative" }}
          >
            <div
              className={`d-flex align-items-center ${styles.modal_input_wrappper}`}
            >
              <div className="px-2">
                <LocationSvg />
              </div>
              <input
                id="location"
                name="location"
                type="text"
                placeholder="Search Location"
                autoComplete="off"
                value={searchedLocation?.name}
                onChange={(event) => onChange(event)}
                onBlur={checkLocation}
                className={styles.formControl}
                style={{ padding: "8px 10px" }}
              />
              <div className="px-2">
                {searchedLocation?.name !== "" ? (
                  <CrossIcon
                    width="20"
                    height="20"
                    color={ONDC_COLORS.SECONDARYCOLOR}
                    style={{ cursor: "pointer" }}
                    onClick={clearSearch}
                  />
                ) : (
                  <DropdownSvg width="13" height="8" />
                )}
              </div>
            </div>
            {inlineError.location_error ? (
              <ErrorMessage>{inlineError.location_error}</ErrorMessage>
            ) : (
              <p
                className="px-2 py-1"
                style={{
                  color: "#ddd",
                  fontSize: "12px",
                  margin: 0,
                }}
              >
                powered by{" "}
                <span>
                  <img
                    src={MMI_LOGO}
                    alt="MMI_LOGO"
                    style={{ height: "15px" }}
                  />
                </span>
              </p>
            )}
            {toggleLocationListCard && searchedLocation?.name !== "" && (
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
          <div className="col-md-6 col-lg-6 col-xl-6 px-4 py-1">
            <form onSubmit={searchProduct} className="w-100">
              <div
                className={`d-flex align-items-center ${styles.modal_input_wrappper}`}
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
                        <DropdownSvg
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
                <div className="flex-grow-1">
                  <input
                    id="search"
                    name="search"
                    type="text"
                    placeholder={`Search ${search.type}`}
                    autoComplete="off"
                    value={search.value}
                    onBlur={checkSearch}
                    onChange={(event) => {
                      const searchValue = event.target.value;
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
            </form>
          </div>
          <div className="col-md-6 col-lg-3 col-xl-3">
            <div className="d-flex align-items-center justify-content-center">
              <div className="h-100 d-flex align-items-center justify-content-center flex-wrap">
                <div className="pe-3 py-1">
                  <button
                    disabled={searchProductLoading}
                    className={bannerStyles.secondary_action}
                    onClick={() => {
                      setSearch((search) => ({
                        ...search,
                        value: "",
                      }));
                      clearSearch();
                    }}
                  >
                    Cancel
                  </button>
                </div>
                <div className="pe-3 py-1">
                  <button
                    disabled={
                      !searchedLocation?.name ||
                      !search?.value ||
                      searchProductLoading
                    }
                    className={
                      searchProductLoading
                        ? bannerStyles.primary_action_hover
                        : bannerStyles.primary_action
                    }
                    type="submit"
                    onClick={searchProduct}
                  >
                    {searchProductLoading ? (
                      <Loading backgroundColor={ONDC_COLORS.ACCENTCOLOR} />
                    ) : (
                      "Search"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
