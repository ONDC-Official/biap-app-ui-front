import React, {
  Fragment,
  useEffect,
  useState,
  useCallback,
  useContext,
} from "react";
import styles from "../../../styles/orders/orders.module.scss";
import Navbar from "../../shared/navbar/navbar";
import no_result_empty_illustration from "../../../assets/images/empty-state-illustration.svg";
import Button from "../../shared/button/button";
import { buttonTypes } from "../../shared/button/utils";
import { useHistory } from "react-router-dom";
import { getCall } from "../../../api/axios";
import Loading from "../../shared/loading/loading";
import { ONDC_COLORS } from "../../shared/colors";
import OrderCard from "./order-card/orderCard";
import Pagination from "../../shared/pagination/pagination";
import { toast_actions, toast_types } from "../../shared/toast/utils/toast";
import { ToastContext } from "../../../context/toastContext";
import useCancellablePromise from "../../../api/cancelRequest";

export default function Orders() {
  // HISTORY
  const history = useHistory();

  // STATES
  const [orders, setOrders] = useState([]);
  const [fetchOrderLoading, setFetchOrderLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalCount: 0,
    postPerPage: 10,
  });
  const [currentSelectedAccordion, setCurrentSelectedAccordion] = useState("");

  // CONTEXT
  const dispatch = useContext(ToastContext);

  // HOOKS
  const { cancellablePromise } = useCancellablePromise();

  const getAllOrders = useCallback(async () => {
    setFetchOrderLoading(true);
    try {
      const { totalCount, orders } = await cancellablePromise(
        getCall(
          `/clientApis/v1/orders?pageNumber=${pagination.currentPage}&limit=${pagination.postPerPage}`
        )
      );
      const formated_orders = orders.map((order) => {
        const {
          quote,
          state,
          id,
          transactionId,
          fulfillments = [],
          billing,
          createdAt,
          bppId,
          bpp_uri,
          items,
        } = order;
        return {
          product: items?.map(({ id }, index) => {
            let findQuote = quote?.breakup.find((item) => item["@ondc/org/item_id"] === id && item["@ondc/org/title_type"] === "item");
            if (findQuote) { } else {
              findQuote = quote?.breakup[index];
            }
            return {
              id,
              name: findQuote?.title ?? "NA",
              cancellation_status: items?.[index]?.cancellation_status ?? "",
              return_status: items?.[index]?.return_status ?? "",
              fulfillment_status: items?.[index]?.fulfillment_status ?? "",
              ...items?.[index]?.product,
            };
          }),
          quote: {
            breakup: quote?.breakup.filter((item) => item["@ondc/org/title_type"] !== "item"),
            price: quote?.price
          },
          quantity: items?.map(({ quantity }) => quantity),
          billing_address: {
            name: billing?.name,
            email: billing?.email,
            phone: billing?.phone,
            location: billing?.address,
          },
          delivery_address: {
            name: fulfillments?.[0]?.end?.location?.address?.name,
            email: fulfillments?.[0]?.end?.contact?.email,
            phone: fulfillments?.[0]?.end?.contact?.phone,
            location: fulfillments?.[0]?.end?.location?.address,
          },
          status: state,
          order_id: id,
          transaction_id: transactionId,
          createdAt,
          bpp_id: bppId,
          bpp_uri: bpp_uri,
          fulfillments: fulfillments
        };
      });
      setPagination((prev) => ({
        ...prev,
        totalCount,
      }));
      setOrders(formated_orders);
      setFetchOrderLoading(false);
    } catch (err) {
      dispatch({
        type: toast_actions.ADD_TOAST,
        payload: {
          id: Math.floor(Math.random() * 100),
          type: toast_types.error,
          message: "Something went wrong!",
        },
      });
      setFetchOrderLoading(false);
    }
    // eslint-disable-next-line
  }, [pagination.currentPage, pagination.postPerPage]);

  useEffect(() => {
    getAllOrders();
  }, [getAllOrders, pagination.currentPage]);

  // loading UI
  const loadingSpin = (
    <div
      className={`${styles.playground_height} d-flex align-items-center justify-content-center`}
    >
      <Loading backgroundColor={ONDC_COLORS.ACCENTCOLOR} />
    </div>
  );

  // empty state ui
  const empty_orders_state = (
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
          <p className={styles.illustration_header}>No Recent Orders found!</p>
          <p className={styles.illustration_body}>
            looks like you haven't order anything lately, you can shop now by
            clicking button below
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
      {fetchOrderLoading ? (
        loadingSpin
      ) : orders.length <= 0 ? (
        empty_orders_state
      ) : (
        <div
          className={styles.playground_height}
          style={{ height: "calc(100vh - 60px)" }}
        >
          <div className="accordion" id="ordersAccordion">
            <div className="container">
              <div className="row py-3">
                <div className="col-12">
                  <p className={styles.cart_label}>Orders</p>
                </div>
              </div>
              <div className={styles.order_list_wrapper}>
                {orders.map(
                  (
                    {
                      product,
                      quantity,
                      billing_address,
                      delivery_address,
                      status,
                      order_id,
                      transaction_id,
                      createdAt,
                      bpp_id,
                      bpp_uri,
                      quote,
                      fulfillments
                    },
                    index
                  ) => {
                    return (
                      <div className="py-2" key={`order_id_${index}`}>
                        <OrderCard
                          bpp_uri={bpp_uri}
                          fulfillments={fulfillments}
                          product={product}
                          quantity={quantity}
                          quote={quote}
                          billing_address={billing_address}
                          delivery_address={delivery_address}
                          status={status}
                          transaction_id={transaction_id}
                          order_id={order_id}
                          created_at={createdAt}
                          bpp_id={bpp_id}
                          accoodion_id={`order_id_${index}`}
                          onFetchUpdatedOrder={() => {
                            setCurrentSelectedAccordion("");
                            dispatch({
                              type: toast_actions.ADD_TOAST,
                              payload: {
                                id: Math.floor(Math.random() * 100),
                                type: toast_types.success,
                                message: "Order status updated successfully!",
                              },
                            });
                            getAllOrders();
                          }}
                          currentSelectedAccordion={currentSelectedAccordion}
                          setCurrentSelectedAccordion={(value) => {
                            if (
                              currentSelectedAccordion.toLowerCase() ===
                              `order_id_${index}`.toLowerCase()
                            ) {
                              setCurrentSelectedAccordion("");
                              return;
                            }
                            setCurrentSelectedAccordion(value);
                          }}
                        />
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ height: "60px" }}
          >
            <Pagination
              className="m-0"
              currentPage={pagination.currentPage}
              totalCount={pagination.totalCount}
              pageSize={pagination.postPerPage}
              onPageChange={(page) => {
                setPagination((prev) => ({
                  ...prev,
                  currentPage: page,
                }));
                setCurrentSelectedAccordion("");
              }}
            />
          </div>
        </div>
      )}
    </Fragment>
  );
}
