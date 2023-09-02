import React, { useEffect, useRef, useState, useContext } from "react";
import axios from "axios";
import useStyles from "./style";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import logo from "../../../assets/images/AppLogo.png";
import { ReactComponent as LocationIcon } from "../../../assets/images/location.svg";
import { ReactComponent as AddressDownIcon } from "../../../assets/images/chevron-down.svg";
import { ReactComponent as ListIcon } from "../../../assets/images/list.svg";
import { ReactComponent as SearchIcon } from "../../../assets/images/search.svg";
import { ReactComponent as CartIcon } from "../../../assets/images/cart.svg";
import { ReactComponent as HeartIcon } from "../../../assets/images/heart.svg";
import { ReactComponent as UserIcon } from "../../../assets/images/loggedInUser.svg";
import { useHistory, useLocation, Link } from "react-router-dom";

import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";

import { restoreToDefault } from "../../../constants/restoreDefaultAddress";
import { getValueFromCookie, AddCookie, removeCookie } from "../../../utils/cookies";
import { search_types } from "../../../constants/searchTypes";

import ModalComponent from "../../common/Modal";
import SelectAddress from "./selectAddress/selectAddress";
import AddressForm from "./addressForm/addressForm";
import useCancellablePromise from "../../../api/cancelRequest";
import { address_types } from "../../../constants/address-types";
import { SearchContext } from "../../../context/searchContext";
import { AddressContext } from "../../../context/addressContext";
import {getAllDeliveryAddressRequest} from '../../../api/address.api';

const NavBar = ({isCheckout=false}) => {
  const classes = useStyles();
  const history = useHistory();
  const locationData = useLocation();
  const useQuery = () => {
    const { search } = locationData;
    return React.useMemo(() => new URLSearchParams(search), [search]);
  };
  let query = useQuery();
  const { setSearchData, setLocationData } = useContext(SearchContext);
  const { setDeliveryAddress } = useContext(AddressContext);

    useEffect(() => {

    }, [locationData]);
  // STATES
  const [inlineError, setInlineError] = useState({
    location_error: "",
    search_error: "",
  });
  const [search, setSearch] = useState({
    type: search_types.PRODUCT,
    value: "",
  });
  const criteria = useRef();
  const [searchedLocationLoading, setSearchLocationLoading] = useState(false);
  const [searchProductLoading, setSearchProductLoading] = useState(false);
  const [searchedLocation, setSearchedLocation] = useState({
    name: "",
    lat: "",
    lng: "",
  });
  const [selectAddressModal, setSelectAddressModal] = useState(false);
  const [toggleAddressModal, setToggleAddressModal] = useState({
    actionType: "",
    toggle: false,
    address: restoreToDefault(),
  });
  const [addressList, setAddressList] = useState([]);
  const [fetchDeliveryAddressLoading, setFetchDeliveryAddressLoading] = useState();
  const [toggleLocationListCard, setToggleLocationListCard] = useState(false);

  // HOOKS
  const { cancellablePromise } = useCancellablePromise();

  // use this function to fetch existing address of the user
  const fetchDeliveryAddress = async () => {
    setFetchDeliveryAddressLoading(true);
    try {
      const data = await cancellablePromise(getAllDeliveryAddressRequest());
      setAddressList(data);
    } catch (err) {
      if (err.response.data.length > 0) {
        setAddressList([]);
        return;
      }
      // dispatch({
      //     type: toast_actions.ADD_TOAST,
      //     payload: {
      //         id: Math.floor(Math.random() * 100),
      //         type: toast_types.error,
      //         message: err?.message,
      //     },
      // });
    } finally {
      setFetchDeliveryAddressLoading(false);
    }
  };

  // use this function to get last entered values
  function getLastEnteredValues() {
    const searchProductName = query.get("s");
    let search_context = getValueFromCookie("search_context");
    if (search_context) {
      search_context = Object.assign({}, JSON.parse(search_context));
      setSearch(() => ({
        type: search_context.search.type,
        value: query.size > 0 && searchProductName ? searchProductName : "",
      }));
      setSearchedLocation(search_context.location);
      setSearchData(() => ({
        type: search_context.search.type,
        value: query.size > 0 &&searchProductName ? searchProductName : "",
      }));
      setLocationData(() => search_context.location);
    } else {
    }
    if (getValueFromCookie("delivery_address")) {
      const address = JSON.parse(getValueFromCookie("delivery_address"));
      if (address) {
        setDeliveryAddress(() => address);
        fetchLatLongFromEloc(address);
      }
    } else {
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
    getLastEnteredValues();
  }, [locationData]);

  const setCriteriaLatLng = () => {
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
  };

  useEffect(() => {
    setCriteriaLatLng();
    //sum of two variable
  }, [search]);

  // get the area code of the location selected
  const getAreadCodeFromLatLong = async (location) => {
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
      let search_context_data = getValueFromCookie("search_context");
      search_context_data = Object.assign({}, JSON.parse(search_context));
      // generating context for search
      const search_context = {
        search: search_context_data.search,
        location: {
          ...searchedLocation,
          name: location?.name,
          lat,
          lng,
          pincode,
          city,
          state,
          tag: location?.tag,
        },
      };
      setLocationData(() => search_context.location);
      AddCookie("search_context", JSON.stringify(search_context));
      setToggleLocationListCard(false);
    } catch (err) {
      // dispatchError(err?.message);
    }
  };

  // get the lat and long of a place
  const fetchLatLongFromEloc = async (locationData) => {
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
      // dispatchError(err?.message);
    }
  };

    const updateSearchParams = () => {
        const categoryName = query.get("c");
        const subCategoryName = query.get("sc");
        const params = new URLSearchParams({});
        if(locationData.pathname !== "/application/products"){
            history.push(`/application/products?s=${search.value}`)
        }else{
            if(search.value){
                params.set('s', search.value)
            }
            if(categoryName){
                params.set('c', categoryName)
            }
            if(subCategoryName){
                params.set('sc', subCategoryName)
            }else{}
            history.replace({ pathname: locationData.pathname, search: params.toString() })
        }
    };

  return (
    <AppBar position="absolute">
      <Toolbar className={classes.headerContainer}>
        <img
          src={logo}
          alt="logo"
          className={classes.appLogo}
          onClick={() => {
            // removeCookie("search_context");
            history.push("/application/products");
          }}
        />
        {
          !isCheckout && (
              <>
                <div className={classes.addressContainer} onClick={() => setSelectAddressModal(true)}>
                  <LocationIcon />
                  <Typography variant="body2" className={classes.addressTypo}>
                    Deliver to <b>{searchedLocation?.pincode}</b>
                  </Typography>
                  <AddressDownIcon />
                </div>
                <div className={classes.inputContainer}>
                  <Paper component="form" className={classes.inputForm}>
                    <IconButton
                        type="button"
                        disabled
                        // className={classes.searchIcon}
                        aria-label="search"
                        // onClick={() => {
                        //     setSearchData(() => search);
                        //     history.push(`/products?s=${search.value}`);
                        // }}
                    >
                      <SearchIcon />
                    </IconButton>
                    <InputBase
                        fullWidth
                        className={classes.inputBase}
                        placeholder="Search..."
                        inputProps={{ "aria-label": "Search..." }}
                        value={search?.value || ""}
                        onKeyDown={(e) => {
                          if(e.keyCode == 13){
                            e.preventDefault()
                            setSearchData(() => search);
                            // history.push(`/products?s=${search.value}`);
                            updateSearchParams();
                          }
                        }}
                        onChange={(e) => {
                          const searchValue = e.target.value;
                          let searchDataUpdate = Object.assign({}, JSON.parse(JSON.stringify(search)));
                          searchDataUpdate.value = searchValue;
                          setSearch(searchDataUpdate);
                          // generating context for search
                          const search_context = {
                            search: searchDataUpdate,
                            location: searchedLocation,
                          };
                          // setSearchData(() => searchDataUpdate);
                          AddCookie("search_context", JSON.stringify(search_context));
                        }}
                    />
                    <IconButton className={classes.listIcon} aria-label="menu">
                      <ListIcon />
                    </IconButton>

                  </Paper>
                </div>
                <div className={classes.favourite}>
                  <HeartIcon />
                  <Typography variant="body2" className={classes.favouriteTypo}>
                    List
                  </Typography>
                </div>
                <div className={classes.cart}>
                  <Link to="/application/cart">
                    <CartIcon />
                    <Typography variant="body2" className={classes.cartTypo}>
                      Cart
                    </Typography>
                  </Link>
                </div>
                <div className={classes.user}>
                  <UserIcon />
                  <Typography variant="body2" className={classes.userTypo}>
                    User
                  </Typography>
                </div>
              </>
            )
        }
        {
          isCheckout && (
              <>
                <div className={classes.inputContainer}></div>
                <div className={classes.user}>
                  <UserIcon />
                  <Typography variant="body2" className={classes.userTypo}>
                    User
                  </Typography>
                </div>
              </>
          )
        }
      </Toolbar>
      {selectAddressModal && (
        <ModalComponent
          open={selectAddressModal}
          onClose={() => {
            setSelectAddressModal(false);
          }}
          title="Select Address"
        >
          <SelectAddress
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
        </ModalComponent>
      )}
      {toggleAddressModal.toggle && (
        <ModalComponent
          open={toggleAddressModal.toggle}
          onClose={() => {
            setToggleAddressModal({
              actionType: "",
              toggle: false,
              address: restoreToDefault(),
            });
            setSelectAddressModal(true);
          }}
          title={`${toggleAddressModal.actionType === "edit" ? `Update Delivery Address` : `Add Delivery Address`}`}
        >
          <AddressForm
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
        </ModalComponent>
      )}
    </AppBar>
  );
};

export default NavBar;
