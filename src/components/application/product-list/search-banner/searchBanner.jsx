import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { search_types } from "../../../../constants/searchTypes";
import { postCall, getCall } from "../../../../api/axios";
import {
  AddCookie,
  removeCookie,
  getValueFromCookie,
} from "../../../../utils/cookies";
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
import { restoreToDefault } from "../../initialize-order/add-address-modal/utils/restoreDefaultAddress";
import SelectAddressModal from "../select-address-modal/selectAddressModal";
import AddAddressModal from "../../initialize-order/add-address-modal/addAddressModal";
import { address_types } from "../../../../constants/address-types";
import { AddressContext } from "../../../../context/addressContext";
import { CartContext } from "../../../../context/cartContext";

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
  const [selectAddressModal, setSelectAddressModal] = useState(false);
  const [toggleAddressModal, setToggleAddressModal] = useState({
    actionType: "",
    toggle: false,
    address: restoreToDefault(),
  });
  const [fetchDeliveryAddressLoading, setFetchDeliveryAddressLoading] =
    useState();
  const [addressList, setAddressList] = useState([]);
  const { deliveryAddress, setDeliveryAddress, setBillingAddress } =
    useContext(AddressContext);

  // CONTEXT
  const dispatch = useContext(ToastContext);
  const { setCartItems } = useContext(CartContext);

  // HOOKS
  const { cancellablePromise } = useCancellablePromise();

  useEffect(() => {
    if (getValueFromCookie("delivery_address")) {
      const address = JSON.parse(getValueFromCookie("delivery_address"));
      if (address) {
        setDeliveryAddress(() => address);
      }
    }
  }, []);

  useEffect(() => {
    setSearchedLocation(location);
  }, [location]);

  // use this function to fetch existing address of the user
  async function fetchDeliveryAddress() {
    setFetchDeliveryAddressLoading(true);
    try {
      const data = await cancellablePromise(
        getCall("/clientApis/v1/delivery_address")
      );
      setAddressList(data);
    } catch (err) {
      if (err.response.data.length > 0) {
        setAddressList([]);
        return;
      }
      dispatch({
        type: toast_actions.ADD_TOAST,
        payload: {
          id: Math.floor(Math.random() * 100),
          type: toast_types.error,
          message: err?.message,
        },
      });
    } finally {
      setFetchDeliveryAddressLoading(false);
    }
  }

  useEffect(() => {
    getLastEnteredValues();

    fetchDeliveryAddress();

    return () => {
      setSearchLocationLoading(false);
      setSearchProductLoading(false);
    };
  }, []);

  useEffect(() => {
    setCriteriaLatLng();
  }, [search]);

  function setCriteriaLatLng() {
    if (getValueFromCookie("search_context")) {
      let sc = JSON.parse(getValueFromCookie("search_context") || {});
      setSearchedLocation({
        name: sc.location.name,
        lat: sc.location.lat,
        lng: sc.location.lng,
        pincode: sc.location.pincode,
        city: sc.location.city,
        state: sc.location.state,
        tag: sc.location.tag,
      });
    }
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
  }

  // use this function to get last entered values
  function getLastEnteredValues() {
    let search_context = getValueFromCookie("search_context");
    if (search_context) {
      search_context = JSON.parse(search_context);
      setSearch(() => ({
        type: search_context.search.type,
        value: search_context.search.value,
      }));
    }
  }
  // use this function to dispatch errors
  function dispatchError(message) {
    dispatch({
      type: toast_actions.ADD_TOAST,
      payload: {
        id: Math.floor(Math.random() * 100),
        type: toast_types.error,
        message,
      },
    });
  }

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
      dispatchError(err?.message);
    } finally {
      setSearchLocationLoading(false);
    }
  }

  // get the lat and long of a place
  async function fetchLatLongFromEloc(locationData) {
    try {
      const { data } = await cancellablePromise(
        axios.get(
          `${process.env.REACT_APP_MMI_BASE_URL}mmi/api/mmi_place_info?eloc=${locationData?.location?.address?.areaCode}`
        )
      );
      if (data?.latitude && data?.longitude) {
        const { latitude, longitude } = data;
        AddCookie("LatLongInfo", JSON.stringify({ latitude, longitude }));
        getAreadCodeFromLatLong({
          name: locationData?.name,
          lat: data?.latitude,
          long: data?.longitude,
          tag: locationData?.location?.address?.tag,
        });
      } else {
        setInlineError((error) => ({
          ...error,
          location_error: "Unable to get location, Please try again!",
        }));
      }
    } catch (err) {
      dispatchError(err?.message);
    }
  }

  // get the area code of the location selected
  async function getAreadCodeFromLatLong(location) {
    try {
      const { data } = await cancellablePromise(
        axios.get(
          `${process.env.REACT_APP_MMI_BASE_URL}mmi/api/mmi_latlong_info?lat=${location?.lat}&long=${location?.long}`
        )
      );
      const { lat, lng, pincode, city, state } = data?.results?.[0];
      setSearchedLocation({
        ...searchedLocation,
        name: location?.name,
        lat,
        lng,
        pincode,
        city,
        state,
        tag: location?.tag,
      });
      setToggleLocationListCard(false);
    } catch (err) {
      dispatchError(err?.message);
    }
  }

  async function searchProduct(e) {
    setCriteriaLatLng();
    e.preventDefault();
    // const allCheckPassed = [checkLocation(), checkSearch()].every(Boolean);
    const allCheckPassed = [checkLocation()].every(Boolean);
    if (!allCheckPassed) {
      return;
    }
    setSearchProductLoading(true);
    try {
      const { context } = await cancellablePromise(
        postCall("/clientApis/v1/search", {
          context: {
            city: searchedLocation.city,
            state: searchedLocation.state,
          },
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
      dispatchError(err?.message);
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
    if (!deliveryAddress?.name) {
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
    // if (!search?.value) {
    //   setInlineError((error) => ({
    //     ...error,
    //     search_error: `${search?.type} cannot be empty`,
    //   }));
    //   return false;
    // }
    return true;
  }

  function clearSearch(e) {
    e.preventDefault();
    e.stopPropagation();
    // setSearchedLocation({
    //   name: "",
    //   lat: "",
    //   lng: "",
    // });
    // setDeliveryAddress();
    // setBillingAddress();
    // setCartItems([]);
    // removeCookie("delivery_address");
    // removeCookie("billing_address");
    // removeCookie("search_context");
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
              onClick={() => setSelectAddressModal(true)}
              style={{ cursor: "pointer" }}
            >
              <div className="px-2">
                <LocationSvg />
              </div>
              <div className={styles.formControl}>
                {searchedLocation.tag
                  ? searchedLocation.tag
                  : searchedLocation.name
                    ? searchedLocation.name
                    : "Select your address"}
                {(searchedLocation.tag || searchedLocation.name) && (
                  <>: {searchedLocation?.pincode}</>
                )}
              </div>
              <div className="px-2">
                <DropdownSvg width="13" height="8" />
              </div>
            </div>
            {selectAddressModal && (
              <SelectAddressModal
                addresses={addressList}
                onSelectAddress={(pin) => {
                  fetchLatLongFromEloc(pin);
                }}
                onClose={() => setSelectAddressModal(false)}
                setAddAddress={() => {
                  setSelectAddressModal(false);
                  setToggleAddressModal({
                    actionType: "add",
                    toggle: true,
                    address: restoreToDefault(),
                  });
                }}
                setUpdateAddress={(address) => {
                  setSelectAddressModal(false);
                  setToggleAddressModal({
                    actionType: "edit",
                    toggle: true,
                    address: address,
                  });
                }}
              />
            )}
            {toggleAddressModal.toggle && (
              <AddAddressModal
                action_type={toggleAddressModal.actionType}
                address_type={address_types.delivery}
                selectedAddress={toggleAddressModal.address}
                onClose={() => {
                  setToggleAddressModal({
                    actionType: "",
                    toggle: false,
                    address: restoreToDefault(),
                  });
                  setSelectAddressModal(true);
                }}
                onAddAddress={(address) => {
                  setToggleAddressModal({
                    actionType: "",
                    toggle: false,
                    address: restoreToDefault(),
                  });
                  setAddressList([...addressList, address]);
                  setSelectAddressModal(true);
                }}
                onUpdateAddress={(address) => {
                  const updatedAddress = addressList.map((d) => {
                    if (d.id === address.id) {
                      return address;
                    }
                    return d;
                  });
                  setAddressList(updatedAddress);
                  setToggleAddressModal({
                    actionType: "",
                    toggle: false,
                    address: restoreToDefault(),
                  });
                  setSelectAddressModal(true);
                }}
              />
            )}
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
                    onClick={(e) => {
                      setSearch((search) => ({
                        ...search,
                        value: "",
                      }));
                      clearSearch(e);
                    }}
                  >
                    Cancel
                  </button>
                </div>
                <div className="pe-3 py-1">
                  <button
                    disabled={
                      !searchedLocation?.name ||
                      // !search?.value ||
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
