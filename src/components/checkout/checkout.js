import React, {useState} from 'react';
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

import {Link} from 'react-router-dom';
import Box from "@mui/material/Box";

const Checkout = () => {
    const classes = useStyles();

    const [activeStep, setActiveStep] = useState(0);

    const steps = ["Customer", "Add Address", "Payment"];

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
                        handleNext={() => {
                            setActiveStep(2);
                        }}
                    />
                )
            case 2:
                return <StepThreeContent />
            default:
                return <>stepLabel</>
        }
    };

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
                                    ₹4,324.00
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