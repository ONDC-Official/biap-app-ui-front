import React from 'react';
import useStyles from './style';
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
import {useHistory} from "react-router-dom";

import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';

const NavBar = () => {

    const classes = useStyles();
    const history = useHistory();

    return (
        <AppBar position="absolute">
            <Toolbar
                className={classes.headerContainer}
            >
                <img
                    src={logo}
                    alt="logo"
                    className={classes.appLogo}
                    onClick={() => {
                        // removeCookie("search_context");
                        // history.push("/application");
                    }}
                />
                <div className={classes.addressContainer}>
                    <LocationIcon />
                    <Typography variant="body2" className={classes.addressTypo}>
                        Deliver to <b>423651</b>
                    </Typography>
                    <AddressDownIcon />
                </div>
                <div className={classes.inputContainer}>
                    <Paper
                        component="form"
                        className={classes.inputForm}
                    >
                        <IconButton className={classes.searchIcon} aria-label="menu">
                            <SearchIcon />
                        </IconButton>
                        <InputBase
                            fullWidth
                            className={classes.inputBase}
                            placeholder="Search..."
                            inputProps={{ 'aria-label': 'Search...' }}
                        />
                        <IconButton type="button" className={classes.listIcon} aria-label="search">
                            <ListIcon />
                        </IconButton>
                    </Paper>
                </div>
                <div className={classes.favourite}>
                    <HeartIcon />
                    <Typography variant="body2" className={classes.favouriteTypo}>
                        List
                    </Typography>
                </div>
                <div className={classes.cart}>
                    <CartIcon />
                    <Typography variant="body2" className={classes.cartTypo}>
                        Cart
                    </Typography>
                </div>
                <div className={classes.user}>
                    <UserIcon />
                    <Typography variant="body2" className={classes.userTypo}>
                        User
                    </Typography>
                </div>
            </Toolbar>
        </AppBar>
    );

};

export default NavBar;