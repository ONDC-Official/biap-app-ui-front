import React, { useContext, useRef, useState, useEffect } from "react";
import CrossIcon from "../../shared/svg/cross-icon";
import styles from "../../../styles/search-product-modal/searchProductModal.module.scss";
import productCartStyles from "../../../styles/products/productCard.module.scss";
import productStyles from "../../../styles/orders/orders.module.scss";
import ErrorMessage from "../../shared/error-message/errorMessage";
import { toast_actions, toast_types } from "../../shared/toast/utils/toast";
import { getValueFromCookie } from "../../../utils/cookies";
import { ToastContext } from "../../../context/toastContext";
import useCancellablePromise from "../../../api/cancelRequest";
import { SSE_TIMEOUT } from "../../../constants/sse-waiting-time";
import { postCall, getCall } from "../../../api/axios";
import Checkbox from "../../shared/checkbox/checkbox";
import Dropdown from "../../shared/dropdown/dropdown";
import Subtract from "../../shared/svg/subtract";
import Add from "../../shared/svg/add";
import { RETURN_REASONS } from "../../../constants/cancelation-reasons";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  Divider,
  Grid,
  Rating,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Input from "../../shared/input/input";
import axios from "axios";
import Cookies from "js-cookie";
import Radio from "@mui/material/Radio";

import { makeStyles } from "@mui/styles";
import { Fullscreen } from "@mui/icons-material";

const useStyles = makeStyles({
  card: {
    padding: "10px 26px !Important",
    // borderRadius: "16px !important",
    marginTop: "15px",
    border: "1.5px solid #e1e1e1 !important",
    boxShadow: "none !important",
  },
  cardLabel: {
    flex: 1,
    fontSize: "15px !important",
    fontWeight: "600 !important",
  },
  orderId: {
    flex: 1,
    fontSize: "20px !important",
    fontWeight: "600 !important",
    color: "gray",
  },
  sellerName: {
    flex: 1,
    fontSize: "18px !important",
    fontWeight: "600 !important",
  },
  itemName: {
    flex: 1,
    fontSize: "16px !important",
    fontWeight: "500 !important",
  },
  agentName: {
    flex: 1,
    fontSize: "17px !important",
    fontWeight: "600 !important",
  },
  centerItem: {
    display: "flex",
    alignItems: "center",
  },
});

export default function RatingsModal({
  bpp_id,
  transaction_id,
  order_id,
  order_status,
  productList = [],
  onClose,
  onSuccess,
  quantity,
  bpp_uri,
  handleFetchUpdatedStatus,
  onUpdateOrder,
  provider,
  fulfillments,
}) {
  console.log("partailsReturnProductList", productList);
  const modalStyles = useStyles();

  // STATES
  const [ratings, setRatings] = useState({
    order: { rating: "" },
    provider: { rating: "" },
    items: {},
    agents: {},
    fulfillments,
  });
  // format will be following
  // {
  //   order: {id: "", rating: ""},
  //   provider: {id: "", rating: ""}
  //   items: {id1: value, id2: value}
  //   agents: {id1: value, id2: value}
  //   fulfillments: {id1: value, id2: value}
  // }

  const [inlineError, setInlineError] = useState({
    selected_id_error: "",
    reason_error: "",
  });
  const [loading, setLoading] = useState(false);
  const [selectedCancelReasonId, setSelectedCancelReasonId] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);
  const [orderQty, setOrderQty] = useState([]);
  const [reasons, setReasons] = useState([]);
  let fulfillmentsToProducts = {};

  const [selectedImages, setSelectedImages] = useState({});

  // REFS
  const cancelPartialEventSourceResponseRef = useRef(null);
  const eventTimeOutRef = useRef([]);

  // CONTEXT
  const dispatch = useContext(ToastContext);

  // HOOKS
  const { cancellablePromise } = useCancellablePromise();

  // use this function to check if the list exist or not for partial products
  // to be returned
  function areProductsToBeReturned() {
    return productList?.length > 0;
  }

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

  // PARTIAL CANCEL APIS
  // use this function to fetch cancel product through events
  function fetchCancelPartialOrderDataThroughEvents(message_id) {
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
    es.addEventListener("on_update", (e) => {
      const { messageId } = JSON.parse(e?.data);
      getPartialCancelOrderDetails(messageId);
      onUpdateOrder();
    });

    const timer = setTimeout(() => {
      es.close();
      if (cancelPartialEventSourceResponseRef.current.length <= 0) {
        dispatchToast(
          "Cannot proceed with you request now! Please try again",
          toast_types.error
        );
        setLoading(false);
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

  const getSignUrl = async (file) => {
    const url = `/clientApis/v2/getSignUrlForUpload/${order_id}`;
    const file_type = file.type.split("/")[1];
    const data = {
      fileType: file_type,
    };
    try {
      const res = await postCall(url, data);
      const publicUrl = await uploadAsset(file, res);
      return publicUrl;
    } catch (error) {
      console.error("Error getting signed URL or uploading file:", error);
    }
  };

  const uploadAsset = async (file, res) => {
    const token = Cookies.get("token");
    const data = await axios(res.urls, {
      method: "PUT",
      data: file,
      headers: {
        ...(token && { "access-token": `Bearer ${token}` }),
        "Content-Type": "multipart/form-data",
      },
    });

    return res.publicUrl;
  };

  // use this api to partial update orders
  async function handlePartialOrderCancel() {
    const allCheckPassed = [checkReason(), checkIsOrderSelected()].every(
      Boolean
    );
    if (!allCheckPassed) return;

    cancelPartialEventSourceResponseRef.current = [];
    //  setLoading(true);
    const map = new Map();
    selectedIds.map((item) => {
      const provider_id = item?.provider_details?.id;
      if (map.get(provider_id)) {
        return map.set(provider_id, [...map.get(provider_id), item]);
      }
      return map.set(provider_id, [item]);
    });
    const requestObject = Array.from(map.values());
    let payload = await Promise.all(
      selectedIds?.map(async (item) => {
        if (Object.keys(selectedImages).length == 0) {
          setInlineError((error) => ({
            ...error,
            image_error: { [item.id]: "Please choose atleast one image" },
          }));
          return;
        } else {
          setInlineError((error) => ({
            ...error,
            image_error: { [item.id]: "" },
          }));
        }
        const imageFiles = await Promise.all(
          selectedImages[item?.id]?.map((file) => getSignUrl(file))
        );
        const customizations = item.customizations;
        const customizationPayload = customizations
          ? Object.entries(customizations).map(
              ([customizationId, customization]) => ({
                id: customizationId,
                quantity: {
                  count: item.quantity.count,
                },
                tags: {
                  parent_item_id: item.parent_item_id,
                  update_type: "return",
                  reason_code: selectedCancelReasonId?.key,
                  ttl_approval: item?.["@ondc/org/return_window"]
                    ? item?.["@ondc/org/return_window"]
                    : "",
                  ttl_reverseqc: "P3D",
                  image: imageFiles.join(","),
                },
              })
            )
          : [];

        return [
          {
            id: item?.id,
            quantity: {
              count: item.quantity.count,
            },
            tags: {
              parent_item_id: item.parent_item_id,
              update_type: "return",
              reason_code: selectedCancelReasonId?.key,
              ttl_approval: item?.["@ondc/org/return_window"]
                ? item?.["@ondc/org/return_window"]
                : "",
              ttl_reverseqc: "P3D",
              image: imageFiles.join(","),
            },
          },
          ...customizationPayload,
        ];
      })
    );

    payload = payload.flat().filter(Boolean);

    const payloadData = requestObject?.map((item, index) => {
      return {
        context: {
          bpp_id,
          bpp_uri,
          transaction_id,
        },
        message: {
          update_target: "item",
          order: {
            id: order_id,
            state: order_status,
            provider: {
              id: item?.[index]?.provider_details?.id,
            },
            items: payload,
          },
        },
      };
    });

    console.log("return payload: ", payloadData);

    try {
      const data = await cancellablePromise(
        postCall("clientApis/v2/update", payloadData)
      );
      // Error handling workflow eg, NACK
      if (data[0].error && data[0].message.ack.status === "NACK") {
        setLoading(false);
        dispatchToast(data[0].error.message, toast_types.error);
      } else {
        fetchCancelPartialOrderDataThroughEvents(
          data?.map((txn) => {
            const { context } = txn;
            return context?.message_id;
          })
        );
      }
    } catch (err) {
      setLoading(false);
      dispatchToast(err?.message, toast_types.error);
    }
  }

  // on Update api
  async function getPartialCancelOrderDetails(message_id) {
    try {
      const data = await cancellablePromise(
        getCall(`/clientApis/v2/on_update?messageId=${message_id}`)
      );
      cancelPartialEventSourceResponseRef.current = [
        ...cancelPartialEventSourceResponseRef.current,
        data,
      ];
      setLoading(false);
      if (data?.message) {
        onSuccess();
      } else {
        dispatchToast(
          "Something went wrong!, product status cannot be updated",
          toast_types.error
        );
      }
    } catch (err) {
      setLoading(false);
      dispatchToast(err?.message, toast_types.error);
      eventTimeOutRef.current.forEach(({ eventSource, timer }) => {
        eventSource.close();
        clearTimeout(timer);
      });
    }
  }

  // use this function to check if any order is selected
  function checkIsOrderSelected() {
    if (selectedIds.length <= 0) {
      setInlineError((error) => ({
        ...error,
        selected_id_error: "Please select a product to return",
      }));
      return false;
    }
    return true;
  }

  // use this function to check if any reason is selected
  function checkReason() {
    if (Object.keys(selectedCancelReasonId).length <= 0) {
      setInlineError((error) => ({
        ...error,
        reason_error: "Please Select Reason",
      }));
      return false;
    }
    return true;
  }

  // use this function to check if the provider is already selected
  function isProductSelected(id) {
    return (
      selectedIds.filter(({ id: provider_id }) => provider_id === id).length > 0
    );
  }

  // use this function to add attribute in filter list
  function addProductToCancel(attribute, qty) {
    let latestAttribute = JSON.parse(
      JSON.stringify(Object.assign({}, attribute))
    );
    latestAttribute.quantity.count = qty;
    setSelectedIds([...selectedIds, latestAttribute]);
  }

  // use this function to remove the selected attribute from filter
  function removeProductToCancel(attribute) {
    setSelectedIds(selectedIds.filter(({ id }) => id !== attribute.id));
  }

  // use this function to update quantity of the selected product
  function updateQtyForSelectedProduct(pId, qty) {
    let data = JSON.parse(JSON.stringify(Object.assign([], selectedIds)));
    data = data.map((item) => {
      if (item.id === pId) {
        item.quantity.count = qty;
      } else {
      }
      return item;
    });
    setSelectedIds(data);
  }

  useEffect(() => {
    return () => {
      eventTimeOutRef.current.forEach(({ eventSource, timer }) => {
        eventSource.close();
        clearTimeout(timer);
      });
    };
  }, []);

  useEffect(() => {
    if (selectedIds.length > 0) {
      const findNonReturnableItem = selectedIds.find(
        (p) => !p?.["@ondc/org/returnable"]
      );
      if (findNonReturnableItem) {
        const data = RETURN_REASONS.filter(
          (r) => r.isApplicableForNonReturnable
        );
        setReasons(data);
      } else {
        setReasons(RETURN_REASONS);
      }
    }
  }, [selectedIds]);

  useEffect(() => {
    if (quantity) {
      setOrderQty(JSON.parse(JSON.stringify(Object.assign(quantity))));
    }
  }, [quantity]);

  const onUpdateQty = (qty, idx, pId) => {
    let qtyData = Object.assign([], orderQty);
    qtyData[idx].count = qty;
    setOrderQty(qtyData);
    updateQtyForSelectedProduct(pId, qty);
  };

  const getFulfillmentsToProducts = () => {
    let fulfillments_to_products = {};
    let fIdToDetails = {};
    fulfillments?.forEach((fulfillment) => {
      fIdToDetails[fulfillment.id] = fulfillment;
    });
    productList?.forEach((product) => {
      const f_id = product.fulfillment_id;
      fulfillments_to_products[f_id] = fulfillments_to_products[f_id]
        ? fulfillments_to_products[f_id]
        : [];
      fulfillments_to_products[f_id].push(product);
    });
    console.log({
      fulfillmentIdToDetails: fIdToDetails,
      fulfillmentIdToProducts: fulfillments_to_products,
    });
    return {
      fulfillmentIdToDetails: fIdToDetails,
      fulfillmentIdToProducts: fulfillments_to_products,
    };
  };

  const renderOverAllOrderReview = () => {
    return (
      <Card className={modalStyles.card}>
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="order"
            id="order"
          >
            <Typography variant="body" className={modalStyles.cardLabel}>
              Rate Your Overall Order
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Divider
              sx={{
                borderColor: "#616161",
                margin: "5px 0 20px 0 ",
                width: "98.5%",
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <Typography variant="body" className={modalStyles.orderId}>
                  {order_id}
                </Typography>
              </div>
              <div>
                <Rating
                  name="simple-controlled"
                  value={ratings.order.rating}
                  onChange={(event, newValue) => {
                    setRatings((oldRatings) => {
                      return {
                        ...oldRatings,
                        order: { id: order_id, rating: newValue },
                      };
                    });
                  }}
                />
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
      </Card>
    );
  };

  const renderSellerReview = () => {
    return (
      <Card className={modalStyles.card}>
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="order"
            id="order"
          >
            <Typography variant="body" className={modalStyles.cardLabel}>
              Rate Your Seller
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Divider
              sx={{
                borderColor: "#616161",
                margin: "5px 0",
                width: "98.5%",
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ width: 50, height: 50 }}>
                    <img
                      src={provider?.descriptor?.symbol}
                      alt=""
                      style={{ width: "100%", height: "100%" }}
                    />
                  </div>
                  <div className={`ml-2 ${modalStyles.centerItem}`}>
                    <Typography
                      variant="body"
                      className={modalStyles.sellerName}
                    >
                      {provider?.descriptor?.name}
                    </Typography>
                  </div>
                </div>
              </div>
              <div className={modalStyles.centerItem}>
                <Rating
                  name="simple-controlled"
                  value={ratings.provider.rating}
                  onChange={(event, newValue) => {
                    setRatings((oldRatings) => {
                      return {
                        ...oldRatings,
                        provider: { id: provider.id, rating: newValue },
                      };
                    });
                  }}
                />
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
      </Card>
    );
  };

  const renderItemReviews = () => {
    const { fulfillmentIdToDetails, fulfillmentIdToProducts } =
      getFulfillmentsToProducts();

    return Object.keys(fulfillmentIdToProducts).map((fulfillment_id) => {
      const agent_id = fulfillmentIdToDetails[fulfillment_id]?.agent.id;
      return (
        <Card className={modalStyles.card}>
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="order"
              id="order"
            >
              <Typography variant="body" className={modalStyles.cardLabel}>
                Rate Your Items
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Divider
                sx={{
                  borderColor: "#616161",
                  margin: "5px 0",
                  width: "98.5%",
                }}
              />
              {fulfillmentIdToProducts[fulfillment_id]?.map((product, idx) => {
                return (
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div style={{ width: 50, height: 50 }}>
                          <img
                            src={product?.descriptor?.symbol}
                            alt=""
                            style={{ width: "100%", height: "100%" }}
                          />
                        </div>
                        <div className={`ml-2 ${modalStyles.centerItem}`}>
                          <Typography
                            variant="body"
                            className={modalStyles.itemName}
                          >
                            {product?.descriptor?.name}
                          </Typography>
                        </div>
                      </div>

                      <div className={modalStyles.centerItem}>
                        <Rating
                          name="simple-controlled"
                          value={ratings.items[product.id] || 0}
                          onChange={(event, newValue) => {
                            setRatings((oldRatings) => {
                              let item_ratings = oldRatings.items;
                              item_ratings[product.id] = newValue;
                              return {
                                ...oldRatings,
                                items: item_ratings,
                              };
                            });
                          }}
                        />
                      </div>
                    </div>
                    <Divider
                      sx={{
                        borderColor: "#616161",
                        margin: "15px 0",
                        width: "98.5%",
                      }}
                    />
                  </div>
                );
              })}
              <Typography variant="body" className={modalStyles.cardLabel}>
                Rate Your Delivery Agent
              </Typography>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
                className="mt-3"
              >
                <div className={`${modalStyles.centerItem}`}>
                  <Typography variant="body" className={modalStyles.agentName}>
                    {fulfillmentIdToDetails[fulfillment_id]?.agent.name}
                  </Typography>
                </div>
                <div className={`${modalStyles.centerItem}`}>
                  <Rating
                    name="simple-controlled"
                    value={ratings.agents[agent_id]}
                    onChange={(event, newValue) => {
                      setRatings((oldRatings) => {
                        let agent_ratings = oldRatings.agents;
                        agent_ratings[agent_id] = newValue;
                        return {
                          ...oldRatings,
                          agents: agent_ratings,
                        };
                      });
                    }}
                  />
                </div>
              </div>
              <Divider
                sx={{
                  borderColor: "#616161",
                  margin: "15px 0",
                  width: "98.5%",
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <Typography variant="body" className={modalStyles.cardLabel}>
                    Rate Your Delivery Experience
                  </Typography>
                </div>
                <div>
                  <Rating
                    name="simple-controlled"
                    value={ratings.fulfillments[fulfillment_id]}
                    onChange={(event, newValue) => {
                      setRatings((oldRatings) => {
                        let fulfilment_ratings = oldRatings.fulfillments;
                        fulfilment_ratings[fulfillment_id] = newValue;
                        return {
                          ...oldRatings,
                          fulfillments: fulfilment_ratings,
                        };
                      });
                    }}
                  />
                </div>
              </div>
            </AccordionDetails>
          </Accordion>
        </Card>
      );
    });
  };

  return (
    <div className={styles.overlay}>
      <div
        className={styles.popup_card}
        style={{ width: "700px", height: "80%" }}
      >
        <div className={`${styles.card_header} d-flex align-items-center`}>
          <Typography variant="h4">Rate Your Order</Typography>
          <div className="ms-auto">
            <CrossIcon
              width="20"
              height="20"
              color={"#151515"}
              style={{ cursor: "pointer" }}
              onClick={onClose}
            />
          </div>
        </div>
        <div className={styles.card_body} style={{ height: "80%" }}>
          <div style={{ maxHeight: "100%", overflow: "auto" }}>
            {renderOverAllOrderReview()}
            {renderSellerReview()}
            {renderItemReviews()}
          </div>
        </div>
        <div className={`${styles.card_footer} d-flex align-items-center`}>
          <Button
            sx={{ paddingLeft: 4, paddingRight: 4, width: "100%" }}
            isloading={loading ? 1 : 0}
            disabled={loading}
            variant="contained"
            onClick={() => {
              handlePartialOrderCancel();
            }}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
