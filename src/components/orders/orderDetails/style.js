import { makeStyles } from '@mui/styles';
import palette from "../../../utils/Theme/palette";

const useStyles = makeStyles({
    orderDetailsContainer: {
        padding: '45px 52px'
    },
    divider: {
        height: '1px',
        backgroundColor: '#E0E0E0 !important',
        marginTop: '36px',
        marginBottom: '32px',
    },

    orderSummaryCard: {
        padding: '26px 16px !Important',
        borderRadius: '16px !important',
        boxShadow: '0px 0px 0px 0px rgba(0, 0, 0, 0.05), 0px 6px 13px 0px rgba(0, 0, 0, 0.05), 0px 24px 24px 0px rgba(0, 0, 0, 0.04), 0px 54px 33px 0px rgba(0, 0, 0, 0.03), 0px 97px 39px 0px rgba(0, 0, 0, 0.01), 0px 151px 42px 0px rgba(0, 0, 0, 0.00) !Important'
    },
    orderNumberTypo: {
        fontWeight: '400 !important',
        lineHeight: '20px !important',
    },
    orderNumberTypoBold: {
        fontWeight: '600 !important'
    },
    orderOnTypo: {
        color: '#8A8A8A',
        fontWeight: '500 !important',
        marginTop: '7px !important'
    },
    orderSummaryDivider: {
        height: '1px',
        backgroundColor: '#E0E0E0 !important',
        marginTop: '16px',
        marginBottom: '26px',
    },
    timelineDot: {
        padding: '0px !important',
        margin: '7px 0px !important'
    },
    timelineIcon: {
        height: '20px !important',
        width: '20px !important',
    },
    dottedConnector: {
        borderLeft: '2px dashed rgba(0, 0, 0, 0.10) !important',
        background: '#fff !important'
    },
    timelineContentHeaderTypo: {
        fontSize: '16px !important',
        fontWeight: '500 !important'
    },
    timelineContentHeaderTimeTypo: {
        fontWeight: '500 !important',
        marginLeft:'8px !important',
        color: '#8A8A8A !important'
    },

    map:{
        width: '100% !important',
        height: '483px !important',
    },

    customerDetailsTypo:{
        fontWeight: '600 !important'
    },
    summaryItemContainer: {
        display: 'flex',
        marginBottom: '14px'
    },
    summaryItemLabel: {
        flex: 1,
        fontSize: '13px !important',
        fontWeight: '600 !important'
    },
    summaryItemValue: {
        width: '150px !important',
        textAlign: 'right',
        fontSize: '13px !important',
        fontWeight: '600 !important'
    },
    summaryItemLabelDescription: {
        color: "#A2A6B0 !important",
        marginTop: '2px !important',
        maxWidth: '300px !important',
    },
    itemSummaryHeaderContainer:{
        display: 'flex',
        marginBottom: '17px !important'
    },
    itemSummaryHeaderLabel: {
        flex: 1,
        fontWeight: '600 !important',
        color: '#8A8A8A !important'
    },
    itemSummaryHeaderValue: {
        width: '150px !important',
        textAlign: 'right',
        fontWeight: '600 !important',
    },
    itemContainer: {
        display: 'flex',
        marginBottom: '17px !important'
    },
    itemLabel: {
        flex: 1,
        fontSize: '14px !important',
        fontWeight: '600 !important',
        color: '#686868 !important'
    },
    itemValue: {
        width: '150px !important',
        textAlign: 'right',
        color: `${palette.primary.main} !important`,
        fontSize: '14px !important',
        fontWeight: '600 !important',
    },

    customerDetailsLabel: {
        fontSize: '16px !important',
        fontWeight: '600 !important',
        lineHeight: '20px !important',
        marginBottom: '8px !important'
    },
    customerDetailsValue: {
        fontSize: '16px !important',
        fontWeight: '400 !important',
        lineHeight: '26px !important'
    },
    downloadInvoiceButton: {
        marginRight: '12px !important'
    },
    summaryItemActionContainer: {
        marginTop: '30px !important',
        display: 'flex',
        gap: '10px !important',
        marginBottom: '17px !important'
    },
    helpButton: {
        flex: 1
    },
    cancelOrderButton: {
        flex: 1
    },
    customizationValue: {
        width: "100px !important",
        textAlign: "right",
        color: "#A2A6B0 !important",
    },
    customizationLabel: {
        color: "#A2A6B0 !important",
        marginTop: "2px !important",
        flex: 1,
    },
    totalLabel: {
        flex: 1,
        fontSize: "16px !important",
        fontWeight: "600 !important",
    },
    totalValue: {
        width: "100px !important",
        textAlign: "right",
        fontWeight: "600 !important",
    },
    actionButtons:{
        float: 'right',
        marginLeft: '12px !important',
        border: '1px solid rgba(0, 0, 0, 0.22) !important'
    }
});

export default useStyles;