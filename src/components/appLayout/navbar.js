import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import logo from "../../assets/images/AppLogo.png";
import {getValueFromCookie, removeCookie} from "../../utils/cookies";
import {useHistory} from "react-router-dom";

const NavBar = () => {

    const user = JSON.parse(getValueFromCookie("user"));
    const history = useHistory();

    return (
        <AppBar position="absolute">
            <Toolbar
                sx={{ display: 'flex', p: '18px 55px 16px 55px' }}
            >
                <img
                    src={logo}
                    alt="logo"
                    style={{ height: "40px", cursor: "pointer" }}
                    onClick={() => {
                        removeCookie("search_context");
                        history.push("/application");
                    }}
                />
                {/*Main App*/}
            </Toolbar>
        </AppBar>
    );

};

export default NavBar;