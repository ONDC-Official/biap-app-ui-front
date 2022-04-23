import React, {
  Fragment,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { buttonTypes } from "../../../../utils/button";
import styles from "../../../../styles/cart/cartView.module.scss";
import Button from "../../../shared/button/button";
import { checkout_steps } from "../../../../constants/checkout-steps";
import { ONDC_COLORS } from "../../../shared/colors";
import AddressRadioButton from "../address-details/address-radio-button/addressRadioButton";
import { CartContext } from "../../../../context/cartContext";
import { getCall, postCall } from "../../../../api/axios";
import { constructQouteObject } from "../../../../utils/constructRequestObject";
import { toast_types } from "../../../../utils/toast";
import Toast from "../../../shared/toast/toast";
import { useHistory } from "react-router-dom";
import axios from "axios";
import CrossIcon from "../../../shared/svg/cross-icon";
import { payment_methods } from "../../../../constants/payment-methods";
import { removeCookie, getValueFromCookie } from "../../../../utils/cookies";

export default function PaymentConfirmationCard(props) {
  const { currentActiveStep, productsQuote, orderStatus } = props;
  const token = getValueFromCookie("token");
  const user = JSON.parse(getValueFromCookie("user"));
  const transaction_id = getValueFromCookie("transaction_id");
  const hyperServiceObject = new window.HyperServices();
  const history = useHistory();
  const deliveryAddress = JSON.parse(
    getValueFromCookie("delivery_address") || "{}"
  );
  const billingAddress = JSON.parse(
    getValueFromCookie("billing_address") || "{}"
  );
  const { cartItems, setCartItems } = useContext(CartContext);
  const [confirmOrderLoading, setConfirmOrderLoading] = useState(false);
  const [toast, setToast] = useState({
    toggle: false,
    type: "",
    message: "",
  });
  const [togglePaymentGateway, setTogglePaymentGateway] = useState(false);
  const [activePaymentMethod, setActivePaymentMethod] = useState(
    payment_methods.COD
  );
  const confirm_polling_timer = useRef(0);
  const onConfirmed = useRef();
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

  useEffect(() => {
    if (orderStatus === "CHARGED") {
      setActivePaymentMethod(payment_methods.JUSPAY);
      const parsedCartItems = JSON.parse(
        getValueFromCookie("cartItems") || "{}"
      );
      setConfirmOrderLoading(true);
      const request_object = constructQouteObject(parsedCartItems);
      confirmOrder(request_object);
    }
    // eslint-disable-next-line
  }, [orderStatus]);

  useEffect(() => {
    return () => {
      clearInterval(confirm_polling_timer.current);
    };
  }, []);

  // use this function to get the total amount of the quote
  function getTotalPayable(items) {
    let sum = 0;
    items.forEach((item) => {
      return (sum += Number(item.product.price.value));
    });
    return sum;
  }

  async function confirmOrder(items) {
    try {
      const data = await postCall(
        "/client/v2/confirm_order",
        items.map((item, index) => ({
          context: {
            transaction_id,
          },
          message: {
            items: item,
            billing_info: {
              address: billingAddress?.address,
              phone: billingAddress?.phone,
              name: billingAddress?.name,
              email: billingAddress?.email,
            },
            delivery_info: {
              type: "HOME-DELIVERY",
              name: deliveryAddress?.name,
              email: deliveryAddress?.email,
              phone: deliveryAddress?.phone,
              location: deliveryAddress?.location,
            },
            payment: {
              paid_amount: getTotalPayable(item),
              status: "PAID",
              transaction_id,
            },
          },
        }))
      );
      const array_of_ids = data.map((d) => {
        if (d.error) {
          return {
            error_reason: d.error.message,
            message_id: d.context.message_id,
          };
        }
        return {
          error_reason: "",
          message_id: d.context.message_id,
        };
      });
      callApiMultipleTimes(array_of_ids);
    } catch (err) {
      console.log(err);
      setConfirmOrderLoading(false);
    }
  }

  // on confirm order Api
  async function onConfirmOrder(array_of_ids) {
    try {
      const data = await getCall(
        `/client/v2/on_confirm_order?messageIds=${array_of_ids
          .filter((txn) => txn.error_reason === "")
          .map((txn) => txn.message_id)}`
      );
      onConfirmed.current = data;
    } catch (err) {
      console.log(err);
      setConfirmOrderLoading(false);
    }
  }

  // use this function to call confirm order multiple times
  function callApiMultipleTimes(message_ids) {
    let counter = 3;
    confirm_polling_timer.current = setInterval(async () => {
      if (counter <= 0) {
        setConfirmOrderLoading(false);
        const allOrderConfirmed = onConfirmed.current.every(
          (data) => data?.message?.order
        );
        if (allOrderConfirmed) {
          // redirect to order listing page.
          // remove transaction_id, search_context from cookies
          removeCookie("transaction_id");
          removeCookie("search_context");
          removeCookie("cartItems");
          removeCookie("delivery_address");
          removeCookie("billing_address");
          setCartItems([]);
          history.replace("/application/orders");
        } else {
          setToast((toast) => ({
            ...toast,
            toggle: true,
            type: toast_types.error,
            message: "Something went wrong!",
          }));
        }
        clearInterval(confirm_polling_timer.current);
        return;
      }
      await onConfirmOrder(message_ids).finally(() => {
        counter -= 1;
      });
    }, 2000);
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

  function hyperCallbackHandler(eventData) {
    try {
      if (eventData) {
        const eventJSON =
          typeof eventData === "string" ? JSON.parse(eventData) : eventData;
        const event = eventJSON.event;
        // Check for event key
        // eslint-disable-next-line
        if (event == "initiate_result") {
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
        `http://localhost:5000/api/payment/signPayload`,
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
          requestId: transaction_id,
          payload: sdkPayload.current,
        },
        hyperCallbackHandler
      );
    } catch (err) {
      console.log(err);
    }
  }

  async function processPayment() {
    try {
      if (!hyperServiceObject.isInitialised()) {
        alert("not initiated");
      }
      const processPayloadObj = {
        merchant_id: process.env.REACT_APP_JUSTPAY_CLIENT_AND_MERCHANT_KEY,
        customer_id: user.id,
        order_id: transaction_id,
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
        `http://localhost:5000/api/payment/signPayload`,
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
        orderId: transaction_id,
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
          requestId: transaction_id,
          payload: processPayload.current,
        },
        (res) => {
          console.log(res);
        }
      );
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className={styles.price_summary_card}>
      {togglePaymentGateway && (
        <div>
          <div style={{ position: "fixed", top: "5%", right: "5%" }}>
            <CrossIcon onClick={() => setTogglePaymentGateway(false)} />
          </div>
          <div
            id="sdk_frame"
            style={{
              height: "80%",
              overflow: "auto",
              position: "fixed",
              top: "10%",
              left: "30%",
              right: "30%",
            }}
          ></div>
        </div>
      )}
      {toast.toggle && (
        <Toast
          type={toast.type}
          message={toast.message}
          onRemove={() =>
            setToast((toast) => ({
              ...toast,
              toggle: false,
            }))
          }
        />
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
        <p className={styles.card_header_title}>Payment Options</p>
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
                      initiateSDK();
                    }}
                  >
                    <div className="px-3">
                      <p className={styles.address_line_1}>Jus pay</p>
                    </div>
                  </AddressRadioButton>
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
              button_text="Checkout"
              onClick={() => {
                setConfirmOrderLoading(true);
                const request_object = constructQouteObject(cartItems);
                confirmOrder(request_object);
              }}
            />
          </div>
        </Fragment>
      )}
    </div>
  );
}
