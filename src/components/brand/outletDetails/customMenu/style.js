import { makeStyles } from "@mui/styles";
import palette from "../../../../utils/Theme/palette";

const useStyles = makeStyles({
  expandIcon: {
    height: "30px !important",
    width: "30px !important",
    "& g path": {
      fill: `${palette.common.black} !important`,
    },
  },
  divider: {
    height: "1px",
    backgroundColor: "#E0E0E0 !important",
  },

  itemNameTypo: {
    marginTop: "12px !important",
    fontWeight: "500 !important",
    lineHeight: "22px !important",
  },
  itemPriceTypo: {
    marginTop: "12px !important",
    fontWeight: "600 !important",
    lineHeight: "18px !important",
  },
  itemDescriptionTypo: {
    color: "#686868 !important",
    marginTop: "12px !important",
    fontWeight: "500 !important",
    lineHeight: "18px !important",
  },
  itemCard: {
    display: "flex",
    borderRadius: "16px !important",
    background: "#F5F5F5 !important",
    height: "152px !important",
    width: "100% !important",
    position: "relative !important",
    float: "right",
  },
  cardAction: {
    marginTop: "-27px",
    // width: '152px !important',
    float: "right",
  },
  addToCartIcon: {
    borderRadius: "60px !important",
    background: "#fff",
  },
  itemImage: {
    margin: "auto !important",
    height: "100% !important",
    width: "100% !important",
  },
  vegNonvegIcon: {
    position: "absolute !important",
    height: "20px !important",
    width: "20px !important",
    top: "8px",
    right: "8px",
  },
  progressBarContainer: {
    textAlign: "center !important",
    marginTop: "16px !important",
  },
  menuButtonContainer: {
    textAlign: "center",
    marginTop: "16px !important",
  },
  menuFloatingButton: {
    // position: "absolute !important",
    // bottom: 0
  },
  menuIcon: {
    marginRight: "10px !important",
    height: "29px !important",
    width: "29px !important",
  },
  dialogMenuName: {
    fontSize: "16px !important",
    fontWeight: "400 !important",
    lineHeight: "24px !important",
    cursor: "pointer",
    marginBottom: "24px !important",
    //   width: '350px !important'
  },
  isActiveMenu: {
    color: `${palette.primary.main} !important`,
    fontSize: "20px !important",
    fontWeight: "500 !important",
  },
  dialogMenuItemName: {
    fontSize: "16px !important",
    fontWeight: "400 !important",
    lineHeight: "24px !important",
    cursor: "pointer",
    marginBottom: "24px !important",
    marginLeft: "15px !important",
    width: "335px !important",
  },
  plusIcon: {
    background: `${palette.primary.light}`,
    marginLeft: "10px !important",
    borderRadius: "50px !important",
  },
  itemsCount: {
    float: "right",
    fontWeight: "600 !important",
  },
  qty: {
    borderRadius: "12px",
    border: "1px solid #196AAB",
    background: "#EAF6FF",
    marginRight: 14,
  },
  qtyIcon: {
    color: "#196AAB",
    cursor: "pointer",
  },
  loader: {
    textAlign: 'left !important',
    display: 'flex',
    borderBottom: "1px solid #E0E0E0",
    paddingBottom: '16px !important'
  }
});

export default useStyles;
