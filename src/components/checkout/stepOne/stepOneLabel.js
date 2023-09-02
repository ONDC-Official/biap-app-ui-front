import React from 'react';
import useStyles from "./style";

import Typography from "@mui/material/Typography";

import {getUser, isLoggedIn} from "../../../utils/validateToken";

const StepOneLabel = ({activeStep}) => {
    const classes = useStyles();
    const user  = getUser();
    return (
        <div>
            <Typography variant="h4" className={classes.labelTypo}>
                Customer
            </Typography>
            {
                activeStep > 0 && isLoggedIn() && user && (
                    <div className={classes.userLabelTypo}>
                        <Typography className={classes.nameLabelTypo} component="div" variant="body">
                            {user.name}
                        </Typography>
                        <Typography className={classes.emailLabelTypo} component="div" variant="body">
                            {user.email}
                        </Typography>
                    </div>
                )
            }
        </div>
    )

};

export default  StepOneLabel;