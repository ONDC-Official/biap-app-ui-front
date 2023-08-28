import React, {useContext} from 'react';

import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Radio from '../../../common/Radio';

import {AddressContext} from "../../../../context/addressContext";
import useCancellablePromise from "../../../../api/cancelRequest";
import axios from "axios";
import { AddCookie, removeCookie } from "../../../../utils/cookies";
import useStyles from "./style";
import AddRoundedIcon from '@mui/icons-material/AddRounded';

const SelectAddress = ({
    addresses, onClose, setAddAddress, setUpdateAddress, onSelectAddress
}) => {
    const classes = useStyles();
    const { deliveryAddress, setDeliveryAddress, setBillingAddress } = useContext(AddressContext);

    // HOOKS
    const { cancellablePromise } = useCancellablePromise();

    const onSetDeliveryAddress = (id, descriptor, address) => {
        // fetchLatLongFromEloc(address?.areaCode);
        return {
            id,
            name: descriptor?.name || "",
            email: descriptor?.email || "",
            phone: descriptor?.phone || "",
            location: {
                address,
            },
        };
    };

    // use this function to fetch lat and long from eloc
    async function fetchLatLongFromEloc(eloc) {
        try {
            const { data } = await cancellablePromise(
                axios.get(
                    `${process.env.REACT_APP_MMI_BASE_URL}mmi/api/mmi_place_info?eloc=${eloc}`
                )
            );
            const { latitude, longitude } = data;
            if (latitude && longitude) {
                AddCookie("LatLongInfo", JSON.stringify({ latitude, longitude }));
            } else {
                // dispatch({
                //     type: toast_actions.ADD_TOAST,
                //     payload: {
                //         id: Math.floor(Math.random() * 100),
                //         type: toast_types.error,
                //         message:
                //             "Cannot get latitude and longitude info for this pincode Please update the Address",
                //     },
                // });
                setDeliveryAddress({});
            }
        } catch (err) {
            // dispatch({
            //     type: toast_actions.ADD_TOAST,
            //     payload: {
            //         id: Math.floor(Math.random() * 100),
            //         type: toast_types.error,
            //         message: err?.message,
            //     },
            // });
        }
    };

    return (
        <Grid container spacing={3}>
            {/* delivery address list card */}
            {
                addresses && addresses.length > 0 && (
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <FormControl className={classes.formControlRoot}>
                            {
                                addresses
                                    .filter(
                                        (delivery_address) =>
                                            delivery_address?.descriptor.phone !== "" &&
                                            delivery_address?.descriptor.email !== ""
                                    ).map((delivery_address, ind) => {
                                    const { id, descriptor, address } = delivery_address;
                                    return (
                                        <div key={`address-radio-button-${ind}`} className={classes.selectAddressRadioContainer}>
                                            <FormControlLabel
                                                className={classes.formControlLabel}
                                                onClick={() => {
                                                    setDeliveryAddress(() =>
                                                        onSetDeliveryAddress(id, descriptor, address)
                                                    );
                                                    AddCookie(
                                                        "delivery_address",
                                                        JSON.stringify(
                                                            onSetDeliveryAddress(id, descriptor, address)
                                                        )
                                                    );
                                                    setBillingAddress();
                                                    removeCookie("billing_address");
                                                    onSelectAddress(
                                                        onSetDeliveryAddress(id, descriptor, address)
                                                    );
                                                    onClose();
                                                }}
                                                control={<Radio checked={deliveryAddress?.id === id} />}
                                                label={
                                                    <div>
                                                        <Typography variant="h5">
                                                            {`${address.tag
                                                                ? address.tag + " (" + descriptor?.name + ")"
                                                                : descriptor?.name
                                                            } `}
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            {descriptor?.email} - {descriptor?.phone}
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            {address?.street ? address.street : address?.door}
                                                            , {address?.city} {address?.state}
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            {address?.areaCode}
                                                        </Typography>
                                                    </div>
                                                }
                                            />
                                            <Button
                                                className={classes.editAddressButton}
                                                variant="text" color="secondary"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setUpdateAddress({
                                                        id,
                                                        name: descriptor?.name,
                                                        email: descriptor?.email,
                                                        phone: descriptor?.phone,
                                                        areaCode: address?.areaCode,
                                                        city: address?.city,
                                                        door: address?.door,
                                                        state: address?.state,
                                                        street: address?.street,
                                                        tag: address?.tag,
                                                    });
                                                }}
                                            >
                                                edit
                                            </Button>
                                        </div>
                                    )
                                })
                            }
                        </FormControl>
                    </Grid>
                )
            }
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className={classes.addAddressContainer}>
                <Typography
                    variant="h6" color="primary"
                    className={classes.addAddress}
                    onClick={() => setAddAddress()}
                >
                    <AddRoundedIcon className={classes.addIcon} />
                    Add Address
                </Typography>
            </Grid>
        </Grid>
    )

};

export default SelectAddress;