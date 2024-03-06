import React, { useContext, useState } from "react";
import useStyles from "./style";

import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Radio from "../../../common/Radio";

import axios from "axios";
import { postCall } from "../../../../api/axios";
import useCancellablePromise from "../../../../api/cancelRequest";
import { restoreToDefault } from "../../../../constants/restoreDefaultAddress";
import { address_types, address_tags } from "../../../../constants/address-types";
import validator from "validator";
import { ToastContext } from "../../../../context/toastContext";
import { toast_actions, toast_types } from "../../../shared/toast/utils/toast";
import TrackingMap from ".././../../orders/orderDetails/trackingMap";
import PlacePickerMap from "../../../common/PlacePickerMap/PlacePickerMap";
import { useEffect } from "react";

const AddressForm = (props) => {
  const classes = useStyles();
  const {
    action_type,
    address_type,
    selectedAddress = restoreToDefault(),
    onClose,
    onAddAddress,
    onUpdateAddress,
    fromCheckout = false,
  } = props;

  // STATES
  const [fetchCityStateLoading, setCityStateLoading] = useState(false);
  const [addAddressLoading, setAddAddressLoading] = useState(false);
  const [address, setAddress] = useState(selectedAddress);

  console.log("selectedAddress=====>0000", selectedAddress);
  const [error, setError] = useState({
    name_error: "",
    email_error: "",
    phone_error: "",
    areaCode_error: "",
    city_name_error: "",
    door_error: "",
    state_name_error: "",
    street_name_error: "",
    tag_error: "",
  });
  const { cancellablePromise } = useCancellablePromise();
  const dispatch = useContext(ToastContext);

  const checkName = () => {
    if (validator.isEmpty(address?.name.trim())) {
      setError((error) => ({
        ...error,
        name_error: "Please enter Name",
      }));
      return false;
    }
    return true;
  };

  const checkEmail = () => {
    if (validator.isEmpty(address?.email.trim())) {
      setError((error) => ({
        ...error,
        email_error: "Please enter Email",
      }));
      return false;
    }
    if (!validator.isEmail(address?.email.trim())) {
      setError((error) => ({
        ...error,
        email_error: "Please enter a valid Email",
      }));
      return false;
    }
    return true;
  };

  const checkPhoneNumber = () => {
    if (validator.isEmpty(address?.phone.trim())) {
      setError((error) => ({
        ...error,
        phone_error: "Please enter a valid phone number",
      }));
      return false;
    }
    if (!validator.isMobilePhone(address?.phone.trim(), "en-IN")) {
      setError((error) => ({
        ...error,
        phone_error: "Please enter a valid phone number",
      }));
      return false;
    }
    return true;
  };

  const checkStreetName = () => {
    console.log("address", address);
    if (!address.street || validator.isEmpty(address?.street.trim())) {
      setError((error) => ({
        ...error,
        street_name_error: "Street Name cannot be empty",
      }));
      return false;
    } else {
      setError((error) => ({
        ...error,
        street_name_error: "",
      }));
    }
    return true;
  };

  const checkLandMark = () => {
    // if (validator.isEmpty(address?.door.trim())) {
    //   setError((error) => ({
    //     ...error,
    //     door_error: "Landmark cannot be empty",
    //   }));
    //   return false;
    // }
    return true;
  };

  const checkCity = () => {
    if (!address.city || validator.isEmpty(address?.city.trim())) {
      setError((error) => ({
        ...error,
        city_name_error: "City Name cannot be empty",
      }));
      return false;
    } else {
      setError((error) => ({
        ...error,
        city_name_error: "",
      }));
    }
    return true;
  };

  const checkState = () => {
    if (!address.state || validator.isEmpty(address?.state.trim())) {
      setError((error) => ({
        ...error,
        state_name_error: "State Name cannot be empty",
      }));
      return false;
    } else {
      setError((error) => ({
        ...error,
        state_name_error: "",
      }));
    }
    return true;
  };

  const checkTag = () => {
    if (validator.isEmpty(address?.tag.trim())) {
      setError((error) => ({
        ...error,
        tag_error: "Please select tag",
      }));
      return false;
    } else {
      setError((error) => ({
        ...error,
        tag_error: "",
      }));
    }
    return true;
  };

  const checkPinCode = () => {
    if (!address.areaCode || validator.isEmpty(address?.areaCode?.trim())) {
      setError((error) => ({
        ...error,
        areaCode_error: "Pin code cannot be empty",
      }));
      return false;
    } else if (address?.areaCode?.length < 6) {
      setError((error) => ({
        ...error,
        areaCode_error: "Please enter a valid Pin Code",
      }));
      return false;
    } else {
      setError((error) => ({
        ...error,
        areaCode_error: "",
      }));
    }
    return true;
  };

  const checkDoor = () => {
    if (!address.door || validator.isEmpty(address?.name.trim())) {
      setError((error) => ({
        ...error,
        door_error: "Building cannot be empty",
      }));
      return false;
    } else {
      setError((error) => ({
        ...error,
        door_error: "",
      }));
    }
    return true;
  };

  // use this function to fetch city and pincode
  const fetchCityAndStateOnAreacode = async (areaCode) => {
    setCityStateLoading(true);
    try {
      const { data } = await cancellablePromise(
        axios.get(`${process.env.REACT_APP_MMI_BASE_URL}mmi/api/mmi_pin_info?pincode=${areaCode}`)
      );
      const cityName = data?.copResults?.city ? data?.copResults?.city : data?.copResults?.district;
      const stateName = data?.copResults?.state;
      setAddress((address) => ({
        ...address,
        city: cityName,
        state: stateName,
      }));
      setError((error) => ({
        ...error,
        city_name_error: "",
        state_name_error: "",
      }));
    } catch (err) {
      let message = "Please enter valid Pin Code";
      if (err.response.status !== 500) {
        message = err.response.data.message;
      } else {
      }
      dispatch({
        type: toast_actions.ADD_TOAST,
        payload: {
          id: Math.floor(Math.random() * 100),
          type: toast_types.error,
          message: message,
        },
      });
      setAddress((address) => ({
        ...address,
        areaCode: "",
        city: "",
        state: "",
      }));
    } finally {
      setCityStateLoading(false);
    }
  };

  // add delivery address
  const handleAddDeliveryAddress = async () => {
    const allChecksPassed = [
      checkName(),
      checkEmail(),
      checkPhoneNumber(),
      checkStreetName(),
      checkLandMark(),
      checkCity(),
      checkState(),
      checkTag(),
      checkPinCode(),
      checkDoor(),
    ].every(Boolean);
    if (!allChecksPassed) {
      return;
    }
    setAddAddressLoading(true);

    try {
      const data = await cancellablePromise(
        postCall("/clientApis/v1/delivery_address", {
          descriptor: {
            name: address.name.trim(),
            email: address.email.trim(),
            phone: address.phone.trim(),
          },
          address: {
            areaCode: address.areaCode.trim(),
            building: address.door.trim(),
            city: address.city.trim(),
            country: "IND",
            door: address.door.trim(),
            building: address.door.trim(),
            state: address.state.trim(),
            street: address.street.trim(),
            tag: address.tag.trim(),
            lat: address.lat,
            lng: address.lng,
          },
        })
      );
      onAddAddress(data);
    } catch (err) {
      dispatch({
        type: toast_actions.ADD_TOAST,
        payload: {
          id: Math.floor(Math.random() * 100),
          type: toast_types.error,
          message: err?.response?.data?.error?.message,
        },
      });
    } finally {
      setAddAddressLoading(false);
    }
  };

  // add billing address
  const handleAddBillingAddress = async () => {
    const allChecksPassed = [
      checkName(),
      checkEmail(),
      checkPhoneNumber(),
      checkStreetName(),
      checkLandMark(),
      checkCity(),
      checkState(),
      checkTag(),
      checkPinCode(),
      checkDoor(),
    ].every(Boolean);
    if (!allChecksPassed) {
      return;
    }
    setAddAddressLoading(true);
    try {
      const data = await cancellablePromise(
        postCall("/clientApis/v1/billing_details", {
          name: address.name.trim(),
          address: {
            areaCode: address.areaCode.trim(),
            building: address.door.trim(),
            city: address.city.trim(),
            country: "IND",
            door: address.door.trim(),
            state: address.state.trim(),
            street: address.street.trim(),
            tag: address.tag.trim(),
            lat: address.lat,
            lng: address.lng,
          },
          email: address.email.trim(),
          phone: address.phone.trim(),
        })
      );
      onAddAddress(data);
    } catch (err) {
      dispatch({
        type: toast_actions.ADD_TOAST,
        payload: {
          id: Math.floor(Math.random() * 100),
          type: toast_types.error,
          message: err?.response?.data?.error?.message,
        },
      });
    } finally {
      setAddAddressLoading(false);
    }
  };

  // update delivery address
  const handleUpdateDeliveryAddress = async () => {
    const allChecksPassed = [
      checkName(),
      checkEmail(),
      checkPhoneNumber(),
      checkStreetName(),
      checkLandMark(),
      checkCity(),
      checkState(),
      checkTag(),
      checkPinCode(),
      checkDoor(),
    ].every(Boolean);
    if (!allChecksPassed) {
      return;
    }
    setAddAddressLoading(true);

    console.log("Address", address);

    try {
      const data = await cancellablePromise(
        postCall(`/clientApis/v1/update_delivery_address/${address.id}`, {
          descriptor: {
            name: address.name.trim(),
            email: address.email.trim(),
            phone: address.phone.trim(),
          },
          address: {
            areaCode: address.areaCode.trim(),
            building: address.door.trim(),
            city: address.city.trim(),
            country: "IND",
            door: address.door.trim(),
            building: address.door.trim(),
            state: address.state.trim(),
            street: address.street.trim(),
            tag: address.tag.trim(),
            lat: address.lat,
            lng: address.lng,
          },
        })
      );
      onUpdateAddress(data);
    } catch (err) {
      dispatch({
        type: toast_actions.ADD_TOAST,
        payload: {
          id: Math.floor(Math.random() * 100),
          type: toast_types.error,
          message: err?.response?.data?.error?.message,
        },
      });
    } finally {
      setAddAddressLoading(false);
    }
  };

  // update billing address
  const handleUpdateBillingAddress = async () => {
    const allChecksPassed = [
      checkName(),
      checkEmail(),
      checkPhoneNumber(),
      checkStreetName(),
      checkLandMark(),
      checkCity(),
      checkState(),
      checkTag(),
      checkPinCode(),
      checkDoor(),
    ].every(Boolean);
    if (!allChecksPassed) {
      return;
    }
    setAddAddressLoading(true);
    try {
      const data = await cancellablePromise(
        postCall(`/clientApis/v1/update_billing_details/${address.id}`, {
          name: address.name.trim(),
          address: {
            areaCode: address.areaCode.trim(),
            city: address.city.trim(),
            country: "IND",
            door: address.door.trim(),
            building: address.door.trim(),
            state: address.state.trim(),
            street: address.street.trim(),
            tag: address.tag.trim(),
            lat: address.lat,
            lng: address.lng,
          },
          email: address.email.trim(),
          phone: address.phone.trim(),
        })
      );
      onUpdateAddress(data);
    } catch (err) {
      dispatch({
        type: toast_actions.ADD_TOAST,
        payload: {
          id: Math.floor(Math.random() * 100),
          type: toast_types.error,
          message: err?.response?.data?.error?.message,
        },
      });
    } finally {
      setAddAddressLoading(false);
    }
  };

  return (
    <Grid container spacing={fromCheckout ? 5 : 3}>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <TextField
          required
          fullWidth
          id="name-input"
          name="name"
          label="Name"
          placeholder="Enter Name"
          type="text"
          value={address?.name}
          onChange={(event) => {
            const name = event.target.value;
            setAddress((address) => ({
              ...address,
              name: name,
            }));
            setError((error) => ({
              ...error,
              name_error: "",
            }));
          }}
          error={!!error.name_error}
          helperText={error.name_error}
          onBlur={checkName}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
        <TextField
          required
          fullWidth
          id="email-input"
          name="email"
          label="Email"
          placeholder="Enter Email"
          type="email"
          value={address?.email}
          onChange={(event) => {
            const name = event.target.value;
            setAddress((address) => ({
              ...address,
              email: name,
            }));
            setError((error) => ({
              ...error,
              email_error: "",
            }));
          }}
          error={!!error.email_error}
          helperText={error.email_error}
          onBlur={checkEmail}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
        <TextField
          required
          fullWidth
          id="phone-input"
          name="phone"
          label="Phone Number"
          placeholder="Enter Phone"
          type="text"
          value={address?.phone}
          onChange={(event) => {
            const regexp = /^[0-9]+$/;
            if (!regexp.test(event.target.value) && event.target.value !== "") return;
            const name = event.target.value;
            setAddress((address) => ({
              ...address,
              phone: name,
            }));
            setError((error) => ({
              ...error,
              phone_error: "",
            }));
          }}
          error={!!error.phone_error}
          helperText={error.phone_error}
          onBlur={checkPhoneNumber}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <MapPicker address={address} setAddress={setAddress} />
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <TextField
          disabled
          required
          fullWidth
          id="Street-input"
          name="Street"
          label="Street"
          placeholder="Enter Street"
          type="text"
          value={address?.street}
          onChange={(event) => {
            const name = event.target.value;
            setAddress((address) => ({
              ...address,
              street: name,
            }));
            setError((error) => ({
              ...error,
              street_name_error: "",
            }));
          }}
          error={!!error.street_name_error}
          helperText={error.street_name_error}
          onBlur={checkStreetName}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
        <TextField
          required
          fullWidth
          id="Landmark-input"
          name="Building"
          label="Building"
          placeholder="Enter Building"
          type="text"
          value={address?.door}
          onChange={(event) => {
            const name = event.target.value;
            setAddress((address) => ({
              ...address,
              door: name,
            }));
            setError((error) => ({
              ...error,
              door_error: "",
            }));
          }}
          error={!!error.door_error}
          helperText={error.door_error}
          onBlur={checkLandMark}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
        <TextField
          disabled
          required
          fullWidth
          id="pin_code-input"
          name="pin_code"
          label="Pin Code"
          placeholder="Enter Pin Code"
          type="text"
          value={address?.areaCode}
          // pattern="\d*"
          // maxlength="6"
          inputProps={{
            maxLength: 6,
          }}
          onChange={(event) => {
            const regexp = /^[0-9]+$/;
            if (!regexp.test(event.target.value) && event.target.value !== "") return;
            const areaCode = event.target.value;
            // if the length is 6 than call the city and state fetch call
            if (areaCode.length === 6) {
              fetchCityAndStateOnAreacode(areaCode);
            } else {
            }
            setAddress((address) => ({
              ...address,
              areaCode: areaCode,
            }));
            setError((error) => ({
              ...error,
              areaCode_error: "",
            }));
          }}
          error={!!error.areaCode_error}
          helperText={error.areaCode_error}
          onBlur={checkPinCode}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
        <TextField
          disabled
          required
          fullWidth
          id="City-input"
          name="City"
          label="City"
          placeholder="Enter City"
          type="text"
          value={address?.city}
          onChange={(event) => {
            const name = event.target.value;
            setAddress((address) => ({
              ...address,
              city: name,
            }));
            setError((error) => ({
              ...error,
              city_name_error: "",
            }));
          }}
          error={!!error.city_name_error}
          helperText={error.city_name_error}
          onBlur={checkCity}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
        <TextField
          disabled
          required
          fullWidth
          id="State-input"
          name="State"
          label="State"
          placeholder="Enter State"
          type="text"
          value={address?.state}
          onChange={(event) => {
            const name = event.target.value;
            setAddress((address) => ({
              ...address,
              state: name,
            }));
            setError((error) => ({
              ...error,
              state_name_error: "",
            }));
          }}
          error={!!error.state_name_error}
          helperText={error.state_name_error}
          onBlur={checkState}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <FormControl>
          <Typography variant="body2" className={classes.tagLabel}>
            Tag
          </Typography>
          <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group">
            {address_tags.length > 0 &&
              address_tags.map((tag, ind) => {
                return (
                  <div key={`Tag-radio-button-${ind}`} className={classes.selectAddressRadioContainer}>
                    <FormControlLabel
                      className={classes.formControlLabel}
                      onClick={() => {
                        setAddress((address) => ({
                          ...address,
                          tag: tag,
                        }));
                        setError((error) => ({
                          ...error,
                          tag_error: "",
                        }));
                      }}
                      control={<Radio className={classes.tagRadio} checked={tag === address?.tag} />}
                      label={tag}
                    />
                  </div>
                );
              })}
          </RadioGroup>
        </FormControl>
        {!!error.tag_error && (
          <Typography variant={"body2"} color="error">
            {error.tag_error}
          </Typography>
        )}
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        {action_type === "edit" ? (
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              if (address_type === address_types.delivery) return handleUpdateDeliveryAddress();
              handleUpdateBillingAddress();
            }}
          >
            Update Address
          </Button>
        ) : (
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              if (address_type === address_types.delivery) return handleAddDeliveryAddress();
              handleAddBillingAddress();
            }}
          >
            Add Address
          </Button>
        )}
        {fromCheckout && (
          <Button
            variant="outlined"
            color="error"
            sx={{
              ml: 1,
            }}
            onClick={() => {
              onClose();
            }}
          >
            Cancel
          </Button>
        )}
      </Grid>
    </Grid>
  );
};

const MapPicker = (props) => {
  const { address, setAddress } = props;
  console.log("MapPicker props=====>", props);
  let locationString = "28.679076630288467,77.06970870494843";
  locationString = locationString.split(",");
  const gps = {
    lat: locationString[0],
    lng: locationString[1],
  };

  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (address.lat && address.lng) {
      console.log(address.areaCode);
      setLocation({
        lat: address.lat,
        lng: address.lng,
        street: address.street,
        city: address.city,
        state: address.state,
        pincode: address.areaCode,
      });
    }
  }, []);

  useEffect(() => {
    if (location) {
      setAddress((address) => ({
        ...address,
        street: location.street,
        city: location.city,
        state: location.state,
        areaCode: location.pincode,
        lat: location.lat.toFixed(6),
        lng: location.lng.toFixed(6),
      }));
    }
  }, [location]);

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <PlacePickerMap location={location || gps} setLocation={setLocation} />
    </div>
  );
};

export default AddressForm;
