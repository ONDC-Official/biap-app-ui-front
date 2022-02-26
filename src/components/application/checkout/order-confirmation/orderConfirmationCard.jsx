import React, { Fragment, useContext } from "react";
import { buttonTypes } from "../../../../utils/button";
import styles from "../../../../styles/cart/cartView.module.scss";
import Button from "../../../shared/button/button";
import {
  checkout_steps,
  get_current_step,
} from "../../../../constants/checkout-steps";
import { ONDC_COLORS } from "../../../shared/colors";
import Checkmark from "../../../shared/svg/checkmark";
import { AddressContext } from "../../../../context/addressContext";

export default function OrderConfirmationCard(props) {
  const { currentActiveStep, setCurrentActiveStep } = props;
  const { deliveryAddress, billingAddress } = useContext(AddressContext);

  console.log(deliveryAddress, billingAddress);
  // function to check whether step is completed or not
  function isStepCompleted() {
    if (currentActiveStep.current_active_step_number > 2) {
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
      currentActiveStep.current_active_step_id === checkout_steps.CONFIRM_ORDER
    ) {
      return true;
    }
    return false;
  }
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
        <p className={styles.card_header_title}>Order Confirmation</p>
        {isStepCompleted() && (
          <div className="px-3">
            <Checkmark width="25" height="16" style={{ marginBottom: "5px" }} />
          </div>
        )}
        {isStepCompleted() && toggleChangeButton() && (
          <div className="ms-auto">
            <Button
              button_type={buttonTypes.primary}
              button_hover_type={buttonTypes.primary_hover}
              button_text="Change"
              onClick={() =>
                setCurrentActiveStep(
                  get_current_step(checkout_steps.CONFIRM_ORDER)
                )
              }
            />
          </div>
        )}
      </div>
      {isCurrentStep() && (
        <Fragment>
          <div className={styles.card_body}>
            {/* List of items will come here */}
            list of items
          </div>
          <div
            className={`${styles.card_footer} d-flex align-items-center justify-content-center`}
          >
            <Button
              button_type={buttonTypes.primary}
              button_hover_type={buttonTypes.primary_hover}
              button_text="Confirm"
              onClick={() =>
                setCurrentActiveStep(
                  get_current_step(checkout_steps.SELECT_PAYMENT_METHOD)
                )
              }
            />
          </div>
        </Fragment>
      )}
    </div>
  );
}
