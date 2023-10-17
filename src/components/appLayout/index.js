import React, {useEffect} from 'react';
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

const AppLayout = ({ pageTitle, children, isCheckout=false }) => {
    const classes = useStyles();

    useEffect(()=>{
        window.scrollTo(0,0);
    }, [])
    return (
        <Box className={classes.allLayoutContainer}>
            <NavBar isCheckout={isCheckout} />
            <Box
                component="main"
                className={classes.mainContainer}
            >
                <Toolbar id="back-to-top-anchor" className={classes.toolbar} />
                {children}
            </Box>
            <Footer />
        </Box>
    )

}

export default AppLayout;