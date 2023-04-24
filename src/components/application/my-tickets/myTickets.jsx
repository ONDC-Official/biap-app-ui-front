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
import { useHistory } from "react-router-dom";
import { getCall } from "../../../api/axios";
import Loading from "../../shared/loading/loading";
import { ONDC_COLORS } from "../../shared/colors";
import TicketCard from "./ticket-card/ticketCard";
import Pagination from "../../shared/pagination/pagination";
import { toast_actions, toast_types } from "../../shared/toast/utils/toast";
import { ToastContext } from "../../../context/toastContext";
import useCancellablePromise from "../../../api/cancelRequest";

export default function MyTickets() {
  // HISTORY
  const history = useHistory();

  // STATES
  const [tickets, setTickets] = useState([]);
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

  const getAllTickets = useCallback(async () => {
    setFetchOrderLoading(true);
    try {
      const { totalCount, issues } = await cancellablePromise(
        getCall(
          `/issueApis/v1/getIssues?pageNumber=${pagination.currentPage}&limit=${pagination.postPerPage}`
        )
      );

      setPagination((prev) => ({
        ...prev,
        totalCount,
      }));
      setTickets(issues);
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
    getAllTickets();
  }, [getAllTickets, pagination.currentPage]);

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
          <p className={styles.illustration_header}>No Tickets found!</p>
        </div>
      </div>
    </div>
  );

  return (
    <Fragment>
      <Navbar />
      {fetchOrderLoading ? (
        loadingSpin
      ) : tickets?.length <= 0 ? (
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
                  <p className={styles.cart_label}>Complaints</p>
                </div>
              </div>
              <div className={styles.order_list_wrapper}>
                {tickets.map(
                  (
                    {
                      order_details,
                      issue_actions,
                      issue_status,
                      issueId,
                      _id,
                      updated_at,
                      created_at,
                      bppId,
                      sub_category,
                      category,
                      description,
                      issue_type,
                    },
                    index
                  ) => {
                    return (
                      <div className="py-2" key={`order_id_${index}`}>
                        <TicketCard
                          description={description}
                          category={category}
                          sub_category={sub_category}
                          order_details={order_details}
                          issue_actions={issue_actions}
                          status={issue_status}
                          issue_type={issue_type}
                          transaction_id={_id}
                          order_id={issueId}
                          updated_at={updated_at}
                          created_at={created_at}
                          bpp_id={bppId}
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
                            getAllTickets();
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
