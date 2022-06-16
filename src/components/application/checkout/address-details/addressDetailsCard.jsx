import React, { Fragment, useContext, useEffect, useState } from "react";
import { buttonTypes } from "../../../../utils/button";
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
import { toast_actions, toast_types } from "../../../../utils/toast";
import { ToastContext } from "../../../../context/toastContext";

export default function AddressDetailsCard(props) {
  const { currentActiveStep, setCurrentActiveStep, initLoading } = props;
  const [deliveryAddresses, setDeliveryAddresses] = useState([]);
  const [billingAddresses, setBillingAddresses] = useState([]);
  const { deliveryAddress, billingAddress } = useContext(AddressContext);
  const dispatch = useContext(ToastContext);
  const [fetchDeliveryAddressLoading, setFetchDeliveryAddressLoading] =
    useState();
  const [fetchBillingAddressLoading, setFetchBillingAddressLoading] =
    useState();

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
        const data = await getCall("/clientApis/v1/delivery_address");
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
  }, []);

  useEffect(() => {
    // use this function to fetch existing address of the user
    async function fetchBillingAddress() {
      setFetchBillingAddressLoading(true);
      try {
        const data = await getCall("/clientApis/v1/billing_details");
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
  }, []);

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
        } d-flex align-items-center`}
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
        <p className={styles.card_header_title}>Address</p>
        {isStepCompleted() && (
          <div className="px-3">
            <Checkmark width="25" height="16" style={{ marginBottom: "5px" }} />
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
              disabled={!deliveryAddress || !billingAddress}
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
