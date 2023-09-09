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
    marginBottom: "14px",
  },
  summaryItemLabel: {
    flex: 1,
    fontSize: "13px !important",
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
  divider: {
    height: "1px",
    backgroundColor: "#CACDD8 !important",
    marginTop: "20px",
    marginBottom: "20px",
  },
  orderTotalDivider: {
    height: "1px",
    backgroundColor: "#CACDD8 !important",
    marginTop: "40px",
    marginBottom: "15px",
  },
  proceedToBuy: {
    marginTop: "8px !important",
  },
});

export default useStyles;
