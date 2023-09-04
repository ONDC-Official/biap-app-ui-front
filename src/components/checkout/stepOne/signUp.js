import React, {useState} from 'react';
import useStyles from './style';

import Grid from "@mui/material/Grid";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '../../common/Checkbox';

const SignUp = () => {
    const classes = useStyles();

    const [user, setUser] = useState({
        firstName: '', lastName: '', email: '', password: '', isConfirmSignup: false
    });
    const [error, setError] = useState({
        firstname_error: "",
        lastname_error: "",
        email_error: "",
        password_error: "",

    });

    // use this function to check the firstname
    function checkFirstName() {
        if (!user.firstName) {
            setError((error) => ({
                ...error,
                firstname_error: "First Name cannot be empty",
            }));
            return false;
        }
        return true;
    };

    // use this function to check the lastname
    function checkLastName() {
        if (!user.lastName) {
            setError((error) => ({
                ...error,
                lastname_error: "Last Name cannot be empty",
            }));
            return false;
        }
        return true;
    };

    // use this function to check the email
    function checkEmail() {
        if (!user.email) {
            setError((error) => ({
                ...error,
                email_error: "Email cannot be empty",
            }));
            return false;
        }
        return true;
    };

    // use this function to check the password
    function checkPassword() {
        if (!user.password) {
            setError((error) => ({
                ...error,
                password_error: "Password cannot be empty",
            }));
            return false;
        } else if (user.password && user.password.length < 8) {
            setError((error) => ({
                ...error,
                password_error: "Password cannot be less than 8 characters",
            }));
            return false;
        }

        return true;
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField
                    required
                    fullWidth
                    id="name-input"
                    name="firstName"
                    label="First Name"
                    placeholder="Enter First Name"
                    type="text"
                    value={user?.firstName}
                    onChange={(event) => {
                        const name = event.target.value;
                        setUser((user) => ({
                            ...user,
                            firstName: name,
                        }));
                        setError((error) => ({
                            ...error,
                            firstname_error: "",
                        }));
                    }}
                    error={!!error.firstname_error}
                    helperText={error.firstname_error}
                    onBlur={checkFirstName}
                />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField
                    required
                    fullWidth
                    id="lastname-input"
                    name="lastName"
                    label="Last Name"
                    placeholder="Enter Last Name"
                    type="text"
                    value={user?.lastName}
                    onChange={(event) => {
                        const name = event.target.value;
                        setUser((user) => ({
                            ...user,
                            lastName: name,
                        }));
                        setError((error) => ({
                            ...error,
                            lastname_error: "",
                        }));
                    }}
                    error={!!error.lastname_error}
                    helperText={error.lastname_error}
                    onBlur={checkFirstName}
                />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField
                    required
                    fullWidth
                    id="email-input"
                    name="email"
                    label="Email"
                    placeholder="Enter Email"
                    type="email"
                    value={user?.email}
                    onChange={(event) => {
                        const name = event.target.value;
                        setUser((user) => ({
                            ...user,
                            email: name,
                        }));
                        setError((error) => ({
                            ...error,
                            email_error: "",
                        }));
                    }}
                    error={!!error.email_error}
                    helperText={error.email_error}
                    onBlur={checkEmail}
                />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField
                    required
                    fullWidth
                    id="email-input"
                    name="password"
                    label="Password"
                    placeholder="Enter Password"
                    type="password"
                    value={user?.password}
                    onChange={(event) => {
                        const name = event.target.value;
                        setUser((user) => ({
                            ...user,
                            password: name,
                        }));
                        setError((error) => ({
                            ...error,
                            password_error: "",
                        }));
                    }}
                    error={!!error.password_error}
                    helperText={error.password_error}
                    onBlur={checkPassword}
                />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <FormControlLabel
                    className={classes.formControlLabelAlign}
                    control={
                        <Checkbox
                            checked={user.isConfirmSignup}
                            className={classes.signupCheckbox}
                            onChange={() => {
                                setUser((user) => ({
                                    ...user,
                                    isConfirmSignup: !user.isConfirmSignup,
                                }));
                            }}
                        />
                    }
                    label="Signup for ONDC News, Launches and special Offers - straight to your inbox"
                />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Button variant="contained" className={classes.signupButton}>
                    Signup
                </Button>
            </Grid>
        </Grid>
    )

};

export default SignUp;