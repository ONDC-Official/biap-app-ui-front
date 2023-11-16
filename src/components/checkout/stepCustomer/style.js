import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    signupButton: {
        width: '235px !important',
    },
    formControlLabelAlign: {
        marginLeft: '0px !important'
    },
    signupCheckbox: {
        padding: '0 9px !important',
        marginRight: '5px !important'
    },

    loggedInUser: {
        display: 'flex'
    },
    userAvatar: {
        width: '60px !important',
        height: '60px !important',
    },
    userTypo: {
        flex: 1,
        marginLeft: '10px !important',
        marginTop: '10px !important',
    },
    nameTypo: {
        fontSize: '16px !important',
        fontWeight: '600 !important',
        lineHeight: '18px !important',
    },
    emailTypo: {
        fontSize: '16px !important',
        fontWeight: '600 !important',
        lineHeight: '18px !important',
        marginTop: '5px !important'
    },
    userActionContainer: {
        marginTop: '24px !important'
    },
    labelTypo: {
        fontWeight: '600 !important',
        lineHeight: '20px !important',
    },
    userLabelTypo: {

    },
    nameLabelTypo: {
        marginTop: '24px !important',
        fontSize: '16px !important',
        fontWeight: '600 !important',
        lineHeight: '18px !important',
    },
    emailLabelTypo: {
        marginTop: '14px !important',
        fontSize: '16px !important',
        fontWeight: '600 !important',
        lineHeight: '18px !important',
    },
});

export default useStyles;