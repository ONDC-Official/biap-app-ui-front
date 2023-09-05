import React, {useContext, useEffect, useState} from 'react';
import useStyles from "./style";

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '../../common/Radio';

import useCancellablePromise from "../../../api/cancelRequest";
import {getAllDeliveryAddressRequest} from '../../../api/address.api';

import AddressList from "./addressList";
import AddressForm from '../../appLayout/navbar/addressForm/addressForm';
import {restoreToDefault} from "../../../constants/restoreDefaultAddress";
import {address_types} from "../../../constants/address-types";
import {AddCookie, removeCookie} from "../../../utils/cookies";
import {AddressContext} from "../../../context/addressContext";

const StepTwoContent = ({handleNext}) => {
    const classes = useStyles();
    const { deliveryAddress, billingAddress, setBillingAddress } = useContext(AddressContext);
    const [addressList, setAddressList] = useState([]);
    const [addressType, setAddressType] = useState('');
    const [fetchDeliveryAddressLoading, setFetchDeliveryAddressLoading] = useState();
    const [toggleAddressForm, setToggleAddressForm] = useState({
        actionType: "",
        toggle: false,
        address: restoreToDefault(),
    });

    // HOOKS
    const { cancellablePromise } = useCancellablePromise();

    // use this function to fetch existing address of the user
    const fetchDeliveryAddress = async () => {
        setFetchDeliveryAddressLoading(true);
        try {
            const data = await cancellablePromise(
                getAllDeliveryAddressRequest()
            );
            setAddressList(data);
        } catch (err) {
            if (err.response.data.length > 0) {
                setAddressList([]);
                return;
            }
        } finally {
            setFetchDeliveryAddressLoading(false);
        }
    };

    useEffect(() => {
        fetchDeliveryAddress();
    }, []);

    return (
        <div>
            {
                fetchDeliveryAddressLoading
                ?<CircularProgress />
                :(
                    <>
                        {
                            addressType !== address_types.delivery && (
                                <>
                                    <AddressList
                                        addressList={addressList}
                                        label="Shipping Address"
                                        setAddAddress={() => {
                                            setToggleAddressForm({
                                                actionType: "add",
                                                toggle: true,
                                                address: restoreToDefault(),
                                            });
                                            setAddressType(address_types.delivery);
                                        }}
                                        setUpdateAddress={(address) => {
                                            setToggleAddressForm({
                                                actionType: "edit",
                                                toggle: true,
                                                address: address,
                                            });
                                            setAddressType(address_types.delivery);
                                        }}

                                    />
                                    {
                                        deliveryAddress && (
                                            <div className={classes.pickupBillingAddress}>
                                                <FormControlLabel
                                                    className={classes.formControlLabel}
                                                    onClick={() => {
                                                        setBillingAddress({
                                                            id: deliveryAddress?.id,
                                                            address: deliveryAddress?.location?.address,
                                                            phone: deliveryAddress?.phone || "",
                                                            name: deliveryAddress?.name || "",
                                                            email: deliveryAddress?.email || "",
                                                        });
                                                        AddCookie(
                                                            "billing_address",
                                                            JSON.stringify({
                                                                id: deliveryAddress?.id,
                                                                address: deliveryAddress?.location?.address,
                                                                phone: deliveryAddress?.phone || "",
                                                                name: deliveryAddress?.name || "",
                                                                email: deliveryAddress?.email || "",
                                                            })
                                                        );
                                                        handleNext();
                                                    }}
                                                    control={<Radio checked={deliveryAddress?.id === billingAddress?.id} />}
                                                    label={
                                                        <Typography variant="body1" component="div" className={classes.billingTypo}>
                                                            My billing and shipping address are the same
                                                        </Typography>
                                                    }
                                                />
                                                <FormControlLabel
                                                    className={classes.formControlLabel}
                                                    onClick={() => {
                                                        setBillingAddress();
                                                        removeCookie("billing_address");
                                                        setToggleAddressForm({
                                                            actionType: "add",
                                                            toggle: true,
                                                            address: restoreToDefault(),
                                                        });
                                                        setAddressType(address_types.billing);
                                                    }}
                                                    control={<Radio checked={billingAddress?deliveryAddress?.id !== billingAddress?.id:addressType === address_types.billing?true:false} />}
                                                    label={
                                                        <Typography variant="body1" component="div" className={classes.billingTypo}>
                                                            Add New Billing Address
                                                        </Typography>
                                                    }
                                                />
                                            </div>
                                        )
                                    }
                                </>
                            )
                        }
                        {
                            toggleAddressForm.toggle && addressType && (
                                <>
                                    {
                                        addressType && (
                                            <Typography component="div" className={classes.formLabel} variant="body">
                                                {addressType === address_types.delivery?'Shipping Address':"Billing Address"}
                                            </Typography>
                                        )
                                    }
                                    <AddressForm
                                        fromCheckout={true}
                                        action_type={toggleAddressForm.actionType}
                                        address_type={addressType}
                                        selectedAddress={toggleAddressForm.address}
                                        onClose={() => {
                                            setToggleAddressForm({
                                                actionType: "",
                                                toggle: false,
                                                address: restoreToDefault(),
                                            });
                                            setAddressType("");
                                        }}
                                        onAddAddress={(address) => {
                                            setToggleAddressForm({
                                                actionType: "",
                                                toggle: false,
                                                address: restoreToDefault(),
                                            });
                                            setAddressList([...addressList, address]);
                                            setAddressType("");
                                        }}
                                        onUpdateAddress={(address) => {
                                            const updatedAddress = addressList.map((d) => {
                                                if (d.id === address.id) {
                                                    return address;
                                                }
                                                return d;
                                            });
                                            setAddressList(updatedAddress);
                                            setToggleAddressForm({
                                                actionType: "",
                                                toggle: false,
                                                address: restoreToDefault(),
                                            });
                                            setAddressType("");
                                        }}
                                    />
                                </>
                            )
                        }
                    </>
                )
            }
        </div>
    )

};

export default StepTwoContent;