import React, { Fragment, useEffect, useState, useCallback } from "react";
import styles from "../../../styles/orders/orders.module.scss";
import Navbar from "../../shared/navbar/navbar";
import no_result_empty_illustration from "../../../assets/images/empty-state-illustration.svg";
import Button from "../../shared/button/button";
import { buttonTypes } from "../../../utils/button";
import { useHistory } from "react-router-dom";
import { getCall } from "../../../api/axios";
import Loading from "../../shared/loading/loading";
import { ONDC_COLORS } from "../../shared/colors";
import OrderCard from "./order-card/orderCard";
import Pagination from "../../shared/pagination/pagination";

export default function Orders() {
  const history = useHistory();
  const [orders, setOrders] = useState([]);
  const [fetchOrderLoading, setFetchOrderLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalCount: 0,
    postPerPage: 10,
  });
  const getAllOrders = useCallback(async () => {
    setFetchOrderLoading(true);
    try {
      const { totalCount, orders } = await getCall(
        `/clientApis/v1/orders?pageNumber=${pagination.currentPage}&limit=${pagination.postPerPage}`
      );
      const formated_orders = orders.map((order) => {
        const {
          quote,
          state,
          id,
          transactionId,
          fulfillment,
          billing,
          created_at,
          bppId,
        } = order;
        return {
          product: {
            name: quote?.breakup[0].title,
            price: quote?.price?.value,
          },
          address: {
            name: billing?.name,
            location: fulfillment?.end?.location?.address,
          },
          status: state,
          order_id: id,
          transaction_id: transactionId,
          created_at,
          bpp_id: bppId,
        };
      });
      setPagination((prev) => ({
        ...prev,
        totalCount,
      }));
      setOrders(formated_orders);
      setFetchOrderLoading(false);
    } catch (err) {
      console.log(err);
      setFetchOrderLoading(false);
    }
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
          style={{ height: "calc(100vh - 120px)" }}
        >
          <div className="container">
            <div className="row py-3">
              <div className="col-12">
                <p className={styles.cart_label}>Orders</p>
              </div>
            </div>
            <div className="row py-2">
              {orders.map(
                ({
                  product,
                  address,
                  status,
                  order_id,
                  transaction_id,
                  created_at,
                  bpp_id,
                }) => {
                  return (
                    <div className="col-12 py-2" key={`order_id_${order_id}`}>
                      <OrderCard
                        product={product}
                        address={address}
                        status={status}
                        transaction_id={transaction_id}
                        order_id={order_id}
                        created_at={created_at}
                        bpp_id={bpp_id}
                        onFetchUpdatedOrder={() => getAllOrders()}
                      />
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>
      )}
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ height: "60px" }}
      >
        <Pagination
          currentPage={pagination.currentPage}
          totalCount={pagination.totalCount}
          pageSize={pagination.postPerPage}
          onPageChange={(page) =>
            setPagination((prev) => ({
              ...prev,
              currentPage: page,
            }))
          }
        />
      </div>
    </Fragment>
  );
}
