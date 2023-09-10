import React from 'react';
import useStyles from "./style";

import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import {useParams} from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import OrderTimeline from './orderTimeline';
import SummaryItems from './summaryItems';
import moment from "moment";

const OrderSummary = ({orderDetails}) => {
    const classes = useStyles();

    const getSubTotal = (quote) => {
        console.log("quote=====>", quote)
        let subtotal = 0;
        quote.forEach((item) => {
            subtotal += parseInt(item?.price?.value)
        });
        return subtotal;
    };

    return (
        <Card
            className={classes.orderSummaryCard}
        >
            <Typography
                variant="h5"
                className={classes.orderNumberTypo}
            >
                {`Order Number: `}
                <span className={classes.orderNumberTypoBold}>{orderDetails?.id}</span>
            </Typography>
            <Typography
                variant="body1"
                className={classes.orderOnTypo}
            >
                {`Ordered On: ${moment(orderDetails?.createdAt).format("DD/MM/yy")} at ${moment(orderDetails?.createdAt).format("hh:mma")}`} | Payment: {orderDetails?.payment?.type} | Item: {orderDetails?.items.length}
            </Typography>
            <Box
                component={"div"}
                className={classes.orderSummaryDivider}
            />

            <OrderTimeline />

            <Box
                component={"div"}
                className={classes.orderSummaryDivider}
            />

            {
                orderDetails?.quote && (
                    <>
                        <SummaryItems
                                items={orderDetails?.quote?orderDetails?.quote?.breakup.filter((item) => item["@ondc/org/title_type"] === "item" || item["@ondc/org/title_type"] === "customization"):[]}
                        />
                        <Box
                            component={"div"}
                            className={classes.orderSummaryDivider}
                        />
                    </>
                )
            }

            <div
                className={classes.summaryItemContainer}
            >
                <Typography variant="body1" className={classes.summaryItemLabel}>
                    Subtotal
                </Typography>
                <Typography variant="body1" className={classes.summaryItemValue}>
                    {getSubTotal(orderDetails?.quote?orderDetails?.quote?.breakup.filter((item) => item["@ondc/org/title_type"] === "item" || item["@ondc/org/title_type"] === "customization"):[])}
                </Typography>
            </div>

            <SummaryItems
                hideHeader={true}
                items={orderDetails?.quote?orderDetails?.quote?.breakup.filter((item) => item["@ondc/org/title_type"] !== "item" && item["@ondc/org/title_type"] !== "customization"):[]}
            />

            <Box
                component={"div"}
                className={classes.orderSummaryDivider}
            />
            <div
                className={classes.summaryItemContainer}
            >
                <Typography variant="body" className={classes.totalLabel}>
                    Order Total
                </Typography>
                <Typography variant="h5" className={classes.totalValue}>
                    {`₹${orderDetails?.quote?.price?.value || 0}`}
                </Typography>
            </div>
            <div
                className={classes.summaryItemActionContainer}
            >
                <Button
                    fullWidth
                    variant="outlined"
                    className={classes.helpButton}
                >
                    Get Help
                </Button>
                <Button
                    fullWidth
                    variant="contained"
                    color="error"
                    className={classes.cancelOrderButton}
                >
                    Cancel Order
                </Button>
            </div>
        </Card>
    )

};

export default OrderSummary;