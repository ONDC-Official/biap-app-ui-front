import { makeStyles } from '@mui/styles';
import palette from "../../../utils/Theme/palette";

const useStyles = makeStyles({
    addressFormLabelTypo: {
        fontWeight: '600 !important',
        lineHeight: '20px !important',
    },
    formLabel: {
        fontWeight: '600 !important',
        lineHeight: '20px !important',
        marginBottom: '32px !important'
    },

    selectAddressRadioContainer: {
        // display: 'flex !important'
        marginTop: '12px !important',
        marginLeft: '24px !important',
        padding: '12px 20px !important',
        border: `1px solid ${palette.primary.main}`,
        background: `${palette.common.white} !important`,
        borderRadius: '8px !important'
    },
    formControlLabel: {
        width: '100% !important',
        alignItems: 'center !important',
        marginLeft: '0px !important',
        "& .MuiFormControlLabel-label": {
            marginLeft: '24px !important',
            "&.MuiTypography-root": {
                flex: 1
                // marginBottom: '5px !important'
            }
        },
        "& .MuiRadio-root": {
            // marginTop: '2px !important'
            width: '20px !important'
        }
    },
    addressTypoContainer: {
        display: 'flex',
        gap: '13px',
        // padding: '0px 5px !important'
    },
    addressNameTypo: {
        fontSize: '16px !important',
        fontWeight: '600 !important',
        lineHeight: '20px !important',
        display: 'flex',
        alignItems: 'center !important',
        width: '100px',
    },
    addressTypo: {
        flex: 1,
    },
    addressActionContainer: {
        width: '100px',
        margin: 'auto',
        textAlign: 'right'
    },
    addAddress: {
        border: `1px dashed ${palette.primary.main} !important`,
        background: `${palette.primary.light} !important`,
        marginTop: '12px !important',
        marginLeft: '24px !important',
        borderRadius: '8px',
        padding: '16px !important'
    },
    addAddressTypo: {
        textAlign: 'center',
        fontSize: '16px !important',
        fontWeight: '600 !important',
        lineHeight: '24px !important',
    },
    addAddressIcon: {
        marginRight: '8px !important',
        height: '20px !important',
        width: '20px !important',
    },
    pickupBillingAddress: {
        marginTop: '20px !important',
        display: 'flex'
    },
    billingTypo: {
        marginLeft: '8px !important'
    },




    editAddress: {
        float: 'right'
    },
    labelTypo: {
        fontWeight: '600 !important',
        lineHeight: '20px !important',
    },
    addressHeaderTypo: {
        marginTop: '24px !important',
        marginBottom: '16px !important',
        fontSize: '16px !important',
        fontWeight: '600 !important',
        lineHeight: '20px !important',
    },
    addressTextTypo: {
        marginBottom: '3px !important',
        fontSize: '16px !important',
        fontWeight: '400 !important',
        lineHeight: '20px !important',
    },
});

export default useStyles;