import React, { Fragment, useContext, useState } from "react";
import { address_types } from "../../../../../constants/address-types";
import { AddressContext } from "../../../../../context/addressContext";
import styles from "../../../../../styles/cart/cartView.module.scss";
import Add from "../../../../shared/svg/add";
import AddAddressModal from "../../../add-address-modal/addAddressModal";
import AddressRadioButton from "../address-radio-button/addressRadioButton";
import { AddCookie } from "../../../../../utils/cookies";
import { restoreToDefault } from "../../../../../utils/restoreDefaultAddress";

export default function BillingAddress(props) {
  const { billingAddresses, setBillingAddresses } = props;
  const { deliveryAddress, billingAddress, setBillingAddress } =
    useContext(AddressContext);
  const [toggleAddressModal, setToggleAddressModal] = useState({
    actionType: "",
    toggle: false,
    address: restoreToDefault(),
  });

  const onSetBillingAddress = (id, name, email, phone, address) => {
    return {
      id,
      address,
      phone,
      name,
      email,
    };
  };

  return (
    <Fragment>
      {/* billing address list card */}
      <p className={`${styles.address_type_label} py-2`}>Billing Address</p>
      {/* delivery address list card */}
      {deliveryAddress && (
        <div className="container-fluid pt-2">
          <div className="row">
            <div className="col-12">
              <AddressRadioButton
                checked={billingAddress?.id === deliveryAddress?.id}
                onClick={() => {
                  setBillingAddress({
                    id: deliveryAddress?.id,
                    address: deliveryAddress?.location?.address,
                    phone: deliveryAddress?.phone || "",
                    name: deliveryAddress?.name || "",
                    email: deliveryAddress?.email || "",
                  });
                  AddCookie(
                    "billing_address",
                    JSON.stringify({
                      id: deliveryAddress?.id,
                      address: deliveryAddress?.location?.address,
                      phone: deliveryAddress?.phone || "",
                      name: deliveryAddress?.name || "",
                      email: deliveryAddress?.email || "",
                    })
                  );
                }}
              >
                <div className="px-3">
                  <p className={styles.address_line_1}>
                    Same as delivery address
                  </p>
                </div>
              </AddressRadioButton>
            </div>
          </div>
        </div>
      )}
      {billingAddresses && billingAddresses?.length > 0 && (
        <div className={`${styles.address_wrapper} container-fluid`}>
          <div className="row">
            {billingAddresses
              .filter(
                (billing_address) =>
                  billing_address?.phone !== "" && billing_address?.email !== ""
              )
              .map((billing_address) => {
                const { id, name, address, email, phone } = billing_address;
                return (
                  <div className="col-lg-6" key={id}>
                    <AddressRadioButton
                      iseditable
                      key={id}
                      checked={billingAddress?.id === id}
                      onClick={() => {
                        setBillingAddress(() =>
                          onSetBillingAddress(id, name, email, phone, address)
                        );
                        AddCookie(
                          "billing_address",
                          JSON.stringify(
                            onSetBillingAddress(id, name, email, phone, address)
                          )
                        );
                      }}
                      oneditaddress={() =>
                        setToggleAddressModal({
                          actionType: "edit",
                          toggle: true,
                          address: {
                            id,
                            name,
                            email,
                            phone,
                            areaCode: address?.areaCode,
                            city: address?.city,
                            door: address?.door,
                            state: address?.state,
                            street: address?.street,
                          },
                        })
                      }
                    >
                      <div className="px-3">
                        <p className={styles.address_name_and_phone}>{name}</p>
                        <p className={`${styles.address_line_2} pb-2`}>
                          {email} - {phone}
                        </p>
                        <p className={styles.address_line_1}>
                          {address?.street ? address.street : address?.door},{" "}
                          {address?.city} {address?.state}
                        </p>
                        <p className={styles.address_line_2}>
                          {address?.areaCode}
                        </p>
                      </div>
                    </AddressRadioButton>
                  </div>
                );
              })}
          </div>
        </div>
      )}
      <div className="container-fluid py-2">
        <div className="row">
          <div className="col-12">
            <div
              className={styles.add_address_wrapper}
              onClick={() =>
                setToggleAddressModal({
                  actionType: "add",
                  toggle: true,
                  address: restoreToDefault(),
                })
              }
            >
              <Add width="15" height="15" classes={styles.add_svg_color} />
              <div className="ps-3 flex-grow-1">
                <p className={styles.add_address_text}>Add Address</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {toggleAddressModal.toggle && (
        <AddAddressModal
          action_type={toggleAddressModal.actionType}
          address_type={address_types.billing}
          selectedAddress={toggleAddressModal.address}
          onClose={() =>
            setToggleAddressModal({
              actionType: "",
              toggle: false,
              address: restoreToDefault(),
            })
          }
          onAddAddress={(address) => {
            setToggleAddressModal({
              actionType: "",
              toggle: false,
              address: restoreToDefault(),
            });
            setBillingAddresses([...billingAddresses, address]);
          }}
          onUpdateAddress={(address) => {
            const updatedAddress = billingAddresses.map((d) => {
              if (d.id === address.id) {
                return address;
              }
              return d;
            });
            setBillingAddresses(updatedAddress);
            setToggleAddressModal({
              actionType: "",
              toggle: false,
              address: restoreToDefault(),
            });
          }}
        />
      )}
    </Fragment>
  );
}
