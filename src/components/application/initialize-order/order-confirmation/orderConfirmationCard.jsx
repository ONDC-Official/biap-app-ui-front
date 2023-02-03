import React, {
  Fragment,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { buttonTypes } from "../../../shared/button/utils";
import styles from "../../../../styles/cart/cartView.module.scss";
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
import { AddCookie, getValueFromCookie } from "../../../../utils/cookies";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Loading from "../../../shared/loading/loading";
import { ToastContext } from "../../../../context/toastContext";
import ErrorMessage from "../../../shared/error-message/errorMessage";
import { SSE_TIMEOUT } from "../../../../constants/sse-waiting-time";
import useCancellablePromise from "../../../../api/cancelRequest";
import { removeNullValues } from "../../../../utils/helper";

export default function OrderConfirmationCard(props) {
  const {
    responseReceivedIds = [],
    responseText = "",
    toggleInit,
    currentActiveStep,
    setCurrentActiveStep,
    updateInitLoading,
    fetchUpdatedQuote,
    updateCartLoading,
  } = props;

  // CONSTANTS
  const transaction_id = Cookies.get("transaction_id");
  const latLongInfo = JSON.parse(Cookies.get("LatLongInfo") || "{}");
  const history = useHistory();

  // STATES
  const [initializeOrderLoading, setInitializeOrderLoading] = useState(false);
  const [eventData, setEventData] = useState([]);

  // CONTEXT
  const { deliveryAddress, billingAddress } = useContext(AddressContext);
  const { cartItems, onRemoveProduct } = useContext(CartContext);
  const dispatch = useContext(ToastContext);

  // REFS
  const responseRef = useRef([]);
  const eventTimeOutRef = useRef([]);
  const updateCartCounter = useRef(0);

  // HOOKS
  const { cancellablePromise } = useCancellablePromise();

  // use this function to dispatch error
  function dispatchToast(type = "toast_types.error", message) {
    dispatch({
      type: toast_actions.ADD_TOAST,
      payload: {
        id: Math.floor(Math.random() * 100),
        type,
        message,
      },
    });
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

  // function to navigate to checkout page
  function navigatoToCheckout() {
    setInitializeOrderLoading(false);
    updateInitLoading(false);
    setCurrentActiveStep(
      get_current_step(checkout_steps.SELECT_PAYMENT_METHOD)
    );
    let checkoutObj = {
      successOrderIds: [],
      productQuotes: [],
    };
    responseRef.current.forEach((item) => {
      const { message } = item;
      checkoutObj = {
        productQuotes: [...checkoutObj.productQuotes, message?.order?.quote],
        successOrderIds: [
          ...checkoutObj.successOrderIds,
          message?.order?.provider?.id.toString(),
        ],
      };
    });
    AddCookie("checkout_details", JSON.stringify(checkoutObj));
    history.replace("/application/checkout");
  }

  // use this function to initialize the order
  function onInit(message_id) {
    eventTimeOutRef.current = [];
    const token = getValueFromCookie("token");
    let header = {
      headers: {
        ...(token && {
          Authorization: `Bearer ${token}`,
        }),
      },
    };
    message_id.forEach((id) => {
      let es = new window.EventSourcePolyfill(
        `${process.env.REACT_APP_BASE_URL}clientApis/events?messageId=${id}`,
        header
      );
      es.addEventListener("on_init", (e) => {
        const { messageId } = JSON.parse(e.data);
        onInitializeOrder(messageId);
      });
      const timer = setTimeout(() => {
        eventTimeOutRef.current.forEach(({ eventSource, timer }) => {
          eventSource.close();
          clearTimeout(timer);
        });
        // check if all the orders got cancled
        if (responseRef.current.length <= 0) {
          setInitializeOrderLoading(false);
          dispatchToast(
            toast_types.error,
            "Cannot fetch details for this product Please try again!"
          );
          return;
        }
        // tale action to redirect them.
        const requestObject = constructQouteObject(
          cartItems.filter(({ provider }) =>
            responseReceivedIds.includes(provider.id.toString())
          )
        );
        if (requestObject.length !== responseRef.current.length) {
          dispatchToast(toast_types.error, "Some orders are not initialized!");
          navigatoToCheckout();
        }
      }, SSE_TIMEOUT);

      eventTimeOutRef.current = [
        ...eventTimeOutRef.current,
        {
          eventSource: es,
          timer,
        },
      ];
    });
  }

  const initializeOrder = useCallback(
    async (items) => {
      responseRef.current = [];
      try {
        const search_context = JSON.parse(getValueFromCookie("search_context"));
        const data = await cancellablePromise(
          postCall(
            "/clientApis/v2/initialize_order",
            items.map((item) => {
              const fulfillments = item[0].fulfillments;
              delete item[0].fulfillments;
              return {
                context: {
                  transaction_id,
                  city: search_context.location.name,
                  state: search_context.location.state,
                },
                message: {
                  items: item,
                  fulfillments: fulfillments,
                  billing_info: {
                    address: removeNullValues(billingAddress?.address),
                    phone: billingAddress?.phone,
                    name: billingAddress?.name,
                    email: billingAddress?.email,
                  },
                  delivery_info: {
                    type: "Delivery",
                    name: deliveryAddress?.name,
                    email: deliveryAddress?.email,
                    phone: deliveryAddress?.phone,
                    location: {
                      gps: `${latLongInfo?.latitude}, ${latLongInfo?.longitude}`,
                      ...deliveryAddress?.location,
                    },
                  },
                  payment: {
                    type: "ON-FULFILLMENT",
                  },
                },
              };
            })
          )
        );
        //Error handling workflow eg, NACK
        const isNACK = data.find((item) => item.error && item.message.ack.status === "NACK");
        if (isNACK) {
          dispatchToast(toast_types.error, isNACK.error.message);
          setInitializeOrderLoading(false);
          updateInitLoading(false);
        } else {
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
          onInit(
            data?.map((txn) => {
              const { context } = txn;
              return context?.message_id;
            })
          );
        }
      } catch (err) {
        dispatchToast(toast_types.error, err.message);
        setInitializeOrderLoading(false);
        updateInitLoading(false);
      }
    },
    // eslint-disable-next-line
    [billingAddress, deliveryAddress]
  );

  // on initialize order Api
  const onInitializeOrder = useCallback(async (message_id) => {
    try {
      const data = await cancellablePromise(
        getCall(`/clientApis/v2/on_initialize_order?messageIds=${message_id}`)
      );
      responseRef.current = [...responseRef.current, data[0]];
      setEventData((eventData) => [...eventData, data[0]]);
    } catch (err) {
      dispatchToast(toast_types.error, err.message);
      setInitializeOrderLoading(false);
      updateInitLoading(false);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (eventData.length > 0) {
      // fetch request object length and compare it with the response length
      const requestObject = constructQouteObject(
        cartItems.filter(({ provider }) =>
          responseReceivedIds.includes(provider.id.toString())
        )
      );
      if (requestObject.length === responseRef.current.length) {
        dispatchToast(toast_types.success, "All Your orders are initialised!");
        navigatoToCheckout();
      }
    }
    // eslint-disable-next-line
  }, [eventData]);

  useEffect(() => {
    if (updateCartCounter.current > 0) {
      fetchUpdatedQuote();
    }
  }, [updateCartCounter.current]);

  useEffect(() => {
    return () => {
      eventTimeOutRef.current.forEach(({ eventSource, timer }) => {
        eventSource.close();
        clearTimeout(timer);
      });
    };
  }, []);

  return (
    <div className={styles.price_summary_card}>
      <div
        className={`${isStepCompleted()
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
                    const { id: provider_id, locations } = provider;
                    return (
                      <div className="col-lg-6 col-sm-12 p-2" key={id}>
                        <div style={{ position: "relative" }}>
                          {!initializeOrderLoading && (
                            <div
                              className={styles.remove_item}
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
                            show_quantity_button={!initializeOrderLoading}
                            bpp_provider_id={provider?.id}
                            onUpdateCart={() =>
                              (updateCartCounter.current += 1)
                            }
                          />
                          {!responseReceivedIds.includes(
                            provider_id.toString()
                          ) && (
                              <>
                                <ErrorMessage>{responseText}</ErrorMessage>
                                <div className={styles.product_disabled} />
                              </>
                            )}
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
              disabled={
                initializeOrderLoading || updateCartLoading || !toggleInit
              }
              button_type={buttonTypes.primary}
              button_hover_type={buttonTypes.primary_hover}
              button_text="Proceed to pay"
              onClick={() => {
                setInitializeOrderLoading(true);
                updateInitLoading(true);
                const request_object = constructQouteObject(
                  cartItems.filter(({ provider }) =>
                    responseReceivedIds.includes(provider.id.toString())
                  )
                );
                initializeOrder(request_object);
              }}
            />
          </div>
        </Fragment>
      )}
    </div>
  );
}
