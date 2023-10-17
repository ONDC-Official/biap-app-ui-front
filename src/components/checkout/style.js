import { makeStyles } from "@mui/styles";
import palette from "../../utils/Theme/palette";

const useStyles = makeStyles({
  header: {
    background: palette.common.white,
    padding: "20px 100px 15px 100px !important",
  },
  headerTypo: {
    fontWeight: "600 !important",
    lineHeight: "18px !important",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  bodyContainer: {
    background: "#F9F9F9 !important",
    padding: "20px 100px !important",
    // height: '100 !important'
  },
  stepRoot: {
    marginTop: "24px !important",
    borderBottom: "1px solid #C8C8C8",
  },
  stepContent: {
    borderLeft: "none !important",
    padding: "32px !important",
    marginLeft: "16px !important",
  },
  stepContentHidden: {
    borderLeft: "none !important",
    padding: "16px !important",
    marginLeft: "16px !important",
  },
  stepLabel: {
    alignItems: "start !important",
    "& .MuiStepLabel-labelContainer": {
      marginLeft: "16px !important",
    },
  },
  labelTypo: {
    fontWeight: "600 !important",
    lineHeight: "20px !important",
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
  summaryItemQuantityLabel: {
    flex: 1,
    fontSize: "12px !important",
    fontWeight: "600 !important",
  },
  summaryItemQuantityValue: {
    width: "120px !important",
    textAlign: "right",
    fontSize: "12px !important",
    fontWeight: "600 !important",
  },
  marginBottom10: {
    marginBottom: '10px !important'
  },
  marginTop10: {
    marginTop: '10px !important'
  },
  marginTop20: {
    marginTop: '20px !important'
  },
  summaryCustomizationPriceValue: {
    color: "#A2A6B0 !important",
    width: "100px !important",
    textAlign: "right",
    fontSize: "12px !important",
    fontWeight: "600 !important",
  },
  summaryItemValue: {
    width: "100px !important",
    textAlign: "right",
    fontSize: "13px !important",
    fontWeight: "600 !important",
  },
  customizationValue: {
    width: "100px !important",
    textAlign: "right",
    color: "#A2A6B0 !important",
  },
  summaryItemLabelDescription: {
    color: "#A2A6B0 !important",
    marginTop: "2px !important",
    flex: 1,
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
  outOfStockDivider: {
    height: "1px",
    backgroundColor: "#CACDD8 !important",
    marginTop: "20px",
    marginBottom: "20px",
  },
  divider: {
    height: "1px",
    backgroundColor: "#CACDD8 !important",
    marginTop: "20px",
    // marginBottom: "20px",
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
