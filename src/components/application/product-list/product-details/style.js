import { makeStyles } from "@mui/styles";
import palette from "../../../../utils/Theme/palette";

const moreImageContainer = (size, borderColor) => ({
  height: size,
  width: size,
  border: "1px solid",
  borderColor: borderColor,
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
});

const useStyles = makeStyles({
  breadCrumbs: {
    backgroundColor: palette.background.paper,
    height: 70,
    display: "flex",
    alignItems: "center",
    paddingLeft: 40,
    color: "grey",
  },
  detailsContainer: {
    backgroundColor: "#f9f9f9",
    position: "relative",
    paddingBottom: "6rem",
  },
  imgContainer: {
    height: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  productImg: {
    height: 500,
    marign: "auto",
  },
  moreImagesContainer: {
    display: "flex",
    justifyContent: "center",
    overflowX: "auto",
  },
  moreImages: {
    ...moreImageContainer(95, "lightgrey"),
    marginRight: 14,
    borderRadius: 12,
    padding: 6,
    backgroundColor: "#ffffff",
  },
  greyContainer: {
    ...moreImageContainer("100%", "#e7e7e7"),
    backgroundColor: "#e7e7e7",
    borderRadius: 6,
  },
  moreImage: {
    height: 80,
    objectFit: "contain",
  },
  productCard: {
    marginTop: 40,
    width: 560,
    padding: "12px 16px",
    display: "flex",
    flexDirection: "column",
  },
  sizeContainer: {
    height: 38,
    width: 38,
    borderRadius: 9,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
    cursor: "pointer",
    border: "1px solid #BEBCBD",
  },
  activeSizeContainer: {
    height: 38,
    width: 38,
    borderRadius: 9,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
    backgroundColor: "#008ECC",
    cursor: "pointer",
  },
  availableColors: {
    ...moreImageContainer(75, "lightgrey"),
    marginRight: 12,
    borderRadius: 12,
    padding: 6,
    backgroundColor: "#ffffff",
    minWidth: 75,
  },
  availableColorImg: { height: 55, objectFit: "contain" },
  productDetailsSection: {
    backgroundColor: palette.background.paper,
    padding: "24px 0px",
  },
  productDetailsLeft: {
    paddingLeft: "60px",
  },
  keyValueContainer: {
    marginTop: "10px",
  },
  key: {
    textTransform: "capitalize",
    fontWeight: 500,
    fontFamily: "Inter !important",
  },
  value: {
    fontWeight: 500,
  },
  outOfStock: {
    margin: "12px 0 24px 0",
    padding: "6px",
    backgroundColor: "#FC95953D",
    borderRadius: 8,
  },
  customization: {
    border: "2px solid rgba(190, 188, 189, 0.46);",
    borderRadius: 9,
    marginRight: 8,
    padding: "6px 12px",
    textAlign: "center",
    cursor: "pointer",
    marginBottom: 8,
    position: "relative",
    textTransform: "capitalize",
  },
  selectedCustomization: {
    textTransform: "capitalize",
    border: "2px solid #008ECC",
    background: "#008ECC",
    borderRadius: 9,
    marginRight: 8,
    padding: "6px 12px",
    textAlign: "center",
    cursor: "pointer",
    marginBottom: 8,
    position: "relative",
  },
  cross: {
    position: "absolute",
    top: 2,
    right: 3,
    fontSize: "12px !important",
    color: "#CCCCCC",
  },
  square: {
    backgroundColor: "transparent",
    border: "1px solid #008001",
    width: 18,
    height: 19,
    marginRight: 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    backgroundColor: "#008001",
    borderRadius: "50%",
    height: "10px",
    width: "10px",
  },
  emptySpace: {
    height: "80vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  editContainer: {
    width: 500,
    padding: "8px 16px",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    flex: 1,
  },
  editDetails: {
    flex: 1,
    paddingBottom: "50px",
    overflow: "scroll",
    scrollbarWidth: "thin",
    "&::-webkit-scrollbar": {
      width: "0px",
    },
  },
  editBtns: {
    height: 70,
    background: "#ffffff",
    display: "flex",
    alignItems: "center",
    padding: "0 12px",
    position: "absolute",
    width: "100%",
    left: 0,
    bottom: 0,
  },
  formControlLabel: {
    width: "100% !important",
    alignItems: "center !important",
    marginLeft: "0px !important",
    marginBottom: "8px !important",
    "& .MuiFormControlLabel-label": {
      // marginLeft: '24px !important',
      "&.MuiTypography-root": {
        flex: 1,
        // marginBottom: '5px !important'
      },
    },
    "& .MuiRadio-root": {
      // marginTop: '2px !important'
      width: "20px !important",
    },
  },
  radioTypoContainer: {
    display: "flex",
    // gap: '13px',
    // padding: '0px 5px !important'
  },
  sizeChart: {
    color: palette.primary.main,
    marginLeft: '20px !important',
    cursor: 'pointer'
  },
  sizeChartContainer: {

  },
  sizeChartImage: {

  }
});

export default useStyles;
