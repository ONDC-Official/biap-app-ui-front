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
import { AddressContext } from "../../../../context/addressContext";
import { CartContext } from "../../../../context/cartContext";
import { getCall, postCall } from "../../../../api/axios";
import { constructQouteObject } from "../../../../utils/constructRequestObject";
import Cookies from "js-cookie";
import { toast_types } from "../../../../utils/toast";
import Toast from "../../../shared/toast/toast";
import { useHistory } from "react-router-dom";

export default function PaymentConfirmationCard(props) {
  const { currentActiveStep } = props;
  const history = useHistory();
  const transaction_id = Cookies.get("transaction_id");
  const { deliveryAddress, billingAddress } = useContext(AddressContext);
  const { cartItems, setCartItems } = useContext(CartContext);
  const [confirmOrderLoading, setConfirmOrderLoading] = useState(false);
  const [toast, setToast] = useState({
    toggle: false,
    type: "",
    message: "",
  });
  const confirm_polling_timer = useRef(0);
  const onConfirmed = useRef();

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
          Cookies.remove("transaction_id");
          Cookies.remove("search_context");
          setCartItems([]);
          history.push("/application/orders");
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
  return (
    <div className={styles.price_summary_card}>
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
                <div className="col-12">
                  <AddressRadioButton checked={true}>
                    <div className="px-3">
                      <p className={styles.address_line_1}>Cash on delivery</p>
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
