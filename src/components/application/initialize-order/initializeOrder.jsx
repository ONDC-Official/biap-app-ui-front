import React, { Fragment, useCallback, useContext, useEffect, useRef, useState, } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import styles from "../../../styles/cart/cartView.module.scss";
import { CartContext } from "../../../context/cartContext";
import { checkout_steps, get_current_step, } from "../../../constants/checkout-steps";
import { getCall, postCall } from "../../../api/axios";
import Loading from "../../shared/loading/loading";
import { ONDC_COLORS } from "../../shared/colors";
import { buttonTypes } from "../../shared/button/utils";
import Navbar from "../../shared/navbar/navbar";
import AddressDetailsCard from "./address-details/addressDetailsCard";
import OrderConfirmationCard from "./order-confirmation/orderConfirmationCard";
import PriceDetailsCard from "./price-details-card/priceDetailsCard";
import { toast_actions, toast_types } from "../../shared/toast/utils/toast";
import { AddCookie, getValueFromCookie } from "../../../utils/cookies";
import { constructQouteObject } from "../../../api/utils/constructRequestObject";
import no_result_empty_illustration from "../../../assets/images/empty-state-illustration.svg";
import Button from "../../shared/button/button";
import { ToastContext } from "../../../context/toastContext";
import { SSE_TIMEOUT } from "../../../constants/sse-waiting-time";
import useCancellablePromise from "../../../api/cancelRequest";

export default function InitializeOrder() {
  // CONSTANTS
  const { location } = JSON.parse(getValueFromCookie("search_context") || "{}");
  const transaction_id = getValueFromCookie("transaction_id");
  const history = useHistory();

  // STATES
  const [getQuoteLoading, setGetQuoteLoading] = useState(true);
  const [updateCartLoading, setUpdateCartLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(false);
  const updatedCartItems = useRef([]);
  const [productsQuote, setProductsQuote] = useState({
    providers: [],
    total_payable: 0,
  });
  const [currentActiveStep, setCurrentActiveStep] = useState(
    get_current_step(checkout_steps.SELECT_ADDRESS)
  );
  const [eventData, setEventData] = useState([]);
  const [errorMessageTimeOut, setErrorMessageTimeOut] = useState(
    "Fetching details for this product"
  );
  const [toggleInit, setToggleInit] = useState(false);

  // REFS
  const responseRef = useRef([]);
  const eventTimeOutRef = useRef([]);

  // CONTEXT
  const { cartItems, onUpdateProduct } = useContext(CartContext);
  const dispatch = useContext(ToastContext);

  const { cancellablePromise } = useCancellablePromise();

  // use this function to dispatch error
  function dispatchToast(message) {
    dispatch({
      type: toast_actions.ADD_TOAST,
      payload: {
        id: Math.floor(Math.random() * 100),
        type: toast_types.error,
        message,
      },
    });
  }

  // use this function to fetch products quote
  function onFetchQuote(message_id) {
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
      es.addEventListener("on_select", (e) => {
        const { messageId } = JSON.parse(e.data);

        onGetQuote(messageId);
      });
      const timer = setTimeout(() => {
        eventTimeOutRef.current.forEach(({ eventSource, timer }) => {
          eventSource.close();
          clearTimeout(timer);
        });
        if (responseRef.current.length <= 0) {
          setGetQuoteLoading(false);
          dispatchToast("Cannot fetch details for this product");
          history.replace("/application/products");
          return;
        }
        const request_object = constructQouteObject(cartItems);
        if (responseRef.current.length !== request_object.length) {
          dispatchToast(
            "Cannot fetch details for some product those products will be ignored!"
          );
          setErrorMessageTimeOut("Cannot fetch details for this product");
        }
        setToggleInit(true);
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

  // use this function to get the quote of the items
  const getQuote = useCallback(async (items, searchContextData = null) => {
    responseRef.current = [];
    try {
      const search_context = searchContextData || JSON.parse(getValueFromCookie("search_context"));
      const data = await cancellablePromise(
        postCall(
          "/clientApis/v2/select",
          items.map((item) => {
            delete item[0].product.context;
            return {
              context: {
                transaction_id,
                city: search_context.location.city,
                state: search_context.location.state,
              },
              message: {
                cart: {
                  items: item,
                },
                fulfillments: [
                  {
                    end: {
                      location: {
                        gps: `${search_context?.location?.lat}, ${search_context?.location?.lng}`,
                        address: {
                          area_code: `${search_context?.location?.pincode}`,
                        },
                      },
                    },
                  },
                ],
              },
            };
          })
        )
      );
      //Error handling workflow eg, NACK
      const isNACK = data.find((item) => item.error && item.message.ack.status === "NACK");
      if (isNACK) {
        dispatchToast(isNACK.error.message);
        setGetQuoteLoading(false);
      } else {
        // fetch through events
        onFetchQuote(
          data?.map((txn) => {
            const { context } = txn;
            return context?.message_id;
          }),
        );
      }
    } catch (err) {
      dispatchToast(err?.response?.data?.error?.message);
      setGetQuoteLoading(false);
      history.replace("/application/products");
    }
    // eslint-disable-next-line
  }, []);

  // on get quote Api
  const onGetQuote = useCallback(async (message_id) => {
    try {
      const data = await cancellablePromise(
        getCall(`/clientApis/v2/on_select?messageIds=${message_id}`)
      );
      responseRef.current = [...responseRef.current, data[0]];
      setEventData((eventData) => [...eventData, data[0]]);
      // onUpdateProduct(data[0].message.quote.items, data[0].message.quote.fulfillments);
      data[0].message.quote.items.forEach(item => {
        const findItemIndexFromCart = updatedCartItems.current.findIndex((prod) => prod.id === item.id);
        if (findItemIndexFromCart > -1) {
          updatedCartItems.current[findItemIndexFromCart].fulfillment_id = item.fulfillment_id;
          updatedCartItems.current[findItemIndexFromCart].fulfillments = data[0].message.quote.fulfillments;
        }
      });
    } catch (err) {
      dispatchToast(err.message);
      setGetQuoteLoading(false);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (eventData.length > 0) {
      // fetch request object length and compare it with the response length
      const requestObject = constructQouteObject(cartItems);
      if (requestObject.length === responseRef.current.length) {
        setToggleInit(true);
      }

      const cartList = JSON.parse(JSON.stringify(updatedCartItems.current));
      // check if any one order contains error
      let total_payable = 0;
      const quotes = responseRef.current?.map((item, index) => {
        const { message, error } = item;
        let provider_payable = 0;
        const provider = {
          products: [],
          total_payable: 0,
          name: '',
          error: null,
        };

        // else generate quote of it
        if (message) {
          if (message?.quote?.quote?.price?.value) {
            provider_payable += Number(message?.quote?.quote?.price?.value);
          }
          const breakup = message?.quote?.quote?.breakup;
          const provided_by = message?.quote?.provider?.descriptor?.name;
          provider.name = provided_by;
          provider.products = breakup?.map((break_up_item) => {
            const cartIndex = cartList.findIndex(one => one.id === break_up_item["@ondc/org/item_id"]);
            const cartItem = cartIndex > -1 ? cartList[cartIndex] : null;
            let cartQuantity = cartItem ? cartItem?.quantity?.count : 0;
            let quantity = break_up_item['@ondc/org/item_quantity'] ? break_up_item['@ondc/org/item_quantity']['count'] : 0;
            let textClass = '';
            let quantityMessage = '';
            if (quantity === 0) {
              if (break_up_item['@ondc/org/title_type'] === 'item') {
                textClass = 'text-error';
                quantityMessage = 'Out of stock';


                if (cartIndex > -1) {
                  cartList.splice(cartIndex, 1);
                }
              }
            } else if (quantity !== cartQuantity) {
              textClass = break_up_item['@ondc/org/title_type'] === 'item' ? 'text-amber' : '';
              quantityMessage = `Quantity: ${quantity}/${cartQuantity}`;
              if (cartItem) {
                cartItem.quantity.count = quantity;
              }
            } else {
              quantityMessage = `Quantity: ${quantity}`;
            }

            if (error && error.code === '30009') {
              cartList.splice(cartIndex, 1);
            }
            return {
              id: break_up_item["@ondc/org/item_id"],
              title: break_up_item?.title,
              price: Number(break_up_item.price?.value)?.toFixed(2),
              cartQuantity,
              quantity,
              provided_by,
              textClass,
              quantityMessage,
            };
          });
        }

        if (error) {
          provider.error = error.message;
        }

        total_payable += provider_payable;
        provider.total_payable = provider_payable;
        return provider;
      });
      setGetQuoteLoading(false);
      setUpdateCartLoading(false);
      updatedCartItems.current = cartList;
      setProductsQuote({
        providers: quotes,
        total_payable: total_payable.toFixed(2),
      });
    }
  }, [eventData]);

  const getProviderIds = (request_object) => {
    let providers = [];
    request_object.map((cartItem) => {
      cartItem.map((item) => {
        providers.push(item.provider.id);
      });
    });
    const ids = [...new Set(providers)];
    AddCookie("providerIds", ids);
    return ids;
  };

  useEffect(() => {
    updatedCartItems.current = cartItems;
  }, [cartItems]);

  useEffect(() => {
    // this check is so that when cart is empty we do not call the
    // and when the payment is not made
    if (cartItems.length > 0) {
      const request_object = constructQouteObject(cartItems);
      getQuote(request_object);
      getProviderIds(request_object);
    }
    // eslint-disable-next-line
  }, []);

  const updateQuoteBasedOnDeliveryAddress = (searchContextData) => {
    updatedCartItems.current = cartItems;
    // this check is so that when cart is empty we do not call the
    // and when the payment is not made
    if (cartItems.length > 0) {
      const request_object = constructQouteObject(cartItems);
      setGetQuoteLoading(true);
      getQuote(request_object, searchContextData);
      getProviderIds(request_object);
    }
  };

  useEffect(() => {
    return () => {
      eventTimeOutRef.current.forEach(({ eventSource, timer }) => {
        eventSource.close();
        clearTimeout(timer);
      });
    };
  }, []);

  const loadingSpin = (
    <div
      className={`${styles.playground_height} d-flex align-items-center justify-content-center`}
    >
      <Loading backgroundColor={ONDC_COLORS.ACCENTCOLOR} />
    </div>
  );

  const empty_cart_state = (
    <div
      className={`${styles.playground_height} d-flex align-items-center justify-content-center`}
    >
      <div className="text-center">
        <div className="py-2">
          <img
            src={no_result_empty_illustration}
            alt="empty_search"
            style={{ height: "130px" }}
          />
        </div>
        <div className="py-2">
          <p className={styles.illustration_header}>Your cart is empty</p>
          <p className={styles.illustration_body}>
            Looks like your shopping cart is empty, you can shop now by clicking on below button
          </p>
        </div>
        <div className="py-3">
          <Button
            button_type={buttonTypes.primary}
            button_hover_type={buttonTypes.primary_hover}
            button_text="Shop now"
            onClick={() => history.push("/application/")}
          />
        </div>
      </div>
    </div>
  );

  return (
    <Fragment>
      <Navbar />
      {cartItems.length <= 0 ? (
        empty_cart_state
      ) : getQuoteLoading ? (
        loadingSpin
      ) : (
        <div className={styles.playground_height}>
          <div className="container">
            <div className="row py-3">
              <div className="col-12">
                <p className={styles.cart_label}>Checkout</p>
              </div>
            </div>
            <div className="row py-2">
              <div className="col-lg-8">
                <div className="container-fluid p-0">
                  <div className="row">
                    <div className="col-12 pb-3">
                      <AddressDetailsCard
                        updatedCartItems={updatedCartItems.current}
                        currentActiveStep={currentActiveStep}
                        setCurrentActiveStep={(value) =>
                          setCurrentActiveStep(value)
                        }
                        initLoading={initLoading || updateCartLoading}
                        updateQuoteBasedOnDeliveryAddress={updateQuoteBasedOnDeliveryAddress}
                      />
                    </div>
                    {
                      currentActiveStep.current_active_step_number > 1 && (
                        <div className="col-12 pb-3">
                          <OrderConfirmationCard
                            updatedCartItems={updatedCartItems.current}
                            responseReceivedIds={responseRef.current.map((item) => {
                              const { message } = item;
                              return message?.quote?.provider?.id.toString();
                            })}
                            productsQuote={productsQuote}
                            responseText={errorMessageTimeOut}
                            currentActiveStep={currentActiveStep}
                            setCurrentActiveStep={(value) =>
                              setCurrentActiveStep(value)
                            }
                            updateInitLoading={(value) => setInitLoading(value)}
                            updateCartLoading={updateCartLoading}
                            fetchUpdatedQuote={() => {
                              setUpdateCartLoading(true);
                              const request_object =
                                constructQouteObject(cartItems);
                              getQuote(request_object);
                            }}
                            toggleInit={toggleInit}
                          />
                        </div>
                      )
                    }
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="container-fluid p-0">
                  <div className="row">
                    <div className="col-12">
                      <PriceDetailsCard
                        updateCartLoading={updateCartLoading}
                        productsQuote={productsQuote}
                        totalLabel="Sub Total"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}
