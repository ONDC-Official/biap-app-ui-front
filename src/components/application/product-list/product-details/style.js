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
    height: 50,
    display: "flex",
    alignItems: "center",
    paddingLeft: 40,
    color: "grey",
  },
  detailsContainer: {
    backgroundColor: palette.background.main,
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
    border: "1px solid #BEBCBD",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
    cursor: "pointer",
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
  },
  value: {
    fontWeight: 500,
  },
});

export default useStyles;
