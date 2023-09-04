import React from 'react';
import useStyles from "./style";

import { isLoggedIn, getUser } from "../../../utils/validateToken";

import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import SignUp from './signUp';

function stringToColor(string) {
    let hash = 0;
    let i;
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
    return color;
};

const StepOneContent = ({handleNext}) => {
    const classes = useStyles();
    const user  = getUser();
    console.log("user=====>", user)
    const stringAvatar = (name) => {
        return {
            sx: {
                bgcolor: stringToColor(name),
            },
            children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
        };
    }
    return (
        <Grid container spacing={3}>
            {
                isLoggedIn()
                ?(
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <div className={classes.loggedInUser}>
                            <Avatar
                                src={user.photoURL}
                                {...stringAvatar(user.name)}
                                className={classes.userAvatar}
                            />
                            <div className={classes.userTypo}>
                                <Typography className={classes.nameTypo} component="div" variant="body">
                                    {user.name}
                                </Typography>
                                <Typography className={classes.emailTypo} component="div" variant="body">
                                    {user.email}
                                </Typography>
                            </div>
                        </div>
                        <div className={classes.userActionContainer}>
                            <Button
                                variant="contained"
                                onClick={handleNext}
                            >
                                Continue
                            </Button>
                        </div>
                    </Grid>
                ):(
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <SignUp />
                    </Grid>
                )
            }
        </Grid>
    )

};

export default StepOneContent;