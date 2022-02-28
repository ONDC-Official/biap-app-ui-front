import React, { Fragment, useEffect, useState } from "react";
import styles from "../../../styles/cart/cartView.module.scss";
import Navbar from "../../shared/navbar/navbar";
import no_result_empty_illustration from "../../../assets/images/empty-state-illustration.svg";
import Button from "../../shared/button/button";
import { buttonTypes } from "../../../utils/button";
import { useHistory } from "react-router-dom";
import { getCall } from "../../../api/axios";
import Loading from "../../shared/loading/loading";
import { ONDC_COLORS } from "../../shared/colors";

export default function Orders() {
  const history = useHistory();
  const [orders, setOrders] = useState([]);
  const [fetchOrderLoading, setFetchOrderLoading] = useState(false);
  useEffect(() => {
    async function getAllOrders() {
      setFetchOrderLoading(true);
      try {
        const data = await getCall("/client/v1/orders");
        console.log(data);
        setOrders(data);
        setFetchOrderLoading(false);
      } catch (err) {
        console.log(err);
        setFetchOrderLoading(false);
      }
    }
    getAllOrders();
  }, []);

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
        <div className={styles.playground_height}>
          list of orders will come here
        </div>
      )}
    </Fragment>
  );
}
