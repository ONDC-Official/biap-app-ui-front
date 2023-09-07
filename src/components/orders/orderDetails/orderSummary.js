import React from 'react';
import useStyles from "./style";

import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import {useParams} from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import OrderTimeline from './orderTimeline';
import SummaryItems from './summaryItems';

const OrderSummary = () => {
    const classes = useStyles();
    const {orderId} = useParams();
    return (
        <Card
            className={classes.orderSummaryCard}
        >
            <Typography
                variant="h5"
                className={classes.orderNumberTypo}
            >
                {`Order Number: `}
                <span className={classes.orderNumberTypoBold}>{orderId}</span>
            </Typography>
            <Typography
                variant="body1"
                className={classes.orderOnTypo}
            >
                Ordered On: 30/04/23 at 4:30pm | Payment: Cash | Item: 02
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

            <SummaryItems />

            <Box
                component={"div"}
                className={classes.orderSummaryDivider}
            />

            <div
                className={classes.summaryItemContainer}
            >
                <Typography variant="body1" className={classes.summaryItemLabel}>
                    Subtotal
                </Typography>
                <Typography variant="body1" className={classes.summaryItemValue}>
                    ₹4,300.00
                </Typography>
            </div>
            <div
                className={classes.summaryItemContainer}
            >
                <Typography variant="body1" className={classes.summaryItemLabel}>
                    Shipping
                    <br />
                    <Typography variant="subtitle2" className={classes.summaryItemLabelDescription}>
                        (Standard Rate - Price may vary depending on the item/destination. TECS Staff will contact you.)
                    </Typography>
                </Typography>
                <Typography variant="body1" className={classes.summaryItemValue}>
                    ₹21.00
                </Typography>
            </div>
            <div
                className={classes.summaryItemContainer}
            >
                <Typography variant="body1" className={classes.summaryItemLabel}>
                    Tax
                </Typography>
                <Typography variant="body1" className={classes.summaryItemValue}>
                    ₹1.91
                </Typography>
            </div>
            <div
                className={classes.summaryItemContainer}
            >
                <Typography variant="body1" className={classes.summaryItemLabel}>
                    GST (10%)
                </Typography>
                <Typography variant="body1" className={classes.summaryItemValue}>
                    ₹1.91
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