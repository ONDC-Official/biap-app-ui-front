import React, { useContext, useState } from "react";
import { postCall } from "../../../api/axios";
import styles from "../../../styles/search-product-modal/searchProductModal.module.scss";
import { buttonTypes } from "../../../utils/button";
import Button from "../../shared/button/button";
import { ONDC_COLORS } from "../../shared/colors";
import Input from "../../shared/input/input";
import CrossIcon from "../../shared/svg/cross-icon";
import { address_types } from "../../../constants/address-types";
import { toast_actions, toast_types } from "../../../utils/toast";
import { restoreToDefault } from "../../../utils/restoreDefaultAddress";
import { ToastContext } from "../../../context/toastContext";
import ErrorMessage from "../../shared/error-message/errorMessage";

export default function AddAddressModal(props) {
  const {
    address_type,
    selectedAddress = restoreToDefault(),
    onClose,
    onAddAddress,
    onUpdateAddress,
  } = props;
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
  });
  const dispatch = useContext(ToastContext);
  // update billing address
  async function handleUpdateBillingAddress() {
    setAddAddressLoading(true);
    try {
      const data = await postCall(
        `/clientApis/v1/update_billing_details/${address.id}`,
        {
          name: address.name.trim(),
          address: {
            areaCode: address.areaCode.trim(),
            building: address.door.trim(),
            city: address.city.trim(),
            country: "IND",
            door: address.door.trim(),
            state: address.state.trim(),
            street: address.street.trim(),
          },
          email: address.email.trim(),
          phone: address.phone.trim(),
        }
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
    setAddAddressLoading(true);
    try {
      const data = await postCall("/clientApis/v1/billing_details", {
        name: address.name.trim(),
        address: {
          areaCode: address.areaCode.trim(),
          building: address.door.trim(),
          city: address.city.trim(),
          country: "IND",
          door: address.door.trim(),
          state: address.state.trim(),
          street: address.street.trim(),
        },
        email: address.email.trim(),
        phone: address.phone.trim(),
      });
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
    setAddAddressLoading(true);
    try {
      const data = await postCall(
        `/clientApis/v1/update_delivery_address/${address.id}`,
        {
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
          },
        }
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
    setAddAddressLoading(true);
    try {
      const data = await postCall("/clientApis/v1/delivery_address", {
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
        },
      });
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

  function checkPhoneNumber() {
    if (address?.phone?.length < 10) {
      setError((error) => ({
        ...error,
        phone_error: "Please enter a valid phone number",
      }));
      return false;
    }
    return true;
  }

  function checkPinCode() {
    if (address?.areaCode?.length < 6) {
      setError((error) => ({
        ...error,
        areaCode_error: "Please enter a valid Area Code",
      }));
      return false;
    }
    return true;
  }

  // use this function to check the disability of the button
  function checkFormvalidation() {
    return (
      address?.name === "" ||
      address?.phone === "" ||
      address?.email === "" ||
      address?.street === "" ||
      address?.city === "" ||
      address?.state === "" ||
      address?.areaCode === "" ||
      address?.landmark === "" ||
      address?.building === "" ||
      error?.name_error !== "" ||
      error?.email_error !== "" ||
      error?.phone_error !== "" ||
      error?.street_name_error !== "" ||
      error?.door_error !== "" ||
      error?.city_name_error !== "" ||
      error?.state_name_error !== "" ||
      error?.areaCode_error !== ""
    );
  }

  function shouldUpdateAddress() {
    return address.name !== "";
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.popup_card}>
        <div className={`${styles.card_header} d-flex align-items-center`}>
          <p className={styles.card_header_title}>
            {shouldUpdateAddress() ? "Update" : "Add"} {address_type} Address
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
                  />
                  <ErrorMessage>{error.name_error}</ErrorMessage>
                </div>
                <div className="col-md-6 col-sm-12">
                  <Input
                    type="text"
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
                      if (
                        !regexp.test(event.target.value) &&
                        event.target.value !== ""
                      )
                        return;
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
                  />
                  <ErrorMessage>{error.door_error}</ErrorMessage>
                </div>
                <div className="col-md-6 col-sm-12">
                  <Input
                    type="text"
                    placeholder="Enter City"
                    id="city"
                    label_name="City"
                    value={address?.city}
                    has_error={error.city_name_error}
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
                  />
                  <ErrorMessage>{error.state_name_error}</ErrorMessage>
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
                      if (
                        !regexp.test(event.target.value) &&
                        event.target.value !== ""
                      )
                        return;
                      const name = event.target.value;
                      setAddress((address) => ({
                        ...address,
                        areaCode: name,
                      }));
                      setError((error) => ({
                        ...error,
                        areaCode_error: "",
                      }));
                    }}
                    onBlur={checkPinCode}
                  />
                  <ErrorMessage>{error.areaCode_error}</ErrorMessage>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`${styles.card_footer} d-flex align-items-center justify-content-center`}
        >
          {shouldUpdateAddress() ? (
            <Button
              isloading={addAddressLoading ? 1 : 0}
              disabled={addAddressLoading || checkFormvalidation()}
              button_type={buttonTypes.primary}
              button_hover_type={buttonTypes.primary_hover}
              button_text="Update Address"
              onClick={() => {
                if (address_type === address_types.delivery)
                  return handleUpdateDeliveryAddress();
                handleUpdateBillingAddress();
              }}
            />
          ) : (
            <Button
              isloading={addAddressLoading ? 1 : 0}
              disabled={
                addAddressLoading ||
                checkFormvalidation() ||
                checkPhoneNumber() ||
                checkPinCode()
              }
              button_type={buttonTypes.primary}
              button_hover_type={buttonTypes.primary_hover}
              button_text="Add Address"
              onClick={() => {
                if (address_type === address_types.delivery)
                  return handleAddDeliveryAddress();
                handleAddBillingAddress();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
