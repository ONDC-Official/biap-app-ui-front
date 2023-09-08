import React, { useState, useEffect, useCallback, useRef } from "react";
import useStyles from "./style";

import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";

import StepOneLabel from "./stepOne/stepOneLabel";
import StepOneContent from "./stepOne/stepOneContent";
import StepTwoLabel from "./stepTwo/stepTwoLabel";
import StepTwoContent from "./stepTwo/stepTwoContent";
import StepThreeLabel from "./stepThree/stepThreeLabel";
import StepThreeContent from "./stepThree/stepThreeContent";

import { Link, Redirect, useHistory } from "react-router-dom";
import Box from "@mui/material/Box";
import { constructQouteObject } from "../../api/utils/constructRequestObject";
import styles from "../../styles/cart/cartView.module.scss";
import { payment_methods } from "../../constants/payment-methods";
import { getValueFromCookie, removeCookie } from "../../utils/cookies";
import { getCall, postCall } from "../../api/axios";
import useCancellablePromise from "../../api/cancelRequest";
import { SSE_TIMEOUT } from "../../constants/sse-waiting-time";

const Checkout = () => {
  const classes = useStyles();
  const history = useHistory();

  const steps = ["Customer", "Add Address", "Payment"];
  const [activeStep, setActiveStep] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [updatedCartItems, setUpdatedCartItems] = useState([]);
  const [productsQuote, setProductsQuote] = useState({
    providers: [],
    total_payable: 0,
  });
  const [initLoading, setInitLoading] = useState(false);

  const [activePaymentMethod, setActivePaymentMethod] = useState(
    payment_methods.COD
  );
  const [confirmOrderLoading, setConfirmOrderLoading] = useState(false);
  const responseRef = useRef([]);
  const eventTimeOutRef = useRef([]);
  const [eventData, setEventData] = useState([]);
  // HOOKS
  const { cancellablePromise } = useCancellablePromise();

  useEffect(() => {
    const cartItemsData = JSON.parse(localStorage.getItem("cartItems"));
    const updatedCartItemsData = JSON.parse(
      localStorage.getItem("updatedCartItems")
    );
    setCartItems(cartItemsData);
    setUpdatedCartItems(updatedCartItemsData);
  }, []);

  useEffect(() => {
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
      const quotes = updatedCartItems?.map((item, index) => {
        const { message, error } = item;
        let provider_payable = 0;
        const provider = {
          products: [],
          total_payable: 0,
          name: "",
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
          const all_items = breakup?.map((break_up_item) => {
            const cartIndex = cartList.findIndex(
              (one) => one.id === break_up_item["@ondc/org/item_id"]
            );
            const cartItem = cartIndex > -1 ? cartList[cartIndex] : null;
            let cartQuantity = cartItem ? cartItem?.quantity?.count : 0;
            let quantity = break_up_item["@ondc/org/item_quantity"]
              ? break_up_item["@ondc/org/item_quantity"]["count"]
              : 0;
            let textClass = "";
            let quantityMessage = "";
            if (quantity === 0) {
              if (break_up_item["@ondc/org/title_type"] === "item") {
                textClass = "text-error";
                quantityMessage = "Out of stock";

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
              if (cartItem) {
                cartItem.quantity.count = quantity;
              }
            } else {
              quantityMessage = `Quantity: ${quantity}`;
            }

            if (error && error.code === "30009") {
              cartList.splice(cartIndex, 1);
            }
            return {
              id: break_up_item["@ondc/org/item_id"],
              title: break_up_item?.title,
              isCustomization:
                break_up_item["@ondc/org/title_type"] === "customization",
              parent_item_id: break_up_item?.item?.parent_item_id,
              price: Number(break_up_item.price?.value)?.toFixed(2),
              cartQuantity,
              quantity,
              provided_by,
              textClass,
              quantityMessage,
            };
          });
          const item_to_customizations = all_items.reduce((acc, item) => {
            acc[item.parent_item_id] = acc[item.parent_item_id] ?? [];
            item.isCustomization && acc[item.parent_item_id].push(item);
            return acc;
          }, {});
          const formatted_items = all_items.reduce((acc, item) => {
            if (!item.isCustomization) {
              let customizations = item_to_customizations[item.id];
              acc.push(item);
              customizations.forEach((customization) =>
                acc.push(customization)
              );
            }
            return acc;
          }, []);
          provider.products = formatted_items;
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
        total_payable: total_payable.toFixed(2),
      });
    }
  }, [updatedCartItems]);

  console.log("productsQuote************************", productsQuote);

  const renderStepLabel = (stepLabel, stepIndex) => {
    switch (stepIndex) {
      case 0:
        return <StepOneLabel activeStep={activeStep} />;
      case 1:
        return (
          <StepTwoLabel
            activeStep={activeStep}
            onUpdateActiveStep={() => {
              setActiveStep(1);
            }}
          />
        );
      case 2:
        return <StepThreeLabel />;
      default:
        return <>stepLabel</>;
    }
  };
  const renderStepContent = (stepLabel, stepIndex) => {
    switch (stepIndex) {
      case 0:
        return (
          <StepOneContent
            handleNext={() => {
              setActiveStep(1);
            }}
          />
        );
      case 1:
        return (
          <StepTwoContent
            cartItemsData={cartItems}
            updatedCartItemsData={updatedCartItems}
            setUpdateCartItemsData={(data) => {
              console.log("updatedCartItems data=====>", updatedCartItems);
              console.log("StepTwoContent data=====>", data);
              setUpdatedCartItems(data);
            }}
            setUpdateCartItemsDataOnInitialize={(data) => {
              setUpdatedCartItems(data);
            }}
            handleNext={() => {
              setActiveStep(2);
            }}
            updateInitLoading={(value) => setInitLoading(value)}
            responseReceivedIds={updatedCartItems.map((item) => {
              const { message } = item;
              return message?.quote?.provider?.id.toString();
            })}
          />
        );
      case 2:
        return (
          <StepThreeContent
            responseReceivedIds={updatedCartItems.map((item) => {
              const { message } = item;
              return message?.quote?.provider?.id.toString();
            })}
            activePaymentMethod={activePaymentMethod}
            setActivePaymentMethod={(value) => {
              setActivePaymentMethod(value);
            }}
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
        removeCookie("search_context");
        removeCookie("delivery_address");
        removeCookie("billing_address");
        // removeCookie("checkout_details");
        localStorage.removeItem("checkout_details");
        removeCookie("parent_and_transaction_id_map");
        removeCookie("LatLongInfo");
        setCartItems([]);
        history.replace("/application/orders");
      }
    }
    // eslint-disable-next-line
  }, [eventData]);

  // on confirm order Api
  const onConfirmOrder = async (message_id) => {
    try {
      const data = await cancellablePromise(
        getCall(`clientApis/v2/on_confirm_order?messageIds=${message_id}`)
      );
      responseRef.current = [...responseRef.current, data[0]];
      setEventData((eventData) => [...eventData, data[0]]);
    } catch (err) {
      // dispatchError(err.message);
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
          // dispatchError(
          //     "Cannot fetch details for this product Please try again!"
          // );
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
      const queryParams = items.map((item, index) => {
        return {
          // pass the map of parent order id and transaction id
          context: {
            domain: item.domain,
            city: search_context.location.name,
            state: search_context.location.state,
            parent_order_id: parentOrderIDMap.get(item?.provider?.id)
              .parent_order_id,
            transaction_id: parentOrderIDMap.get(item?.provider?.id)
              .transaction_id,
          },
          message: {
            payment: {
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
        };
      });

      const data = await cancellablePromise(
        postCall("clientApis/v2/confirm_order", queryParams)
      );
      //Error handling workflow eg, NACK
      const isNACK = data.find(
        (item) => item.error && item.message.ack.status === "NACK"
      );
      if (isNACK) {
        // dispatchError(isNACK.error.message);
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
      // dispatchError(err.message);
      setConfirmOrderLoading(false);
    }
    // eslint-disable-next-line
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
          <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
            <Card className={classes.summaryCard}>
              <Typography variant="h4">Summary</Typography>
              <Box component={"div"} className={classes.divider} />
              {productsQuote?.providers.map((provider, pindex) => (
                <div key={`pindex-${pindex}`}>
                  {provider.products
                    .filter((quote) => quote?.title !== "")
                    .map((quote, qIndex) =>
                      !quote?.isCustomization ? (
                        <div
                          className={classes.summaryItemContainer}
                          key={`quote-${qIndex}`}
                        >
                          <Typography
                            variant="body1"
                            className={classes.summaryItemLabel}
                          >
                            {quote?.title}
                          </Typography>
                          <Typography
                            variant="body1"
                            className={classes.summaryItemValue}
                          >
                            {`₹${quote?.price}`}
                          </Typography>
                        </div>
                      ) : (
                        <div
                          className={classes.summaryItemContainer}
                          key={`quote-${qIndex}`}
                        >
                          <Typography
                            variant="subtitle2"
                            className={classes.summaryItemLabelDescription}
                          >
                            {quote?.title}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            className={classes.customizationValue}
                          >
                            {`₹${quote?.price}`}
                          </Typography>
                        </div>
                      )
                    )}
                  {provider.error && (
                    <Typography
                      variant="body1"
                      color="error"
                      className={classes.summaryItemLabel}
                    >
                      {provider.error}
                    </Typography>
                  )}
                </div>
              ))}
              {/*<div*/}
              {/*    className={classes.summaryItemContainer}*/}
              {/*>*/}
              {/*    <Typography variant="body1" className={classes.summaryItemLabel}>*/}
              {/*        Subtotal*/}
              {/*    </Typography>*/}
              {/*    <Typography variant="body1" className={classes.summaryItemValue}>*/}
              {/*        ₹4,300.00*/}
              {/*    </Typography>*/}
              {/*</div>*/}
              {/*<div*/}
              {/*    className={classes.summaryItemContainer}*/}
              {/*>*/}
              {/*    <Typography variant="body1" className={classes.summaryItemLabel}>*/}
              {/*        Shipping*/}
              {/*        <br />*/}
              {/*        <Typography variant="subtitle2" className={classes.summaryItemLabelDescription}>*/}
              {/*            (Standard Rate - Price may vary depending on the item/destination. TECS Staff will contact you.)*/}
              {/*        </Typography>*/}
              {/*    </Typography>*/}
              {/*    <Typography variant="body1" className={classes.summaryItemValue}>*/}
              {/*        ₹21.00*/}
              {/*    </Typography>*/}
              {/*</div>*/}
              {/*<div*/}
              {/*    className={classes.summaryItemContainer}*/}
              {/*>*/}
              {/*    <Typography variant="body1" className={classes.summaryItemLabel}>*/}
              {/*        Tax*/}
              {/*    </Typography>*/}
              {/*    <Typography variant="body1" className={classes.summaryItemValue}>*/}
              {/*        ₹1.91*/}
              {/*    </Typography>*/}
              {/*</div>*/}
              {/*<div*/}
              {/*    className={classes.summaryItemContainer}*/}
              {/*>*/}
              {/*    <Typography variant="body1" className={classes.summaryItemLabel}>*/}
              {/*        GST (10%)*/}
              {/*    </Typography>*/}
              {/*    <Typography variant="body1" className={classes.summaryItemValue}>*/}
              {/*        ₹1.91*/}
              {/*    </Typography>*/}
              {/*</div>*/}
              <Box component={"div"} className={classes.orderTotalDivider} />
              <div className={classes.summaryItemContainer}>
                <Typography variant="body" className={classes.totalLabel}>
                  Order Total
                </Typography>
                <Typography variant="body" className={classes.totalValue}>
                  {`₹${productsQuote?.total_payable}`}
                </Typography>
              </div>
              <Button
                className={classes.proceedToBuy}
                fullWidth
                variant="contained"
                onClick={() => {
                  const { productQuotes, successOrderIds } = JSON.parse(
                    // getValueFromCookie("checkout_details") || "{}"
                    localStorage.getItem("checkout_details") || "{}"
                  );
                  console.log("successOrderIds=====>", successOrderIds);
                  setConfirmOrderLoading(true);
                  let c = cartItems.map((item) => {
                    return item.item;
                  });
                  console.log("c=====>", c);
                  if (activePaymentMethod === payment_methods.JUSPAY) {
                    // setTogglePaymentGateway(true);
                    // setLoadingSdkForPayment(true);
                    // initiateSDK();
                    const request_object = constructQouteObject(
                      c.filter(({ provider }) =>
                        successOrderIds?.includes(provider.local_id.toString())
                      )
                    );
                    confirmOrder(request_object[0], payment_methods.JUSPAY);
                  } else {
                    console.log("cartItems=====>", cartItems);
                    const request_object = constructQouteObject(
                      c.filter(({ provider }) =>
                        successOrderIds?.includes(provider.local_id.toString())
                      )
                    );
                    console.log("request_object=====>", request_object);
                    confirmOrder(request_object[0], payment_methods.COD);
                  }
                }}
              >
                Proceed to Buy
              </Button>
            </Card>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default Checkout;
