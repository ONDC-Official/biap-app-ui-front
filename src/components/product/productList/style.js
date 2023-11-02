import { makeStyles } from "@mui/styles";
import palette from "../../../utils/Theme/palette";

const useStyles = makeStyles({
  productContainer: {
    padding: "28px 54px !important",
  },
  productItemContainer: {
    cursor: "pointer",
  },
  productCard: {
    boxShadow: "none !important",
    background: "#F5F5F5 !important",
    display: "flex",
    height: "261px !important",
    borderRadius: "12px !important",
    position: "relative !important",
    "&:hover $productImage": {
      // filter: "blur(5px)",
    },
    "&:hover $buyNowButton": {
      display: "block !Important",
    },
  },
  buyNowButton: {
    display: "none !important",
    position: "absolute !important",
    bottom: 10,
    right: "50%",
    left: "50%",
    // marginRight: '20px !important',
    // marginLeft: '20px !important',
    width: "200px !important",
    transform: "translate(-50%, -50%)",
  },
  productImage: {
    margin: "auto !important",
    maxHeight: "95%",
    maxWidth: "95%",
    borderRadius: "5px",
  },
  cartIcon: {
    position: "absolute !important",
    top: 14,
    right: 18,
  },
  productNameTypo: {
    fontWeight: "600 !important",
    marginTop: "13px !important",
    // textAlign: 'center',
    // paddingLeft: '10px',
    paddingRight: "10px",
  },
  providerTypo: {
    marginTop: "2px !important",
    fontWeight: "500 !important",
    color: "#686868 !important",
  },
  divider: {
    height: "1px",
    backgroundColor: "#EDEDED !important",
    marginTop: "10px",
  },
  priceTypo: {
    fontWeight: "600 !important",
    lineHeight: "18px !important",
    marginTop: "12px !important",
  },
  catNameTypoContainer: {
    display: "flex",
  },
  catNameTypo: {
    flex: 1,
  },
  viewTypeButton: {
    borderRadius: "3px !important",
    padding: "11px 13px !important",
    marginLeft: "10px !important",
  },

  productItemContainerList: {
    border: `1px solid #EDEDED`,
    borderRadius: "12px !important",
  },
  productCardList: {
    boxShadow: "none !important",
    background: "#F5F5F5 !important",
    display: "flex",
    height: "280px",
    minHeight: "280px !important",
    // width: '314px !important',
    borderRadius: "12px 0px 0px 12px !important",
  },
  productDetailsTypo: {
    padding: "37px 16px 26px 16px",
    position: "relative",
  },
  productNameTypoList: {
    fontWeight: "600 !important",
  },
  providerTypoList: {
    marginTop: "5px !important",
    fontWeight: "500 !important",
    color: "#686868 !important",
  },
  priceTypoList: {
    fontWeight: "600 !important",
    lineHeight: "18px !important",
    marginTop: "20px !important",
  },
  descriptionTypoList: {
    marginTop: "16px !important",
    color: "#505050 !important",

    display: "-webkit-box",
    "-webkit-line-clamp": 2,
    "-webkit-box-orient": "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  footerActions: {
    position: "absolute",
    bottom: "16px",
    width: "calc(100% - 32px) !important",
  },
  addToCartBtn: {
    float: "right",
    marginLeft: "8px !important",
    width: "195px",
  },

  paginationContainer: {
    marginTop: "24px !important",
    marginBottom: "24px !important",
  },
  pagination: {
    "& ul": {
      justifyContent: "center !important",
    },
  },
});

export default useStyles;
