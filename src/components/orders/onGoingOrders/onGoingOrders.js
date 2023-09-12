import React, {useEffect, useState, useContext} from 'react';
import useStyles from "./style";

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import OrderCard from "../orderCard/orderCard";
import orderImage from '../../../assets/images/item.png';

import useCancellablePromise from "../../../api/cancelRequest";

import {getAllOrdersRequest} from '../../../api/orders.api';
import Pagination from '@mui/material/Pagination';
import Loading from "../../shared/loading/loading";
import { ToastContext } from "../../../context/toastContext";
import {toast_actions, toast_types} from "../../shared/toast/utils/toast";

const OnGoingOrders = () => {
    const classes = useStyles();

    const [orderList, setOrderList] = useState([]);
    const [totalOrdersCount, setTotalOrdersCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [paginationModel, setPaginationModel] = useState({
        page: 1,
        pageSize: 10,
        searchData: []
    });
    const dispatch = useContext(ToastContext);

    // HOOKS
    const { cancellablePromise } = useCancellablePromise();

    useEffect(() => {
        getAllOrders();
    }, []);

    const getAllOrders = async() => {
        setIsLoading(true);
        try {
            let paginationData = Object.assign({}, JSON.parse(JSON.stringify(paginationModel)));
            paginationData.status="Created,Accepted";
            const data = await cancellablePromise(
                getAllOrdersRequest(paginationData)
            );
            console.log("getAllOrders=====>", data);
            setOrderList(data.orders);
            setTotalOrdersCount(data.totalCount);
        } catch (err) {
            dispatch({
                type: toast_actions.ADD_TOAST,
                payload: {
                    id: Math.floor(Math.random() * 100),
                    type: toast_types.error,
                    message: err?.response?.data?.error?.message,
                },
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getAllOrders()
    }, [paginationModel]);

    return (
        <Grid container spacing={3}>
            {
                isLoading
                    ? (
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className={classes.loaderContainer}>
                            <Loading />
                        </Grid>
                    ) : (
                        <>
                            {
                                orderList.length > 0
                                    ? (
                                        <>
                                            {
                                                orderList.map((order, orderIndex) => (
                                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}
                                                          key={`order-inx-${orderIndex}`}>
                                                        <OrderCard
                                                            data={{
                                                                id: '1', name: 'Burger King', deliveryTime: '42', address: 'Sector 28, Chandigarh', price: '999.00', orderDateTime: '11 Aug 2023 at 5:05pm', images: [orderImage], status: 'Confirmed', domain: 'ONDC:RET11',
                                                                items: [
                                                                    { id: '1', name: 'Veg Whopper + Paneer Royale + Crispy Veg', isVeg: true },
                                                                    { id: '2', name: 'Veg Whopper + Paneer Royale + Crispy', isVeg: false },
                                                                ]
                                                            }}
                                                            orderDetails={order}
                                                        />
                                                    </Grid>
                                                ))
                                            }
                                        </>
                                    ) : (
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <Typography variant="body1">
                                                No orders available
                                            </Typography>
                                        </Grid>
                                    )
                            }
                            {
                                orderList.length > 0 && (
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className={classes.paginationContainer}>
                                        <Pagination
                                            className={classes.pagination}
                                            count={Math.ceil(totalOrdersCount/paginationModel.pageSize)}
                                            shape="rounded"
                                            color="primary"
                                            page={paginationModel.page}
                                            onChange={(evant, page) => {
                                                let paginationData = Object.assign({}, paginationModel);
                                                paginationData.page = page;
                                                setPaginationModel(paginationData);
                                            }}
                                        />
                                    </Grid>
                                )
                            }
                        </>
                    )
            }
        </Grid>
    );

};

export default OnGoingOrders;