import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import logo from "../../../assets/images/AppLogo.png";
import { ReactComponent as LocationIcon} from "../../../assets/images/location.svg";
import {ReactComponent as AddressDownIcon} from "../../../assets/images/chevron-down.svg";
import {ReactComponent as ListIcon} from "../../../assets/images/list.svg";
import {ReactComponent as SearchIcon} from "../../../assets/images/search.svg";
import {ReactComponent as CartIcon} from "../../../assets/images/cart.svg";
import {ReactComponent as HeartIcon} from "../../../assets/images/heart.svg";
import {ReactComponent as UserIcon} from "../../../assets/images/loggedInUser.svg";
import {getValueFromCookie, removeCookie} from "../../../utils/cookies";
import {useHistory} from "react-router-dom";

import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';

const NavBar = () => {

    const user = JSON.parse(getValueFromCookie("user"));
    const history = useHistory();

    return (
        <AppBar position="absolute">
            <Toolbar
                sx={{ display: 'flex', p: '18px 55px 16px 55px !important' }}
            >
                <img
                    src={logo}
                    alt="logo"
                    style={{ height: "40px", width: '100px', cursor: "pointer" }}
                    onClick={() => {
                        removeCookie("search_context");
                        history.push("/application");
                    }}
                />
                <div style={{display: 'flex', marginLeft: '20px'}}>
                    <LocationIcon />
                    <Typography variant="body2" style={{marginLeft: '4px', marginRight: '6px'}}>
                        Deliver to <b>423651</b>
                    </Typography>
                    <AddressDownIcon />
                </div>
                <div style={{flex: 1, marginLeft: '14px', marginRight: '80px'}}>
                    <Paper
                        component="form"
                        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', borderRadius: '58px', height: '43px' }}
                    >
                        <IconButton sx={{ p: '10px' }} aria-label="menu">
                            <SearchIcon />
                        </IconButton>
                        <InputBase
                            fullWidth
                            sx={{flex: 1 }}
                            placeholder="Search..."
                            inputProps={{ 'aria-label': 'Search...' }}
                        />
                        <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                            <ListIcon />
                        </IconButton>
                    </Paper>
                </div>
                <div style={{display: 'flex'}}>
                    <HeartIcon style={{fill: '#fff'}} />
                    <Typography variant="body2" style={{marginLeft: '5px', marginTop: '3px'}}>
                        List
                    </Typography>
                </div>
                <div style={{display: 'flex', marginLeft: '22px', marginRight: '22px'}}>
                    <CartIcon />
                    <Typography variant="body2" style={{marginLeft: '5px', marginTop: '3px'}}>
                        Cart
                    </Typography>
                </div>
                <div style={{display: 'flex'}}>
                    <UserIcon />
                    <Typography variant="body2" style={{marginLeft: '5px', marginTop: '3px'}}>
                        User
                    </Typography>
                </div>
            </Toolbar>
        </AppBar>
    );

};

export default NavBar;