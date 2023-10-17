import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  headerContainer: {
    display: "flex",
    padding: "18px 55px 16px 55px !important",
  },
  appLogo: {
    height: "40px !important",
    width: "100px !important",
    cursor: "pointer",
  },
  addressContainer: {
    cursor: "pointer",
    display: "flex",
    marginLeft: "20px !important",
  },
  addressTypo: {
    marginLeft: "4px !important",
    marginRight: "6px !important",
  },
  inputContainer: {
    flex: 1,
    marginLeft: "14px !important",
    marginRight: "80px !important",
  },
  inputForm: {
    padding: "2px 4px !important",
    display: "flex !important",
    alignItems: "center !important",
    borderRadius: "58px !important",
    height: "43px !important",
  },
  searchIcon: {
    padding: "10px !important",
  },
  inputBase: {
    flex: 1,
  },
  listIcon: {
    padding: "10px !important",
  },
  favourite: {
    display: "flex !important",
  },
  favouriteTypo: {
    marginLeft: "5px !important",
    marginTop: "3px !important",
  },
  cart: {
    display: "flex !important",
    marginLeft: "22px !important",
    marginRight: "22px !important",
  },
  cartTypo: {
    marginLeft: "5px !important",
    marginTop: "3px !important",
    color: "#ffffff",
    textDecoration: "none",
    display: "inline-block",
  },
  user: {
    display: "flex !important",
    cursor: 'pointer',
    gap: '5px'
  },
  userMenu: {
    '& .MuiPaper-root':{
      minWidth: '180px !important',
      top: '65px !important',
      borderRadius: '8px !important',
      border: '1px solid #E2E8F0 !important',
      boxShadow: '0px 10px 22px 0px rgba(45, 77, 108, 0.15) !important'
    }
  },
  userTypo: {
    marginTop: "3px !important",
  },
});

export default useStyles;
