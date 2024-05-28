import { makeStyles } from "@mui/styles";
import ThemePalette from "../../../utils/Theme/theme.json";

const useStyles = makeStyles({
  offersContainer: {
    width: "100%",
    display: "flex",
    marginTop: 24,
    position: "relative",
    padding: "0px 11rem",
  },
  offersRow: {
    display: "flex",
    gap: "18px",
    overflow: "auto",
    paddingBottom: "10px",
    "&::-webkit-scrollbar": {
      display: "none",
    },
    //  overflow: "hidden",
    transition: "transform 0.5s ease",
    scrollBehavior: "smooth",
  },
  offerCard: {
    width: "max-content",
    height: "max-content",
    border: "1.5px solid #e8e8e8",
    borderRadius: 24,
    display: "flex",
    alignItems: "center",
    padding: "20px 30px",
    //  marginRight: 20,
  },
  left: {
    width: "max-content",
    minWidth: 150,
  },
  right: {
    width: 100,
    height: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "end",
    position: "relative",
  },
  offerTitle: {
    fontSize: 14,
    margin: 0,
  },
  offerText: {
    fontSize: 24,
    fontWeight: "600",
    margin: 0,
    textTransform: "capitalize",
    marginBottom: 10,
  },
  brandImage: {
    height: 80,
    width: 80,
  },
  leftIcon: {
    position: "absolute",
    left: 100,
    top: '30%',
  },
  rightIcon: {
    position: "absolute",
    right: 100,
    top: '30%',
  },

  offerCardContainer: {
    width: "max-content",
    height: "max-content",
    border: "1.5px solid #e8e8e8",
    borderRadius: 24,
    display: "flex",
    alignItems: "center",
  },
  offerIconContainer: {
    backgroundColor: ThemePalette.primaryColorLight,
    padding: '16px',
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
  },
  offerTextContainer: {
    padding: '16px',
    flex: 1,
    '& .offerText': {
      marginBottom: '0px !important'
    }
  },
  offerCode: {
    fontSize: 24,
    fontWeight: "600",
    margin: 0,
    textTransform: "capitalize",
  }
});

export default useStyles;
