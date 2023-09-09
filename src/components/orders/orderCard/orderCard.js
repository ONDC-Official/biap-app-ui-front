import React from 'react';
import useStyles from "./style";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";

import no_image_found from "../../../assets/images/no_image_found.png";
import {ReactComponent as VegIcon} from "../../../assets/images/veg.svg";
import {ReactComponent as NonVegIcon} from "../../../assets/images/nonveg.svg";
import Typography from "@mui/material/Typography";
import {useHistory} from "react-router-dom";

const OrderCard = ({orderDetails}) => {
    const classes = useStyles();
    const history = useHistory();

    const renderItemsName = (items) => {
        const itemsName = items.map((item) => item.name);

        return (
            <>
                {
                    items.map((item) => (
                        <>
                            {item.isVeg ? <VegIcon className={classes.vegNonVegIcon}/> :
                                <NonVegIcon className={classes.vegNonVegIcon}/>}
                            <span className={classes.itemTypo}>{item.name}</span>
                        </>
                    ))
                }
            </>
        )
        return itemsName.join(", ");
    };
    return (
        <Grid container spacing={0} className={classes.orderItemContainer}>
            <Grid item xs={12} sm={12} md={2.5} lg={2.5} xl={2.5}>
                <Card className={classes.orderCard}>
                    <img className={classes.orderImage} src={orderDetails?.images?.length > 0 ? orderDetails?.images[0] : no_image_found} alt={`sub-cat-img-${orderDetails?.id}`}/>
                </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={9.5} lg={9.5} xl={9.5} className={classes.orderDetailsTypo}>
                <Typography component="div" variant="h5" className={classes.productNameTypoList}>
                    {orderDetails?.name}
                    <Typography component="span" variant="body1" className={classes.deliveryTimeTypo}>
                        {`Delivery ${orderDetails?.domain === "ONDC:RET11"?"time":""}:`}
                        <Typography component="span" variant="body1" color="primary" className={classes.deliveryTimeTypoValue}>
                            {` ${orderDetails?.deliveryTime} ${orderDetails?.domain === "ONDC:RET11"?"mins":""}`}
                        </Typography>
                    </Typography>
                    <Chip
                        className={classes.statusChip}
                        color={orderDetails?.status === "Confirmed"?"primary":orderDetails?.status === "Delivered"?"success":orderDetails?.status === "Cancelled"?"error":"primary"}
                        label={orderDetails?.status}
                    />
                </Typography>
                <Typography variant="body1" className={classes.addressTypo}>
                    {orderDetails?.address}
                </Typography>
                <Typography variant="body1" className={classes.itemNameTypo}>
                    {renderItemsName(orderDetails?.items)}
                </Typography>
                <Typography variant="h4" className={classes.priceTypo}>
                    <span className={classes.priceTypoLabel}>{`Total Paid: `}</span>
                    {`₹${Number.isInteger(Number(orderDetails?.price))
                        ? Number(orderDetails?.price).toFixed(2)
                        : Number(orderDetails?.price).toFixed(2)}`}
                </Typography>
                <Typography component="div" variant="body1" className={classes.orderDateTime}>
                    {`Ordered On: ${orderDetails?.orderDateTime}`}

                    {
                        orderDetails.status === "Confirmed" && (
                            <Button
                                className={classes.trackOrderButton}
                                variant="contained"
                            >
                                Track Order
                            </Button>
                        )
                    }

                    {
                        orderDetails.status === "Delivered" && (
                            <Button
                                className={classes.downloadInvoiceButton}
                                variant="outlined"
                            >
                                Download Invoice
                            </Button>
                        )
                    }

                    <Button
                        className={classes.viewSummaryButton}
                        variant="outlined"
                        onClick={() => {
                            history.push(`/application/order/${orderDetails.id}`)
                        }}
                    >
                        View summary
                    </Button>
                </Typography>
            </Grid>
        </Grid>
    )

};

export default OrderCard;