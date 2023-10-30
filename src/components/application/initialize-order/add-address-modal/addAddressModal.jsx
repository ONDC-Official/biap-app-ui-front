import React, { useContext, useState } from "react";
import axios from "axios";
import { postCall } from "../../../../api/axios";
import styles from "../../../../styles/search-product-modal/searchProductModal.module.scss";
import cancelRadioStyles from "../../../../styles/cart/cartView.module.scss";
import inputStyles from "../../../shared/input/input.module.scss";
import { buttonTypes } from "../../../shared/button/utils";
import Button from "../../../shared/button/button";
import { ONDC_COLORS } from "../../../shared/colors";
import Input from "../../../shared/input/input";
import CrossIcon from "../../../shared/svg/cross-icon";
import { address_types, address_tags } from "../../../../constants/address-types";
import { toast_actions, toast_types } from "../../../shared/toast/utils/toast";
import { restoreToDefault } from "./utils/restoreDefaultAddress";
import { ToastContext } from "../../../../context/toastContext";
import ErrorMessage from "../../../shared/error-message/errorMessage";
import validator from "validator";
import useCancellablePromise from "../../../../api/cancelRequest";
import AddressRadioButton from "../../initialize-order/address-details/address-radio-button/addressRadioButton";

export default function AddAddressModal(props) {
  const {
    action_type,
    address_type,
    selectedAddress = restoreToDefault(),
    onClose,
    onAddAddress,
    onUpdateAddress,
  } = props;

  // STATES
  const [fetchCityStateLoading, setCityStateLoading] = useState(false);
  const [addAddressLoading, setAddAddressLoading] = useState(false);
  const [address, setAddress] = useState(selectedAddress);
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

  // CONTEXT
  const dispatch = useContext(ToastContext);

  // HOOKS
  const { cancellablePromise } = useCancellablePromise();

  function checkName() {
    if (validator.isEmpty(address?.name.trim())) {
      setError((error) => ({
        ...error,
        name_error: "Please enter Name",
      }));
      return false;
    }
    return true;
  }

  function checkEmail() {
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
  }

  function checkPhoneNumber() {
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
  }

  function checkStreetName() {
    if (validator.isEmpty(address?.street.trim())) {
      setError((error) => ({
        ...error,
        street_name_error: "Street Name cannot be empty",
      }));
      return false;
    }
    return true;
  }

  function checkLandMark() {
    // if (validator.isEmpty(address?.door.trim())) {
    //   setError((error) => ({
    //     ...error,
    //     door_error: "Landmark cannot be empty",
    //   }));
    //   return false;
    // }
    return true;
  }

  function checkCity() {
    if (validator.isEmpty(address?.city.trim())) {
      setError((error) => ({
        ...error,
        city_name_error: "City Name cannot be empty",
      }));
      return false;
    }
    return true;
  }

  function checkState() {
    if (validator.isEmpty(address?.state.trim())) {
      setError((error) => ({
        ...error,
        state_name_error: "State Name cannot be empty",
      }));
      return false;
    }
    return true;
  }

  function checkTag() {
    if (validator.isEmpty(address?.tag.trim())) {
      setError((error) => ({
        ...error,
        tag_error: "Please select tag",
      }));
      return false;
    }
    return true;
  }

  function checkPinCode() {
    if (validator.isEmpty(address?.areaCode.trim())) {
      setError((error) => ({
        ...error,
        areaCode_error: "Pin code cannot be empty",
      }));
      return false;
    }
    if (address?.areaCode?.length < 6) {
      setError((error) => ({
        ...error,
        areaCode_error: "Please enter a valid Pin Code",
      }));
      return false;
    }
    return true;
  }

  // update billing address
  async function handleUpdateBillingAddress() {
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
            building: address.door.trim(),
            city: address.city.trim(),
            country: "IND",
            door: address.door.trim(),
            state: address.state.trim(),
            street: address.street.trim(),
            tag: address.tag.trim(),
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
          message: err?.message,
        },
      });
    } finally {
      setAddAddressLoading(false);
    }
  }

  // add billing address
  async function handleAddBillingAddress() {
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
          message: err?.message,
        },
      });
    } finally {
      setAddAddressLoading(false);
    }
  }

  // update delivery address
  async function handleUpdateDeliveryAddress() {
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
    ].every(Boolean);
    if (!allChecksPassed) {
      return;
    }
    setAddAddressLoading(true);
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
            state: address.state.trim(),
            street: address.street.trim(),
            tag: address.tag.trim(),
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
          message: err?.message,
        },
      });
    } finally {
      setAddAddressLoading(false);
    }
  }

  // add delivery address
  async function handleAddDeliveryAddress() {
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
            state: address.state.trim(),
            street: address.street.trim(),
            tag: address.tag.trim(),
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
          message: err?.message,
        },
      });
    } finally {
      setAddAddressLoading(false);
    }
  }

  // use this function to fetch city and pincode
  async function fetchCityAndStateOnAreacode(areaCode) {
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
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.popup_card}>
        <div className={`${styles.card_header} d-flex align-items-center`}>
          <p className={styles.card_header_title}>
            {action_type === "edit" ? "Update" : "Add"} {address_type} Address
          </p>
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
          <div className={styles.address_form_wrapper}>
            <div className={"container-fluid"}>
              <div className="row">
                <div className="col-sm-12">
                  <Input
                    label_name="Name"
                    type="text"
                    placeholder="Enter Name"
                    id="name"
                    value={address?.name}
                    has_error={error.name_error}
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
                    onBlur={checkName}
                    required
                  />
                  <ErrorMessage>{error.name_error}</ErrorMessage>
                </div>
                <div className="col-md-6 col-sm-12">
                  <Input
                    type="email"
                    placeholder="Enter Email"
                    id="email"
                    label_name="Email"
                    value={address?.email}
                    has_error={error.email_error}
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
                    onBlur={checkEmail}
                    required
                  />
                  <ErrorMessage>{error.email_error}</ErrorMessage>
                </div>
                <div className="col-md-6 col-sm-12">
                  <Input
                    type="text"
                    maxlength="10"
                    placeholder="Enter Phone"
                    id="phone"
                    label_name="Phone Number"
                    value={address?.phone}
                    has_error={error.phone_error}
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
                    onBlur={checkPhoneNumber}
                    required
                  />
                  <ErrorMessage>{error.phone_error}</ErrorMessage>
                </div>
                <div className="col-sm-12">
                  <Input
                    label_name="Street"
                    type="text"
                    placeholder="Enter Street"
                    id="street"
                    has_error={error.street_name_error}
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
                    onBlur={checkStreetName}
                    required
                  />
                  <ErrorMessage>{error.street_name_error}</ErrorMessage>
                </div>
                <div className="col-md-6 col-sm-12">
                  <Input
                    type="text"
                    placeholder="Enter Landmark"
                    id="landmark"
                    label_name="Landmark"
                    has_error={error.door_error}
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
                    onBlur={checkLandMark}
                    // required
                  />
                  <ErrorMessage>{error.door_error}</ErrorMessage>
                </div>
                <div className="col-md-6 col-sm-12">
                  <Input
                    type="text"
                    pattern="\d*"
                    maxlength="6"
                    placeholder="Enter Pin code"
                    id="pin_code"
                    label_name="Pin Code"
                    value={address?.areaCode}
                    has_error={error.areaCode_error}
                    onChange={(event) => {
                      const regexp = /^[0-9]+$/;
                      if (!regexp.test(event.target.value) && event.target.value !== "") return;
                      const areaCode = event.target.value;
                      // if the length is 6 than call the city and state fetch call
                      if (areaCode.length === 6) {
                        fetchCityAndStateOnAreacode(areaCode);
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
                    onBlur={checkPinCode}
                    required
                  />
                  <ErrorMessage>{error.areaCode_error}</ErrorMessage>
                </div>
                <div className="col-md-6 col-sm-12">
                  <Input
                    type="text"
                    placeholder="Enter City"
                    id="city"
                    label_name="City"
                    value={address?.city}
                    has_error={error.city_name_error}
                    required
                    disabled
                  />
                  <ErrorMessage>{error.city_name_error}</ErrorMessage>
                </div>
                <div className="col-md-6 col-sm-12">
                  <Input
                    type="text"
                    placeholder="Enter State"
                    id="state"
                    label_name="State"
                    has_error={error.state_name_error}
                    value={address?.state}
                    required
                    disabled
                  />
                  <ErrorMessage>{error.state_name_error}</ErrorMessage>
                </div>
                <div className="col-sm-12" style={{ position: "relative" }}>
                  <label htmlFor={"tag"} className={`${inputStyles.form_label} ${inputStyles.required}`}>
                    Tag
                  </label>
                  <div className="py-2 d-flex align-items-center">
                    {address_tags.length > 0 &&
                      address_tags.map((tag) => {
                        return (
                          <AddressRadioButton
                            // disabled={loading}
                            checked={tag === address?.tag}
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
                          >
                            <div className="px-3">
                              <p className={cancelRadioStyles.address_name_and_phone}>{tag}</p>
                            </div>
                          </AddressRadioButton>
                        );
                      })}
                  </div>
                  <ErrorMessage>{error.tag_error}</ErrorMessage>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles.card_footer} d-flex align-items-center justify-content-center`}>
          {action_type === "edit" ? (
            <Button
              isloading={addAddressLoading ? 1 : 0}
              disabled={addAddressLoading || fetchCityStateLoading}
              button_type={buttonTypes.primary}
              button_hover_type={buttonTypes.primary_hover}
              button_text="Update Address"
              onClick={() => {
                if (address_type === address_types.delivery) return handleUpdateDeliveryAddress();
                handleUpdateBillingAddress();
              }}
            />
          ) : (
            <Button
              isloading={addAddressLoading ? 1 : 0}
              disabled={addAddressLoading || fetchCityStateLoading}
              button_type={buttonTypes.primary}
              button_hover_type={buttonTypes.primary_hover}
              button_text="Add Address"
              onClick={() => {
                if (address_type === address_types.delivery) return handleAddDeliveryAddress();
                handleAddBillingAddress();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
