import { makeStyles } from '@mui/styles';
import palette from "../../../utils/Theme/palette";

const useStyles = makeStyles({
    orderItemContainer: {
        border: `1px solid #EDEDED`,
        borderRadius: '12px !important',
    },
    orderCard: {
        boxShadow: "none !important",
        background: '#F5F5F5 !important',
        display: 'flex',
        minHeight: '250px !important',
        // width: '314px !important',
        borderRadius: '12px 0px 0px 12px !important'
    },
    orderImage: {
        margin: 'auto !important',
        maxHeight: '95%',
        maxWidth: '95%',
    },
    orderDetailsTypo: {
        padding: '37px 16px 26px 16px',
        position: 'relative'
    },
    deliveryTimeTypo: {
        marginLeft: '6px !important',
        color: '#686868 !important',
        fontWeight: '500 !important',
        lineHeight: '18px !important',
    },
    deliveryTimeTypoValue: {
        fontWeight: '500 !important',
        lineHeight: '18px !important',
    },
    statusChip: {
        float: 'right'
    },
    addressTypo: {
        marginTop: '12px !important',
        fontWeight: '500 !important',
        color: '#686868 !important',
        lineHeight: '18px !important'
    },
    itemNameTypo: {
        marginTop: '10px !important',
        fontWeight: '600 !important',
        lineHeight: '20px !important'
    },
    vegNonVegIcon: {
        marginRight: '5px !important',
        // marginLeft: '10px !important',
        height: '16px !important',
        width: '16px !important',
    },
    itemTypo: {
        marginRight: '16px !important',
    },
    priceTypo: {
        marginTop: '16px !important'
    },
    priceTypoLabel: {
        marginTop: '12px !important',
        fontWeight: '500 !important',
        color: '#686868 !important',
        lineHeight: '18px !important'
    },
    orderDateTime: {
        marginTop: '14px !important',
        fontWeight: '500 !important',
        color: '#686868 !important',
        lineHeight: '18px !important'
    },
    viewSummaryButton: {
        float: 'right',
    },
    trackOrderButton: {
        float: 'right',
        marginLeft: '16px !important'
    },
    downloadInvoiceButton: {
        float: 'right',
        marginLeft: '16px !important'
    }
});

export default useStyles;