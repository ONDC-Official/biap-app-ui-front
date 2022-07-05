import React, {
  Fragment,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { buttonTypes } from "../../../shared/button/utils";
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
import { constructQouteObject } from "../../../../api/utils/constructRequestObject";
import { toast_actions, toast_types } from "../../../shared/toast/utils/toast";
import { AddCookie } from "../../../../utils/cookies";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Loading from "../../../shared/loading/loading";
import { ToastContext } from "../../../../context/toastContext";

export default function OrderConfirmationCard(props) {
  const {
    currentActiveStep,
    setCurrentActiveStep,
    updateInitLoading,
    fetchUpdatedQuote,
    updateCartLoading,
  } = props;
  const transaction_id = Cookies.get("transaction_id");
  const history = useHistory();
  const { deliveryAddress, billingAddress } = useContext(AddressContext);
  const { cartItems, onRemoveProduct } = useContext(CartContext);
  const [initializeOrderLoading, setInitializeOrderLoading] = useState(false);
  const dispatch = useContext(ToastContext);
  const initialize_polling_timer = useRef(0);
  const onInitialized = useRef();
  const updateCartCounter = useRef(0);

  useEffect(() => {
    return () => {
      clearInterval(initialize_polling_timer.current);
    };
  }, []);

  useEffect(() => {
    if (updateCartCounter.current > 0) {
      fetchUpdatedQuote();
    }
    // eslint-disable-next-line
  }, [updateCartCounter.current]);

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
      const parentTransactionIdMap = new Map();
      data.map((data) => {
        const provider_id = data?.context?.provider_id;
        return parentTransactionIdMap.set(provider_id, {
          parent_order_id: data?.context?.parent_order_id,
          transaction_id: data?.context?.transaction_id,
        });
      });
      // store parent order id to cookies
      AddCookie("parent_order_id", data[0]?.context?.parent_order_id);
      // store the map into cookies
      AddCookie(
        "parent_and_transaction_id_map",
        JSON.stringify(Array.from(parentTransactionIdMap.entries()))
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
      dispatch({
        type: toast_actions.ADD_TOAST,
        payload: {
          id: Math.floor(Math.random() * 100),
          type: toast_types.error,
          message: "Something went wrong!",
        },
      });
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
      dispatch({
        type: toast_actions.ADD_TOAST,
        payload: {
          id: Math.floor(Math.random() * 100),
          type: toast_types.error,
          message: "Something went wrong!",
        },
      });
      setInitializeOrderLoading(false);
      updateInitLoading(false);
    }
  }

  // use this function to call initlaize order multiple times
  function callApiMultipleTimes(message_ids) {
    let counter = 8;
    initialize_polling_timer.current = setInterval(async () => {
      if (counter <= 0) {
        setInitializeOrderLoading(false);
        updateInitLoading(false);
        const allOrderInitialized = onInitialized.current.every(
          (data) => data?.message?.order
        );
        if (allOrderInitialized) {
          dispatch({
            type: toast_actions.ADD_TOAST,
            payload: {
              id: Math.floor(Math.random() * 100),
              type: toast_types.success,
              message: "Your order is initialised!",
            },
          });
          setCurrentActiveStep(
            get_current_step(checkout_steps.SELECT_PAYMENT_METHOD)
          );
          AddCookie(
            "product-quote",
            JSON.stringify({
              quote: onInitialized.current?.map(
                (data) => data?.message?.order?.quote
              ),
            })
          );
          history.replace("/application/checkout");
        } else {
          dispatch({
            type: toast_actions.ADD_TOAST,
            payload: {
              id: Math.floor(Math.random() * 100),
              type: toast_types.error,
              message: "Something went wrong!",
            },
          });
        }
        clearInterval(initialize_polling_timer.current);
        return;
      }
      await onInitializeOrder(message_ids).finally(() => {
        counter -= 1;
      });
    }, 3000);
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
        <p className={styles.card_header_title}>Update Cart</p>
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
                {updateCartLoading ? (
                  <div
                    style={{ height: "150px" }}
                    className="d-flex align-items-center justify-content-center"
                  >
                    <Loading backgroundColor={ONDC_COLORS.ACCENTCOLOR} />
                  </div>
                ) : (
                  cartItems.map(({ id, bpp_id, product, provider }) => {
                    const { locations } = provider;
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
                              onClick={() => {
                                onRemoveProduct(id);
                                updateCartCounter.current += 1;
                              }}
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
                            price={product?.price}
                            bpp_provider_descriptor={{
                              name: product?.provider_details?.descriptor?.name,
                            }}
                            bpp_id={bpp_id}
                            location_id={locations ? locations[0] : ""}
                            bpp_provider_id={provider?.id}
                            onUpdateCart={() =>
                              (updateCartCounter.current += 1)
                            }
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
          <div
            className={`${styles.card_footer} d-flex align-items-center justify-content-center`}
          >
            <Button
              isloading={initializeOrderLoading ? 1 : 0}
              disabled={initializeOrderLoading || updateCartLoading}
              button_type={buttonTypes.primary}
              button_hover_type={buttonTypes.primary_hover}
              button_text="Proceed to pay"
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
