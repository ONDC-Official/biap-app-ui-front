import React, { useEffect } from "react";

const Razorpay = (props) => {
  const { paymentKey, paymentParams, setPaymentStatus, setPaymentResponse } = props;

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
        description: "Test Transaction",
        image: "https://example.com/your_logo",
        order_id: `${paymentParams.orderDetail.id}`,
        handler: function (response) {
          console.log("payment success response: ", response);
          setPaymentResponse(response);
          setPaymentStatus("success");
        },
        prefill: {
          name: "Gaurav Kumar",
          email: "gaurav.kumar@example.com",
          contact: "9000090000",
        },
        notes: {
          address: "Razorpay Corporate Office",
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
