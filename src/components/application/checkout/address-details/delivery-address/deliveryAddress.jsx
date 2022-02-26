import React, { Fragment, useContext } from "react";
import { AddressContext } from "../../../../../context/addressContext";
import styles from "../../../../../styles/cart/cartView.module.scss";
import Add from "../../../../shared/svg/add";
import AddressRadioButton from "../address-radio-button/addressRadioButton";

export default function DeliveryAddress(props) {
  const { deliveryAddresses } = props;
  const { deliveryAddress, setDeliveryAddress } = useContext(AddressContext);
  return (
    <Fragment>
      {/* delivery address list card */}
      <p className={styles.address_type_label}>Delivery Address</p>
      {/* delivery address list card */}
      {deliveryAddresses.length > 0 && (
        <div className={`${styles.address_wrapper} container-fluid py-2`}>
          <div className="row">
            {deliveryAddresses.map((delivery_address) => {
              const { id, descriptor, address } = delivery_address;
              return (
                <div className="col-6">
                  <AddressRadioButton
                    key={id}
                    checked={deliveryAddress?.id === id}
                    onClick={() => setDeliveryAddress(delivery_address)}
                  >
                    <div className="px-3">
                      <p className={styles.address_name_and_phone}>
                        {descriptor?.name}
                      </p>
                      <p className={styles.address_line_1}>
                        {address?.door}, {address?.city} {address?.state}
                      </p>
                      <p className={styles.address_line_2}>
                        {address?.area_code}
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
            <div className={styles.add_address_wrapper}>
              <Add width="15" height="15" classes={styles.add_svg_color} />
              <div className="px-3 flex-grow-1">
                <p className={styles.add_address_text}>Add Address</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
