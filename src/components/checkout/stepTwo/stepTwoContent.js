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
import {toast_actions, toast_types} from "../../shared/toast/utils/toast";
import Cookies from "js-cookie";
import {ToastContext} from "../../../context/toastContext";

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
    };

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
            updatedCartItems.current = cartItemsData;
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
            localStorage.setItem("updatedCartItems", JSON.stringify([...[], data[0]]));
            setUpdateCartItemsData([...[], data[0]]);
        } catch (err) {
            dispatchToast(toast_types.error, err?.response?.data?.error?.message);
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
                    dispatchToast(toast_types.error, "Cannot fetch details for this product");

                    history.replace("/application/products");
                    return;
                }
                const request_object = constructQouteObject(cartItems);
                if (responseRef.current.length !== request_object.length) {
                    dispatchToast(toast_types.error, "Cannot fetch details for some product those products will be ignored!");
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
                const data = await cancellablePromise(postCall("/clientApis/v2/select", [selectPayload]));
                //Error handling workflow eg, NACK
                const isNACK = data.find((item) => item.error && item.message.ack.status === "NACK");
                if (isNACK) {
                    dispatchToast(toast_types.error, isNACK.error.message);
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
                setGetQuoteLoading(false);
                history.replace("/application/products");
            }
        } else {
            dispatchToast(toast_types.error, "Please select address");
        }
    };

    const handleSelect = () => {
        if (cartItems.length > 0) {
            let c = cartItems.map((item) => {
                return item.item;
            });

            const request_object = constructQouteObject(c);
            getQuote(request_object[0]);
        }
    };

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
                                                            handleNext();
                                                            // handleInitializaOrder()
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
                                                    handleNext();
                                                    // handleInitializaOrder();
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