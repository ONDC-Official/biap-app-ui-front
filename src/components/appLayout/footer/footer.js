import React from 'react';
import useStyles from './style';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import logo from "../../../assets/images/AppLogo.png";
import { ReactComponent as CallIcon} from "../../../assets/images/call.svg";
import { ReactComponent as WhatsappIcon} from "../../../assets/images/whatsapp.svg";
import appStoreImage from "../../../assets/images/appStore.png";
import playStoreImage from "../../../assets/images/playStore.png";
import {removeCookie} from "../../../utils/cookies";
import categoryList from '../../../constants/categories';

const Footer = () => {
    const classes = useStyles();
    return (
        <Box
            component="footer"
            className={classes.footerContainer}
        >
            <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                    <div>
                        <img
                            src={logo}
                            alt="logo"
                            className={classes.footerAppLogo}
                        />
                    </div>
                    <div
                        className={classes.contactUsContainer}
                    >
                        <Typography variant="h6" color="white">Contact Us</Typography>
                        <div className={classes.contactUsItem}>
                            <div>
                                <WhatsappIcon />
                            </div>
                            <div className={classes.itemDetailsContainer}>
                                <Typography className={classes.itemDetailsLabel} variant="body" component="div" color="white">Whats App</Typography>
                                <Typography className={classes.itemDetailsValue} variant="body" component="div" color="white">+1 202-918-2132</Typography>
                            </div>
                        </div>
                        <div className={classes.contactUsItem}>
                            <div>
                                <CallIcon />
                            </div>
                            <div className={classes.itemDetailsContainer}>
                                <Typography className={classes.itemDetailsLabel} variant="body" component="div" color="white">Call Us</Typography>
                                <Typography className={classes.itemDetailsValue} variant="body" component="div" color="white">+1 202-918-2132</Typography>
                            </div>
                        </div>
                    </div>
                    <div
                        className={classes.appsContainer}
                    >
                        <Typography variant="h6" color="white">Download App</Typography>
                        <div className={classes.appsItem}>
                            <img className={classes.appImages} src={appStoreImage} alt="App Store"/>
                            <img className={classes.appImages} src={playStoreImage} alt="App Store"/>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                    <Typography variant="body" component="div" color="white">
                        Most Popular Categories
                    </Typography>
                    <Box
                        component={"div"}
                        className={classes.categoryDivider}
                    />
                    <ul className={classes.listContainer}>
                        {
                            categoryList.map((item, index) => (
                                <li key={`category-${index}`} className={classes.listStyle}>
                                    <Typography
                                        className={classes.itemDetailsLabel} variant="body" component="div" color="white"
                                    >
                                        {item.shortName}
                                    </Typography>
                                </li>
                            ))
                        }
                    </ul>
                </Grid>
                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                    <Typography variant="body" component="div" color="white">
                        Customer Services
                    </Typography>
                    <Box
                        component={"div"}
                        className={classes.serviceDivider}
                    />
                    <ul className={classes.listContainer}>
                        <li className={classes.listStyle}>
                            <Typography
                                className={classes.itemDetailsLabel} variant="body" component="div" color="white"
                            >
                                About Us
                            </Typography>
                        </li>
                        <li className={classes.listStyle}>
                            <Typography
                                className={classes.itemDetailsLabel} variant="body" component="div" color="white"
                            >
                                Terms & Conditions
                            </Typography>
                        </li>
                        <li className={classes.listStyle}>
                            <Typography
                                className={classes.itemDetailsLabel} variant="body" component="div" color="white"
                            >
                                FAQ
                            </Typography>
                        </li>
                        <li className={classes.listStyle}>
                            <Typography
                                className={classes.itemDetailsLabel} variant="body" component="div" color="white"
                            >
                                Privacy Policy
                            </Typography>
                        </li>
                        <li className={classes.listStyle}>
                            <Typography
                                className={classes.itemDetailsLabel} variant="body" component="div" color="white"
                            >
                                E-waste Policy
                            </Typography>
                        </li>
                        <li className={classes.listStyle}>
                            <Typography
                                className={classes.itemDetailsLabel} variant="body" component="div" color="white"
                            >
                                Cancellation & Return Policy
                            </Typography>
                        </li>
                    </ul>
                </Grid>
                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                    <div className={classes.circleOne}></div>
                    <div className={classes.circleTwo}></div>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}
                    style={{textAlign: 'center', marginTop: '25px'}}
                >
                    <Box
                        component={"div"}
                        className={classes.divider}
                    />
                    <Typography
                        variant="body1"
                        color="white"
                        style={{marginTop: '18px', marginBottom: '20px'}}
                    >
                        © 2023 All rights reserved. ONDC.
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    );

};

export default Footer;