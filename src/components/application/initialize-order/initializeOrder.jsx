import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  Fragment,
  useCallback,
} from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import styles from "../../../styles/cart/cartView.module.scss";
import { CartContext } from "../../../context/cartContext";
import {
  get_current_step,
  checkout_steps,
} from "../../../constants/checkout-steps";
import { postCall, getCall } from "../../../api/axios";
import Loading from "../../shared/loading/loading";
import { ONDC_COLORS } from "../../shared/colors";
import { buttonTypes } from "../../shared/button/utils";
import Navbar from "../../shared/navbar/navbar";
import AddressDetailsCard from "./address-details/addressDetailsCard";
import OrderConfirmationCard from "./order-confirmation/orderConfirmationCard";
import PriceDetailsCard from "../checkout/price-details-card/priceDetailsCard";
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
  const [productsQuote, setProductsQoute] = useState({
    products: [],
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
  const getQuote = useCallback(async (items) => {
    responseRef.current = [];
    try {
      const search_context = JSON.parse(getValueFromCookie("search_context"));
      const data = await cancellablePromise(
        postCall(
          "/clientApis/v2/select",
          items.map((item) => {
            delete item[0].product.context;
            return {
              context: {
                transaction_id,
                city: search_context.location.name,
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
                        gps: `${location?.lat}, ${location?.lng}`,
                        address: {
                          area_code: `${location?.pincode}`,
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
      onUpdateProduct(data[0].message.quote.items, data[0].message.quote.fulfillments)
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
      // check if any one order contains error
      let total_payable = 0;
      const quotes = responseRef.current?.map((item, index) => {
        const { message } = item;
        // else generate quote of it
        if (message) {
          total_payable += Number(message?.quote?.quote?.price?.value);
          const breakup = message?.quote?.quote?.breakup;
          const provided_by = message?.quote?.provider?.descriptor?.name;
          const product = breakup?.map((break_up_item) => ({
            title: break_up_item?.title,
            price: Number(break_up_item.price?.value)?.toFixed(2),
            provided_by,
          }));
          return product;
        }
        return {
          title: "",
          price: "",
          provided_by: "",
        };
      });
      setGetQuoteLoading(false);
      setUpdateCartLoading(false);
      setProductsQoute({
        products: quotes.flat(),
        total_payable: total_payable.toFixed(2),
      });
    }
    // eslint-disable-next-line
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
    // this check is so that when cart is empty we do not call the
    // and when the payment is not made
    if (cartItems.length > 0) {
      const request_object = constructQouteObject(cartItems);
      getQuote(request_object);
      getProviderIds(request_object);
    }
    // eslint-disable-next-line
  }, []);

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
            looks like your shopping cart is empty, you can shop now by clicking
            button below
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
                        currentActiveStep={currentActiveStep}
                        setCurrentActiveStep={(value) =>
                          setCurrentActiveStep(value)
                        }
                        initLoading={initLoading || updateCartLoading}
                      />
                    </div>
                    <div className="col-12 pb-3">
                      <OrderConfirmationCard
                        responseReceivedIds={responseRef.current.map((item) => {
                          const { message } = item;
                          return message?.quote?.provider?.id.toString();
                        })}
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
