import React, {useContext, useEffect, useRef, useState} from 'react';
import useStyles from "./style";

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '../../common/Radio';

import useCancellablePromise from "../../../api/cancelRequest";
import {getAllDeliveryAddressRequest} from '../../../api/address.api';

import AddressList from "./addressList";
import AddressForm from '../../appLayout/navbar/addressForm/addressForm';
import {restoreToDefault} from "../../../constants/restoreDefaultAddress";
import {address_types} from "../../../constants/address-types";
import {AddCookie, getValueFromCookie, removeCookie} from "../../../utils/cookies";
import {AddressContext} from "../../../context/addressContext";
import {constructQouteObject} from "../../../api/utils/constructRequestObject";
import {v4 as uuidv4} from "uuid";
import {getCall, postCall} from "../../../api/axios";
import {useHistory} from "react-router-dom";
import {SSE_TIMEOUT} from "../../../constants/sse-waiting-time";
import {removeNullValues} from "../../../utils/helper";
import {toast_types} from "../../shared/toast/utils/toast";
import Cookies from "js-cookie";

const StepTwoContent = ({
                            cartItemsData,
                            updatedCartItemsData,
                            setUpdateCartItemsData,
                            setUpdateCartItemsDataOnInitialize,
                            handleNext,
                            updateInitLoading,
                            responseReceivedIds
                        }) => {
    const classes = useStyles();
    const history = useHistory();

    const {deliveryAddress, billingAddress, setBillingAddress} = useContext(AddressContext);
    const [addressList, setAddressList] = useState([]);
    const [addressType, setAddressType] = useState('');
    const [fetchDeliveryAddressLoading, setFetchDeliveryAddressLoading] = useState();
    const [toggleAddressForm, setToggleAddressForm] = useState({
        actionType: "",
        toggle: false,
        address: restoreToDefault(),
    });


    const transaction_id = getValueFromCookie("transaction_id");
    const responseRef = useRef([]);
    const eventTimeOutRef = useRef([]);
    const [getQuoteLoading, setGetQuoteLoading] = useState(true);
    const [errorMessageTimeOut, setErrorMessageTimeOut] = useState("Fetching details for this product");
    const [toggleInit, setToggleInit] = useState(false);
    const [eventData, setEventData] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const updatedCartItems = useRef([]);


    const [initializeOrderLoading, setInitializeOrderLoading] = useState(false);
    const latLongInfo = JSON.parse(Cookies.get("LatLongInfo") || "{}");

    useEffect(() => {
        if (cartItemsData) {
            setCartItems(cartItemsData)
        }
        if (updatedCartItemsData) {
            updatedCartItems.current = updatedCartItemsData;
            console.log("updatedCartItemsData uuuuuuuuuuuuuuu=====>", updatedCartItemsData)
        }
    }, [cartItemsData, updatedCartItemsData]);
    // HOOKS
    const {cancellablePromise} = useCancellablePromise();

    // use this function to fetch existing address of the user
    const fetchDeliveryAddress = async () => {
        setFetchDeliveryAddressLoading(true);
        try {
            const data = await cancellablePromise(
                getAllDeliveryAddressRequest()
            );
            setAddressList(data);
        } catch (err) {
            if (err.response.data.length > 0) {
                setAddressList([]);
                return;
            }
        } finally {
            setFetchDeliveryAddressLoading(false);
        }
    };

    useEffect(() => {
        fetchDeliveryAddress();
    }, []);

    useEffect(() => {

    }, [cartItems, updatedCartItems]);

    const onGetQuote = async (message_id) => {
        try {
            const data = await cancellablePromise(getCall(`/clientApis/v2/on_select?messageIds=${message_id}`));
            responseRef.current = [...responseRef.current, data[0]];

            setEventData((eventData) => [...eventData, data[0]]);

            // onUpdateProduct(data[0].message.quote.items, data[0].message.quote.fulfillments);
            data[0].message.quote.items.forEach((item) => {
                const findItemIndexFromCart = updatedCartItems.current.findIndex((prod) => prod.id === item.id);
                if (findItemIndexFromCart > -1) {
                    updatedCartItems.current[findItemIndexFromCart].fulfillment_id = item.fulfillment_id;
                    updatedCartItems.current[findItemIndexFromCart].fulfillments = data[0].message.quote.fulfillments;
                }
            });

            localStorage.setItem("cartItems", JSON.stringify(updatedCartItems.current));
            localStorage.setItem("updatedCartItems", JSON.stringify([...eventData, data[0]]));
            setUpdateCartItemsData([...eventData, data[0]]);
        } catch (err) {
            alert(err.message);
            setGetQuoteLoading(false);
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
                const {messageId} = JSON.parse(e.data);

                onGetQuote(messageId);
            });
            const timer = setTimeout(() => {
                eventTimeOutRef.current.forEach(({eventSource, timer}) => {
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

            history.push(`/application/checkout`);
        });
    };

    const getQuote = async (items, searchContextData = null) => {
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
                        transaction_id: transaction_id,
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
                            const {context} = txn;
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
            alert("Please select address")
        }
    };

    const handleSelect = () => {
        if (cartItems.length > 0) {
            let c = cartItems.map((item) => {
                return item.item;
            });

            const request_object = constructQouteObject(c);
            console.log("request_object", request_object);
            getQuote(request_object[0]);
        }
    };


    // on initialize order Api

    const navigateToPayment = () => {
        setInitializeOrderLoading(false);
        updateInitLoading(false);
        let checkoutObj = {
            successOrderIds: [],
            productQuotes: [],
        };
        responseRef.current.forEach((item) => {
            const {message} = item;
            checkoutObj = {
                productQuotes: [...checkoutObj.productQuotes, message?.order?.quote],
                successOrderIds: [...checkoutObj.successOrderIds, message?.order?.provider?.id.toString()],
            };
        });
        // AddCookie("checkout_details", JSON.stringify(checkoutObj));
        localStorage.setItem("checkout_details", JSON.stringify(checkoutObj));
        handleNext();
    };
    const onInitializeOrder = async (message_id) => {
        try {
            localStorage.setItem("selectedItems", JSON.stringify(updatedCartItems));
            const data = await cancellablePromise(getCall(`/clientApis/v2/on_initialize_order?messageIds=${message_id}`));
            responseRef.current = [...responseRef.current, data[0]];
            setEventData((eventData) => [...eventData, data[0]]);

            let oldData = updatedCartItems.current;
            console.log("&&&&&&&&&&&&&&&&&&&&&&&&&=====>", data[0])
            console.log("%%%%%%%%%%%%%%%%%%%%%%%%%=====>", oldData)
            oldData[0].message.quote.quote = data[0].message.order.quote;

            setUpdateCartItemsDataOnInitialize(oldData)
        } catch (err) {
            // dispatchToast(toast_types.error, err.message);
            setInitializeOrderLoading(false);
            updateInitLoading(false);
        }

        navigateToPayment();
        // eslint-disable-next-line
    };

    // use this function to initialize the order
    function onInit(message_id) {
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
                const {messageId} = JSON.parse(e.data);
                onInitializeOrder(messageId);
            });
            const timer = setTimeout(() => {
                eventTimeOutRef.current.forEach(({eventSource, timer}) => {
                    eventSource.close();
                    clearTimeout(timer);
                });
                // check if all the orders got cancled
                if (responseRef.current.length <= 0) {
                    setInitializeOrderLoading(false);
                    // dispatchToast(toast_types.error, "Cannot fetch details for this product Please try again!");
                    return;
                }
                // tale action to redirect them.
                const requestObject = constructQouteObject(
                    updatedCartItems.filter(({provider}) => responseReceivedIds.includes(provider.id.toString()))
                );
                if (requestObject.length !== responseRef.current.length) {
                    // dispatchToast(toast_types.error, "Some orders are not initialized!");
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
    };


    const initializeOrder = async (itemsList) => {
            const items = JSON.parse(JSON.stringify(Object.assign([], itemsList)));
        console.log("items=====>", items)
            responseRef.current = [];
            try {
                const search_context = JSON.parse(getValueFromCookie("search_context"));
                const data = await cancellablePromise(
                    postCall(
                        "/clientApis/v2/initialize_order",
                        items.map((item) => {
                            const fulfillments = item[0].product.fulfillments;
                            console.log("ITEM=====>", item)
                            delete item[0].product.fulfillments;
                            return {
                                context: {
                                    transaction_id: transaction_id,
                                    city: search_context.location.name,
                                    state: search_context.location.state,
                                    domain: item[0].domain,
                                },
                                message: {
                                    items: item,
                                    fulfillments: fulfillments,
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
                                            gps: `${latLongInfo?.latitude}, ${latLongInfo?.longitude}`,
                                            ...deliveryAddress?.location,
                                        },
                                    },
                                    payment: {
                                        type: "ON-FULFILLMENT",
                                    },
                                },
                            };
                        })
                    )
                );
                //Error handling workflow eg, NACK
                const isNACK = data.find((item) => item.error && item.message.ack.status === "NACK");
                if (isNACK) {
                    // dispatchToast(toast_types.error, isNACK.error.message);
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
                            const {context} = txn;
                            return context?.message_id;
                        })
                    );
                }
            } catch (err) {
                // dispatchToast(toast_types.error, err.message);
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
        console.log("c=====>", c)
        console.log("A=====>", responseReceivedIds)
        const request_object = constructQouteObject(
            c.filter(({provider}) => responseReceivedIds.includes(provider.local_id.toString()))
        );
        console.log("request_object=====>", request_object)
        initializeOrder(request_object);
    }

    return (
        <div>
            {
                fetchDeliveryAddressLoading
                    ? <CircularProgress/>
                    : (
                        <>
                            {
                                addressType !== address_types.delivery && (
                                    <>
                                        <AddressList
                                            addressList={addressList}
                                            label="Shipping Address"
                                            onSelectAddress={handleSelect}
                                            setAddAddress={() => {
                                                setToggleAddressForm({
                                                    actionType: "add",
                                                    toggle: true,
                                                    address: restoreToDefault(),
                                                });
                                                setAddressType(address_types.delivery);
                                            }}
                                            setUpdateAddress={(address) => {
                                                setToggleAddressForm({
                                                    actionType: "edit",
                                                    toggle: true,
                                                    address: address,
                                                });
                                                setAddressType(address_types.delivery);
                                            }}

                                        />
                                        {
                                            deliveryAddress && (
                                                <div className={classes.pickupBillingAddress}>
                                                    <FormControlLabel
                                                        className={classes.formControlLabel}
                                                        onClick={() => {
                                                            setBillingAddress({
                                                                id: deliveryAddress?.id,
                                                                address: deliveryAddress?.location?.address,
                                                                phone: deliveryAddress?.phone || "",
                                                                name: deliveryAddress?.name || "",
                                                                email: deliveryAddress?.email || "",
                                                            });
                                                            AddCookie(
                                                                "billing_address",
                                                                JSON.stringify({
                                                                    id: deliveryAddress?.id,
                                                                    address: deliveryAddress?.location?.address,
                                                                    phone: deliveryAddress?.phone || "",
                                                                    name: deliveryAddress?.name || "",
                                                                    email: deliveryAddress?.email || "",
                                                                })
                                                            );
                                                            // handleNext();
                                                            handleInitializaOrder()
                                                        }}
                                                        control={<Radio checked={deliveryAddress?.id === billingAddress?.id}/>}
                                                        label={
                                                            <Typography variant="body1" component="div"
                                                                        className={classes.billingTypo}>
                                                                My billing and shipping address are the same
                                                            </Typography>
                                                        }
                                                    />
                                                    <FormControlLabel
                                                        className={classes.formControlLabel}
                                                        onClick={() => {
                                                            setBillingAddress();
                                                            removeCookie("billing_address");
                                                            setToggleAddressForm({
                                                                actionType: "add",
                                                                toggle: true,
                                                                address: restoreToDefault(),
                                                            });
                                                            setAddressType(address_types.billing);
                                                        }}
                                                        control={<Radio
                                                            checked={billingAddress ? deliveryAddress?.id !== billingAddress?.id : addressType === address_types.billing ? true : false}/>}
                                                        label={
                                                            <Typography variant="body1" component="div"
                                                                        className={classes.billingTypo}>
                                                                Add New Billing Address
                                                            </Typography>
                                                        }
                                                    />
                                                </div>
                                            )
                                        }
                                    </>
                                )
                            }
                            {
                                toggleAddressForm.toggle && addressType && (
                                    <>
                                        {
                                            addressType && (
                                                <Typography component="div" className={classes.formLabel} variant="body">
                                                    {addressType === address_types.delivery ? 'Shipping Address' : "Billing Address"}
                                                </Typography>
                                            )
                                        }
                                        <AddressForm
                                            fromCheckout={true}
                                            action_type={toggleAddressForm.actionType}
                                            address_type={addressType}
                                            selectedAddress={toggleAddressForm.address}
                                            onClose={() => {
                                                setToggleAddressForm({
                                                    actionType: "",
                                                    toggle: false,
                                                    address: restoreToDefault(),
                                                });
                                                setAddressType("");
                                            }}
                                            onAddAddress={(address) => {
                                                setToggleAddressForm({
                                                    actionType: "",
                                                    toggle: false,
                                                    address: restoreToDefault(),
                                                });
                                                setAddressList([...addressList, address]);
                                                setAddressType("");
                                                if (addressType === address_types.billing) {
                                                    // handleNext();
                                                    handleInitializaOrder();
                                                }
                                            }}
                                            onUpdateAddress={(address) => {
                                                const updatedAddress = addressList.map((d) => {
                                                    if (d.id === address.id) {
                                                        return address;
                                                    }
                                                    return d;
                                                });
                                                setAddressList(updatedAddress);
                                                setToggleAddressForm({
                                                    actionType: "",
                                                    toggle: false,
                                                    address: restoreToDefault(),
                                                });
                                                setAddressType("");
                                            }}
                                        />
                                    </>
                                )
                            }
                        </>
                    )
            }
        </div>
    )

};

export default StepTwoContent;