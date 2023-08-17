import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import logo from "../../assets/images/AppLogo.png";
import {removeCookie} from "../../utils/cookies";

const Footer = () => {

    return (
        <Box
            component="footer"
            sx={{
                pt: '54px',
                pl: '122px',
                pr: '122px',
                backgroundColor: (theme) => theme.palette.primary.main
            }}
        >
            <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={5} lg={5} xl={5}>
                    <div>
                        <img
                            src={logo}
                            alt="logo"
                            style={{ height: "40px" }}
                        />
                    </div>
                </Grid>
                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                    2
                </Grid>
                <Grid item xs={12} sm={12} md={5} lg={5} xl={5}>
                    3
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}
                    style={{textAlign: 'center', marginTop: '35px'}}
                >
                    <Box
                        component={"div"}
                        sx={{
                            height: '1px',
                            backgroundColor: (theme) => theme.palette.primary.light
                        }}
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