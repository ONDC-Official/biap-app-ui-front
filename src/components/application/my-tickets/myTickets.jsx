import React, {
    useEffect,
    useState,
    useCallback,
    useContext,
} from "react";
import Loading from "../../shared/loading/loading";
import Pagination from '@mui/material/Pagination';

import { toast_actions, toast_types } from "../../shared/toast/utils/toast";
import { ToastContext } from "../../../context/toastContext";
import useCancellablePromise from "../../../api/cancelRequest";
import useStyles from "../cart/styles";
import { Grid, Typography } from "@mui/material";
import TicketCard from "./ticketCard";
import { getCall } from "../../../api/axios";

export default function MyTickets() {
    // STATES
    const [tickets, setTickets] = useState([]);
    const [fetchOrderLoading, setFetchOrderLoading] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalCount: 0,
        postPerPage: 10,
    });

    // CONTEXT
    const dispatch = useContext(ToastContext);
    const classes = useStyles();


    // HOOKS
    const { cancellablePromise } = useCancellablePromise();

    const getAllTickets = useCallback(async () => {
        setFetchOrderLoading(true);
        try {
            const { totalCount, issues } = 
            await cancellablePromise(
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

    // empty state ui
    const empty_orders_state = (
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{marginLeft: 5}}>
            <Typography variant="body1">
                No Complaints available
            </Typography>
        </Grid>
    );

    return (
        <div>
            <div className={classes.headingContainer}>
                <Typography variant="h3" className={classes.heading}>
                    Complaints
                </Typography>
            </div>
            {fetchOrderLoading ? (
                <div className={classes.loadingContainer}>
                    <Loading />
                </div>
            ) : (
                <Grid container spacing={3} >
                    {tickets.length === 0 ? (
                        empty_orders_state
                    ) : (
                        tickets.map((order, orderIndex) => (
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ marginLeft: '10%' }}
                                key={`order-inx-${orderIndex}`}>
                                <TicketCard
                                    data={order}
                                    orderDetails={order?.order_details}
                                />
                            </Grid>
                        ))
                    )}

                    {/* <div
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
                    </div> */}
                    <div
                        className="d-flex align-items-center justify-content-center"
                        style={{ height: "60px", width: "100%" }}
                    >
                        {
                            tickets.length > 0 && (
                                <Pagination
                                    className={classes.pagination}
                                    count={Math.ceil(pagination.totalCount / pagination.postPerPage)}
                                    shape="rounded"
                                    color="primary"
                                    page={pagination.currentPage}
                                    onChange={(evant, page) => {
                                        setPagination((prev) => ({
                                            ...prev,
                                            currentPage: page,
                                        }));

                                    }}
                                />
                            )
                        }
                    </div>
                </Grid>
            )}
        </div>
    );
}
