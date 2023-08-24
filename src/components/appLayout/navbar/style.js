import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    headerContainer: {
        display: 'flex',
        padding: '18px 55px 16px 55px !important'
    },
    appLogo: {
        height: "40px !important",
        width: '100px !important',
        cursor: "pointer"
    },
    addressContainer: {
        cursor: 'pointer',
        display: 'flex',
        marginLeft: '20px !important'
    },
    addressTypo: {
        marginLeft: '4px !important',
        marginRight: '6px !important'
    },
    inputContainer: {
        flex: 1,
        marginLeft: '14px !important',
        marginRight: '80px !important'
    },
    inputForm: {
        padding: '2px 4px !important',
        display: 'flex !important',
        alignItems: 'center !important',
        borderRadius: '58px !important',
        height: '43px !important'
    },
    searchIcon: {
        padding: '10px !important'
    },
    inputBase: {
        flex: 1
    },
    listIcon: {
        padding: '10px !important'
    },
    favourite: {
        display: 'flex !important'
    },
    favouriteTypo: {
        marginLeft: '5px !important',
        marginTop: '3px !important'
    },
    cart: {
        display: 'flex !important',
        marginLeft: '22px !important',
        marginRight: '22px !important'
    },
    cartTypo: {
        marginLeft: '5px !important',
        marginTop: '3px !important'
    },
    user: {
        display: 'flex !important'
    },
    userTypo: {
        marginLeft: '5px',
        marginTop: '3px'
    },
});

export default useStyles;