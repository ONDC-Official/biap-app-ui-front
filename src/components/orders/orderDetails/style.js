import { makeStyles } from '@mui/styles';
import palette from "../../../utils/Theme/palette";

const useStyles = makeStyles({
    orderDetailsContainer: {
        padding: '45px 52px'
    },
    divider: {
        height: '1px',
        backgroundColor: '#E0E0E0 !important',
        marginTop: '20px',
        marginBottom: '20px',
    },
    statusChip:{
        float: 'right',
        marginRight: '5px !important',
    },

    marginBottom12:{
        marginBottom: '12px !important'
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
        borderRadius: '10px !important'
    },

    customerDetailsTypo:{
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
        flex: 1,
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
    },











    summaryCard: {
        borderRadius: "16px !important",
        background: `${palette.common.white} !important`,
        boxShadow: `0px 0px 0px 0px rgba(0, 0, 0, 0.05), 0px 6px 13px 0px rgba(0, 0, 0, 0.05), 0px 24px 24px 0px rgba(0, 0, 0, 0.04), 0px 54px 33px 0px rgba(0, 0, 0, 0.03), 0px 97px 39px 0px rgba(0, 0, 0, 0.01), 0px 151px 42px 0px rgba(0, 0, 0, 0.00) !important`,
        padding: "16px 20px !important",
    },
    summaryItemContainer: {
        display: "flex",
        marginBottom: "10px",
    },
    summaryDeliveryItemContainer: {
        display: "flex",
        marginBottom: "10px",
    },
    summaryQuoteItemContainer: {
        display: "flex",
        marginBottom: "3px",
    },
    summaryItemLabel: {
        flex: 1,
        fontSize: "13px !important",
        fontWeight: "600 !important",
        marginTop: "20px !important",
    },
    summaryDeliveryLabel: {
        flex: 1,
        fontSize: "13px !important",
        fontWeight: "600 !important",
    },
    summaryCustomizationLabel: {
        flex: 1,
        color: "#A2A6B0 !important",
        fontSize: "12px !important",
        fontWeight: "600 !important",
        marginLeft: "20px !important",
    },
    summaryItemPriceLabel: {
        flex: 1,
        fontSize: "12px !important",
        fontWeight: "600 !important",
        marginLeft: "10px !important",
    },
    summaryItemDiscountLabel: {
        flex: 1,
        color: "green",
        fontSize: "12px !important",
        fontWeight: "600 !important",
        marginLeft: "10px !important",
    },
    summaryCustomizationDiscountLabel: {
        flex: 1,
        color: "#b1e3b1",
        fontSize: "12px !important",
        fontWeight: "600 !important",
        marginLeft: "10px !important",
    },
    summaryItemTaxLabel: {
        flex: 1,
        color: "red",
        fontSize: "12px !important",
        fontWeight: "600 !important",
        marginLeft: "10px !important",
    },
    summaryCustomizationTaxLabel: {
        flex: 1,
        color: "#eb9494",
        fontSize: "12px !important",
        fontWeight: "600 !important",
        marginLeft: "30px !important",
    },
    summaryCustomizationPriceLabel: {
        flex: 1,
        color: "#A2A6B0 !important",
        fontSize: "12px !important",
        fontWeight: "600 !important",
        marginLeft: "30px !important",
    },
    summaryItemPriceValue: {
        width: "100px !important",
        textAlign: "right",
        fontSize: "12px !important",
        fontWeight: "600 !important",
    },
    summaryCustomizationPriceValue: {
        color: "#A2A6B0 !important",
        width: "100px !important",
        textAlign: "right",
        fontSize: "12px !important",
        fontWeight: "600 !important",
    },
    subTotalLabel: {
        flex: 1,
        fontWeight: "600 !important",
    },
    summarySubtotalContainer:{
        display: "flex",
        marginBottom: "0px !important",
        marginTop: '20px !important'
    },
    subTotalValue: {
        width: "100px !important",
        textAlign: "right",
        fontWeight: "600 !important",
    },
    orderTotalDivider: {
        height: "1px",
        backgroundColor: "#CACDD8 !important",
        marginTop: "20px",
        marginBottom: "15px",
    },
    proceedToBuy: {
        marginTop: "8px !important",
    },
});

export default useStyles;