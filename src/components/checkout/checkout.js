import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
} from "react";
import useStyles from "./style";

import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";

import StepCustomerLabel from "./stepCustomer/stepCustomerLabel";
import StepCustomerContent from "./stepCustomer/stepCustomerContent";
import StepAddressLabel from "./stepAddress/stepAddressLabel";
import StepAddressContent from "./stepAddress/stepAddressContent";
import StepPaymentLabel from "./stepPayment/stepPaymentLabel";
import StepPaymentContent from "./stepPayment/stepPaymentContent";

import { Link, Redirect, useHistory } from "react-router-dom";
import Box from "@mui/material/Box";
import { constructQouteObject } from "../../api/utils/constructRequestObject";
import styles from "../../styles/cart/cartView.module.scss";
import { payment_methods } from "../../constants/payment-methods";
import { getValueFromCookie, removeCookie } from "../../utils/cookies";
import { getCall, postCall } from "../../api/axios";
import useCancellablePromise from "../../api/cancelRequest";
import { SSE_TIMEOUT } from "../../constants/sse-waiting-time";
import { ToastContext } from "../../context/toastContext";
import { toast_actions, toast_types } from "../shared/toast/utils/toast";
import Loading from "../shared/loading/loading";
import { CartContext } from "../../context/cartContext";
import StepFulfillmentLabel from "./StepFulfillment/stepFulfillmentLabel";
import StepFulfillmentContent from "./StepFulfillment/stepFulfillmentContent";
import StepCartLabel from "./stepCart/stepCartLabel";
import StepCartContent from "./stepCart/stepCartContent";

import moment from "moment";

import { v4 as uuidv4 } from "uuid";

const Checkout = () => {
  const classes = useStyles();
  const history = useHistory();

  const steps = ["Cart", "Customer", "Fulfillment", "Add Address", "Payment"];
  const [activeStep, setActiveStep] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [updatedCartItems, setUpdatedCartItems] = useState([]);
  const [productsQuote, setProductsQuote] = useState({
    providers: [],
    isError: false,
    total_payable: 0,
  });
  const [initLoading, setInitLoading] = useState(false);

  const [activePaymentMethod, setActivePaymentMethod] = useState("");
  const [confirmOrderLoading, setConfirmOrderLoading] = useState(false);
  const responseRef = useRef([]);
  const eventTimeOutRef = useRef([]);
  const [eventData, setEventData] = useState([]);
  const dispatch = useContext(ToastContext);
  const { fetchCartItems } = useContext(CartContext);
  const [quoteItemInProcessing, setQuoteItemInProcessing] = useState(null);
  const [selectedFulfillments, setSelectedFulfillments] = useState({});
  // HOOKS
  const { cancellablePromise } = useCancellablePromise();

  const resetCartItems = () => {
    const cartItemsData = JSON.parse(localStorage.getItem("cartItems"));
    const updatedCartItemsData = JSON.parse(
      localStorage.getItem("updatedCartItems")
    );
    setCartItems(cartItemsData);
    setSelectedFulfillments({});
    setUpdatedCartItems(updatedCartItemsData);
  };

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

  useEffect(() => {
    resetCartItems();
    let timeout;
    const duration = moment.duration(
      updatedCartItems[0]?.message.quote.quote.ttl
    );
    timeout = setTimeout(() => {
      history.push("/application/cart");
      dispatchToast(toast_types.error, "Request Timed out, please try again!");
    }, duration.milliseconds);

    return () => {
      clearTimeout(timeout);
    };
  }, [updatedCartItems[0]?.message.quote.quote.ttl]);

  useEffect(() => {
    try {
      if (updatedCartItems.length > 0) {
        // fetch request object length and compare it with the response length
        let c = cartItems.map((item) => {
          return item.item;
        });
        const requestObject = constructQouteObject(c);
        if (requestObject.length === updatedCartItems.length) {
          // setToggleInit(true);
        }

        const cartList = JSON.parse(JSON.stringify(updatedCartItems));
        // check if any one order contains error
        let total_payable = 0;
        let isAnyError = false;
        let quotes = updatedCartItems?.map((item, index) => {
          let { message, error } = item;
          let provider_payable = 0;
          const provider = {
            products: [],
            total_payable: 0,
            name: "",
            error: null,
          };
          // else generate quote of it
          if (message) {
            //          message = m2;

            if (message?.quote?.quote?.price?.value) {
              provider_payable += Number(message?.quote?.quote?.price?.value);
            }
            const breakup = message?.quote?.quote?.breakup;
            const provided_by = message?.quote?.provider?.descriptor?.name;
            provider.name = provided_by;
            let uuid = 0;
            const all_items = breakup?.map((break_up_item) => {
              const cartIndex = cartList?.findIndex(
                (one) => one.id === break_up_item["@ondc/org/item_id"]
              );
              const cartItem = cartIndex > -1 ? cartList[cartIndex] : null;
              let findItemFromCartItems = null;
              let isCustimization = false;
              if (break_up_item?.item?.tags) {
                const findTag = break_up_item?.item?.tags.find(
                  (tag) => tag.code === "type"
                );
                if (findTag) {
                  const findCust = findTag.list.find(
                    (listItem) => listItem.value === "customization"
                  );
                  if (findCust) {
                    isCustimization = true;
                  } else {
                  }
                }
              } else {
              }
              cartItems.forEach((ci) => {
                if (isCustimization) {
                  const cc = ci?.item?.customisations || [];
                  cc.forEach((i) => {
                    if (i.local_id === break_up_item["@ondc/org/item_id"]) {
                      findItemFromCartItems = i;
                    }
                  });
                } else {
                  if (
                    ci?.item?.local_id === break_up_item["@ondc/org/item_id"]
                  ) {
                    findItemFromCartItems = ci?.item;
                  }
                }
              });
              let cartQuantity = findItemFromCartItems
                ? findItemFromCartItems?.quantity?.count
                : cartItem
                ? cartItem?.quantity?.count
                : 0;
              let quantity = break_up_item["@ondc/org/item_quantity"]
                ? break_up_item["@ondc/org/item_quantity"]["count"]
                : 0;

              let textClass = "";
              let quantityMessage = "";
              let isError = false;
              if (quantity === 0) {
                if (break_up_item["@ondc/org/title_type"] === "item") {
                  textClass = "text-error";
                  quantityMessage = "Out of stock";
                  isError = true;

                  if (cartIndex > -1) {
                    cartList.splice(cartIndex, 1);
                  }
                }
              } else if (quantity !== cartQuantity) {
                textClass =
                  break_up_item["@ondc/org/title_type"] === "item"
                    ? "text-amber"
                    : "";
                quantityMessage = `Quantity: ${quantity}/${cartQuantity}`;
                isError = true;

                if (cartItem) {
                  cartItem.quantity.count = quantity;
                }
              } else {
                quantityMessage = `Quantity: ${quantity}`;
              }

              if (error && error.code === "30009") {
                cartList.splice(cartIndex, 1);
              } else {
              }
              if (error && error.code === "40002") {
              } else {
              }
              uuid = uuid + 1;
              return {
                id: break_up_item["@ondc/org/item_id"],
                title: break_up_item?.title,
                title_type: break_up_item["@ondc/org/title_type"],
                isCustomization: isItemCustomization(break_up_item?.item?.tags),
                isDelivery:
                  break_up_item["@ondc/org/title_type"] === "delivery",
                parent_item_id: break_up_item?.item?.parent_item_id,
                price: Number(break_up_item.price?.value)?.toFixed(2),
                cartQuantity,
                quantity,
                provided_by,
                textClass,
                quantityMessage,
                uuid: uuid,
                isError,
                errorCode: error?.code || "",
              };
            });

            let items = {};
            let delivery = {};
            let outOfStock = [];
            let errorCode = "";
            let selected_fulfillments = selectedFulfillments;

            if (Object.keys(selectedFulfillments).length === 0) {
              updatedCartItems[0]?.message?.quote.items.forEach((item) => {
                selected_fulfillments[item.id] = item.fulfillment_id;
              });
              setSelectedFulfillments(selected_fulfillments);
            } else {
            }

            let selected_fulfillment_ids = Object.values(selected_fulfillments);

            all_items.forEach((item) => {
              errorCode = item.errorCode;
              setQuoteItemInProcessing(item.id);
              if (item.isError) {
                outOfStock.push(item);
                isAnyError = true;
              }
              // for type item
              if (item.title_type === "item" && !item.isCustomization) {
                let key = item.parent_item_id || item.id;
                let price = {
                  title: item.quantity + " * Base Price",
                  value: item.price,
                };
                let prev_item_data = items[key];
                let addition_item_data = { title: item.title, price: price };
                items[key] = { ...prev_item_data, ...addition_item_data };
              }
              if (
                item.title_type === "tax" &&
                !item.isCustomization &&
                !selected_fulfillment_ids.includes(item.id)
                // item.id !== selected_fulfillments
              ) {
                let key = item.parent_item_id || item.id;
                items[key] = items[key] || {};
                items[key]["tax"] = {
                  title: item.title,
                  value: item.price,
                };
              }
              if (item.title_type === "discount" && !item.isCustomization) {
                let key = item.parent_item_id || item.id;
                items[key] = items[key] || {};
                items[key]["discount"] = {
                  title: item.title,
                  value: item.price,
                };
              }

              //for customizations
              if (item.title_type === "item" && item.isCustomization) {
                let key = item.parent_item_id;
                items[key]["customizations"] =
                  items[key]["customizations"] || {};
                let existing_data = items[key]["customizations"][item.id] || {};
                let customisation_details = {
                  title: item.title,
                  price: {
                    title: item.quantity + " * Base Price",
                    value: item.price,
                  },
                  quantityMessage: item.quantityMessage,
                  textClass: item.textClass,
                  quantity: item.quantity,
                  cartQuantity: item.cartQuantity,
                };
                items[key]["customizations"][item.id] = {
                  ...existing_data,
                  ...customisation_details,
                };
              }
              if (item.title_type === "tax" && item.isCustomization) {
                let key = item.parent_item_id;
                items[key]["customizations"] =
                  items[key]["customizations"] || {};
                items[key]["customizations"][item.id] =
                  items[key]["customizations"][item.id] || {};
                items[key]["customizations"][item.id]["tax"] = {
                  title: item.title,
                  value: item.price,
                };
              }
              if (item.title_type === "discount" && item.isCustomization) {
                let key = item.parent_item_id;
                items[key]["customizations"] =
                  items[key]["customizations"] || {};
                items[key]["customizations"][item.id] =
                  items[key]["customizations"][item.id] || {};
                items[key]["customizations"][item.id]["discount"] = {
                  title: item.title,
                  value: item.price,
                };
              }
              //for delivery
              if (
                item.title_type === "delivery" &&
                selected_fulfillment_ids.includes(item.id)
                // item.id === selected_fulfillments
              ) {
                delivery["delivery"] = {
                  title: item.title,
                  value: item.price,
                };
              }
              if (
                item.title_type === "discount_f" &&
                selected_fulfillment_ids.includes(item.id)
                // item.id === selected_fulfillments
              ) {
                delivery["discount"] = {
                  title: item.title,
                  value: item.price,
                };
              }
              if (
                (item.title_type === "tax_f" || item.title_type === "tax") &&
                selected_fulfillment_ids.includes(item.id)
                // item.id === selected_fulfillments
              ) {
                delivery["tax"] = {
                  title: item.title,
                  value: item.price,
                };
              }
              if (
                item.title_type === "packing" &&
                selected_fulfillment_ids.includes(item.id)
                // item.id === selected_fulfillments
              ) {
                delivery["packing"] = {
                  title: item.title,
                  value: item.price,
                };
              }
              if (item.title_type === "discount") {
                if (item.isCustomization) {
                  let id = item.parent_item_id;
                } else {
                  let id = item.id;
                  items[id]["discount"] = {
                    title: item.title,
                    value: item.price,
                  };
                }
              }
              if (
                item.title_type === "misc" &&
                selected_fulfillment_ids.includes(item.id)
                // item.id === selected_fulfillments
              ) {
                delivery["misc"] = {
                  title: item.title,
                  value: item.price,
                };
              }
            });
            setQuoteItemInProcessing(null);
            provider.items = items;
            provider.delivery = delivery;
            provider.outOfStock = outOfStock;
            provider.errorCode = errorCode || "";
            if (errorCode !== "") {
              isAnyError = true;
            }
          }

          if (error) {
            provider.error = error.message;
          }

          total_payable += provider_payable;
          provider.total_payable = provider_payable;
          return provider;
        });
        // setGetQuoteLoading(false);
        // setUpdateCartLoading(false);
        setProductsQuote({
          providers: quotes,
          isError: isAnyError,
          total_payable: total_payable.toFixed(2),
        });
      }
    } catch (err) {
      console.log("Calculating quote:", err);
      showQuoteError();
    }
  }, [updatedCartItems, selectedFulfillments]);

  const showQuoteError = () => {
    let msg = "";
    if (quoteItemInProcessing) {
      msg = `Looks like Quote mapping for item: ${quoteItemInProcessing} is invalid! Please check!`;
    } else {
      msg =
        "Seems like issue with quote processing! Please confirm first if quote is valid!";
    }
    dispatchError(msg);
  };

  const isItemCustomization = (tags) => {
    let isCustomization = false;
    tags?.forEach((tag) => {
      if (tag.code === "type") {
        tag.list.forEach((listOption) => {
          if (
            listOption.code === "type" &&
            listOption.value == "customization"
          ) {
            isCustomization = true;
            return true;
          }
        });
      }
    });
    return isCustomization;
  };

  const getSelectedFulfillment = () => {
    if (selectedFulfillments) {
      return updatedCartItems[0]?.message?.quote?.fulfillments.find(
        (fulfillment) => fulfillment.id === selectedFulfillments
      );
    }
  };

  const getCartProducts = () => {
    let products = {};
    return cartItems?.map((cartItem) => {
      return {
        name: cartItem?.item?.product?.descriptor?.name,
        id: cartItem.item.local_id,
      };
    });
  };

  const renderStepLabel = (stepLabel, stepIndex) => {
    switch (stepIndex) {
      case 0:
        return (
          <StepCartLabel
            activeStep={activeStep}
            onUpdateActiveStep={() => {
              setActiveStep(0);
            }}
          />
        );
      case 1:
        return <StepCustomerLabel activeStep={activeStep} />;
      case 2:
        return (
          <StepFulfillmentLabel
            fulfillment={getSelectedFulfillment()}
            selectedFulfillments={selectedFulfillments}
            fulfillments={updatedCartItems[0]?.message?.quote?.fulfillments}
            products={getCartProducts()}
            activeStep={activeStep}
            onUpdateActiveStep={() => {
              setActiveStep(2);
            }}
          />
        );
      case 3:
        return (
          <StepAddressLabel
            activeStep={activeStep}
            onUpdateActiveStep={() => {
              setActiveStep(3);
            }}
          />
        );
      case 4:
        return <StepPaymentLabel />;
      default:
        return <>stepLabel</>;
    }
  };

  const renderStepContent = (stepLabel, stepIndex) => {
    switch (stepIndex) {
      case 0:
        return (
          <StepCartContent
            isError={productsQuote.isError}
            cartItemsData={cartItems}
            updatedCartItemsData={updatedCartItems}
            setUpdateCartItemsData={(data) => {
              setSelectedFulfillments({});
              setUpdatedCartItems(data);
            }}
            handleNext={() => {
              setActiveStep(1);
              resetCartItems();
            }}
          />
        );
      case 1:
        return (
          <StepCustomerContent
            isError={productsQuote.isError}
            handleNext={() => {
              setActiveStep(2);
            }}
          />
        );
      case 2:
        return (
          <StepFulfillmentContent
            fulfillments={updatedCartItems[0]?.message?.quote?.fulfillments}
            selectedFulfillment={selectedFulfillments}
            setSelectedFulfillment={setSelectedFulfillments}
            handleNext={() => {
              setActiveStep(3);
            }}
          />
        );
      case 3:
        return (
          <StepAddressContent
            isError={productsQuote.isError}
            cartItemsData={cartItems}
            updatedCartItemsData={updatedCartItems}
            setUpdateCartItemsData={(data) => {
              setSelectedFulfillments({});
              setUpdatedCartItems(data);
            }}
            setUpdateCartItemsDataOnInitialize={(data) => {
              setSelectedFulfillments({});
              setUpdatedCartItems(data);
            }}
            handleNext={() => {
              setActiveStep(4);
            }}
            updateInitLoading={(value) => setInitLoading(value)}
            responseReceivedIds={updatedCartItems.map((item) => {
              const { message } = item;
              return message?.quote?.provider?.id.toString();
            })}
          />
        );
      case 4:
        return (
          <StepPaymentContent
            isError={productsQuote.isError}
            responseReceivedIds={updatedCartItems.map((item) => {
              const { message } = item;
              return message?.quote?.provider?.id.toString();
            })}
            activePaymentMethod={activePaymentMethod}
            setActivePaymentMethod={(value) => {
              setActivePaymentMethod(value);
            }}
            cartItemsData={cartItems}
            selectedFulfillments={selectedFulfillments}
            updatedCartItemsData={updatedCartItems}
            updateInitLoading={(value) => setInitLoading(value)}
            setUpdateCartItemsDataOnInitialize={(data) => {
              setSelectedFulfillments({});
              setUpdatedCartItems(data);
            }}
            fulfillments={updatedCartItems[0]?.message?.quote?.fulfillments}
          />
        );
      default:
        return <>stepLabel</>;
    }
  };

  useEffect(() => {
    if (responseRef.current.length > 0) {
      setConfirmOrderLoading(false);
      // fetch request object length and compare it with the response length
      const { productQuotes, successOrderIds } = JSON.parse(
        // getValueFromCookie("checkout_details") || "{}"
        localStorage.getItem("checkout_details") || "{}"
      );
      let c = cartItems.map((item) => {
        return item.item;
      });
      const requestObject = constructQouteObject(
        c.filter(({ provider }) =>
          successOrderIds.includes(provider.local_id.toString())
        )
      );
      if (responseRef.current.length === requestObject.length) {
        // redirect to order listing page.
        // remove parent_order_id, search_context from cookies
        removeCookie("transaction_id");
        removeCookie("parent_order_id");
        // removeCookie("search_context");
        // removeCookie("delivery_address");
        removeCookie("billing_address");
        // removeCookie("checkout_details");
        localStorage.removeItem("checkout_details");
        removeCookie("parent_and_transaction_id_map");
        localStorage.setItem("transaction_id", uuidv4());
        // removeCookie("LatLongInfo");
        setCartItems([]);
        history.replace("/application/orders");
      }
    }
    // eslint-disable-next-line
  }, [eventData]);

  // function to dispatch error
  function dispatchError(message) {
    dispatch({
      type: toast_actions.ADD_TOAST,
      payload: {
        id: Math.floor(Math.random() * 100),
        type: toast_types.error,
        message,
      },
    });
  }

  // on confirm order Api
  const onConfirmOrder = async (message_id) => {
    try {
      const data = await cancellablePromise(
        getCall(`clientApis/v2/on_confirm_order?messageIds=${message_id}`)
      );
      responseRef.current = [...responseRef.current, data[0]];
      setEventData((eventData) => [...eventData, data[0]]);
      fetchCartItems();
    } catch (err) {
      dispatchError(err?.response?.data?.error?.message);
      setConfirmOrderLoading(false);
    }
    // eslint-disable-next-line
  };

  // use this function to confirm the order
  function onConfirm(message_id) {
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
      es.addEventListener("on_confirm", (e) => {
        const { messageId } = JSON.parse(e.data);
        onConfirmOrder(messageId);
      });
      const timer = setTimeout(() => {
        eventTimeOutRef.current.forEach(({ eventSource, timer }) => {
          eventSource.close();
          clearTimeout(timer);
        });
        // check if all the orders got cancled
        if (responseRef.current.length <= 0) {
          setConfirmOrderLoading(false);
          dispatchError(
            "Cannot fetch details for this product Please try again!"
          );
          return;
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
  const getItemProviderId = (item) => {
    const providers = getValueFromCookie("providerIds").split(",");
    let provider = {};
    if (providers.includes(item.provider.local_id)) {
      provider = {
        id: item.provider.local_id,
        locations: item.provider.locations.map((location) => location.local_id),
      };
    } else {
    }
    return provider;
  };
  const confirmOrder = async (items, method) => {
    responseRef.current = [];
    const parentOrderIDMap = new Map(
      JSON.parse(getValueFromCookie("parent_and_transaction_id_map"))
    );
    const { productQuotes: productQuotesForCheckout } = JSON.parse(
      // getValueFromCookie("checkout_details") || "{}"
      localStorage.getItem("checkout_details") || "{}"
    );
    try {
      const search_context = JSON.parse(getValueFromCookie("search_context"));
      const item = items[0];
      const queryParams = [
        {
          context: {
            domain: item.domain,
            city: item.contextCity,
            state: search_context.location.state,
            parent_order_id: parentOrderIDMap.get(item?.provider?.id)
              .parent_order_id,
            transaction_id: parentOrderIDMap.get(item?.provider?.id)
              .transaction_id,
            pincode: JSON.parse(getValueFromCookie("delivery_address"))
              ?.location.address.areaCode,
          },
          message: {
            payment: {
              ...updatedCartItems[0].message.quote.payment,
              paid_amount: Number(productQuotesForCheckout[0]?.price?.value),
              type:
                method === payment_methods.COD ? "ON-FULFILLMENT" : "ON-ORDER",
              transaction_id: parentOrderIDMap.get(item?.provider?.id)
                .transaction_id,
              paymentGatewayEnabled: false, //TODO: we send false for, if we enabled jusPay the we will handle.
            },
            quote: {
              ...productQuotesForCheckout[0],
              price: {
                currency: productQuotesForCheckout[0].price.currency,
                value: String(productQuotesForCheckout[0].price.value),
              },
            },
            providers: getItemProviderId(item),
          },
        },
      ];
      const data = await cancellablePromise(
        postCall("clientApis/v2/confirm_order", queryParams)
      );
      //Error handling workflow eg, NACK
      // const isNACK = data.find(
      //   (item) => item.error && item.message.ack.status === "NACK"
      // );
      const isNACK = data.find((item) => item.error && item.code !== "");
      if (isNACK) {
        dispatchError(isNACK.error.message);
        setConfirmOrderLoading(false);
      } else {
        onConfirm(
          data?.map((txn) => {
            const { context } = txn;
            return context?.message_id;
          })
        );
      }
    } catch (err) {
      dispatchError(err?.response?.data?.error?.message);
      setConfirmOrderLoading(false);
    }
    // eslint-disable-next-line
  };

  const renderDeliveryLine = (quote, key) => {
    return (
      <div
        className={classes.summaryDeliveryItemContainer}
        key={`d-quote-${key}-price`}
      >
        <Typography variant="body1" className={classes.summaryDeliveryLabel}>
          {quote?.title}
        </Typography>
        <Typography variant="body1" className={classes.summaryItemPriceValue}>
          {`₹${parseInt(quote?.value).toFixed(2)}`}
        </Typography>
      </div>
    );
  };

  const renderDeliveryCharges = (data) => {
    return (
      <div>
        {data.delivery && renderDeliveryLine(data.delivery, "delivery")}
        {data.discount && renderDeliveryLine(data.discount, "discount")}
        {data.tax && renderDeliveryLine(data.tax, "tax")}
        {data.packing && renderDeliveryLine(data.packing, "packing")}
        {data.misc && renderDeliveryLine(data.misc, "misc")}
        {data &&
          (data.delivery ||
            data.discount ||
            data.tax ||
            data.packing ||
            data.misc) && (
            <>
              <div className={classes.summarySubtotalContainer}>
                <Typography variant="body2" className={classes.subTotalLabel}>
                  Total
                </Typography>
                <Typography variant="body2" className={classes.subTotalValue}>
                  {`₹${getDeliveryTotalAmount(productsQuote?.providers)}`}
                </Typography>
              </div>
              <Box component={"div"} className={classes.orderTotalDivider} />
            </>
          )}
      </div>
    );
  };

  const getDeliveryTotalAmount = (providers) => {
    let total = 0;
    providers.forEach((provider) => {
      const data = provider.delivery;
      if (data.delivery) {
        total = total + parseFloat(data.delivery.value);
      }
      if (data.discount) {
        total = total + parseFloat(data.discount.value);
      }
      if (data.tax) {
        total = total + parseFloat(data.tax.value);
      }
      if (data.packing) {
        total = total + parseFloat(data.packing.value);
      }
      if (data.misc) {
        total = total + parseFloat(data.misc.value);
      }
    });
    return total.toFixed(2);
  };

  const renderItemDetails = (quote, qIndex, isCustomization) => {
    return (
      <div>
        <div
          className={classes.summaryQuoteItemContainer}
          key={`quote-${qIndex}-price`}
        >
          <Typography
            variant="body1"
            className={
              isCustomization
                ? classes.summaryCustomizationPriceLabel
                : classes.summaryItemPriceLabel
            }
          >
            {quote?.price?.title}
          </Typography>
          <Typography
            variant="body1"
            className={
              isCustomization
                ? classes.summaryCustomizationPriceValue
                : classes.summaryItemPriceValue
            }
          >
            {`₹${parseInt(quote?.price?.value).toFixed(2)}`}
          </Typography>
        </div>
        {quote?.tax && (
          <div
            className={classes.summaryQuoteItemContainer}
            key={`quote-${qIndex}-tax`}
          >
            <Typography
              variant="body1"
              className={
                isCustomization
                  ? classes.summaryCustomizationTaxLabel
                  : classes.summaryItemTaxLabel
              }
            >
              {quote?.tax.title}
            </Typography>
            <Typography
              variant="body1"
              className={
                isCustomization
                  ? classes.summaryCustomizationPriceValue
                  : classes.summaryItemPriceValue
              }
            >
              {`₹${parseInt(quote?.tax.value).toFixed(2)}`}
            </Typography>
          </div>
        )}
        {quote?.discount && (
          <div
            className={classes.summaryQuoteItemContainer}
            key={`quote-${qIndex}-discount`}
          >
            <Typography
              variant="body1"
              className={
                isCustomization
                  ? classes.summaryCustomizationDiscountLabel
                  : classes.summaryItemDiscountLabel
              }
            >
              {quote?.discount.title}
            </Typography>
            <Typography
              variant="body1"
              className={classes.summaryItemPriceValue}
            >
              {`₹${parseInt(quote?.discount.value).toFixed(2)}`}
            </Typography>
          </div>
        )}
      </div>
    );
  };

  const getItemsTotal = (providers) => {
    let finalTotal = 0;
    if (providers) {
      providers.forEach((provider) => {
        const items = Object.values(provider.items).filter(
          (quote) => quote?.title !== ""
        );
        items.forEach((item) => {
          finalTotal = finalTotal + parseFloat(item.price.value);
          if (item?.tax) {
            finalTotal = finalTotal + parseFloat(item.tax.value);
          }
          if (item?.discount) {
            finalTotal = finalTotal + parseFloat(item.discount.value);
          }
          if (item?.customizations) {
            Object.values(item.customizations)?.forEach((custItem) => {
              finalTotal = finalTotal + parseFloat(custItem.price.value);
              if (custItem?.tax) {
                finalTotal = finalTotal + parseFloat(custItem.tax.value);
              }
            });
          }
        });
      });
    }
    return finalTotal.toFixed(2);
  };

  const renderOutofStockItems = (provider, pindex) => {
    //  if (productsQuote.isError && provider.errorCode === "") {
    //    throw new Error();
    //  }

    if (
      productsQuote.isError &&
      provider.errorCode === "40002" &&
      provider.error
    ) {
      return (
        <div key={`outof-stockpindex-${pindex}`}>
          {provider.error && provider.errorCode === "40002" ? (
            <>
              <div>
                <Typography
                  variant="body1"
                  className={`${classes.summaryItemLabel} ${classes.marginBottom10} ${classes.marginTop20} text-error`}
                >
                  Out of stock
                </Typography>
              </div>
              <div>
                <div
                  className={`${classes.summaryQuoteItemContainer} ${classes.marginBottom10}`}
                >
                  <Typography
                    variant="body1"
                    className={classes.summaryItemQuantityLabel}
                  >
                    Items
                  </Typography>
                  <Typography
                    variant="body1"
                    className={classes.summaryItemQuantityValue}
                  >
                    Cart Quantity
                  </Typography>
                  <Typography
                    variant="body1"
                    className={classes.summaryItemQuantityValue}
                  >
                    Available Quantity
                  </Typography>
                </div>
              </div>
              {provider.outOfStock.map((outOfStockItems, i) => (
                <div key={`outof-stock-item-index-${i}`}>
                  <div>
                    <div
                      className={classes.summaryQuoteItemContainer}
                      key={`quote-${i}-price`}
                    >
                      <Typography
                        variant="body1"
                        className={classes.summaryItemQuantityLabel}
                      >
                        {outOfStockItems?.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        className={classes.summaryItemQuantityValue}
                      >
                        {`${outOfStockItems?.cartQuantity}`}
                      </Typography>
                      <Typography
                        variant="body1"
                        className={classes.summaryItemQuantityValue}
                      >
                        {`${outOfStockItems?.quantity}`}
                      </Typography>
                    </div>
                  </div>
                </div>
              ))}
              <Box component={"div"} className={classes.divider} />
            </>
          ) : (
            <></>
          )}
        </div>
      );
    } else {
      return <></>;
    }
  };

  const renderItems = (provider, pindex) => {
    return (
      <div key={`pindex-${pindex}`}>
        {Object.values(provider.items)
          .filter((quote) => quote?.title !== "")
          .map((quote, qIndex) => (
            <div key={`quote-${qIndex}`}>
              <div
                className={classes.summaryQuoteItemContainer}
                key={`quote-${qIndex}-title`}
              >
                <Typography
                  variant="body1"
                  className={`${classes.summaryItemLabel} ${quote.textClass}`}
                >
                  {quote?.title}
                  <p className={`${styles.ordered_from} ${quote.textClass}`}>
                    {quote.quantityMessage}
                  </p>
                </Typography>
              </div>
              {renderItemDetails(quote)}
              {quote?.customizations && (
                <div key={`quote-${qIndex}-customizations`}>
                  <div
                    className={classes.summaryQuoteItemContainer}
                    key={`quote-${qIndex}-customizations`}
                  >
                    <Typography
                      variant="body1"
                      className={classes.summaryItemPriceLabel}
                    >
                      Customizations
                    </Typography>
                  </div>
                  {Object.values(quote?.customizations).map(
                    (customization, cIndex) => (
                      <div>
                        <div
                          className={classes.summaryQuoteItemContainer}
                          key={`quote-${qIndex}-customizations-${cIndex}`}
                        >
                          <Typography
                            variant="body1"
                            className={classes.summaryCustomizationLabel}
                          >
                            {customization.title}
                          </Typography>
                        </div>
                        {renderItemDetails(customization, cIndex, true)}
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          ))}
        {/*<div className={classes.summarySubtotalContainer}>*/}
        {/*  <Typography variant="body2" className={classes.subTotalLabel}>*/}
        {/*    Total*/}
        {/*  </Typography>*/}
        {/*  <Typography variant="body2" className={classes.subTotalValue}>*/}
        {/*    {`₹${getItemsTotal(Object.values(provider.items).filter((quote) => quote?.title !== ""))}`}*/}
        {/*  </Typography>*/}
        {/*</div>*/}
        {productsQuote.isError &&
          provider.errorCode !== "" &&
          provider.errorCode !== "40002" &&
          provider.error && (
            <Typography
              variant="body1"
              color="error"
              className={classes.summaryItemLabel}
            >
              {provider.error}
            </Typography>
          )}
      </div>
    );
  };

  const renderQuote = () => {
    try {
      return (
        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
          <Card className={classes.summaryCard}>
            <Typography variant="h4">Summary</Typography>
            <Box component={"div"} className={classes.divider} />
            {productsQuote?.providers.map((provider, pindex) =>
              renderOutofStockItems(provider, pindex)
            )}

            {productsQuote?.providers.map((provider, pindex) =>
              renderItems(provider, pindex)
            )}
            <div className={classes.summarySubtotalContainer}>
              <Typography variant="body2" className={classes.subTotalLabel}>
                Total
              </Typography>
              <Typography variant="body2" className={classes.subTotalValue}>
                {`₹${getItemsTotal(productsQuote?.providers)}`}
              </Typography>
            </div>
            <Box component={"div"} className={classes.divider} />
            {productsQuote?.providers.map((provider, pindex) => {
              return (
                <div key={`pindex-${pindex}`}>
                  <div key={`d-pindex-${pindex}`}>
                    {renderDeliveryCharges(provider.delivery)}
                  </div>
                </div>
              );
            })}
            <div
              className={`${classes.summaryItemContainer} ${classes.marginTop20}`}
            >
              <Typography variant="body" className={classes.totalLabel}>
                Order Total
              </Typography>
              <Typography variant="body" className={classes.totalValue}>
                {/*{`₹${getItemsTotal(productsQuote?.providers) + getDeliveryTotalAmount(productsQuote?.providers)}`}*/}
                {`₹${parseInt(productsQuote?.total_payable).toFixed(2)}`}
              </Typography>
            </div>
            <Button
              className={classes.proceedToBuy}
              fullWidth
              variant="contained"
              disabled={
                activePaymentMethod === "" ||
                productsQuote.isError ||
                confirmOrderLoading ||
                initLoading ||
                activeStep !== 4
              }
              onClick={() => {
                if (activePaymentMethod) {
                  const { productQuotes, successOrderIds } = JSON.parse(
                    // getValueFromCookie("checkout_details") || "{}"
                    localStorage.getItem("checkout_details") || "{}"
                  );
                  setConfirmOrderLoading(true);
                  let c = cartItems.map((item) => {
                    return item.item;
                  });
                  if (activePaymentMethod === payment_methods.JUSPAY) {
                    // setTogglePaymentGateway(true);
                    // setLoadingSdkForPayment(true);
                    // initiateSDK();
                    const request_object = constructQouteObject(
                      c.filter(({ provider }) =>
                        successOrderIds.includes(provider.local_id.toString())
                      )
                    );
                    confirmOrder(request_object[0], payment_methods.JUSPAY);
                  } else {
                    const request_object = constructQouteObject(
                      c.filter(({ provider }) =>
                        successOrderIds.includes(provider.local_id.toString())
                      )
                    );
                    confirmOrder(request_object[0], payment_methods.COD);
                  }
                } else {
                  dispatchError("Please select payment.");
                }
              }}
            >
              {confirmOrderLoading || initLoading ? (
                <Loading />
              ) : (
                "Proceed to Buy"
              )}
            </Button>
          </Card>
        </Grid>
      );
    } catch (error) {
      console.log("Rendering quote error", error);
      showQuoteError();
    }
  };

  if (cartItems === null || updatedCartItems === null) {
    return <Redirect to={"/application/cart"} />;
  }

  return (
    <>
      <div className={classes.header}>
        <Typography
          component={Link}
          underline="hover"
          color="primary.main"
          variant="body1"
          className={classes.headerTypo}
          to={`/application`}
        >
          BACK TO SHOP
        </Typography>
      </div>
      <div className={classes.bodyContainer}>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
            <Stepper
              activeStep={activeStep}
              orientation="vertical"
              connector={false}
            >
              {steps.map((step, index) => (
                <Step key={step.label} className={classes.stepRoot}>
                  <StepLabel className={classes.stepLabel}>
                    {renderStepLabel(step, index)}
                  </StepLabel>
                  <StepContent
                    sx={{
                      padding: index === 0 ? "10px 0px !important" : "14px",
                    }}
                    className={
                      activeStep === index
                        ? classes.stepContent
                        : classes.stepContentHidden
                    }
                  >
                    {renderStepContent(step, index)}
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </Grid>
          {renderQuote()}
        </Grid>
      </div>
    </>
  );
};

export default Checkout;
