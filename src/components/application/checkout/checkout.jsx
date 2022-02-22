import React, {
  Fragment,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Navbar from "../../shared/navbar/navbar";
import { CartContext } from "../../../context/cartContext";
import styles from "../../../styles/cart/cartView.module.scss";
import { buttonTypes } from "../../../utils/button";
import { getSubTotal } from "../../../utils/getSubTotal";
import Button from "../../shared/button/button";
import { ONDC_COLORS } from "../../shared/colors";
import IndianRupee from "../../shared/svg/indian-rupee";
import no_result_empty_illustration from "../../../assets/images/empty-state-illustration.svg";
import Cookies from "js-cookie";
import { getCall, postCall } from "../../../api/axios";
import { constructQouteObject } from "../../../utils/constructRequestObject";
import Loading from "../../shared/loading/loading";

export default function Checkout() {
  const { cartItems } = useContext(CartContext);
  const transaction_id = Cookies.get("transaction_id");
  const history = useHistory();
  const [getQuoteLoading, setGetQuoteLoading] = useState(true);
  const quote_polling_timer = useRef(0);
  useEffect(() => {
    // use this function to get the quote of the items
    async function getQuote(items) {
      try {
        const data = await postCall(
          "/client/v2/get_quote",
          items.map((item) => ({
            context: {
              transaction_id,
            },
            message: {
              cart: {
                items: item,
              },
            },
          }))
        );
        const array_of_ids = data.map((d) => d.context.message_id);
        callApiMultipleTimes(array_of_ids);
      } catch (err) {
        console.log(err);
        setGetQuoteLoading(false);
      }
    }

    // this check is so that when cart is empty we do not call the
    if (cartItems.length > 0) {
      const request_object = constructQouteObject(cartItems);
      getQuote(request_object);
    }

    // cleanup function
    return () => {
      clearInterval(quote_polling_timer.current);
    };
  }, [cartItems, transaction_id]);

  // on get quote Api
  async function onGetQuote(message_ids) {
    try {
      const data = await getCall(
        `/client/v2/on_get_quote?messageIds=${message_ids}`
      );
      console.log(data);
    } catch (err) {
      console.log(err);
      setGetQuoteLoading(false);
    }
  }

  // use this function to call on get quote call multiple times
  function callApiMultipleTimes(message_ids) {
    let counter = 3;
    quote_polling_timer.current = setInterval(async () => {
      if (counter <= 0) {
        setGetQuoteLoading(false);
        clearInterval(quote_polling_timer.current);
        return;
      }
      await onGetQuote(message_ids).finally(() => {
        counter -= 1;
      });
    }, 2000);
  }

  const loadingSpin = (
    <div
      className={`${styles.playground_height} d-flex align-items-center justify-content-center`}
    >
      <Loading backgroundColor={ONDC_COLORS.ACCENTCOLOR} />
    </div>
  );

  const empty_cart_state = (
    <div
      className={`${styles.playground_height} d-flex align-items-center justify-content-center`}
    >
      <div className="text-center">
        <div className="py-2">
          <img
            src={no_result_empty_illustration}
            alt="empty_search"
            style={{ height: "130px" }}
          />
        </div>
        <div className="py-2">
          <p className={styles.illustration_header}>Your cart is empty</p>
          <p className={styles.illustration_body}>
            looks like your shopping cart is empty, you can shop now by clicking
            button below
          </p>
        </div>
        <div className="py-3">
          <Button
            button_type={buttonTypes.primary}
            button_hover_type={buttonTypes.primary_hover}
            button_text="Shop now"
            onClick={() => history.push("/application/")}
          />
        </div>
      </div>
    </div>
  );
  return (
    <Fragment>
      <Navbar />
      {cartItems.length <= 0 ? (
        empty_cart_state
      ) : getQuoteLoading ? (
        loadingSpin
      ) : (
        <div className={styles.playground_height}>
          <div className="container">
            <div className="row py-3">
              <div className="col-12">
                <p className={styles.cart_label}>Checkout</p>
              </div>
            </div>
            <div className="row py-2">
              <div className="col-lg-8">
                <div className="container-fluid p-0">
                  <div className="row">
                    <div className="col-12">i am shipping addresss</div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="container-fluid p-0">
                  <div className="row">
                    <div className="col-12 p-2">
                      <div className={styles.price_summary_card}>
                        <div className={styles.card_header}>
                          <p className={styles.card_header_title}>
                            Price Details
                          </p>
                        </div>
                        <div className={styles.card_body}>
                          <div className="py-2 d-flex align-items-center">
                            <div className="pe-2">
                              <p className={styles.card_body_text}>
                                Items in cart({cartItems.length})
                              </p>
                            </div>
                            <div className="ms-auto d-flex align-items-center">
                              <div className="px-1">
                                <IndianRupee
                                  width="8"
                                  height="13"
                                  color={ONDC_COLORS.PRIMARYCOLOR}
                                />
                              </div>
                              <p className={styles.sub_total_text}>
                                {getSubTotal(cartItems)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}
