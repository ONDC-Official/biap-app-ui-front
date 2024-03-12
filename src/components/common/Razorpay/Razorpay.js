import React, { useEffect } from "react";

const Razorpay = (props) => {
  const { paymentKey, paymentParams } = props;
  console.log("props: ", props);
  console.log("key: ", paymentKey);
  console.log("payment params: ", paymentParams);
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
          //  alert(response.razorpay_payment_id);
          //  alert(response.razorpay_order_id);
          //  alert(response.razorpay_signature);
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
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
      });

      rzp.open();
    };

    loadRazorpayScript();
  }, []);

  return null;
};

export default Razorpay;
