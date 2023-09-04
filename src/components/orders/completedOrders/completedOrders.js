import React, {useEffect, useState} from 'react';
import useStyles from "./style";

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import OrderCard from "../orderCard/orderCard";
import orderImage from '../../../assets/images/item.png';

const CompletedOrders = () => {
    const classes = useStyles();
    const [orderList, setOrderList] = useState([]);

    useEffect(() => {
        const data = [
            {
                name: 'H&M', deliveryTime: 'On Saturday', address: 'Sector 28, Chandigarh', price: '1999.00', orderDateTime: '11 Aug 2023 at 5:05pm', images: [orderImage], status: 'Delivered', domain: 'ONDC:RET12',
                items: [
                    { id: '1', name: 'Embroidered Handloom Cotton Silk Saree' },
                ]
            },
            {
                name: 'Burger King', deliveryTime: '42', address: 'Sector 28, Chandigarh', price: '999.00', orderDateTime: '11 Aug 2023 at 5:05pm', images: [orderImage], status: 'Delivered', domain: 'ONDC:RET11',
                items: [
                    { id: '1', name: 'Veg Whopper + Paneer Royale + Crispy Veg', isVeg: true },
                    { id: '2', name: 'Veg Whopper + Paneer Royale + Crispy', isVeg: false },
                ]
            }
        ];
        setOrderList(data);
    }, []);

    return (
        <Grid container spacing={3}>
            {
                orderList.length > 0
                    ?(
                        <>
                            {
                                orderList.map((order, orderIndex) => (
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} key={`order-inx-${orderIndex}`}>
                                        <OrderCard
                                            orderDetails={order}
                                        />
                                    </Grid>
                                ))
                            }
                        </>
                    ):(
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Typography variant="body1">
                                No orders available
                            </Typography>
                        </Grid>
                    )
            }
        </Grid>
    )

};

export default CompletedOrders;