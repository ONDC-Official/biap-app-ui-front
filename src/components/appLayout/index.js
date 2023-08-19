import React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import NavBar from "./navbar/navbar";
import Footer from "./footer/footer";

import { makeStyles } from '@mui/styles';
import palette from "../../utils/Theme/palette";

const useStyles = makeStyles({
    allLayoutContainer: {
        display: 'flex', flexDirection: 'column'
    },
    mainContainer: {
        flexGrow: 1,
        height: '100%',
        minHeight: '100vh',
        // margin: '20px',
    },
    toolbar: {
        height: '77px'
    }
});

const AppLayout = ({ pageTitle, children }) => {
    const classes = useStyles();
    return (
        <Box className={classes.allLayoutContainer}>
            <NavBar />
            <Box
                component="main"
                className={classes.mainContainer}
            >
                <Toolbar className={classes.toolbar} />
                {children}
            </Box>
            <Footer />
        </Box>
    )

}

export default AppLayout;