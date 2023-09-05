import React, {useState, useEffect} from 'react';
import useStyles from "./style";

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';

import StepOneLabel from './stepOne/stepOneLabel';
import StepOneContent from './stepOne/stepOneContent';
import StepTwoLabel from './stepTwo/stepTwoLabel';
import StepTwoContent from './stepTwo/stepTwoContent';
import StepThreeLabel from './stepThree/stepThreeLabel';
import StepThreeContent from './stepThree/stepThreeContent';

import {Link, Redirect} from 'react-router-dom';
import Box from "@mui/material/Box";
import {constructQouteObject} from "../../api/utils/constructRequestObject";
import styles from "../../styles/cart/cartView.module.scss";

const Checkout = () => {
    const classes = useStyles();

    const steps = ["Customer", "Add Address", "Payment"];
    const [activeStep, setActiveStep] = useState(0);
    const [cartItems, setCartItems] = useState([]);
    const [updatedCartItems, setUpdatedCartItems] = useState([]);
    const [productsQuote, setProductsQuote] = useState({
        providers: [],
        total_payable: 0,
    });
    const [initLoading, setInitLoading] = useState(false);

    useEffect(() => {
        const cartItemsData = JSON.parse(localStorage.getItem("cartItems"));
        const updatedCartItemsData = JSON.parse(localStorage.getItem("updatedCartItems"));
        setCartItems(cartItemsData);
        setUpdatedCartItems(updatedCartItemsData);
    }, []);

    useEffect(() => {
        if (updatedCartItems.length > 0) {
            // fetch request object length and compare it with the response length
            console.log("111111111111", cartItems);
            let c = cartItems.map((item) => {
                return item.item;
            });
            const requestObject = constructQouteObject(c);
            if (requestObject.length === updatedCartItems.length) {
                // setToggleInit(true);
            }

            console.log("22222222222222");

            const cartList = JSON.parse(JSON.stringify(updatedCartItems));
            // check if any one order contains error
            let total_payable = 0;
            const quotes = updatedCartItems?.map((item, index) => {
                const { message, error } = item;
                let provider_payable = 0;
                const provider = {
                    products: [],
                    total_payable: 0,
                    name: "",
                    error: null,
                };

                // else generate quote of it
                if (message) {
                    if (message?.quote?.quote?.price?.value) {
                        provider_payable += Number(message?.quote?.quote?.price?.value);
                    }
                    const breakup = message?.quote?.quote?.breakup;
                    const provided_by = message?.quote?.provider?.descriptor?.name;
                    provider.name = provided_by;
                    provider.products = breakup?.map((break_up_item) => {
                        const cartIndex = cartList.findIndex((one) => one.id === break_up_item["@ondc/org/item_id"]);
                        const cartItem = cartIndex > -1 ? cartList[cartIndex] : null;
                        let cartQuantity = cartItem ? cartItem?.quantity?.count : 0;
                        let quantity = break_up_item["@ondc/org/item_quantity"]
                            ? break_up_item["@ondc/org/item_quantity"]["count"]
                            : 0;
                        let textClass = "";
                        let quantityMessage = "";
                        if (quantity === 0) {
                            if (break_up_item["@ondc/org/title_type"] === "item") {
                                textClass = "text-error";
                                quantityMessage = "Out of stock";

                                if (cartIndex > -1) {
                                    cartList.splice(cartIndex, 1);
                                }
                            }
                        } else if (quantity !== cartQuantity) {
                            textClass = break_up_item["@ondc/org/title_type"] === "item" ? "text-amber" : "";
                            quantityMessage = `Quantity: ${quantity}/${cartQuantity}`;
                            if (cartItem) {
                                cartItem.quantity.count = quantity;
                            }
                        } else {
                            quantityMessage = `Quantity: ${quantity}`;
                        }

                        if (error && error.code === "30009") {
                            cartList.splice(cartIndex, 1);
                        }
                        return {
                            id: break_up_item["@ondc/org/item_id"],
                            title: break_up_item?.title,
                            price: Number(break_up_item.price?.value)?.toFixed(2),
                            cartQuantity,
                            quantity,
                            provided_by,
                            textClass,
                            quantityMessage,
                        };
                    });
                }

                if (error) {
                    provider.error = error.message;
                }

                total_payable += provider_payable;
                provider.total_payable = provider_payable;
                return provider;
            });
            // setGetQuoteLoading(false);
            // setUpdateCartLoading(false);
            setProductsQuote({
                providers: quotes,
                total_payable: total_payable.toFixed(2),
            });
        }
    }, [updatedCartItems]);

    console.log("productsQuote************************", productsQuote)

    const renderStepLabel = (stepLabel, stepIndex) => {
        switch(stepIndex) {
            case 0:
                return (
                    <StepOneLabel
                        activeStep={activeStep}
                    />
                )
            case 1:
                return (
                    <StepTwoLabel
                        activeStep={activeStep}
                        onUpdateActiveStep={() => {
                            setActiveStep(1);
                        }}

                    />
                )
            case 2:
                return <StepThreeLabel />
            default:
                return <>stepLabel</>
        }
    };
    const renderStepContent = (stepLabel, stepIndex) => {
        switch(stepIndex) {
            case 0:
                return (
                    <StepOneContent
                        handleNext={() => {
                            setActiveStep(1);
                        }}
                    />
                )
            case 1:
                return (
                    <StepTwoContent
                        cartItemsData={cartItems}
                        updatedCartItemsData={updatedCartItems}
                        setUpdateCartItemsData={(data) => {
                            console.log("updatedCartItems data=====>", updatedCartItems)
                            console.log("StepTwoContent data=====>", data)
                            setUpdatedCartItems(data)
                        }}
                        setUpdateCartItemsDataOnInitialize={(data) => {
                            setUpdatedCartItems(data)
                        }}
                        handleNext={() => {
                            setActiveStep(2);
                        }}
                        updateInitLoading={(value) => setInitLoading(value)}
                        responseReceivedIds={updatedCartItems.map((item) => {
                            const {message} = item;
                            return message?.quote?.provider?.id.toString();
                        })}
                    />
                )
            case 2:
                return (
                    <StepThreeContent
                        responseReceivedIds={updatedCartItems.map((item) => {
                            const {message} = item;
                            return message?.quote?.provider?.id.toString();
                        })}
                    />
                )
            default:
                return <>stepLabel</>
        }
    };

    if(cartItems === null || updatedCartItems === null){
        return <Redirect to={"/application/cart"} />
    }
    return (
        <>
            <div className={classes.header}>
                <Typography component={Link} underline="hover" color="primary.main" variant="body1" className={classes.headerTypo} to={`/application`}>
                    BACK TO SHOP
                </Typography>
            </div>
            <div className={classes.bodyContainer}>
                <Grid container spacing={6}>
                    <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
                        <Stepper activeStep={activeStep} orientation="vertical" connector={false}>
                            {steps.map((step, index) => (
                                <Step key={step.label} className={classes.stepRoot}>
                                    <StepLabel
                                        className={classes.stepLabel}
                                    >
                                        {renderStepLabel(step, index)}
                                    </StepLabel>
                                    <StepContent className={activeStep === index?classes.stepContent:classes.stepContentHidden}>
                                        {renderStepContent(step, index)}
                                    </StepContent>
                                </Step>
                            ))}
                        </Stepper>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                        <Card
                            className={classes.summaryCard}
                        >
                            <Typography variant="h4">
                                Summary
                            </Typography>
                            <Box
                                component={"div"}
                                className={classes.divider}
                            />
                            {
                                productsQuote?.providers.map((provider, pindex) => (
                                    <div key={`pindex-${pindex}`}>
                                        {
                                            provider.products.filter((quote) => quote?.title !== "").map((quote, qIndex) => (
                                                <div
                                                    className={classes.summaryItemContainer}
                                                    key={`quote-${qIndex}`}
                                                >
                                                    <Typography variant="body1" className={classes.summaryItemLabel}>
                                                        {quote?.title}
                                                        {
                                                            quote?.quantityMessage && (
                                                                <>
                                                                    <br />
                                                                    <Typography variant="subtitle2" className={classes.summaryItemLabelDescription}>
                                                                        (Standard Rate - Price may vary depending on the item/destination. TECS Staff will contact you.)
                                                                    </Typography>
                                                                </>
                                                            )
                                                        }
                                                    </Typography>
                                                    <Typography variant="body1" className={classes.summaryItemValue}>
                                                        {`₹${quote?.price}`}
                                                    </Typography>
                                                </div>
                                            ))
                                        }
                                        {provider.error && (
                                            <Typography variant="body1" color="error" className={classes.summaryItemLabel}>
                                                {provider.error}
                                            </Typography>
                                        )}
                                    </div>
                                ))
                            }
                            {/*<div*/}
                            {/*    className={classes.summaryItemContainer}*/}
                            {/*>*/}
                            {/*    <Typography variant="body1" className={classes.summaryItemLabel}>*/}
                            {/*        Subtotal*/}
                            {/*    </Typography>*/}
                            {/*    <Typography variant="body1" className={classes.summaryItemValue}>*/}
                            {/*        ₹4,300.00*/}
                            {/*    </Typography>*/}
                            {/*</div>*/}
                            {/*<div*/}
                            {/*    className={classes.summaryItemContainer}*/}
                            {/*>*/}
                            {/*    <Typography variant="body1" className={classes.summaryItemLabel}>*/}
                            {/*        Shipping*/}
                            {/*        <br />*/}
                            {/*        <Typography variant="subtitle2" className={classes.summaryItemLabelDescription}>*/}
                            {/*            (Standard Rate - Price may vary depending on the item/destination. TECS Staff will contact you.)*/}
                            {/*        </Typography>*/}
                            {/*    </Typography>*/}
                            {/*    <Typography variant="body1" className={classes.summaryItemValue}>*/}
                            {/*        ₹21.00*/}
                            {/*    </Typography>*/}
                            {/*</div>*/}
                            {/*<div*/}
                            {/*    className={classes.summaryItemContainer}*/}
                            {/*>*/}
                            {/*    <Typography variant="body1" className={classes.summaryItemLabel}>*/}
                            {/*        Tax*/}
                            {/*    </Typography>*/}
                            {/*    <Typography variant="body1" className={classes.summaryItemValue}>*/}
                            {/*        ₹1.91*/}
                            {/*    </Typography>*/}
                            {/*</div>*/}
                            {/*<div*/}
                            {/*    className={classes.summaryItemContainer}*/}
                            {/*>*/}
                            {/*    <Typography variant="body1" className={classes.summaryItemLabel}>*/}
                            {/*        GST (10%)*/}
                            {/*    </Typography>*/}
                            {/*    <Typography variant="body1" className={classes.summaryItemValue}>*/}
                            {/*        ₹1.91*/}
                            {/*    </Typography>*/}
                            {/*</div>*/}
                            <Box
                                component={"div"}
                                className={classes.orderTotalDivider}
                            />
                            <div
                                className={classes.summaryItemContainer}
                            >
                                <Typography variant="body" className={classes.totalLabel}>
                                    Order Total
                                </Typography>
                                <Typography variant="body" className={classes.totalValue}>
                                    {`₹${productsQuote?.total_payable}`}
                                </Typography>
                            </div>
                            <Button
                                className={classes.proceedToBuy}
                                fullWidth
                                variant="contained"
                            >
                                Proceed to Buy
                            </Button>
                        </Card>
                    </Grid>
                </Grid>
            </div>
        </>
    )

};

export default Checkout;