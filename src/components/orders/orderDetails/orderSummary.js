import React, {useEffect, useState, useContext, useRef} from "react";
import useStyles from "./style";

import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import OrderTimeline from "./orderTimeline";
import SummaryItems from "./summaryItems";
import moment from "moment";
import styles from "../../../styles/cart/cartView.module.scss";
import { ToastContext } from "../../../context/toastContext";
import { toast_actions, toast_types } from "../../shared/toast/utils/toast";
import ReturnOrderModal from "./returnOrderModal";
import CancelOrderModal from "./cancelOrderModal";
import useCancellablePromise from "../../../api/cancelRequest";
import {getCall, postCall} from "../../../api/axios";
import Loading from "../../shared/loading/loading";
import {getValueFromCookie} from "../../../utils/cookies";
import {SSE_TIMEOUT} from "../../../constants/sse-waiting-time";
import Chip from "@mui/material/Chip";

const OrderSummary = ({ orderDetails, onUpdateOrder }) => {
  const classes = useStyles();

  const [itemQuotes, setItemQuotes] = useState(null);
  const [deliveryQuotes, setDeliveryQuotes] = useState(null);
  const dispatch = useContext(ToastContext);
  const [quoteItemInProcessing, setQuoteItemInProcessing] = useState(null);

  const [toggleReturnOrderModal, setToggleReturnOrderModal] = useState(false);
  const [toggleCancelOrderModal, setToggleCancelOrderModal] = useState(false);
  const [productsList, setProductsList] = useState([]);
  const [allNonCancellable, setAllNonCancellable] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const statusEventSourceResponseRef = useRef(null);
  const eventTimeOutRef = useRef([]);

  // HOOKS
  const { cancellablePromise } = useCancellablePromise();

  // use this function to dispatch error
  function dispatchToast(message, type) {
    dispatch({
      type: toast_actions.ADD_TOAST,
      payload: {
        id: Math.floor(Math.random() * 100),
        type,
        message,
      },
    });
  }

  const isItemCustomization = (tags) => {
    let isCustomization = false;
    tags?.forEach((tag) => {
      if (tag.code === "type") {
        tag.list.forEach((listOption) => {
          if (listOption.code === "type" && listOption.value == "customization") {
            isCustomization = true;
            return true;
          }
        });
      }
    });
    return isCustomization;
  };

  useEffect(() => {
    try {
      if (orderDetails && orderDetails.quote) {
        const provided_by = orderDetails?.provider?.descriptor?.name;
        let uuid = 0;
        const breakup = orderDetails.quote.breakup;
        const all_items = breakup?.map((break_up_item) => {
          const items = orderDetails.items;
          const itemIndex = items.findIndex((one) => one.id === break_up_item["@ondc/org/item_id"]);
          const item = itemIndex > -1 ? items[itemIndex] : null;
          let itemQuantity = item ? item?.quantity?.count : 0;
          let quantity = break_up_item["@ondc/org/item_quantity"]
            ? break_up_item["@ondc/org/item_quantity"]["count"]
            : 0;
          let textClass = "";
          let quantityMessage = "";
          if (quantity === 0) {
            if (break_up_item["@ondc/org/title_type"] === "item") {
              textClass = "text-error";
              quantityMessage = "Out of stock";

              if (itemIndex > -1) {
                items.splice(itemIndex, 1);
              }
            }
          } else if (quantity !== itemQuantity) {
            textClass = break_up_item["@ondc/org/title_type"] === "item" ? "text-amber" : "";
            quantityMessage = `Quantity: ${quantity}/${itemQuantity}`;
            if (item) {
              item.quantity.count = quantity;
            }
          } else {
            quantityMessage = `Quantity: ${quantity}`;
          }
          uuid = uuid + 1;
          return {
            id: break_up_item["@ondc/org/item_id"],
            title: break_up_item?.title,
            title_type: break_up_item["@ondc/org/title_type"],
            isCustomization: isItemCustomization(break_up_item?.item?.tags),
            isDelivery: break_up_item["@ondc/org/title_type"] === "delivery",
            parent_item_id: break_up_item?.item?.parent_item_id,
            price: Number(break_up_item.price?.value)?.toFixed(2),
            itemQuantity,
            quantity,
            provided_by,
            textClass,
            quantityMessage,
            uuid: uuid,
            fulfillment_status: item?.fulfillment_status,
            cancellation_status: item?.cancellation_status,
            return_status: item?.return_status,
            isCancellable: item?.product?.['@ondc/org/cancellable'],
            isReturnable: item?.product?.['@ondc/org/returnable']
          };
        });
        let items = {};
        let delivery = {};
        all_items.forEach((item) => {
          setQuoteItemInProcessing(item.id);
          // for type item
          if (item.title_type === "item" && !item.isCustomization) {
            let key = item.parent_item_id || item.id;
            let price = {
              title: item.quantity + " * Base Price",
              value: item.price,
            };
            let prev_item_data = items[key];
            let addition_item_data = { title: item.title, price: price };
            addition_item_data.isCancellable = item.isCancellable;
            addition_item_data.isReturnable = item.isReturnable;
            addition_item_data.fulfillment_status = item?.fulfillment_status;
            if(item?.return_status){
              addition_item_data.return_status = item?.return_status;
            }else{}
            if(item?.cancellation_status){
              addition_item_data.cancellation_status = item?.cancellation_status;
            }else{}
            items[key] = { ...prev_item_data, ...addition_item_data };
          }
          if (item.title_type === "tax" && !item.isCustomization) {
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
            items[key]["customizations"] = items[key]["customizations"] || {};
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
            items[key]["customizations"] = items[key]["customizations"] || {};
            items[key]["customizations"][item.id] = items[key]["customizations"][item.id] || {};
            items[key]["customizations"][item.id]["tax"] = {
              title: item.title,
              value: item.price,
            };
          }
          if (item.title_type === "discount" && item.isCustomization) {
            let key = item.parent_item_id;
            items[key]["customizations"] = items[key]["customizations"] || {};
            items[key]["customizations"][item.id] = items[key]["customizations"][item.id] || {};
            items[key]["customizations"][item.id]["discount"] = {
              title: item.title,
              value: item.price,
            };
          }
          //for delivery
          if (item.title_type === "delivery") {
            delivery["delivery"] = {
              title: item.title,
              value: item.price,
            };
          }
          if (item.title_type === "discount_f") {
            delivery["discount"] = {
              title: item.title,
              value: item.price,
            };
          }
          if (item.title_type === "tax_f") {
            delivery["tax"] = {
              title: item.title,
              value: item.price,
            };
          }
          if (item.title_type === "packing") {
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
          if (item.title_type === "misc") {
            delivery["misc"] = {
              title: item.title,
              value: item.price,
            };
          }
        });
        setQuoteItemInProcessing(null);
        setItemQuotes(items);
        setDeliveryQuotes(delivery);
      }
    } catch (error) {
      console.log(error);
      showQuoteError();
    }
  }, [orderDetails]);

  useEffect(() => {
    if (orderDetails && itemQuotes) {
      const productsList = generateProductsList(orderDetails, itemQuotes);
      setProductsList(productsList);
    }
  }, [orderDetails, itemQuotes]);

  useEffect(() => {
    if (!!productsList.length) {
      setAllNonCancellable(areAllItemsNonCancellable(productsList));
    }
  }, [productsList]);

  const areAllItemsNonCancellable = (products) => {
    for (const productIndex in products) {
      if (productsList[productIndex]["@ondc/org/cancellable"] == false) {
        return false;
      }
    }

    return true;
  };

  function generateProductsList(orderDetails, itemQuotes) {
    return orderDetails?.items
      ?.map(({ id }, index) => {
        let findQuote = orderDetails.quote?.breakup.find(
          (item) => item["@ondc/org/item_id"] === id && item["@ondc/org/title_type"] === "item"
        );
        if (findQuote) {
          const tag = findQuote.item.tags.find((tag) => tag.code === "type");
          const tagList = tag?.list;
          const type = tagList?.find((item) => item.code === "type");
          if (type?.value === "item") {
            const parentId = findQuote.item.parent_item_id;
            const customizations = itemQuotes[parentId].customizations;
            return {
              id,
              name: findQuote?.title ?? "NA",
              cancellation_status: orderDetails.items?.[index]?.cancellation_status ?? "",
              return_status: orderDetails.items?.[index]?.return_status ?? "",
              fulfillment_status: orderDetails.items?.[index]?.fulfillment_status ?? "",
              customizations: customizations ?? null,
              ...orderDetails.items?.[index]?.product,
            };
          }
        } else {
          findQuote = orderDetails.quote?.breakup[index];
        }
        return null;
      })
      .filter((item) => item !== null);
  }

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

  const showQuoteError = () => {
    let msg = "";
    if (quoteItemInProcessing) {
      msg = `Looks like Quote mapping for item: ${quoteItemInProcessing} is invalid! Please check!`;
    } else {
      msg = "Seems like issue with quote processing! Please confirm first if quote is valid!";
    }
    dispatchError(msg);
  };

  const getSubTotal = (quote) => {
    let subtotal = 0;
    quote.forEach((item) => {
      subtotal += parseInt(item?.price?.value);
    });
    return subtotal;
  };

  const getItemsWithCustomizations = () => {
    const breakup = orderDetails?.quote?.breakup;
    let returnBreakup = [];
    const filterItems = breakup.filter((item) => item["@ondc/org/title_type"] === "item");
    const filterCustomizations = breakup.filter((item) => item["@ondc/org/title_type"] === "customization");
    filterItems.forEach((item) => {
      const itemId = item["@ondc/org/item_id"];
      const filterCustomizationItems = filterCustomizations.filter((cust) => cust.item.parent_item_id === itemId);
      returnBreakup.push(item);
      if (filterCustomizationItems.length > 0) {
        filterCustomizationItems.forEach((custItem) => {
          returnBreakup.push(custItem);
        });
      }
    });
    return returnBreakup;
  };

  const renderItems = () => {
    return (
      <div>
        {Object.values(itemQuotes)
          .filter((quote) => quote?.title !== "")
          .map((quote, qIndex) => (
            <div key={`quote-${qIndex}`}>
              <div className={classes.summaryQuoteItemContainer} key={`quote-${qIndex}-title`}>
                <Typography variant="body1" className={`${classes.summaryItemLabel} ${quote.textClass}`}>
                  {quote?.title}
                  {
                    quote?.fulfillment_status && (
                      <Chip
                          size="small"
                          // variant="outlined"
                          className={classes.statusChip}
                          label={quote?.fulfillment_status}
                      />
                    )
                  }
                  <p className={`${styles.ordered_from} ${quote.textClass}`}>{quote.quantityMessage}</p>
                </Typography>
              </div>
              <div className={`${classes.summaryQuoteItemContainer} ${classes.marginBottom12}`}>
                {
                  quote.cancellation_status
                  ?(
                    <Chip
                      size="small"
                      // variant="outlined"
                      className={classes.statusChip}
                      label={quote?.cancellation_status}
                    />
                  ):quote.return_status?(
                    <Chip
                      size="small"
                      // variant="outlined"
                      className={classes.statusChip}
                      label={quote?.return_status}
                    />
                  ):(
                    <>
                      <Chip
                          size="small"
                          // variant="outlined"
                          className={classes.statusChip}
                          label={quote?.isReturnable?"returnable":"non returnable"}
                      />
                      <Chip
                          size="small"
                          // variant="outlined"
                          className={classes.statusChip}
                          label={quote?.isCancellable?"cancelable":"non cancelable"}
                      />
                    </>
                  )
                }
              </div>
              {renderItemDetails(quote)}
              {quote?.customizations && (
                <div key={`quote-${qIndex}-customizations`}>
                  <div className={classes.summaryQuoteItemContainer} key={`quote-${qIndex}-customizations`}>
                    <Typography variant="body1" className={classes.summaryItemPriceLabel}>
                      Customizations
                    </Typography>
                  </div>
                  {Object.values(quote?.customizations).map((customization, cIndex) => (
                    <div>
                      <div
                        className={classes.summaryQuoteItemContainer}
                        key={`quote-${qIndex}-customizations-${cIndex}`}
                      >
                        <Typography variant="body1" className={classes.summaryCustomizationLabel}>
                          {customization.title}
                        </Typography>
                      </div>
                      {renderItemDetails(customization, cIndex, true)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
      </div>
    );
  };

  const renderItemDetails = (quote, qIndex, isCustomization) => {
    return (
      <div>
        <div className={classes.summaryQuoteItemContainer} key={`quote-${qIndex}-price`}>
          <Typography
            variant="body1"
            className={isCustomization ? classes.summaryCustomizationPriceLabel : classes.summaryItemPriceLabel}
          >
            {quote?.price?.title}
          </Typography>
          <Typography
            variant="body1"
            className={isCustomization ? classes.summaryCustomizationPriceValue : classes.summaryItemPriceValue}
          >
            {`₹${quote?.price?.value}`}
          </Typography>
        </div>
        {quote?.tax && (
          <div className={classes.summaryQuoteItemContainer} key={`quote-${qIndex}-tax`}>
            <Typography
              variant="body1"
              className={isCustomization ? classes.summaryCustomizationTaxLabel : classes.summaryItemTaxLabel}
            >
              {quote?.tax.title}
            </Typography>
            <Typography
              variant="body1"
              className={isCustomization ? classes.summaryCustomizationPriceValue : classes.summaryItemPriceValue}
            >
              {`₹${quote?.tax.value}`}
            </Typography>
          </div>
        )}
        {quote?.discount && (
          <div className={classes.summaryQuoteItemContainer} key={`quote-${qIndex}-discount`}>
            <Typography
              variant="body1"
              className={isCustomization ? classes.summaryCustomizationDiscountLabel : classes.summaryItemDiscountLabel}
            >
              {quote?.discount.title}
            </Typography>
            <Typography variant="body1" className={classes.summaryItemPriceValue}>
              {`₹${quote?.discount.value}`}
            </Typography>
          </div>
        )}
      </div>
    );
  };

  const getItemsTotal = () => {
    let finalTotal = 0;
    if (itemQuotes) {
      const items = Object.values(itemQuotes).filter((quote) => quote?.title !== "");
      items.forEach((item) => {
        finalTotal = finalTotal + parseInt(item.price.value);
        if (item.customizations) {
          Object.values(item.customizations).forEach((custItem) => {
            finalTotal = finalTotal + parseInt(custItem.price.value);
          });
        }
      });
    }
    return finalTotal;
  };

  const renderDeliveryLine = (quote, key) => {
    return (
      <div className={classes.summaryDeliveryItemContainer} key={`d-quote-${key}-price`}>
        <Typography variant="body1" className={classes.summaryDeliveryLabel}>
          {quote?.title}
        </Typography>
        <Typography variant="body1" className={classes.summaryItemPriceValue}>
          {`₹${quote?.value}`}
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
      </div>
    );
  };

  const getDeliveryTotalAmount = (providers) => {
    let total = 0;
    const data = deliveryQuotes;
    if (data.delivery) {
      total = total + parseInt(data.delivery.value);
    }
    if (data.discount) {
      total = total + parseInt(data.discount.value);
    }
    if (data.tax) {
      total = total + parseInt(data.tax.value);
    }
    if (data.packing) {
      total = total + parseInt(data.packing.value);
    }
    if (data.misc) {
      total = total + parseInt(data.misc.value);
    }
    return total;
  };

  const renderQuote = () => {
    try {
      return (
        <div>
          <div>
            {itemQuotes ? renderItems() : ""}
            <div className={classes.summarySubtotalContainer}>
              <Typography variant="body2" className={classes.subTotalLabel}>
                Total
              </Typography>
              <Typography variant="body2" className={classes.subTotalValue}>
                {`₹${itemQuotes ? getItemsTotal() : 0}`}
              </Typography>
            </div>
          </div>

          <Box component={"div"} className={classes.divider} />

          <div>
            {deliveryQuotes ? renderDeliveryCharges(deliveryQuotes) : ""}
            <div className={classes.summarySubtotalContainer}>
              <Typography variant="body2" className={classes.subTotalLabel}>
                Total
              </Typography>
              <Typography variant="body2" className={classes.subTotalValue}>
                {`₹${deliveryQuotes ? getDeliveryTotalAmount() : ""}`}
              </Typography>
            </div>
          </div>

          <Box component={"div"} className={classes.orderSummaryDivider} />
          <div className={classes.summaryItemContainer}>
            <Typography variant="body" className={classes.totalLabel}>
              Order Total
            </Typography>
            <Typography variant="h5" className={classes.totalValue}>
              {`₹${orderDetails?.quote?.price?.value || 0}`}
            </Typography>
          </div>
        </div>
      );
    } catch (error) {
      console.log(error);
      showQuoteError();
    }
  };

  // on status
  async function getUpdatedStatus(message_id) {
    try {
      const data = await cancellablePromise(
          getCall(`/clientApis/v2/on_order_status?messageIds=${message_id}`)
      );
      statusEventSourceResponseRef.current = [
        ...statusEventSourceResponseRef.current,
        data[0],
      ];
      const { message, error = {} } = data[0];
      if (error?.message) {
        dispatchToast("Cannot get status for this product", toast_types.error);
        setStatusLoading(false);
        return;
      }
      if (message?.order) {
        onUpdateOrder(message?.order);
        dispatch({
          type: toast_actions.ADD_TOAST,
          payload: {
            id: Math.floor(Math.random() * 100),
            type: toast_types.success,
            message: "Order status updated successfully!",
          },
        });
      }
      setStatusLoading(false);
    } catch (err) {
      setStatusLoading(false);
      dispatchToast(err?.message, toast_types.error);
      eventTimeOutRef.current.forEach(({ eventSource, timer }) => {
        eventSource.close();
        clearTimeout(timer);
      });
    }
  };

  // STATUS APIS
  // use this function to fetch support info through events
  function fetchStatusDataThroughEvents(message_id) {
    const token = getValueFromCookie("token");
    let header = {
      headers: {
        ...(token && {
          Authorization: `Bearer ${token}`,
        }),
      },
    };
    let es = new window.EventSourcePolyfill(
        `${process.env.REACT_APP_BASE_URL}clientApis/events?messageId=${message_id}`,
        header
    );
    es.addEventListener("on_status", (e) => {
      const { messageId } = JSON.parse(e?.data);
      getUpdatedStatus(messageId);
    });

    const timer = setTimeout(() => {
      es.close();
      if (statusEventSourceResponseRef.current.length <= 0) {
        dispatchToast(
            "Cannot proceed with you request now! Please try again",
            toast_types.error
        );
        setStatusLoading(false);
      }
    }, SSE_TIMEOUT);

    eventTimeOutRef.current = [
      ...eventTimeOutRef.current,
      {
        eventSource: es,
        timer,
      },
    ];
  }

  // use this api to get updated status of the order
  async function handleFetchUpdatedStatus() {
    statusEventSourceResponseRef.current = [];
    setStatusLoading(true);
    const transaction_id = orderDetails?.transactionId;
    const bpp_id = orderDetails?.bppId;
    const order_id = orderDetails?.id;
    try {
      const data = await cancellablePromise(
          postCall("/clientApis/v2/order_status", [
            {
              context: {
                transaction_id,
                bpp_id,
              },
              message: {
                order_id,
              },
            },
          ])
      );
      //Error handling workflow eg, NACK
      if (data[0].error && data[0].message.ack.status === "NACK") {
        setStatusLoading(false);
        dispatchToast(data[0].error.message, toast_types.error);
      } else {
        fetchStatusDataThroughEvents(data[0]?.context?.message_id);
      }
    } catch (err) {
      setStatusLoading(false);
      dispatchToast(err?.message, toast_types.error);
    }
  };

  return (
    <Card className={classes.orderSummaryCard}>
      <Typography variant="h5" className={classes.orderNumberTypo}>
        {`Order Number: `}
        <span className={classes.orderNumberTypoBold}>{orderDetails?.id}</span>
        <Chip
            className={classes.statusChip}
            color={orderDetails?.state === "Confirmed" || orderDetails?.state === "Created"?"primary":orderDetails?.state === "Delivered"?"success":orderDetails?.state === "Cancelled"?"error":"primary"}
            label={orderDetails?.state}
        />
      </Typography>
      <Typography variant="body1" className={classes.orderOnTypo}>
        {`Ordered On: ${moment(orderDetails?.createdAt).format("DD/MM/yy")} at ${moment(orderDetails?.createdAt).format(
          "hh:mma"
        )}`}{" "}
        | Payment: {orderDetails?.payment?.type === "ON-FULFILLMENT" ? "Cash on delivery" : "Prepaid"}
      </Typography>
      <Box component={"div"} className={classes.orderSummaryDivider} />

      <OrderTimeline />

      <Box component={"div"} className={classes.orderSummaryDivider} />

      {renderQuote()}
      <div className={classes.summaryItemActionContainer}>
        <Button
          fullWidth
          variant="outlined"
          className={classes.helpButton}
          onClick={() => handleFetchUpdatedStatus()}
        >
          {statusLoading?<Loading />:"Get Status"}
        </Button>
        {(orderDetails?.state === "Accepted" || orderDetails?.state === "Created") && (
          <Button
            fullWidth
            variant="contained"
            color="error"
            className={classes.cancelOrderButton}
            onClick={() => setToggleCancelOrderModal(true)}
            disabled={allNonCancellable || statusLoading}
          >
            Cancel Order
          </Button>
        )}
        {orderDetails?.state === "Completed" && (
          <Button
            fullWidth
            variant="contained"
            color="error"
            className={classes.cancelOrderButton}
            onClick={() => setToggleReturnOrderModal(true)}
            disabled={statusLoading}
          >
            Return Order
          </Button>
        )}
      </div>

      {toggleReturnOrderModal && (
        <ReturnOrderModal
          onClose={() => setToggleReturnOrderModal(false)}
          onSuccess={() => setToggleReturnOrderModal(false)}
          quantity={orderDetails.items?.map(({ quantity }) => quantity)}
          partailsCancelProductList={generateProductsList(orderDetails, itemQuotes)}
          order_status={orderDetails.state}
          bpp_id={orderDetails.bppId}
          transaction_id={orderDetails.transactionId}
          order_id={orderDetails.id}
        />
      )}

      {toggleCancelOrderModal && (
        <CancelOrderModal
          onClose={() => setToggleCancelOrderModal(false)}
          onSuccess={() => setToggleCancelOrderModal(false)}
          quantity={orderDetails.items?.map(({ quantity }) => quantity)}
          partailsCancelProductList={generateProductsList(orderDetails, itemQuotes)}
          order_status={orderDetails.state}
          bpp_id={orderDetails.bppId}
          transaction_id={orderDetails.transactionId}
          order_id={orderDetails.id}
        />
      )}
    </Card>
  );
};

export default OrderSummary;
