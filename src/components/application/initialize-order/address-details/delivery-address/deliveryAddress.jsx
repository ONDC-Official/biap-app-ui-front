import React, { Fragment, useContext, useState } from "react";
import { address_types } from "../../../../../constants/address-types";
import { AddressContext } from "../../../../../context/addressContext";
import styles from "../../../../../styles/cart/cartView.module.scss";
import Add from "../../../../shared/svg/add";
import AddAddressModal from "../../add-address-modal/addAddressModal";
import AddressRadioButton from "../address-radio-button/addressRadioButton";
import { AddCookie } from "../../../../../utils/cookies";
import { restoreToDefault } from "../../add-address-modal/utils/restoreDefaultAddress";
import { ToastContext } from "../../../../../context/toastContext";
import { getCall } from "../../../../../api/axios";
import {
  toast_actions,
  toast_types,
} from "../../../../shared/toast/utils/toast";

export default function DeliveryAddress(props) {
  const { deliveryAddresses, setDeliveryAddresses } = props;
  const { deliveryAddress, setDeliveryAddress } = useContext(AddressContext);
  const [toggleAddressModal, setToggleAddressModal] = useState({
    actionType: "",
    toggle: false,
    address: restoreToDefault(),
  });

  const dispatch = useContext(ToastContext);

  const onSetDeliveryAddress = (id, descriptor, address) => {
    fetchLatLongFromEloc(address?.areaCode);
    return {
      id,
      name: descriptor?.name || "",
      email: descriptor?.email || "",
      phone: descriptor?.phone || "",
      location: {
        address,
      },
    };
  };

  // use this function to fetch lat and long from eloc
  async function fetchLatLongFromEloc(eloc) {
    try {
      const { latitude, longitude } = await getCall(
        `/mmi/api/mmi_place_info?eloc=${eloc}`
      );
      if (latitude && longitude) {
        AddCookie("LatLongInfo", JSON.stringify({ latitude, longitude }));
      } else {
        dispatch({
          type: toast_actions.ADD_TOAST,
          payload: {
            id: Math.floor(Math.random() * 100),
            type: toast_types.error,
            message:
              "Cannot get latitude and longitude info for this pincode Please update the Address",
          },
        });
        setDeliveryAddress({});
      }
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

  return (
    <Fragment>
      {/* delivery address list card */}
      <p className={`${styles.address_type_label} py-2`}>Delivery Address</p>
      {/* delivery address list card */}
      {deliveryAddresses && deliveryAddresses.length > 0 && (
        <div className={`${styles.address_wrapper} container-fluid pt-2`}>
          <div className="row">
            {deliveryAddresses
              .filter(
                (delivery_address) =>
                  delivery_address?.descriptor.phone !== "" &&
                  delivery_address?.descriptor.email !== ""
              )
              .map((delivery_address) => {
                const { id, descriptor, address } = delivery_address;
                return (
                  <div className="col-lg-6" key={id}>
                    <AddressRadioButton
                      iseditable
                      key={id}
                      checked={deliveryAddress?.id === id}
                      onClick={() => {
                        setDeliveryAddress(() =>
                          onSetDeliveryAddress(id, descriptor, address)
                        );
                        AddCookie(
                          "delivery_address",
                          JSON.stringify(
                            onSetDeliveryAddress(id, descriptor, address)
                          )
                        );
                      }}
                      oneditaddress={() =>
                        setToggleAddressModal({
                          actionType: "edit",
                          toggle: true,
                          address: {
                            id,
                            name: descriptor?.name,
                            email: descriptor?.email,
                            phone: descriptor?.phone,
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
                        <p className={styles.address_name_and_phone}>
                          {descriptor?.name}
                        </p>
                        <p className={`${styles.address_line_2} pb-2`}>
                          {descriptor?.email} - {descriptor?.phone}
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
          address_type={address_types.delivery}
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
            setDeliveryAddresses([...deliveryAddresses, address]);
          }}
          onUpdateAddress={(address) => {
            const updatedAddress = deliveryAddresses.map((d) => {
              if (d.id === address.id) {
                return address;
              }
              return d;
            });
            setDeliveryAddresses(updatedAddress);
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
