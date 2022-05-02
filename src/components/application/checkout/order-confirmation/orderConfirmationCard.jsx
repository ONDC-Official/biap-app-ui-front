import React, {
  Fragment,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { buttonTypes } from "../../../../utils/button";
import styles from "../../../../styles/cart/cartView.module.scss";
// import cartItemStyles from "../../../../styles/products/cartItemsOrderSummary.module.scss";
import Button from "../../../shared/button/button";
import {
  checkout_steps,
  get_current_step,
} from "../../../../constants/checkout-steps";
import { ONDC_COLORS } from "../../../shared/colors";
import Checkmark from "../../../shared/svg/checkmark";
import { AddressContext } from "../../../../context/addressContext";
import { CartContext } from "../../../../context/cartContext";
import CrossIcon from "../../../shared/svg/cross-icon";
import ProductCard from "../../product-list/product-card/productCard";
import { getCall, postCall } from "../../../../api/axios";
import Cookies from "js-cookie";
import { constructQouteObject } from "../../../../utils/constructRequestObject";
import Toast from "../../../shared/toast/toast";
import { toast_types } from "../../../../utils/toast";

export default function OrderConfirmationCard(props) {
  const { currentActiveStep, setCurrentActiveStep, updateInitLoading } = props;
  const transaction_id = Cookies.get("transaction_id");
  const { deliveryAddress, billingAddress } = useContext(AddressContext);
  const { cartItems, onRemoveProduct } = useContext(CartContext);
  const [initializeOrderLoading, setInitializeOrderLoading] = useState(false);
  const [toast, setToast] = useState({
    toggle: false,
    type: "",
    message: "",
  });
  const initialize_polling_timer = useRef(0);
  const onInitialized = useRef();

  useEffect(() => {
    return () => {
      clearInterval(initialize_polling_timer.current);
    };
  }, []);

  async function initializeOrder(items) {
    try {
      const data = await postCall(
        "/clientApis/v2/initialize_order",
        items.map((item) => ({
          context: {
            transaction_id,
          },
          message: {
            items: item,
            billing_info: {
              address: billingAddress?.address,
              phone: billingAddress?.phone,
              name: billingAddress?.name,
              email: billingAddress?.email,
            },
            delivery_info: {
              type: "HOME-DELIVERY",
              name: deliveryAddress?.name,
              email: deliveryAddress?.email,
              phone: deliveryAddress?.phone,
              location: deliveryAddress?.location,
            },
          },
        }))
      );
      const array_of_ids = data.map((d) => {
        if (d.error) {
          return {
            error_reason: d.error.message,
            message_id: d.context.message_id,
          };
        }
        return {
          error_reason: "",
          message_id: d.context.message_id,
        };
      });
      callApiMultipleTimes(array_of_ids);
    } catch (err) {
      console.log(err);
      setInitializeOrderLoading(false);
      updateInitLoading(false);
    }
  }

  // on initialize order Api
  async function onInitializeOrder(array_of_ids) {
    try {
      const data = await getCall(
        `/clientApis/v2/on_initialize_order?messageIds=${array_of_ids
          .filter((txn) => txn.error_reason === "")
          .map((txn) => txn.message_id)}`
      );
      onInitialized.current = data;
    } catch (err) {
      console.log(err);
      setInitializeOrderLoading(false);
      updateInitLoading(false);
    }
  }

  // use this function to call initlaize order multiple times
  function callApiMultipleTimes(message_ids) {
    let counter = 3;
    initialize_polling_timer.current = setInterval(async () => {
      if (counter <= 0) {
        setInitializeOrderLoading(false);
        updateInitLoading(false);
        const allOrderInitialized = onInitialized.current.every(
          (data) => data?.message?.order
        );
        if (allOrderInitialized) {
          setToast((toast) => ({
            ...toast,
            toggle: true,
            type: toast_types.success,
            message: "Your order is initialized!",
          }));
          setCurrentActiveStep(
            get_current_step(checkout_steps.SELECT_PAYMENT_METHOD)
          );
        } else {
          setToast((toast) => ({
            ...toast,
            toggle: true,
            type: toast_types.error,
            message: "Something went wrong!",
          }));
        }
        clearInterval(initialize_polling_timer.current);
        return;
      }
      await onInitializeOrder(message_ids).finally(() => {
        counter -= 1;
      });
    }, 2000);
  }

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
      {toast.toggle && (
        <Toast
          type={toast.type}
          message={toast.message}
          onRemove={() =>
            setToast((toast) => ({
              ...toast,
              toggle: false,
            }))
          }
        />
      )}
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
            <div className="container-fluid">
              <div className="row">
                {cartItems.map(({ product, id, bpp_id, provider }) => {
                  return (
                    <div className="col-lg-6 col-sm-12 p-2" key={id}>
                      <div style={{ position: "relative" }}>
                        {!initializeOrderLoading && (
                          <div
                            style={{
                              position: "absolute",
                              top: "5px",
                              right: "5px",
                              cursor: "pointer",
                            }}
                            onClick={() => onRemoveProduct(id)}
                          >
                            <CrossIcon
                              width="20"
                              height="20"
                              color={ONDC_COLORS.SECONDARYCOLOR}
                            />
                          </div>
                        )}
                        <ProductCard
                          product={product}
                          bpp_id={bpp_id}
                          location_id={provider?.locations[0]}
                          bpp_provider_id={provider?.id}
                          bpp_provider_descriptor={{ name: provider?.name }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div
            className={`${styles.card_footer} d-flex align-items-center justify-content-center`}
          >
            <Button
              isloading={initializeOrderLoading ? 1 : 0}
              disabled={initializeOrderLoading}
              button_type={buttonTypes.primary}
              button_hover_type={buttonTypes.primary_hover}
              button_text="Place Order"
              onClick={() => {
                setInitializeOrderLoading(true);
                updateInitLoading(true);
                const request_object = constructQouteObject(cartItems);
                initializeOrder(request_object);
              }}
            />
          </div>
        </Fragment>
      )}
    </div>
  );
}
