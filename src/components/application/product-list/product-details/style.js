import { makeStyles } from "@mui/styles";
import palette from "../../../../utils/Theme/palette";

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
  },
  moreImages: {
    marginRight: 8,
    height: 95,
    width: 95,
    border: "1px solid",
    borderColor: "lightgrey",
    borderRadius: 12,
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  moreImage: {
    borderRadius: 12,
    height: 80,
    objectFit: "contain",
  },
});

export default useStyles;
