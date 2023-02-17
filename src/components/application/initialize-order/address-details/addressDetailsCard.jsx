import React, { Fragment, useContext, useEffect, useState } from "react";
import { buttonTypes } from "../../../shared/button/utils";
import styles from "../../../../styles/cart/cartView.module.scss";
import Button from "../../../shared/button/button";
import { ONDC_COLORS } from "../../../shared/colors";
import {
  checkout_steps,
  get_current_step,
} from "../../../../constants/checkout-steps";
import Checkmark from "../../../shared/svg/checkmark";
import Loading from "../../../shared/loading/loading";
import { getCall } from "../../../../api/axios";
import { AddressContext } from "../../../../context/addressContext";
import DeliveryAddress from "./delivery-address/deliveryAddress";
import BillingAddress from "./billing-address/billingAddress";
import { toast_actions, toast_types } from "../../../shared/toast/utils/toast";
import { ToastContext } from "../../../../context/toastContext";
import useCancellablePromise from "../../../../api/cancelRequest";

export default function AddressDetailsCard(props) {
  const { currentActiveStep, setCurrentActiveStep, initLoading, updatedCartItems } = props;

  // STATES
  const [deliveryAddresses, setDeliveryAddresses] = useState([]);
  const [billingAddresses, setBillingAddresses] = useState([]);
  const [fetchDeliveryAddressLoading, setFetchDeliveryAddressLoading] =
      useState();
  const [fetchBillingAddressLoading, setFetchBillingAddressLoading] =
      useState();

  // CONTEXT
  const { deliveryAddress, billingAddress, setDeliveryAddress } =
      useContext(AddressContext);
  const dispatch = useContext(ToastContext);

  // HOOKS
  const { cancellablePromise } = useCancellablePromise();

  // function to check whether step is completed or not
  function isStepCompleted() {
    if (currentActiveStep.current_active_step_number > 1) {
      return true;
    }
    return false;
  }

  // function to check whether to show the change button or not
  function toggleChangeButton() {
    if (currentActiveStep.current_active_step_number < 3) {
      return true;
    }
    return false;
  }

  // function to get the current active step
  function isCurrentStep() {
    if (
        currentActiveStep.current_active_step_id === checkout_steps.SELECT_ADDRESS
    ) {
      return true;
    }
    return false;
  }

  useEffect(() => {
    // use this function to fetch existing address of the user
    async function fetchDeliveryAddress() {
      setFetchDeliveryAddressLoading(true);
      try {
        const data = await cancellablePromise(
            getCall("/clientApis/v1/delivery_address")
        );
        setDeliveryAddresses(data);
      } catch (err) {
        if (err.response.data.length > 0) {
          setDeliveryAddresses([]);
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

    fetchDeliveryAddress();

    const updatedDeliveryAddress = deliveryAddresses.filter(
        (da) => da.id === deliveryAddress.id
    )[0];
    if (updatedDeliveryAddress) {
      const { id, descriptor, address } = updatedDeliveryAddress;
      let formattedUpdatedAddress = {
        id,
        name: descriptor?.name || "",
        email: descriptor?.email || "",
        phone: descriptor?.phone || "",
        location: {
          address,
        },
      };

      setDeliveryAddress(formattedUpdatedAddress);
    }
    // eslint-disable-next-line
  }, [currentActiveStep]);

  useEffect(() => {
    // use this function to fetch existing address of the user
    async function fetchBillingAddress() {
      setFetchBillingAddressLoading(true);
      try {
        const data = await cancellablePromise(
            getCall("/clientApis/v1/billing_details")
        );
        setBillingAddresses(data);
      } catch (err) {
        if (err.response.data.length > 0) {
          setBillingAddresses([]);
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
        setFetchBillingAddressLoading(false);
      }
    }

    fetchBillingAddress();

    // eslint-disable-next-line
  }, [currentActiveStep.current_active_step_number]);

  const in_card_loading = (
      <div
          className="d-flex align-items-center justify-content-center"
          style={{ height: "100px" }}
      >
        <Loading backgroundColor={ONDC_COLORS.ACCENTCOLOR} />
      </div>
  );

  return (
      <div className={styles.price_summary_card}>
        <div
            className={`${
                isStepCompleted()
                    ? styles.step_completed_card_header
                    : styles.card_header
            }`}
            style={
              isCurrentStep()
                  ? {
                    borderBottom: `1px solid ${ONDC_COLORS.BACKGROUNDCOLOR}`,
                    borderBottomRightRadius: 0,
                    borderBottomLeftRadius: 0,
                  }
                  : {
                    borderBottomRightRadius: "10px",
                    borderBottomLeftRadius: "10px",
                  }
            }
        >
          <div className="d-flex align-items-center">
            <p className={styles.card_header_title}>Address</p>
            {isStepCompleted() && (
                <div className="px-3">
                  <Checkmark
                      width="25"
                      height="16"
                      style={{ marginBottom: "5px" }}
                  />
                </div>
            )}
            {isStepCompleted() && toggleChangeButton() && (
                <div className="ms-auto">
                  <Button
                      disabled={initLoading}
                      button_type={buttonTypes.primary}
                      button_hover_type={buttonTypes.primary_hover}
                      button_text="Change"
                      onClick={() =>
                          setCurrentActiveStep(
                              get_current_step(checkout_steps.SELECT_ADDRESS)
                          )
                      }
                  />
                </div>
            )}
          </div>
          {isStepCompleted() && (
              <div className="py-2">
                <p
                    className={styles.address_type_label}
                    style={{ fontSize: "14px", fontWeight: "normal" }}
                >
                  Delivering to:
                </p>
                <p className={styles.address_name_and_phone}>
                  {deliveryAddress?.name}
                </p>
                <p className={`${styles.address_line_2} pb-2`}>
                  {deliveryAddress?.email} - {deliveryAddress?.phone}
                </p>
                <p className={styles.address_line_1}>
                  {deliveryAddress?.location?.address?.street
                      ? deliveryAddress?.location?.address.street
                      : deliveryAddress?.location?.address?.door}
                  , {deliveryAddress?.location?.address?.city}{" "}
                  {deliveryAddress?.location?.address?.state}
                </p>
                <p className={styles.address_line_2}>
                  {deliveryAddress?.location?.address?.areaCode}
                </p>
              </div>
          )}
        </div>
        {isCurrentStep() && (
            <Fragment>
              <div className={styles.card_body}>
                {fetchDeliveryAddressLoading ? (
                    in_card_loading
                ) : (
                    <DeliveryAddress
                        deliveryAddresses={deliveryAddresses}
                        setDeliveryAddresses={(value) => setDeliveryAddresses(value)}
                    />
                )}
                <hr style={{ background: ONDC_COLORS.SECONDARYCOLOR }} />
                {fetchBillingAddressLoading ? (
                    in_card_loading
                ) : (
                    <BillingAddress
                        billingAddresses={billingAddresses}
                        setBillingAddresses={(value) => setBillingAddresses(value)}
                    />
                )}
              </div>
              <div
                  className={`${styles.card_footer} d-flex align-items-center justify-content-center`}
              >
                <Button
                    disabled={!deliveryAddress || !billingAddress || updatedCartItems.length === 0}
                    button_type={buttonTypes.primary}
                    button_hover_type={buttonTypes.primary_hover}
                    button_text="Proceed"
                    onClick={() =>
                        setCurrentActiveStep(
                            get_current_step(checkout_steps.CONFIRM_ORDER)
                        )
                    }
                />
              </div>
            </Fragment>
        )}
      </div>
  );
}
