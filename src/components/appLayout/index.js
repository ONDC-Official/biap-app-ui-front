import React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import NavBar from "./navbar";
import Footer from "./footer";

const AppLayout = ({ pageTitle, children }) => {

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', }}>
            <NavBar />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    height: '100%',
                    minHeight: '100vh',
                    m: 2.5,
                    // mt: 0.5
                }}
            >
                <Toolbar />
                {children}
            </Box>
            <Footer />
        </Box>
    )

}

export default AppLayout;