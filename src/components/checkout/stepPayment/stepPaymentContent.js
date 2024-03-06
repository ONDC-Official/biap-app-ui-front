import React, { useContext, useEffect, useRef, useState } from "react";
import useStyles from "./style";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";

import { ReactComponent as Prepaid } from "../../../assets/images/prepaid.svg";
import { ReactComponent as CashOnDelivery } from "../../../assets/images/cashOnDelivery.svg";
import { ReactComponent as CheckedIcon } from "../../../assets/images/checked.svg";
import { payment_methods } from "../../../constants/payment-methods";
import { constructQouteObject } from "../../../api/utils/constructRequestObject";
import { AddCookie, getValueFromCookie } from "../../../utils/cookies";
import { getCall, postCall } from "../../../api/axios";
import { removeNullValues } from "../../../utils/helper";
import { AddressContext } from "../../../context/addressContext";
import useCancellablePromise from "../../../api/cancelRequest";
import Cookies from "js-cookie";
import { SSE_TIMEOUT } from "../../../constants/sse-waiting-time";
import { ToastContext } from "../../../context/toastContext";
import { toast_actions, toast_types } from "../../shared/toast/utils/toast";
import Razorpay from "../../common/Razorpay/Razorpay";

const StepPaymentContent = ({
  activePaymentMethod,
  setActivePaymentMethod,
  updateInitLoading,
  cartItemsData,
  updatedCartItemsData,
  setUpdateCartItemsData,
  setUpdateCartItemsDataOnInitialize,
  responseReceivedIds,
  selectedFulfillments,
  fulfillments,
}) => {
  const classes = useStyles();

  const { deliveryAddress, billingAddress, setBillingAddress } = useContext(AddressContext);

  const transaction_id = localStorage.getItem("transaction_id");
  const latLongInfo = JSON.parse(Cookies.get("LatLongInfo") || "{}");

  const [initializeOrderLoading, setInitializeOrderLoading] = useState(false);
  const [eventData, setEventData] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const updatedCartItems = useRef([]);
  const responseRef = useRef([]);
  const eventTimeOutRef = useRef([]);

  const dispatch = useContext(ToastContext);

  // use this function to dispatch error
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
  // HOOKS
  const { cancellablePromise } = useCancellablePromise();

  useEffect(() => {
    if (cartItemsData) {
      setCartItems(cartItemsData);
    }
    if (updatedCartItemsData) {
      updatedCartItems.current = updatedCartItemsData;
    }
    if (cartItemsData && updatedCartItemsData) {
    }
  }, [cartItemsData, updatedCartItemsData]);

  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      // handleInitializaOrder();
    }
  }, [cartItems]);

  const handleSuccess = () => {
    setInitializeOrderLoading(false);
    updateInitLoading(false);
    let checkoutObj = {
      successOrderIds: [],
      productQuotes: [],
    };
    responseRef.current.forEach((item) => {
      const { message } = item;
      checkoutObj = {
        productQuotes: [...checkoutObj.productQuotes, message?.order?.quote],
        successOrderIds: [...checkoutObj.successOrderIds, message?.order?.provider?.id.toString()],
      };
    });
    // AddCookie("checkout_details", JSON.stringify(checkoutObj));
    localStorage.setItem("checkout_details", JSON.stringify(checkoutObj));
    // handleNext();
  };
  const onInitializeOrder = async (message_id) => {
    setInitializeOrderLoading(true);
    try {
      localStorage.setItem("selectedItems", JSON.stringify(updatedCartItems));
      const data = await cancellablePromise(getCall(`/clientApis/v2/on_initialize_order?messageIds=${message_id}`));
      responseRef.current = [...responseRef.current, data[0]];
      setEventData((eventData) => [...eventData, data[0]]);

      let oldData = updatedCartItems.current;
      oldData[0].message.quote.quote = data[0].message.order.quote;
      oldData[0].message.quote.payment = data[0].message.order.payment;

      setUpdateCartItemsDataOnInitialize(oldData);
      handleSuccess();
    } catch (err) {
      dispatchToast(toast_types.error, err?.response?.data?.error?.message);
      setInitializeOrderLoading(false);
      updateInitLoading(false);
    }
    // eslint-disable-next-line
  };

  // use this function to initialize the order
  function onInit(message_id) {
    setInitializeOrderLoading(true);
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
          dispatchToast(toast_types.error, "Cannot fetch details for this product Please try again!");
          return;
        }
        // tale action to redirect them.
        const requestObject = constructQouteObject(
          updatedCartItems.filter(({ provider }) => responseReceivedIds.includes(provider.id.toString()))
        );
        if (requestObject.length !== responseRef.current.length) {
          dispatchToast(toast_types.error, "Some orders are not initialized!");
          // navigateToPayment();
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

  const initializeOrder = async (itemsList) => {
    const items = JSON.parse(JSON.stringify(Object.assign([], itemsList)));
    responseRef.current = [];
    setInitializeOrderLoading(true);
    try {
      const search_context = JSON.parse(getValueFromCookie("search_context"));

      const data = await cancellablePromise(
        postCall(
          "/clientApis/v2/initialize_order",

          items.map((item) => {
            let itemsData = Object.assign([], JSON.parse(JSON.stringify(item)));
            itemsData = itemsData.map((itemData) => {
              itemData.fulfillment_id = selectedFulfillments[itemData.local_id];
              delete itemData.product.fulfillment_id;
              if (updatedCartItems.current) {
                let findItemFromQuote = updatedCartItems.current[0].message.quote.items.find(
                  (data) => data.id === itemData.local_id
                );
                if (findItemFromQuote) {
                  itemData.parent_item_id = findItemFromQuote.parent_item_id;
                }
              } else {
              }
              return itemData;
            });

            return {
              context: {
                transaction_id: transaction_id,
                city: search_context.location.name,
                city: item[0].contextCity,
                state: search_context.location.state,
                domain: item[0].domain,
                pincode: JSON.parse(getValueFromCookie("delivery_address"))?.location.address.areaCode,
              },
              message: {
                items: itemsData,
                fulfillments: fulfillments.filter((fulfillment) =>
                  Object.values(selectedFulfillments).includes(fulfillment.id)
                ),
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
                    gps: `${deliveryAddress?.location?.address?.lat},${deliveryAddress?.location?.address?.lng}`,
                    ...deliveryAddress?.location,
                  },
                },
                payment: {
                  type: activePaymentMethod === payment_methods.COD ? "ON-FULFILLMENT" : "ON-ORDER",
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
        AddCookie("parent_and_transaction_id_map", JSON.stringify(Array.from(parentTransactionIdMap.entries())));
        onInit(
          data?.map((txn) => {
            const { context } = txn;
            return context?.message_id;
          })
        );
      }
    } catch (err) {
      console.log(err);
      dispatchToast(toast_types.error, err?.response?.data?.error?.message);
      setInitializeOrderLoading(false);
      updateInitLoading(false);
    }
  };

  const handleInitializaOrder = () => {
    setInitializeOrderLoading(true);
    updateInitLoading(true);
    let c = cartItems.map((item) => {
      return item.item;
    });
    const request_object = constructQouteObject(
      c.filter(({ provider }) => responseReceivedIds.includes(provider.local_id.toString()))
    );

    initializeOrder(request_object);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
        <Card
          className={`${classes.paymentCard} ${activePaymentMethod === payment_methods.COD ? classes.activeCard : ""} ${
            initializeOrderLoading ? classes.nonClickable : ""
          }`}
          onClick={() => {
            if (!initializeOrderLoading && activePaymentMethod !== payment_methods.COD) {
              setActivePaymentMethod(payment_methods.COD);
              handleInitializaOrder();
            }
          }}
        >
          {/*<img className={classes.paymentImage} src={cashOnDelivery} alt="Cash on delivery"/>*/}
          <CashOnDelivery className={classes.paymentImage} />
          {activePaymentMethod === payment_methods.COD && <CheckedIcon className={classes.checkedIcon} />}
        </Card>
        <Typography className={classes.paymentTypo} variant="body" component="div">
          Cash on delivery
        </Typography>
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
        <Card
          className={`${classes.paymentCard} ${
            activePaymentMethod === payment_methods.RAZORPAY ? classes.activeCard : ""
          } ${initializeOrderLoading ? classes.nonClickable : ""}`}
          onClick={() => {
            console.log("open razor pay");
            setActivePaymentMethod(payment_methods.RAZORPAY);
            // if (!initializeOrderLoading && activePaymentMethod !== payment_methods.JUSPAY) {
            //   setActivePaymentMethod(payment_methods.JUSPAY);
            //   handleInitializaOrder();
            // }
          }}
        >
          {/*<img className={classes.paymentImage} src={prepaid} alt="Prepaid"/>*/}
          <Prepaid className={classes.paymentImage} />
          {activePaymentMethod === payment_methods.RAZORPAY && <CheckedIcon className={classes.checkedIcon} />}
        </Card>
        <Typography className={classes.paymentTypo} variant="body" component="div">
          Prepaid
        </Typography>
        {activePaymentMethod === payment_methods.RAZORPAY && <Razorpay />}
      </Grid>
    </Grid>
  );
};

export default StepPaymentContent;
