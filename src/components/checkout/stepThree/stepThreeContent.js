import React, {useState} from 'react';
import useStyles from "./style";

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import {ReactComponent as Prepaid} from '../../../assets/images/prepaid.svg'
import {ReactComponent as CashOnDelivery} from '../../../assets/images/cashOnDelivery.svg'
import {ReactComponent as CheckedIcon} from '../../../assets/images/checked.svg'
import {payment_methods} from "../../../constants/payment-methods";

const StepThreeContent = ({activePaymentMethod, setActivePaymentMethod}) => {
    const classes = useStyles();

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Card
                    className={`${classes.paymentCard} ${activePaymentMethod === payment_methods.COD?classes.activeCard:""}`}
                    onClick={() => setActivePaymentMethod(payment_methods.COD)}
                >
                    {/*<img className={classes.paymentImage} src={cashOnDelivery} alt="Cash on delivery"/>*/}
                    <CashOnDelivery className={classes.paymentImage} />
                    {
                        activePaymentMethod === payment_methods.COD && (
                            <CheckedIcon className={classes.checkedIcon} />
                        )
                    }
                </Card>
                <Typography className={classes.paymentTypo} variant="body" component="div">
                    Cash on delivery
                </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Card
                    className={`${classes.paymentCard} ${activePaymentMethod === payment_methods.JUSPAY?classes.activeCard:""}`}
                    onClick={() => setActivePaymentMethod(payment_methods.JUSPAY)}
                >
                    {/*<img className={classes.paymentImage} src={prepaid} alt="Prepaid"/>*/}
                    <Prepaid className={classes.paymentImage} />
                    {
                        activePaymentMethod === payment_methods.JUSPAY && (
                            <CheckedIcon className={classes.checkedIcon} />
                        )
                    }
                </Card>
                <Typography className={classes.paymentTypo} variant="body" component="div">
                    Prepaid
                </Typography>
            </Grid>
        </Grid>
    )

};

export default StepThreeContent;