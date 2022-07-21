import React, {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { buttonTypes } from "../../../shared/button/utils";
import styles from "../../../../styles/cart/cartView.module.scss";
import Button from "../../../shared/button/button";
import { checkout_steps } from "../../../../constants/checkout-steps";
import { ONDC_COLORS } from "../../../shared/colors";
import AddressRadioButton from "../../initialize-order/address-details/address-radio-button/addressRadioButton";
import { CartContext } from "../../../../context/cartContext";
import { getCall, postCall } from "../../../../api/axios";
import { constructQouteObject } from "../../../../api/utils/constructRequestObject";
import { toast_actions, toast_types } from "../../../shared/toast/utils/toast";
import { useHistory } from "react-router-dom";
import axios from "axios";
import CrossIcon from "../../../shared/svg/cross-icon";
import { payment_methods } from "../../../../constants/payment-methods";
import { removeCookie, getValueFromCookie } from "../../../../utils/cookies";
import Loading from "../../../shared/loading/loading";
import { ToastContext } from "../../../../context/toastContext";
import { SSE_TIMEOUT } from "../../../../constants/sse-waiting-time";

export default function PaymentConfirmationCard(props) {
  const {
    currentActiveStep,
    productsQuote,
    orderStatus,
    setActivePaymentMethod,
    activePaymentMethod,
    successOrderIds = [],
  } = props;

  // CONSTANTS
  const token = getValueFromCookie("token");
  const user = JSON.parse(getValueFromCookie("user"));
  const parent_order_id = getValueFromCookie("parent_order_id");
  const billingAddress = JSON.parse(
    getValueFromCookie("billing_address") || "{}"
  );
  const parentOrderIDMap = new Map(
    JSON.parse(getValueFromCookie("parent_and_transaction_id_map"))
  );

  // JUSPAY SDK
  const hyperServiceObject = new window.HyperServices();

  // HISTORY
  const history = useHistory();

  // STATES
  const [confirmOrderLoading, setConfirmOrderLoading] = useState(false);
  const [togglePaymentGateway, setTogglePaymentGateway] = useState(false);
  const [loadingSdkForPayment, setLoadingSdkForPayment] = useState(false);
  const [eventData, setEventData] = useState([]);

  //REFS
  const responseRef = useRef([]);
  const sdkPayload = useRef({
    action: "initiate",
    clientId: process.env.REACT_APP_JUSTPAY_CLIENT_AND_MERCHANT_KEY,
    merchantId: process.env.REACT_APP_JUSTPAY_CLIENT_AND_MERCHANT_KEY,
    merchantKeyId: process.env.REACT_APP_MERCHANT_KEY_ID,
    signaturePayload: "",
    signature: "",
    environment: process.env.REACT_APP_PAYMENT_SDK_ENV,
    integrationType: "iframe",
    hyperSDKDiv: "sdk_frame", // Div ID to be used for rendering
  });
  const processPayload = useRef({
    action: "paymentPage",
    merchantId: process.env.REACT_APP_JUSTPAY_CLIENT_AND_MERCHANT_KEY,
    clientId: process.env.REACT_APP_JUSTPAY_CLIENT_AND_MERCHANT_KEY,
    orderId: "",
    amount: "",
    customerId: user.id,
    customerEmail: "",
    customerMobile: "",
    orderDetails: "",
    signature: "",
    merchantKeyId: process.env.REACT_APP_MERCHANT_KEY_ID,
    environment: process.env.REACT_APP_PAYMENT_SDK_ENV,
  });

  // CONTEXT
  const { cartItems, setCartItems } = useContext(CartContext);
  const dispatch = useContext(ToastContext);

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

  // function to get the current active step
  function isCurrentStep() {
    if (
      currentActiveStep.current_active_step_id ===
      checkout_steps.SELECT_PAYMENT_METHOD
    ) {
      return true;
    }
    return false;
  }

  // JUSPAY SDK METHODS
  // CALLBACK HANDLER
  function hyperCallbackHandler(eventData) {
    try {
      if (eventData) {
        const eventJSON =
          typeof eventData === "string" ? JSON.parse(eventData) : eventData;
        const event = eventJSON.event;
        // Check for event key
        // eslint-disable-next-line
        if (event == "initiate_result") {
          setLoadingSdkForPayment(false);
          processPayment();
          // eslint-disable-next-line
        } else if (event == "process_result") {
          //Handle process result here
          // eslint-disable-next-line
        } else if (event == "user_event") {
          //Handle Payment Page events
        } else {
          console.log("Unhandled event", event, " Event data", eventData);
        }
      } else {
        console.log("No data received in event", eventData);
      }
    } catch (error) {
      console.log("Error in hyperSDK response", error);
    }
  }

  // INIT SDK METHOD
  async function initiateSDK() {
    try {
      const initiatePayloadObj = {
        merchant_id: process.env.REACT_APP_JUSTPAY_CLIENT_AND_MERCHANT_KEY,
        customer_id: user.id,
        mobile_number: billingAddress?.phone,
        email_address: billingAddress?.email,
        timestamp: String(new Date().getTime()),
      };

      const { data } = await axios.post(
        `${process.env.REACT_APP_BASE_URL}clientApis/payment/signPayload`,
        {
          payload: JSON.stringify(initiatePayloadObj),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      sdkPayload.current = {
        ...sdkPayload.current,
        signaturePayload: JSON.stringify(initiatePayloadObj),
        signature: data.signedPayload,
      };
      // calling the sdk method
      hyperServiceObject.initiate(
        {
          service: "in.juspay.hyperpay",
          requestId: parent_order_id,
          payload: sdkPayload.current,
        },
        hyperCallbackHandler
      );
    } catch (err) {
      dispatch({
        type: toast_actions.ADD_TOAST,
        payload: {
          id: Math.floor(Math.random() * 100),
          type: toast_types.error,
          message: "Something went wrong!",
        },
      });
    }
  }

  // PROCESS SDK METHOD
  async function processPayment() {
    try {
      if (!hyperServiceObject.isInitialised()) {
        alert("not initiated");
      }
      const processPayloadObj = {
        merchant_id: process.env.REACT_APP_JUSTPAY_CLIENT_AND_MERCHANT_KEY,
        customer_id: user.id,
        order_id: parent_order_id,
        customer_phone: billingAddress?.phone,
        customer_email: billingAddress?.email,
        amount:
          process.env.REACT_APP_PAYMENT_SDK_ENV === "sandbox"
            ? 9
            : productsQuote.total_payable,
        timestamp: String(new Date().getTime()),
        return_url: String(window.location.href),
      };
      const { data } = await axios.post(
        `${process.env.REACT_APP_BASE_URL}clientApis/payment/signPayload`,
        {
          payload: JSON.stringify(processPayloadObj),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      processPayload.current = {
        ...processPayload.current,
        customerEmail: billingAddress?.email,
        customerMobile: billingAddress?.phone,
        orderId: parent_order_id,
        orderDetails: JSON.stringify(processPayloadObj),
        signature: data.signedPayload,
        amount:
          process.env.REACT_APP_PAYMENT_SDK_ENV === "sandbox"
            ? 9
            : productsQuote.total_payable,
      };
      hyperServiceObject.process(
        {
          service: "in.juspay.hyperpay",
          requestId: parent_order_id,
          payload: processPayload.current,
        },
        () => {}
      );
    } catch (err) {
      dispatch({
        type: toast_actions.ADD_TOAST,
        payload: {
          id: Math.floor(Math.random() * 100),
          type: toast_types.error,
          message: "Something went wrong!",
        },
      });
    }
  }

  // use this function to confirm the order
  function onConfirm(message_id) {
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
        `${process.env.REACT_APP_BASE_URL}clientApis/events?messageId=${id}`,
        header
      );
      es.addEventListener("on_confirm", (e) => {
        const { messageId } = JSON.parse(e.data);
        onConfirmOrder(messageId);
      });
      setTimeout(() => {
        es.close();
        // check if all the orders got cancled
        if (responseRef.current.length <= 0) {
          setConfirmOrderLoading(false);
          dispatchError(
            "Cannot fetch details for this product Please try again!"
          );
          return;
        }
      }, SSE_TIMEOUT);
    });
  }

  const confirmOrder = useCallback(async (items, method) => {
    responseRef.current = [];
    try {
      const data = await postCall(
        "clientApis/v2/confirm_order",
        items.map((item, index) => ({
          // pass the map of parent order id and transaction id
          context: parentOrderIDMap.get(item[0]?.provider?.id),
          message: {
            payment: {
              paid_amount: Number(productsQuote[index]?.price?.value),
              type:
                method === payment_methods.COD
                  ? "POST-FULFILLMENT"
                  : "ON-ORDER",
              transaction_id: parentOrderIDMap.get(item[0]?.provider?.id)
                .transaction_id,
            },
          },
        }))
      );
      onConfirm(
        data?.map((txn) => {
          const { context } = txn;
          return context?.message_id;
        })
      );
    } catch (err) {
      dispatchError(err.message);
      setConfirmOrderLoading(false);
    }
  }, []);

  // on confirm order Api
  const onConfirmOrder = useCallback(async (message_id) => {
    try {
      const data = await getCall(
        `clientApis/v2/on_confirm_order?messageIds=${message_id}`
      );
      responseRef.current = [...responseRef.current, data[0]];
      setEventData((eventData) => [...eventData, data[0]]);
    } catch (err) {
      dispatchError(err.message);
      setConfirmOrderLoading(false);
    }
  }, []);

  // use this effect to handle callback from juspay and calling the confirm api.
  useEffect(() => {
    if (orderStatus === "CHARGED") {
      const parsedCartItems = JSON.parse(
        localStorage.getItem("cartItems") || "{}"
      );
      setConfirmOrderLoading(true);
      const request_object = constructQouteObject(
        parsedCartItems.filter(({ provider }) =>
          successOrderIds.includes(provider.id.toString())
        )
      );
      confirmOrder(request_object, payment_methods.JUSPAY);
    }
    // eslint-disable-next-line
  }, [orderStatus]);

  useEffect(() => {
    if (responseRef.current.length > 0) {
      console.log(responseRef.current);
      setConfirmOrderLoading(false);
      // fetch request object length and compare it with the response length
      const requestObject = constructQouteObject(
        cartItems.filter(({ provider }) =>
          successOrderIds.includes(provider.id.toString())
        )
      );
      if (responseRef.current.length === requestObject.length) {
        // redirect to order listing page.
        // remove parent_order_id, search_context from cookies
        removeCookie("transaction_id");
        removeCookie("parent_order_id");
        removeCookie("search_context");
        removeCookie("cartItems");
        removeCookie("delivery_address");
        removeCookie("billing_address");
        removeCookie("checkout_details");
        removeCookie("parent_and_transaction_id_map");
        setCartItems([]);
        history.replace("/application/orders");
      }
    }
  }, [eventData]);

  return (
    <div className={styles.price_summary_card}>
      {togglePaymentGateway && (
        <div id="sdk_frame" className={styles.juspay_card}>
          {loadingSdkForPayment ? (
            <div className="h-100 d-flex align-items-center justify-content-center">
              <Loading />
            </div>
          ) : (
            <div style={{ position: "absolute", top: "10px", right: "10px" }}>
              <CrossIcon
                width="25"
                height="25"
                style={{ cursor: "pointer" }}
                color={ONDC_COLORS.SECONDARYCOLOR}
                onClick={() => {
                  setTogglePaymentGateway(false);
                  setActivePaymentMethod(payment_methods.COD);
                }}
              />
            </div>
          )}
        </div>
      )}
      <div
        className={styles.card_header}
        style={
          isCurrentStep()
            ? {
                borderBottom: `1px solid ${ONDC_COLORS.BACKGROUNDCOLOR}`,
                borderBottomRightRadius: 0,
                borderBottomLeftRadius: 0,
              }
            : {
                borderBottomRightRadius: "10px",
                borderBottomLeftRadius: "10px",
              }
        }
      >
        <p className={styles.card_header_title}>
          {"Payment & order confirmation"}
        </p>
      </div>
      {isCurrentStep() && (
        <Fragment>
          <div className={styles.card_body}>
            {/* payment optios list will come here */}
            <div className="container-fluid pt-2">
              <div className="row">
                <div className="col-6">
                  <AddressRadioButton
                    checked={activePaymentMethod === payment_methods.COD}
                    disabled={confirmOrderLoading}
                    onClick={() => setActivePaymentMethod(payment_methods.COD)}
                  >
                    <div className="px-3">
                      <p className={styles.address_line_1}>Cash on delivery</p>
                    </div>
                  </AddressRadioButton>
                </div>
                <div className="col-6">
                  <AddressRadioButton
                    checked={activePaymentMethod === payment_methods.JUSPAY}
                    disabled={confirmOrderLoading}
                    onClick={() => {
                      setActivePaymentMethod(payment_methods.JUSPAY);
                      setTogglePaymentGateway(true);
                      setLoadingSdkForPayment(true);
                      initiateSDK();
                    }}
                  >
                    <div className="px-3">
                      <p className={styles.address_line_1}>Prepaid</p>
                    </div>
                  </AddressRadioButton>
                  <div className="px-2">
                    <p style={{ color: "#aaa", fontSize: "12px", margin: 0 }}>
                      powered by{" "}
                      <span>
                        <img
                          src="https://imgee.s3.amazonaws.com/imgee/a0baca393d534736b152750c7bde97f1.png"
                          alt="juspay_logo"
                          style={{ height: "15px", padding: "0 5px" }}
                        />
                      </span>{" "}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`${styles.card_footer} d-flex align-items-center justify-content-center`}
          >
            <Button
              isloading={confirmOrderLoading ? 1 : 0}
              disabled={confirmOrderLoading}
              button_type={buttonTypes.primary}
              button_hover_type={buttonTypes.primary_hover}
              button_text="Place Order"
              onClick={() => {
                setConfirmOrderLoading(true);
                const request_object = constructQouteObject(
                  cartItems.filter(({ provider }) =>
                    successOrderIds.includes(provider.id.toString())
                  )
                );
                confirmOrder(request_object, payment_methods.COD);
              }}
            />
          </div>
        </Fragment>
      )}
    </div>
  );
}
