import React, { useEffect, useState, useContext, useRef } from "react";
import useStyles from "./style";

import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import moment from "moment";
import styles from "../../../styles/cart/cartView.module.scss";
import { ToastContext } from "../../../context/toastContext";
import { toast_actions, toast_types } from "../../shared/toast/utils/toast";
import ReturnOrderModal from "./returnOrderModal";
import CancelOrderModal from "./cancelOrderModal";
import useCancellablePromise from "../../../api/cancelRequest";
import { getCall, postCall } from "../../../api/axios";
import Loading from "../../shared/loading/loading";
import { getValueFromCookie } from "../../../utils/cookies";
import { SSE_TIMEOUT } from "../../../constants/sse-waiting-time";
import Chip from "@mui/material/Chip";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IssueOrderModal from "./issueOrderModal";
import { useHistory } from "react-router-dom";

const OrderSummary = ({ orderDetails, onUpdateOrder, onUpdateTrakingDetails }) => {
  const classes = useStyles();
  const history = useHistory();

  const [itemQuotes, setItemQuotes] = useState(null);
  const [cancelledItems, setCancelledItems] = useState([]);
  const [returnItems, setReturnItems] = useState([]);
  const [returnOrCancelledItems, setReturnOrCancelledItems] = useState([]);
  const [deliveryQuotes, setDeliveryQuotes] = useState(null);
  const dispatch = useContext(ToastContext);
  const [quoteItemInProcessing, setQuoteItemInProcessing] = useState(null);

  const [toggleReturnOrderModal, setToggleReturnOrderModal] = useState(false);
  const [toggleCancelOrderModal, setToggleCancelOrderModal] = useState(false);
  const [productsList, setProductsList] = useState([]);
  const [allNonCancellable, setAllNonCancellable] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [isIssueRaised, setIsIssueRaised] = useState(false);
  const [orderIssueId, setOrderIssueId] = useState("");
  const [issueLoading, setIssueLoading] = useState(false);
  const [toggleIssueModal, setToggleIssueModal] = useState(false);

  const statusEventSourceResponseRef = useRef(null);
  const eventTimeOutRef = useRef([]);

  const [trackOrderLoading, setTrackOrderLoading] = useState(false);
  const trackOrderRef = useRef(null);
  const trackEventSourceResponseRef = useRef(null);

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

  useEffect(() => {
    try {
      if (orderDetails) {
        if (orderDetails.updatedQuote) {
          const provided_by = orderDetails?.provider?.descriptor?.name;
          let uuid = 0;
          const breakup = orderDetails.updatedQuote.breakup;
          const all_items = breakup?.map((break_up_item) => {
            const items = orderDetails.items;
            const itemIndex = items.findIndex(
              (one) => one.id === break_up_item["@ondc/org/item_id"]
            );
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
              textClass =
                break_up_item["@ondc/org/title_type"] === "item"
                  ? "text-amber"
                  : "";
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
              isCancellable: item?.product?.["@ondc/org/cancellable"],
              isReturnable: item?.product?.["@ondc/org/returnable"],
            };
          });
          let items = {};
          let delivery = {};
          let selected_fulfillment_id = orderDetails?.items[0]?.fulfillment_id;
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
              if (item?.return_status) {
                addition_item_data.return_status = item?.return_status;
              } else {
              }
              if (item?.cancellation_status) {
                addition_item_data.cancellation_status =
                  item?.cancellation_status;
              } else {
              }
              items[key] = { ...prev_item_data, ...addition_item_data };
            }
            if (
              item.title_type === "tax" &&
              !item.isCustomization &&
              item.id !== selected_fulfillment_id
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
              items[key]["customizations"][item.id] =
                items[key]["customizations"][item.id] || {};
              items[key]["customizations"][item.id]["tax"] = {
                title: item.title,
                value: item.price,
              };
            }
            if (item.title_type === "discount" && item.isCustomization) {
              let key = item.parent_item_id;
              items[key]["customizations"] = items[key]["customizations"] || {};
              items[key]["customizations"][item.id] =
                items[key]["customizations"][item.id] || {};
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
            if (
              (item.title_type === "tax_f" || item.title_type === "tax") &&
              item.id === selected_fulfillment_id
            ) {
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
        if (orderDetails.items && orderDetails.items.length > 0) {
          const filterCancelledItems = orderDetails.items.filter(
            (item) =>
              item.cancellation_status &&
              item.cancellation_status === "Cancelled"
          );
          const filterReturnItems = orderDetails.items.filter(
            (item) =>
              item.cancellation_status &&
              item.cancellation_status !== "Cancelled"
          );
          setCancelledItems(filterCancelledItems);
          setReturnItems(filterReturnItems);
        }
        setReturnOrCancelledItems(getReturnOrCancelledItems());
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


  useEffect(() => {
    if (orderDetails) {
      getTrackIssueDetails();
    }
  }, [orderDetails]);

  // get issue status
  async function getTrackIssueDetails() {
    try {
      setIssueLoading(true);
      const data = await cancellablePromise(
        getCall(`/issueApis/v1/issue?transactionId=${orderDetails?.transactionId}`)
      );


      const { issueExistance, issue } = data;
      if (issueExistance) {
        setIssueLoading(false);
        setIsIssueRaised(true);
        setOrderIssueId(issue.issueId)
      } else {
        setIssueLoading(false);
      }
    } catch (err) {
      setIssueLoading(false);
      dispatchToast(err?.message, toast_types.error);
    }
  }

  const areAllItemsNonCancellable = (products) => {
    return !products.some((obj) => obj["@ondc/org/cancellable"]);
  };

  function generateProductsList(orderDetails, itemQuotes) {
    return orderDetails?.items
      ?.map(({ id }, index) => {
        let findQuote = orderDetails.updatedQuote?.breakup.find(
          (item) =>
            item["@ondc/org/item_id"] === id &&
            item["@ondc/org/title_type"] === "item"
        );
        if (findQuote) {
          if (findQuote?.item?.tags) {
            const tag = findQuote.item.tags.find((tag) => tag.code === "type");
            const tagList = tag?.list;
            const type = tagList?.find((item) => item.code === "type");
            if (type?.value === "item") {
              const parentId = findQuote?.item?.parent_item_id;
              let customizations = null;
              if (parentId) {
                customizations = itemQuotes[parentId].customizations;
              } else {
              }
              return {
                id,
                name: findQuote?.title ?? "NA",
                cancellation_status:
                  orderDetails.items?.[index]?.cancellation_status ?? "",
                return_status: orderDetails.items?.[index]?.return_status ?? "",
                fulfillment_status:
                  orderDetails.items?.[index]?.fulfillment_status ?? "",
                customizations: customizations ?? null,
                ...orderDetails.items?.[index]?.product,
                parent_item_id: parentId,
                provider_details: orderDetails.provider,
              };
            }
          } else {
            const parentId = findQuote?.item?.parent_item_id;
            return {
              id,
              name: findQuote?.title ?? "NA",
              cancellation_status:
                orderDetails.items?.[index]?.cancellation_status ?? "",
              return_status: orderDetails.items?.[index]?.return_status ?? "",
              fulfillment_status:
                orderDetails.items?.[index]?.fulfillment_status ?? "",
              customizations: null,
              ...orderDetails.items?.[index]?.product,
              parent_item_id: parentId,
              provider_details: orderDetails.provider,
            };
          }
        } else {
          findQuote = orderDetails.updatedQuote?.breakup[index];
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
      msg =
        "Seems like issue with quote processing! Please confirm first if quote is valid!";
    }
    dispatchError(msg);
  };

  const getSubTotal = (quote) => {
    let subtotal = 0;
    quote.forEach((item) => {
      subtotal += parseFloat(item?.price?.value);
    });
    return subtotal;
  };

  const getItemsWithCustomizations = () => {
    const breakup = orderDetails?.updatedQuote?.breakup;
    let returnBreakup = [];
    const filterItems = breakup.filter(
      (item) => item["@ondc/org/title_type"] === "item"
    );
    const filterCustomizations = breakup.filter(
      (item) => item["@ondc/org/title_type"] === "customization"
    );
    filterItems.forEach((item) => {
      const itemId = item["@ondc/org/item_id"];
      const filterCustomizationItems = filterCustomizations.filter(
        (cust) => cust.item.parent_item_id === itemId
      );
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
              <div
                className={classes.summaryQuoteItemContainer}
                key={`quote-${qIndex}-title`}
              >
                <Typography
                  variant="body1"
                  className={`${classes.summaryItemLabel} ${quote.textClass}`}
                >
                  {quote?.title}
                  {quote?.fulfillment_status && (
                    <Chip
                      size="small"
                      // variant="outlined"
                      className={classes.statusChip}
                      label={quote?.fulfillment_status}
                    />
                  )}
                  <p className={`${styles.ordered_from} ${quote.textClass}`}>
                    {quote.quantityMessage}
                  </p>
                </Typography>
              </div>
              <div
                className={`${classes.summaryQuoteItemContainer} ${classes.marginBottom12}`}
              >
                {quote.cancellation_status ? (
                  <Chip
                    size="small"
                    // variant="outlined"
                    className={classes.statusChip}
                    label={quote?.cancellation_status}
                  />
                ) : quote.return_status ? (
                  <Chip
                    size="small"
                    // variant="outlined"
                    className={classes.statusChip}
                    label={quote?.return_status}
                  />
                ) : (
                  <>
                    <Chip
                      size="small"
                      // variant="outlined"
                      className={classes.statusChip}
                      label={
                        quote?.isReturnable ? "returnable" : "non returnable"
                      }
                    />
                    <Chip
                      size="small"
                      // variant="outlined"
                      className={classes.statusChip}
                      label={
                        quote?.isCancellable ? "cancelable" : "non cancelable"
                      }
                    />
                  </>
                )}
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
      </div>
    );
  };

  const renderCancelledItems = () => {
    return (
      <div>
        <div>
          <Typography variant="body1" className={`${classes.summaryItemLabel}`}>
            Cancelled Items
          </Typography>
        </div>
        {cancelledItems.map((item, itemIndex) => (
          <div
            className={`${classes.summaryQuoteItemContainer} displayEllipsis`}
            key={`quote-${itemIndex}-price`}
          >
            <Tooltip
              title={`${item?.product?.descriptor?.name} * ${item.quantity.count}`}
            >
              <Typography
                variant="body1"
                className={classes.summaryItemPriceLabel}
              >
                {`${item?.product?.descriptor?.name} * ${item.quantity.count}`}
              </Typography>
            </Tooltip>
            {item?.cancellation_status && (
              <Chip
                size="small"
                className={classes.statusChip}
                label={item?.cancellation_status}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderReturnItems = () => {
    return (
      <div>
        <div className={classes.summaryQuoteItemContainer}>
          <Typography variant="body1" className={`${classes.summaryItemLabel}`}>
            Returned Items
          </Typography>
        </div>
        {returnItems.map((item, itemIndex) => (
          <div
            className={`${classes.summaryQuoteItemContainer} displayEllipsis`}
            key={`quote-${itemIndex}-price`}
          >
            <Tooltip
              title={`${item?.product?.descriptor?.name} * ${item.quantity.count}`}
            >
              <Typography
                variant="body1"
                className={classes.summaryItemPriceLabel}
              >
                {`${item?.product?.descriptor?.name} * ${item.quantity.count}`}
              </Typography>
            </Tooltip>
            {item?.cancellation_status && (
              <Chip
                size="small"
                className={classes.statusChip}
                label={item?.cancellation_status}
              />
            )}
          </div>
        ))}
      </div>
    );
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

  const getItemsTotal = () => {
    let finalTotal = 0;
    if (itemQuotes) {
      const items = Object.values(itemQuotes).filter(
        (quote) => quote?.title !== ""
      );
      items.forEach((item) => {
        finalTotal = finalTotal + parseFloat(item.price.value);
        if (item?.tax) {
          finalTotal = finalTotal + parseFloat(item.tax.value);
        }
        if (item.customizations) {
          Object.values(item.customizations).forEach((custItem) => {
            finalTotal = finalTotal + parseFloat(custItem.price.value);
            if (custItem?.tax) {
              finalTotal = finalTotal + parseFloat(custItem.tax.value);
            }
          });
        }
      });
    }
    finalTotal = parseInt(finalTotal).toFixed(2);
    return finalTotal;
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
      </div>
    );
  };

  const getDeliveryTotalAmount = (providers) => {
    let total = 0;
    const data = deliveryQuotes;
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
    return parseInt(total).toFixed(2);
  };

  const renderQuote = () => {
    try {
      return (
        <div>
          <div>
            {itemQuotes ? renderItems() : ""}

            {cancelledItems.length > 0 ||
              (returnItems.length > 0 && (
                <Box component={"div"} className={classes.divider} />
              ))}

            {cancelledItems.length > 0 ? renderCancelledItems() : ""}

            {returnItems.length > 0 ? renderReturnItems() : ""}

            {cancelledItems.length > 0 ||
              (returnItems.length > 0 && (
                <Box component={"div"} className={classes.divider} />
              ))}

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
              {`₹${parseInt(orderDetails?.updatedQuote?.price?.value).toFixed(2) || 0
                }`}
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
  }

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
  }

  // TRACK APIS
  // use this api to track and order
  async function handleFetchTrackOrderDetails() {
    trackEventSourceResponseRef.current = [];
    setTrackOrderLoading(true);
    const transaction_id = orderDetails?.transactionId;
    const bpp_id = orderDetails?.bppId;
    const order_id = orderDetails?.id;
    try {
      const data = await cancellablePromise(
        postCall("/clientApis/v2/track", [
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
      fetchTrackingDataThroughEvents(data[0]?.context?.message_id);
    } catch (err) {
      setTrackOrderLoading(false);
      dispatchToast(err?.message, toast_types.error);
    }
  }

  // use this function to fetch tracking info through events
  function fetchTrackingDataThroughEvents(message_id) {
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
    es.addEventListener("on_track", (e) => {
      const { messageId } = JSON.parse(e?.data);
      getTrackOrderDetails(messageId);
    });

    const timer = setTimeout(() => {
      es.close();
      if (trackEventSourceResponseRef.current.length <= 0) {
        dispatchToast(
          "Cannot proceed with you request now! Please try again",
          toast_types.error
        );
        setTrackOrderLoading(false);
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

  // on track order
  async function getTrackOrderDetails(message_id) {
    try {
      const data = await cancellablePromise(
        getCall(`/clientApis/v2/on_track?messageIds=${message_id}`)
      );
      setTrackOrderLoading(false);
      trackEventSourceResponseRef.current = [
        ...trackEventSourceResponseRef.current,
        data[0],
      ];
      const { message } = data[0];
      if (message.tracking.status === "active" && message.tracking.url === "") {
        onUpdateTrakingDetails(null);
        setTrackOrderLoading(false);
        dispatchToast(
          "Tracking information is not provided by the provider.",
          toast_types.error
        );
        return;
      } else if (message?.tracking?.url === "") {
        onUpdateTrakingDetails(null);
        setTrackOrderLoading(false);
        dispatchToast(
          "Tracking information not available for this product",
          toast_types.error
        );
        return;
      } else if (message.tracking.status === "active" && message?.tracking?.location?.gps) {
        onUpdateTrakingDetails(message?.tracking);
      } else if (
        message.tracking.status === "active" &&
        (message?.tracking?.url !== "" || message?.tracking?.url !== undefined)
      ) {
        setTrackOrderLoading(false);
        trackOrderRef.current.href = message?.tracking?.url;
        trackOrderRef.current.target = "_blank";
        trackOrderRef.current.click();
        onUpdateTrakingDetails(null);
      } else {
        onUpdateTrakingDetails(null);
        setTrackOrderLoading(false);
        dispatchToast(
          "Tracking information is not provided by the provider.",
          toast_types.error
        );
        return;
      }
    } catch (err) {
      setTrackOrderLoading(false);
      dispatchToast(err?.message, toast_types.error);
      eventTimeOutRef.current.forEach(({ eventSource, timer }) => {
        eventSource.close();
        clearTimeout(timer);
      });
    }
  }

  const getReturnOrCancelledItems = () => {
    let items = [];
    orderDetails?.fulfillments?.forEach((f) => {
      if (f.type === "Return") {
        const details = f.tags[0].list;
        items.push({
          id: details.find((d) => d.code === "item_id")["value"],
          quantity: details.find((d) => d.code === "item_quantity")["value"],
          type: f.type,
          status: f.state.descriptor.code,
        });
      }
    });
    return items;
  };

  const renderReturnOrCancel = () => {
    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 250 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <b>Item ID</b>
              </TableCell>
              <TableCell align="center">
                <b>Type</b>
              </TableCell>
              <TableCell align="center">
                <b>Quantity</b>
              </TableCell>
              <TableCell align="center">
                <b>Status</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {returnOrCancelledItems.map((row, idx) => (
              <TableRow
                key={row.idx}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="center">{row.id}</TableCell>
                <TableCell align="center">{row.type}</TableCell>
                <TableCell align="center">{row.quantity}</TableCell>
                <TableCell align="center">{row.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <div>
      <Card className={classes.orderSummaryCard}>
        <Typography variant="h5" className={classes.orderNumberTypo}>
          {`Order Number: `}
          <span className={classes.orderNumberTypoBold}>
            {orderDetails?.id}
          </span>
          <Chip
            className={classes.statusChip}
            color={
              orderDetails?.state === "Confirmed" ||
                orderDetails?.state === "Created"
                ? "primary"
                : orderDetails?.state === "Delivered"
                  ? "success"
                  : orderDetails?.state === "Cancelled"
                    ? "error"
                    : "primary"
            }
            label={orderDetails?.state}
          />
        </Typography>
        <Typography variant="body1" className={classes.orderOnTypo}>
          {`Ordered On: ${moment(orderDetails?.createdAt).format(
            "DD/MM/yy"
          )} at ${moment(orderDetails?.createdAt).format("hh:mma")}`}{" "}
          | Payment:{" "}
          {orderDetails?.payment?.type === "ON-FULFILLMENT"
            ? "Cash on delivery"
            : "Prepaid"}
        </Typography>
        <Box
          component={"div"}
          className={`${classes.orderSummaryDivider} ${classes.marginBottom0}`}
        />
        {/*<OrderTimeline />*/}
        {/*<Box component={"div"} className={classes.orderSummaryDivider} />*/}
        {renderQuote()}
        <div className={classes.summaryItemActionContainer}>
          { (orderDetails?.state === "Accepted" || orderDetails?.state === "In-progress" || orderDetails?.state === "Completed") && (
            <>
              {isIssueRaised ? (
                <Button
                  fullWidth
                  variant="outlined"
                  className={classes.helpButton}
                  disabled={
                    trackOrderLoading ||
                    statusLoading ||
                    issueLoading
                  }
                  onClick={() => history.push(`/application/complaints/`)}
                >
                  {issueLoading ? (
                    <Loading />
                  ) : (
                    "Track Issue"
                  )}
                </Button>
              ) : (
                <Button
                  fullWidth
                  variant="outlined"
                  className={classes.helpButton}
                  disabled={
                    trackOrderLoading ||
                    statusLoading ||
                    issueLoading
                  }
                  onClick={() => setToggleIssueModal(true)}
                >
                  {issueLoading ? (
                    <Loading />
                  ) : (
                    "Raise Issue"
                  )}
                </Button>
              )}
            </>)}
          <Button
            fullWidth
            variant="outlined"
            className={classes.helpButton}
            onClick={() => handleFetchUpdatedStatus()}
          >
            {statusLoading ? <Loading /> : "Get Status"}
          </Button>
          <Button
            fullWidth
            variant="outlined"
            disabled={trackOrderLoading || statusLoading}
            className={classes.helpButton}
            onClick={() => handleFetchTrackOrderDetails()}
          >
            Track
          </Button>
          {(orderDetails?.state === "Accepted" ||
            orderDetails?.state === "Created") && (
              <Button
                fullWidth
                variant="contained"
                color="error"
                className={classes.cancelOrderButton}
                onClick={() => setToggleCancelOrderModal(true)}
                disabled={allNonCancellable || statusLoading || trackOrderLoading}
              >
                Cancel Order
              </Button>
            )}
          {orderDetails?.state === "Completed" && (
            <>
              <Button
                fullWidth
                variant="contained"
                color="error"
                className={classes.cancelOrderButton}
                onClick={() => setToggleReturnOrderModal(true)}
                disabled={statusLoading || trackOrderLoading}
              >
                Return Order
              </Button>
            </>
          )}
        </div>
        {toggleReturnOrderModal && (
          <ReturnOrderModal
            onClose={() => setToggleReturnOrderModal(false)}
            onSuccess={() => {
              setToggleReturnOrderModal(false);
              onUpdateOrder();
            }}
            // quantity={orderDetails.items?.map(({ quantity }) => quantity)}
            quantity={orderDetails.items
              ?.filter(
                (item) =>
                  !item.hasOwnProperty("cancellation_status") ||
                  (item.hasOwnProperty("cancellation_status") &&
                    item.cancellation_status == "") ||
                  !item.hasOwnProperty("return_status") ||
                  (item.hasOwnProperty("return_status") &&
                    item.return_status == "")
              )
              .map(({ quantity }) => quantity)}
            partailsReturnProductList={generateProductsList(
              orderDetails,
              itemQuotes
            ).filter((item) => {
              if (
                !item.hasOwnProperty("cancellation_status") ||
                (item.hasOwnProperty("cancellation_status") &&
                  item.cancellation_status == "") ||
                !item.hasOwnProperty("return_status") ||
                (item.hasOwnProperty("return_status") &&
                  item.return_status == "")
              ) {
                return item;
              }
            })}
            order_status={orderDetails.state}
            bpp_id={orderDetails.bppId}
            transaction_id={orderDetails.transactionId}
            order_id={orderDetails.id}
            domain={orderDetails.domain}
            bpp_uri={orderDetails.bpp_uri}
            handleFetchUpdatedStatus={handleFetchUpdatedStatus}
            onUpdateOrder={onUpdateOrder}
          />
        )}
        {toggleCancelOrderModal && (
          <CancelOrderModal
            onClose={() => setToggleCancelOrderModal(false)}
            onSuccess={() => {
              setToggleCancelOrderModal(false);
              onUpdateOrder();
            }}
            quantity={orderDetails.items
              ?.filter(
                (item) =>
                  !item.hasOwnProperty("cancellation_status") ||
                  (item.hasOwnProperty("cancellation_status") &&
                    item.cancellation_status == "") ||
                  !item.hasOwnProperty("return_status") ||
                  (item.hasOwnProperty("return_status") &&
                    item.return_status == "")
              )
              .map(({ quantity }) => quantity)}
            partailsCancelProductList={generateProductsList(
              orderDetails,
              itemQuotes
            ).filter((item) => {
              if (orderDetails.domain === "ONDC:RET11") {
                return (
                  orderDetails.state === "Created" &&
                  item["@ondc/org/cancellable"] == true &&
                  item.fulfillment_status == "Pending" &&
                  (!item.hasOwnProperty("cancellation_status") ||
                    (item.hasOwnProperty("cancellation_status") &&
                      item.cancellation_status == "") ||
                    !item.hasOwnProperty("return_status") ||
                    (item.hasOwnProperty("return_status") &&
                      item.return_status == ""))
                );
              } else {
                return (
                  (orderDetails.state === "Accepted" ||
                    orderDetails.state === "Created") &&
                  item["@ondc/org/cancellable"] == true &&
                  item.fulfillment_status == "Pending" &&
                  (!item.hasOwnProperty("cancellation_status") ||
                    (item.hasOwnProperty("cancellation_status") &&
                      item.cancellation_status == "") ||
                    !item.hasOwnProperty("return_status") ||
                    (item.hasOwnProperty("return_status") &&
                      item.return_status == ""))
                );
              }
            })}
            order_status={orderDetails.state}
            bpp_id={orderDetails.bppId}
            transaction_id={orderDetails.transactionId}
            order_id={orderDetails.id}
            domain={orderDetails.domain}
            bpp_uri={orderDetails.bpp_uri}
            handleFetchUpdatedStatus={handleFetchUpdatedStatus}
            onUpdateOrder={onUpdateOrder}
          />
        )}
        {toggleIssueModal && (
          <IssueOrderModal
            onClose={() => setToggleIssueModal(false)}
            onSuccess={() => {
              setToggleIssueModal(false);
              onUpdateOrder();
              dispatch({
                type: toast_actions.ADD_TOAST,
                payload: {
                  id: Math.floor(Math.random() * 100),
                  type: toast_types.success,
                  message: "Complaint raised successfully!",
                },
              });
            }}
            quantity={orderDetails.items?.map(({ quantity }) => quantity)}
            partailsIssueProductList={generateProductsList(
              orderDetails,
              itemQuotes
            )}
            order_status={orderDetails.state}
            billing_address={orderDetails?.billing}
            delivery_address={orderDetails?.fulfillments?.[0]?.end?.location?.address}
            transaction_id={orderDetails.transactionId}
            order_id={orderDetails.id}
            bpp_id={orderDetails.bppId}
            bpp_uri={orderDetails.bpp_uri}
            fulfillments={orderDetails.fulfillments}
            domain={orderDetails.domain}
          />
        )}
        <a
          ref={trackOrderRef}
          style={{ visibility: "hidden", display: "none" }}
        >
          navigate
        </a>
      </Card>
      <br />
      {returnOrCancelledItems.length > 0 && (
        <Card className={classes.orderSummaryCard}>
          <Typography variant="body" className={classes.totalLabel}>
            Returned / Cancelled Items
          </Typography>
          <div style={{ marginTop: "20px" }}>{renderReturnOrCancel()}</div>
        </Card>
      )}
    </div>
  );
};

export default OrderSummary;
