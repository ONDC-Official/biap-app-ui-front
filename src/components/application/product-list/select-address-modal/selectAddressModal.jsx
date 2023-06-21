import React, { useContext } from "react";
import axios from "axios";
import { AddCookie, removeCookie } from "../../../../utils/cookies";
import { AddressContext } from "../../../../context/addressContext";
import styles from "../../../../styles/search-product-modal/searchProductModal.module.scss";
import cartStyles from "../../../../styles/cart/cartView.module.scss";
import { ONDC_COLORS } from "../../../shared/colors";
import CrossIcon from "../../../shared/svg/cross-icon";
import AddressRadioButton from "../../initialize-order/address-details/address-radio-button/addressRadioButton";
import Add from "../../../shared/svg/add";
import { ToastContext } from "../../../../context/toastContext";
import useCancellablePromise from "../../../../api/cancelRequest";
import { toast_actions, toast_types } from "../../../shared/toast/utils/toast";

export default function SelectAddressModal(props) {
  const {
    onClose,
    setAddAddress,
    setUpdateAddress,
    addresses,
    onSelectAddress,
  } = props;
  const { deliveryAddress, setDeliveryAddress, setBillingAddress } =
    useContext(AddressContext);
  const dispatch = useContext(ToastContext);
  // HOOKS
  const { cancellablePromise } = useCancellablePromise();

  const onSetDeliveryAddress = (id, descriptor, address) => {
    // fetchLatLongFromEloc(address?.areaCode);
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
      const { data } = await cancellablePromise(
        axios.get(
          `${process.env.REACT_APP_MMI_BASE_URL}mmi/api/mmi_place_info?eloc=${eloc}`
        )
      );
      const { latitude, longitude } = data;
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
    <div className={styles.overlay}>
      <div
        className={styles.popup_card}
        style={{ minWidth: "auto !important" }}
      >
        <div className={`${styles.card_header} d-flex align-items-center`}>
          <p className={styles.card_header_title}>
            {/* {action_type === "edit" ? "Update" : "Add"} {address_type} Address */}
            Select Address
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
          {/* delivery address list card */}
          {addresses && addresses.length > 0 && (
            <div className={`container-fluid pt-2`}>
              <div>
                {addresses
                  .filter(
                    (delivery_address) =>
                      delivery_address?.descriptor.phone !== "" &&
                      delivery_address?.descriptor.email !== ""
                  )
                  .map((delivery_address) => {
                    const { id, descriptor, address } = delivery_address;
                    return (
                      <div key={id}>
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
                            setBillingAddress();
                            removeCookie("billing_address");
                            onSelectAddress(
                              onSetDeliveryAddress(id, descriptor, address)
                            );
                            onClose();
                          }}
                          oneditaddress={() => {
                            setUpdateAddress({
                              id,
                              name: descriptor?.name,
                              email: descriptor?.email,
                              phone: descriptor?.phone,
                              areaCode: address?.areaCode,
                              city: address?.city,
                              door: address?.door,
                              state: address?.state,
                              street: address?.street,
                              tag: address?.tag,
                            });
                          }}
                        >
                          <div className="px-3">
                            <p className={cartStyles.address_name_and_phone}>
                              {`${address.tag
                                ? address.tag + " (" + descriptor?.name + ")"
                                : descriptor?.name
                                } `}
                            </p>
                            <p className={`${cartStyles.address_line_2} pb-2`}>
                              {descriptor?.email} - {descriptor?.phone}
                            </p>
                            <p className={cartStyles.address_line_1}>
                              {address?.street ? address.street : address?.door}
                              , {address?.city} {address?.state}
                            </p>
                            <p className={cartStyles.address_line_2}>
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

          <div>
            <div
              className={cartStyles.add_address_wrapper}
              onClick={() => setAddAddress()}
            >
              <Add width="15" height="15" classes={cartStyles.add_svg_color} />
              <div className="ps-3 flex-grow-1">
                <p className={cartStyles.add_address_text}>Add Address</p>
              </div>
            </div>
          </div>
        </div>
        {/* <div
                    className={`${styles.card_footer} d-flex align-items-center justify-content-center`}
                >

                </div> */}
      </div>
    </div>
  );
}
