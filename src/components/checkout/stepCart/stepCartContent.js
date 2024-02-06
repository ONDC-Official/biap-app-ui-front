import React, { useContext, useEffect, useRef, useState } from "react";
import Cart from "../../application/cart/cart";
import { Button } from "@mui/material";
import useStyles from "./style";
import { getValueFromCookie } from "../../../utils/cookies";
import { ToastContext } from "../../../context/toastContext";
import { toast_actions, toast_types } from "../../shared/toast/utils/toast";
import { useHistory } from "react-router-dom";
import { getCall, postCall } from "../../../api/axios";
import useCancellablePromise from "../../../api/cancelRequest";
import { AddressContext } from "../../../context/addressContext";
import { constructQouteObject } from "../../../api/utils/constructRequestObject";
import { SSE_TIMEOUT } from "../../../constants/sse-waiting-time";
import Loading from "../../shared/loading/loading";

const StepCartContent = (props) => {
  const { isError, handleNext, cartItemsData, updatedCartItemsData, setUpdateCartItemsData } = props;

  const classes = useStyles();
  const history = useHistory();
  const dispatch = useContext(ToastContext);
  const { deliveryAddress } = useContext(AddressContext);
  const { cancellablePromise } = useCancellablePromise();

  function dispatchToast(type, message) {
    dispatch({
      type: toast_actions.ADD_TOAST,
      payload: {
        id: Math.floor(Math.random() * 100),
        type,
        message,
      },
    });
  }

  const transaction_id = getValueFromCookie("transaction_id");
  const responseRef = useRef([]);
  const eventTimeOutRef = useRef([]);
  const [getQuoteLoading, setGetQuoteLoading] = useState(false);
  const [errorMessageTimeOut, setErrorMessageTimeOut] = useState("Fetching details for this product");
  const [toggleInit, setToggleInit] = useState(false);
  const [eventData, setEventData] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const updatedCartItems = useRef([]);
  const [loading, setLoading] = useState(false);
  const [quoteError, setQuoteError] = useState(false);

  const getQuote = async (items, searchContextData = null) => {
    responseRef.current = [];
    if (deliveryAddress) {
      try {
        setGetQuoteLoading(true);
        const search_context = searchContextData || JSON.parse(getValueFromCookie("search_context"));
        let domain = "";
        let contextCity = "";
        const updatedItems = items.map((item) => {
          const newItem = Object.assign({}, item);
          domain = newItem.domain;
          contextCity = newItem.contextCity
          delete newItem.context;
          delete newItem.contextCity;
          return newItem;
        });
        let selectPayload = {
          context: {
            transaction_id: transaction_id,
            domain: domain,
            city: contextCity || deliveryAddress.location.address.city,
            state: deliveryAddress.location.address.state,
          },
          message: {
            cart: {
              items: updatedItems,
            },
            fulfillments: [
              {
                end: {
                  location: {
                    gps: `${deliveryAddress?.location?.address?.lat},${deliveryAddress?.location?.address?.lng}`,
                    address: {
                      area_code: `${search_context?.location?.pincode}`,
                    },
                  },
                },
              },
            ],
          },
        };
        const data = await cancellablePromise(postCall("/clientApis/v2/select", [selectPayload]));
        //Error handling workflow eg, NACK
        const isNACK = data.find((item) => item.error && item.message.ack.status === "NACK");
        if (isNACK) {
          dispatchToast(toast_types.error, isNACK.error.message);
          setGetQuoteLoading(false);
          setQuoteError(true);
        } else {
          // fetch through events
          onFetchQuote(
            data?.map((txn) => {
              const { context } = txn;
              return context?.message_id;
            })
          );
        }
      } catch (err) {
        setGetQuoteLoading(false);
        setQuoteError(true);
        history.replace("/application/products");
      }
    } else {
      dispatchToast(toast_types.error, "Please select address");
      setQuoteError(true);
    }
  };

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
        `${process.env.REACT_APP_BASE_URL}clientApis/events/v2?messageId=${id}`,
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
          dispatchToast(toast_types.error, "Cannot fetch details for this product");
          setQuoteError(true);

          history.replace("/application/products");
          return;
        }
        let c = cartItems.map((item) => {
          return item.item;
        });
        const request_object = constructQouteObject(c);
        if (responseRef.current.length !== request_object.length) {
          dispatchToast(toast_types.error, "Cannot fetch details for some product those products will be ignored!");
          setErrorMessageTimeOut("Cannot fetch details for this product");
          setGetQuoteLoading(false);
          setQuoteError(true);
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

  const onGetQuote = async (message_id) => {
    try {
      const data = await cancellablePromise(getCall(`/clientApis/v2/on_select?messageIds=${message_id}`));
      responseRef.current = [...responseRef.current, data[0]];

      setEventData((eventData) => [...eventData, data[0]]);

      // onUpdateProduct(data[0].message.quote.items, data[0].message.quote.fulfillments);
      data[0].message.quote.items.forEach((item) => {
        const findItemIndexFromCart = updatedCartItems.current.findIndex((prod) => prod.item.product.id === item.id);
        if (findItemIndexFromCart > -1) {
          updatedCartItems.current[findItemIndexFromCart].item.product.fulfillment_id = item.fulfillment_id;
          updatedCartItems.current[findItemIndexFromCart].item.product.fulfillments =
            data[0].message.quote.fulfillments;
        }
      });

      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems.current));
      localStorage.setItem("updatedCartItems", JSON.stringify([...[], data[0]]));
      setUpdateCartItemsData([...[], data[0]]);
      setGetQuoteLoading(false);

      if (data[0].error != null) {
        setQuoteError(true);
      } else {
        setQuoteError(false);
      }
    } catch (err) {
      dispatchToast(toast_types.error, err?.response?.data?.error?.message);
      setGetQuoteLoading(false);
      setQuoteError(true);
    }
    // eslint-disable-next-line
  };

  useEffect(() => {
    if (updatedCartItemsData) {
      if (updatedCartItemsData[0]?.error != null) setQuoteError(true);
    }
  }, [updatedCartItemsData]);

  return (
    <div>
      <Cart
        showOnlyItems={true}
        setCheckoutCartItems={(data) => {
          setCartItems(data);
          updatedCartItems.current = data;
        }}
      />
      <div className={classes.userActionContainer}>
        <Button
          variant="contained"
          onClick={() => {
            handleNext();
          }}
          disabled={getQuoteLoading || quoteError}
        >
          Continue
        </Button>
        <Button
          sx={{ marginLeft: "10px", width: 130 }}
          variant="contained"
          onClick={() => {
            if (cartItems.length > 0) {
              let c = cartItems.map((item) => {
                return item.item;
              });
              const request_object = constructQouteObject(c);
              getQuote(request_object[0]);
            }
          }}
          disabled={cartItems.length == 0 || getQuoteLoading}
        >
          {getQuoteLoading ? <Loading width="8px" height="8px" /> : "Update Cart"}
        </Button>
      </div>
    </div>
  );
};

export default StepCartContent;
