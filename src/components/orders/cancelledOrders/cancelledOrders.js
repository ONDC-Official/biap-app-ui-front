import React, {useEffect, useState} from 'react';
import useStyles from "./style";

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import OrderCard from "../orderCard/orderCard";
import orderImage from '../../../assets/images/item.png';

import useCancellablePromise from "../../../api/cancelRequest";

import {getAllOrdersRequest} from '../../../api/orders.api';
import Pagination from '@mui/material/Pagination';
import Loading from "../../shared/loading/loading";

const CancelledOrders = () => {
    const classes = useStyles();

    const [orderList, setOrderList] = useState([]);
    const [totalOrdersCount, setTotalOrdersCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [paginationModel, setPaginationModel] = useState({
        page: 1,
        pageSize: 10,
        searchData: []
    });

    // HOOKS
    const { cancellablePromise } = useCancellablePromise();

    useEffect(() => {
        const data = [
            {
                id: '1', name: 'Burger King', deliveryTime: '42', address: 'Sector 28, Chandigarh', price: '999.00', orderDateTime: '11 Aug 2023 at 5:05pm', images: [orderImage], status: 'Cancelled', domain: 'ONDC:RET11',
                items: [
                    { id: '1', name: 'Veg Whopper + Paneer Royale + Crispy Veg', isVeg: true },
                    { id: '2', name: 'Veg Whopper + Paneer Royale + Crispy', isVeg: false },
                ]
            }
        ];
        setOrderList(data);
        getAllOrders();
    }, []);

    const getAllOrders = async() => {
        setIsLoading(true);
        try {
            const paginationData = Object.assign({}, JSON.parse(JSON.stringify(paginationModel)));
            const data = await cancellablePromise(
                getAllOrdersRequest(paginationData)
            );
            console.log("getAllOrders=====>", data);
            // setOrderList(data.orders);
            setTotalOrdersCount(data.totalCount)
        } catch (err) {
            // dispatch({
            //     type: toast_actions.ADD_TOAST,
            //     payload: {
            //         id: Math.floor(Math.random() * 100),
            //         type: toast_types.error,
            //         message: err?.message,
            //     },
            // });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Grid container spacing={3}>
            {
                isLoading
                    ? (
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className={classes.loaderContainer}>
                            <Loading/>
                        </Grid>
                    )
                    : (
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
                                            count={Math.ceil(totalOrdersCount / paginationModel.pageSize)}
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

export default CancelledOrders;