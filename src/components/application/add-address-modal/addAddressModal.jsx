import React, { useState } from "react";
import { postCall } from "../../../api/axios";
import styles from "../../../styles/search-product-modal/searchProductModal.module.scss";
import { buttonTypes } from "../../../utils/button";
import Button from "../../shared/button/button";
import { ONDC_COLORS } from "../../shared/colors";
import Input from "../../shared/input/input";
import CrossIcon from "../../shared/svg/cross-icon";
import { address_types } from "../../../constants/address-types";

export default function AddAddressModal(props) {
  const { address_type, onClose, onAddAddress } = props;
  const [addAddressLoading, setAddAddressLoading] = useState(false);
  const [address, setAddress] = useState({
    name: "",
    email: "",
    phone: "",
    area_code: "",
    city: "",
    door: "",
    state: "",
    street: "",
  });
  const [error, setError] = useState({
    name_error: "",
    email_error: "",
    phone_error: "",
    area_code_error: "",
    city_name_error: "",
    door_error: "",
    state_name_error: "",
    street_name_error: "",
  });

  // add billing address
  async function handleAddBillingAddress() {
    setAddAddressLoading(true);
    try {
      const data = await postCall("/client/v1/billing_details", {
        name: address.name,
        address: {
          area_code: address.area_code,
          building: address.door,
          city: address.city,
          country: "IND",
          door: address.door,
          state: address.state,
          street: address.street,
        },
        email: address.email,
        phone: address.phone,
      });
      onAddAddress(data);
    } catch (err) {
      console.log(err);
    } finally {
      setAddAddressLoading(false);
    }
  }

  // add delivery address
  async function handleAddDeliveryAddress() {
    setAddAddressLoading(true);
    try {
      const data = await postCall("/client/v1/delivery_address", {
        descriptor: {
          name: address.name,
          email: address.email,
          phone: address.phone,
        },
        address: {
          area_code: address.area_code,
          building: address.door,
          city: address.city,
          country: "IND",
          door: address.door,
          state: address.state,
          street: address.street,
        },
      });
      onAddAddress(data);
    } catch (err) {
      console.log(err);
    } finally {
      setAddAddressLoading(false);
    }
  }

  // use this function to check the disability of the button
  function checkFormvalidation() {
    return (
      address?.name === "" ||
      address?.street === "" ||
      address?.city === "" ||
      address?.state === "" ||
      address?.pinCode === "" ||
      address?.landmark === "" ||
      address?.building === ""
    );
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.popup_card}>
        <div className={`${styles.card_header} d-flex align-items-center`}>
          <p className={styles.card_header_title}>Add {address_type} Address</p>
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
                    has_error={error.name_error}
                    onChange={(event) => {
                      const name = event.target.value;
                      setAddress((address) => ({
                        ...address,
                        name: name.trim(),
                      }));
                      setError((error) => ({
                        ...error,
                        name_error: "",
                      }));
                    }}
                  />
                </div>
                <div className="col-md-6 col-sm-12">
                  <Input
                    type="text"
                    placeholder="Enter Email"
                    id="email"
                    label_name="Email"
                    onChange={(event) => {
                      const name = event.target.value;
                      setAddress((address) => ({
                        ...address,
                        email: name.trim(),
                      }));
                      setError((error) => ({
                        ...error,
                        email_error: "",
                      }));
                    }}
                  />
                </div>
                <div className="col-md-6 col-sm-12">
                  <Input
                    type="number"
                    placeholder="Enter Phone"
                    id="phone"
                    label_name="Phone Number"
                    onChange={(event) => {
                      const name = event.target.value;
                      setAddress((address) => ({
                        ...address,
                        phone: name.trim(),
                      }));
                      setError((error) => ({
                        ...error,
                        phone_error: "",
                      }));
                    }}
                  />
                </div>
                <div className="col-sm-12">
                  <Input
                    label_name="Street"
                    type="text"
                    placeholder="Enter Street"
                    id="street"
                    has_error={error.street_name_error}
                    onChange={(event) => {
                      const name = event.target.value;
                      setAddress((address) => ({
                        ...address,
                        street: name.trim(),
                      }));
                      setError((error) => ({
                        ...error,
                        street_name_error: "",
                      }));
                    }}
                  />
                </div>
                <div className="col-md-6 col-sm-12">
                  <Input
                    type="text"
                    placeholder="Enter Landmark"
                    id="landmark"
                    label_name="Landmark"
                    onChange={(event) => {
                      const name = event.target.value;
                      setAddress((address) => ({
                        ...address,
                        door: name.trim(),
                      }));
                      setError((error) => ({
                        ...error,
                        door_error: "",
                      }));
                    }}
                  />
                </div>
                <div className="col-md-6 col-sm-12">
                  <Input
                    type="text"
                    placeholder="Enter City"
                    id="city"
                    label_name="City"
                    onChange={(event) => {
                      const name = event.target.value;
                      setAddress((address) => ({
                        ...address,
                        city: name.trim(),
                      }));
                      setError((error) => ({
                        ...error,
                        city_name_error: "",
                      }));
                    }}
                  />
                </div>
                <div className="col-md-6 col-sm-12">
                  <Input
                    type="text"
                    placeholder="Enter State"
                    id="state"
                    label_name="State"
                    onChange={(event) => {
                      const name = event.target.value;
                      setAddress((address) => ({
                        ...address,
                        state: name.trim(),
                      }));
                      setError((error) => ({
                        ...error,
                        state_name_error: "",
                      }));
                    }}
                  />
                </div>
                <div className="col-md-6 col-sm-12">
                  <Input
                    type="text"
                    placeholder="Enter Pin code"
                    id="pin_code"
                    label_name="Pin Code"
                    onChange={(event) => {
                      const name = event.target.value;
                      setAddress((address) => ({
                        ...address,
                        area_code: name.trim(),
                      }));
                      setError((error) => ({
                        ...error,
                        area_code_error: "",
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`${styles.card_footer} d-flex align-items-center justify-content-center`}
        >
          <Button
            isloading={addAddressLoading ? 1 : 0}
            disabled={addAddressLoading || checkFormvalidation()}
            button_type={buttonTypes.primary}
            button_hover_type={buttonTypes.primary_hover}
            button_text="Add Address"
            onClick={() => {
              if (address_type === address_types.delivery)
                return handleAddDeliveryAddress();
              handleAddBillingAddress();
            }}
          />
        </div>
      </div>
    </div>
  );
}
