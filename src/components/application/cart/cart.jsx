import React, { useContext, useEffect, useRef, useState } from "react";
import useStyles from "./styles";
import { useHistory, Link } from "react-router-dom";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Button, Card, Divider, Grid, TextField, Typography } from "@mui/material";
import { deleteCall, getCall, postCall, putCall } from "../../../api/axios";
import { AddCookie, getValueFromCookie } from "../../../utils/cookies";
import Loading from "../../shared/loading/loading";
import { constructQouteObject } from "../../../api/utils/constructRequestObject";
import useCancellablePromise from "../../../api/cancelRequest";
import { SSE_TIMEOUT } from "../../../constants/sse-waiting-time";
import { v4 as uuidv4 } from "uuid";
import { AddressContext } from "../../../context/addressContext";

export default function Cart() {
  const ref = useRef(null);
  const classes = useStyles();
  const history = useHistory();
  const { deliveryAddress } = useContext(AddressContext);
  let user = JSON.parse(getValueFromCookie("user"));
  const { cancellablePromise } = useCancellablePromise();
  const transaction_id = getValueFromCookie("transaction_id");

  const responseRef = useRef([]);
  const eventTimeOutRef = useRef([]);
  const updatedCartItems = useRef([]);
  const [getQuoteLoading, setGetQuoteLoading] = useState(true);
  const [toggleInit, setToggleInit] = useState(false);
  const [eventData, setEventData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [haveDistinctProviders, setHaveDistinctProviders] = useState(false);
  const [errorMessageTimeOut, setErrorMessageTimeOut] = useState("Fetching details for this product");

  const getCartSubtotal = () => {
    let subtotal = 0;
    cartItems.map((cartItem) => {
      subtotal += cartItem.item.product.subtotal;
    });
    return subtotal;
  };

  const checkDistinctProviders = () => {
    if (cartItems.length < 2) {
      setHaveDistinctProviders(false);
    } else {
      const firstProvider = cartItems[0].item.provider.id;
      let haveDifferentProvider = false;

      for (let i = 1; i < cartItems.length; i++) {
        if (cartItems[i].item.provider.id !== firstProvider) {
          haveDifferentProvider = true;
          break;
        }
      }

      setHaveDistinctProviders(haveDifferentProvider);
    }
  };

  const getCartItems = async () => {
    try {
      setLoading(true);
      const url = `/clientApis/v2/cart/${user.id}`;
      const res = await getCall(url);
      setCartItems(res);
      updatedCartItems.current = res;
    } catch (error) {
      console.log("Error fetching cart items:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (itemId, increment) => {
    const url = `/clientApis/v2/cart/${user.id}/${itemId}`;
    const items = cartItems.concat([]);
    const itemIndex = items.findIndex((item) => item.item.id === itemId);
    if (itemIndex !== -1) {
      let updatedCartItem = items[itemIndex];
      updatedCartItem.id = updatedCartItem.item.id;

      if (increment) {
        updatedCartItem.item.quantity.count += 1;
      } else {
        if (updatedCartItem.item.quantity.count > 1) {
          updatedCartItem.item.quantity.count -= 1;
        }
      }

      updatedCartItem = updatedCartItem.item;
      const res = await putCall(url, updatedCartItem);
      console.log("after update:", res);
      setLoading(false);
      getCartItems();
    }
  };

  const deleteCartItem = async (itemId) => {
    const url = `/clientApis/v2/cart/${user.id}/${itemId}`;
    const res = await deleteCall(url);
    getCartItems();
  };

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
    getCartItems();
  }, []);

  useEffect(() => {
    checkDistinctProviders();
  }, [cartItems.length]);

  const emptyCartScreen = () => {
    return (
      <div className={classes.emptyCartScreen}>
        <InfoOutlinedIcon color="warning" sx={{ fontSize: 90, marginBottom: 2 }} />
        <Typography variant="h3" sx={{ fontFamily: "Inter", fontWeight: 700, textTransform: "none" }}>
          Your Cart is Empty. Please add items
        </Typography>
        <Typography variant="body" sx={{ marginTop: 2, marginBottom: 2 }}>
          Explore our wide selection and find something you like
        </Typography>
        <Link to="/application/products">
          <Button variant="contained">Explore Now</Button>
        </Link>
      </div>
    );
  };

  const renderTableHeads = () => {
    return (
      <Grid>
        <Grid container sx={{ paddingTop: "20px" }}>
          <Grid item xs={4.3}>
            <Typography variant="body1" className={classes.tableHead}>
              Item
            </Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography variant="body1" className={classes.tableHead} sx={{ marginLeft: "6px" }}>
              Price
            </Typography>
          </Grid>
          <Grid item xs={1.2}>
            <Typography variant="body1" className={classes.tableHead} sx={{ marginLeft: "12px" }}>
              Qty
            </Typography>
          </Grid>
          <Grid item xs={1.4}>
            <Typography variant="body1" className={classes.tableHead}>
              Subtotal
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body1" className={classes.tableHead}>
              Special Instructions
            </Typography>
          </Grid>
        </Grid>
        <Divider sx={{ backgroundColor: "#CACDD8", margin: "20px 0", width: "98.5%" }} />
      </Grid>
    );
  };

  const getCustomizations = (cartItem) => {
    if (cartItem.item.customisations) {
      const customisations = cartItem.item.customisations;

      return customisations.map((c) => {
        return (
          <Grid container sx={{ marginTop: 1 }}>
            <Typography>{c.item_details.descriptor.name} &nbsp;</Typography>
            <Typography>₹{c.item_details.price.value}</Typography>
          </Grid>
        );
      });
    }

    return null;
  };

  const renderProducts = () => {
    return cartItems?.map((cartItem, idx) => {
      return (
        <Grid>
          <Grid container key={cartItem?.item?.id} style={{ alignItems: "flex-start" }}>
            <Grid item xs={4.3}>
              <Grid container>
                <div className={classes.moreImages}>
                  <div className={classes.greyContainer}>
                    <img
                      className={classes.moreImage}
                      alt="product-image"
                      src={cartItem?.item?.product?.descriptor?.images[0]}
                      onClick={() => history.push(`/application/products/${cartItem.item.id}`)}
                    />
                  </div>
                </div>
                <Grid>
                  <Typography variant="body1" sx={{ width: 200, fontWeight: 600 }}>
                    {cartItem?.item?.product?.descriptor?.name}
                  </Typography>
                  <Grid container sx={{ marginTop: "4px" }} alignItems="center">
                    <div className={classes.logoContainer}>
                      <img
                        className={classes.logo}
                        alt={"store-logo"}
                        src={cartItem?.item?.provider?.descriptor?.symbol}
                      />
                    </div>
                    <Typography variant="body1" color="#686868" sx={{ fontWeight: 500 }}>
                      {cartItem?.item?.provider?.descriptor?.name}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              {getCustomizations(cartItem)}
            </Grid>
            <Grid item xs={1}>
              <Typography variant="body" sx={{ fontWeight: 600 }}>
                ₹ {cartItem?.item?.product?.price?.value}
              </Typography>
            </Grid>
            <Grid item xs={1.2}>
              <div className={classes.qtyContainer}>
                <Typography variant="body1" sx={{ marginRight: "6px", fontWeight: 600 }}>
                  {cartItem?.item?.quantity?.count}
                </Typography>
                <KeyboardArrowUpIcon
                  className={classes.qtyArrowUp}
                  onClick={() => updateCartItem(cartItem.item.id, true)}
                />
                <KeyboardArrowDownIcon
                  className={classes.qtyArrowDown}
                  onClick={() => updateCartItem(cartItem.item.id, false)}
                />
              </div>
            </Grid>
            <Grid item xs={1.4}>
              <Typography variant="body" sx={{ fontWeight: 600 }}>
                ₹ {parseInt(cartItem?.item?.quantity?.count) * parseInt(cartItem?.item?.product?.subtotal)}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                multiline
                rows={2}
                size="small"
                placeholder="Write here"
                sx={{ padding: "6px 12px" }}
              />

              <Grid container sx={{ margin: "16px 0" }} alignItems="center" justifyContent="flex-end">
                <Button
                  variant="text"
                  startIcon={<DeleteOutlineIcon size="small" />}
                  color="error"
                  onClick={() => deleteCartItem(cartItem?.item?.id)}
                >
                  <Typography>Delete</Typography>
                </Button>
              </Grid>
            </Grid>
          </Grid>
          {cartItem.item.quantity.count > cartItem.item.product.quantity.available.count && (
            <Grid>
              <div className={classes.infoBox}>
                <Typography className={classes.infoText}>
                  Only {cartItem.item.product.quantity.available.count} available instead of{" "}
                  {cartItem.item.quantity.count}. Update the quantity or switch to another provider.
                </Typography>
              </div>
            </Grid>
          )}
          {idx === cartItems.length - 1 && haveDistinctProviders && (
            <Grid>
              <div className={classes.infoBox} style={{ background: "#FAE1E1", width: "98.5%" }}>
                <Typography className={classes.infoText} style={{ color: "#D83232", textAlign: "center" }}>
                  You are ordering from different store. Please check your order again.
                </Typography>
              </div>
            </Grid>
          )}
          <Divider sx={{ backgroundColor: "#CACDD8", margin: "20px 0", width: "98.5%" }} />
        </Grid>
      );
    });
  };

  const renderSummaryCard = () => {
    return (
      <Card className={classes.summaryCard}>
        <Typography variant="h4" className={classes.summaryTypo}>
          Summary
        </Typography>
        <Divider sx={{ background: "#CACDD8", margin: "20px 0" }} />
        <Grid container justifyContent="space-between" sx={{ marginBottom: "14px" }}>
          <Typography variant="subtitle1" className={classes.summaryLabel}>
            Cart Subtotal
          </Typography>
          <Typography variant="subtitle1" className={classes.summaryLabel}>
            ₹{getCartSubtotal()}
          </Typography>
        </Grid>
        {/* <Grid container justifyContent="space-between" sx={{ marginBottom: "14px" }}>
          <Grid xs={8}>
            <Typography variant="subtitle1" className={classes.summaryLabel}>
              Shipping
            </Typography>
            <Typography variant="subtitle2" color="#A2A6B0">
              (Standard Rate - Price may vary depending on the item/destination. TECS Staff will contact you.)
            </Typography>
          </Grid>
          <Typography variant="subtitle1" className={classes.summaryLabel}>
            ₹0
          </Typography>
        </Grid> */}
        {/* <Grid container justifyContent="space-between" sx={{ marginBottom: "14px" }}>
          <Typography variant="subtitle1" className={classes.summaryLabel}>
            Tax
          </Typography>
          <Typography variant="subtitle1" className={classes.summaryLabel}>
            ₹0
          </Typography>
        </Grid> */}
        {/* <Grid container justifyContent="space-between" sx={{ marginBottom: "14px" }}>
          <Typography variant="subtitle1" className={classes.summaryLabel}>
            GST (10%)
          </Typography>
          <Typography variant="subtitle1" className={classes.summaryLabel}>
            ₹0
          </Typography>
        </Grid> */}
        {/* <Divider sx={{ background: "#CACDD8", margin: "20px 0" }} /> */}
        {/* <Grid container justifyContent="space-between" sx={{ marginBottom: "14px" }}>
          <Typography variant="subtitle1" className={classes.summaryLabel}>
            Order Total
          </Typography>
          <Typography variant="subtitle1" sx={{ fontSize: 18, fontWeight: 600 }}>
            ₹{getCartSubtotal()}
          </Typography>
        </Grid> */}

        <Button
          variant="contained"
          sx={{ marginTop: 1, marginBottom: 2 }}
          disabled={haveDistinctProviders}
          onClick={() => {
            console.log("Checkout=====>", cartItems);
            if (cartItems.length > 0) {
              let c = cartItems.map((item) => {
                return item.item;
              });

              const request_object = constructQouteObject(c);
              console.log("request_object", request_object);
              getQuote(request_object[0]);
              //   getProviderIds(request_object);
            }
          }}
        >
          Checkout
        </Button>
      </Card>
    );
  };

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

  const getQuote = async (items, searchContextData = null) => {
    const ttansactionId = uuidv4();
    AddCookie("transaction_id", ttansactionId);
    responseRef.current = [];
    if (deliveryAddress) {
      try {
        const search_context = searchContextData || JSON.parse(getValueFromCookie("search_context"));
        let domain = "";
        const updatedItems = items.map((item) => {
          domain = item.domain;
          delete item.context;
          return item;
        });
        let selectPayload = {
          context: {
            transaction_id: ttansactionId,
            domain: domain,
            city: deliveryAddress.location.address.city,
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
        console.log("select payload:", selectPayload);
        const data = await cancellablePromise(postCall("/clientApis/v2/select", [selectPayload]));
        //Error handling workflow eg, NACK
        const isNACK = data.find((item) => item.error && item.message.ack.status === "NACK");
        if (isNACK) {
          alert(isNACK.error.message);
          setGetQuoteLoading(false);
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
        alert(err?.response?.data?.error?.message);
        console.log(err?.response?.data?.error);
        setGetQuoteLoading(false);
        history.replace("/application/products");
      }
    } else {
      alert("Please select address");
    }

    // eslint-disable-next-line
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
          alert("Cannot fetch details for this product");
          history.replace("/application/products");
          return;
        }
        const request_object = constructQouteObject(cartItems);
        if (responseRef.current.length !== request_object.length) {
          alert("Cannot fetch details for some product those products will be ignored!");
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

      // history.push(`/application/checkout`);
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

        console.log("cart", cartItems);
        console.log("updated cart", updatedCartItems.current);
      });

      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems.current));
      localStorage.setItem("updatedCartItems", JSON.stringify(responseRef.current));
      history.push(`/application/checkout`);
    } catch (err) {
      alert(err.message);
      setGetQuoteLoading(false);
    }
    // eslint-disable-next-line
  };

  return (
    <div ref={ref}>
      <div className={classes.headingContainer}>
        <Typography variant="h3" className={classes.heading}>
          My Cart
        </Typography>
      </div>

      {loading ? (
        <div className={classes.loadingContainer}>
          <Loading />
        </div>
      ) : (
        <>
          {cartItems.length === 0 ? (
            emptyCartScreen()
          ) : (
            <Grid container className={classes.cartContainer}>
              <Grid item xs={8}>
                {renderTableHeads()}
                <div style={{ minHeight: "80vh", alignItems: "flex-start", justifyContent: "flex-start" }}>
                  {renderProducts()}
                </div>
              </Grid>

              <Grid item xs={4}>
                {renderSummaryCard()}
              </Grid>
            </Grid>
          )}
        </>
      )}
    </div>
  );
}
