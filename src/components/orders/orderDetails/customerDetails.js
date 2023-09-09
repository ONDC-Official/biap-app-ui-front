import React from 'react';
import useStyles from "./style";

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import {ReactComponent as CallIcon} from "../../../assets/images/callBrand.svg";

const CustomerDetails = () => {
    const classes = useStyles();
    const customerDetails = {
        id: '1', name: 'Rohit Singh', mobile: '+91 7082222724', date: '30/04/23 at 4:30pm',
        orderNumber: '92728282', paymentMode: 'Cash',
        deliveryAddress: '1333 Evesham Road Astwood Bank New Delhi B96 6AY India'
    };

    return (
        <Grid container spacing={3} columns={10}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography variant="h4" className={classes.customerDetailsTypo}>
                    Customer Details
                </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                <Typography component="div" variant="body" className={classes.customerDetailsLabel}>
                    Order Number
                </Typography>
                <Typography component="div" variant="body" className={classes.customerDetailsValue}>
                    {customerDetails.orderNumber}
                </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
                <Typography component="div" variant="body" className={classes.customerDetailsLabel}>
                    Payment mode
                </Typography>
                <Typography component="div" variant="body" className={classes.customerDetailsValue}>
                    {customerDetails.paymentMode}
                </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                <Typography component="div" variant="body" className={classes.customerDetailsLabel}>
                    Customer Name
                </Typography>
                <Typography component="div" variant="body" className={classes.customerDetailsValue}>
                    {customerDetails.name}
                </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                <Typography component="div" variant="body" className={classes.customerDetailsLabel}>
                    Phone Number
                </Typography>
                <Typography component="div" variant="body" className={classes.customerDetailsValue}>
                    {customerDetails.mobile}
                </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Typography component="div" variant="body" className={classes.customerDetailsLabel}>
                    Date
                </Typography>
                <Typography component="div" variant="body" className={classes.customerDetailsValue}>
                    {customerDetails.date}
                </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography component="div" variant="body" className={classes.customerDetailsLabel}>
                    Delivered To
                </Typography>
                <Typography component="div" variant="body" className={classes.customerDetailsValue}>
                    {customerDetails.deliveryAddress}
                </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Button
                    variant="outlined"
                    className={classes.downloadInvoiceButton}
                >
                    Downoad Invoice
                </Button>
                <Button
                    variant="outlined"
                    startIcon={<CallIcon />}
                >
                    Call Burger King
                </Button>
            </Grid>
        </Grid>
    )

};

export default CustomerDetails;