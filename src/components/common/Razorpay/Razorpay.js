import React, { useContext, useEffect } from "react";
import { AddressContext } from "../../../context/addressContext";

const Razorpay = (props) => {
  const { paymentKey, paymentParams, setPaymentStatus, setPaymentResponse, providerName } = props;
  const { billingAddress } = useContext(AddressContext);

  const addressFields = [
    billingAddress.address.door,
    billingAddress.address.building,
    billingAddress.address.street,
    billingAddress.address.areaCode,
    billingAddress.address.city,
    billingAddress.address.state,
    billingAddress.address.country,
  ];

  const commaSeparatedAddress = addressFields.filter((field) => field !== undefined && field !== null).join(", ");

  useEffect(() => {
    const loadRazorpayScript = () => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        initializeRazorpay();
      };
    };

    const initializeRazorpay = () => {
      const options = {
        key: `${paymentKey}`,
        amount: `${paymentParams.orderDetail.amount_due}`,
        currency: "INR",
        name: "ONDC",
        description: `${providerName}`,
        image: `https://ondc.org/assets/theme/images/ondc_registered_logo.svg?v=e4051cae62`,
        order_id: `${paymentParams.orderDetail.id}`,
        handler: function (response) {
          console.log("payment success response: ", response);
          setPaymentResponse(response);
          setPaymentStatus("success");
        },
        prefill: {
          name: `${billingAddress.name}`,
          email: `${billingAddress.email}`,
          contact: `${billingAddress.phone}`,
        },
        notes: {
          address: commaSeparatedAddress,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        console.log("payment failure response: ", response);
        setPaymentResponse(response);
        setPaymentStatus("fail");
      });

      rzp.open();
    };

    loadRazorpayScript();
  }, []);

  return null;
};

export default Razorpay;
