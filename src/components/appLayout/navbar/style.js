import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    headerContainer: {
        display: 'flex',
        padding: '18px 55px 16px 55px !important'
    },
    appLogo: {
        height: "40px",
        width: '100px',
        cursor: "pointer"
    },
    addressContainer: {
        display: 'flex',
        marginLeft: '20px'
    },
    addressTypo: {
        marginLeft: '4px',
        marginRight: '6px'
    },
    inputContainer: {
        flex: 1,
        marginLeft: '14px',
        marginRight: '80px'
    },
    inputForm: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        borderRadius: '58px',
        height: '43px'
    },
    searchIcon: {
        padding: '10px'
    },
    inputBase: {
        flex: 1
    },
    listIcon: {
        padding: '10px'
    },
    favourite: {
        display: 'flex'
    },
    favouriteTypo: {
        marginLeft: '5px',
        marginTop: '3px'
    },
    cart: {
        display: 'flex',
        marginLeft: '22px',
        marginRight: '22px'
    },
    cartTypo: {
        marginLeft: '5px',
        marginTop: '3px'
    },
    user: {
        display: 'flex'
    },
    userTypo: {
        marginLeft: '5px',
        marginTop: '3px'
    },
});

export default useStyles;