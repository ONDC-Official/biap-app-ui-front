import { makeStyles } from '@mui/styles';
import palette from "../../../utils/Theme/palette";

const useStyles = makeStyles({
    footerContainer: {
        paddingTop: '54px',
        paddingLeft: '122px',
        paddingRight: '122px',
        backgroundColor: palette.primary.main,
        position: 'relative',
        overflow: 'hidden'
    },
    footerAppLogo: {
        height: "40px"
    },
    contactUsContainer: {
        marginTop: "30px"
    },
    contactUsItem: {
        display: 'flex',
        marginTop: "20px"
    },
    itemDetailsContainer: {
        marginLeft: '11px'
    },
    itemDetailsLabel: {
        fontWeight: 400,
        lineHeight: '20px'
    },
    itemDetailsValue: {
        marginTop: '5px',
        fontWeight: 700
    },
    appsContainer: {
        marginTop: "30px"
    },
    appsItem: {
        display: 'flex',
        marginTop: "20px"
    },
    appImages: {
        marginRight: '10px'
    },
    divider: {
        height: '1px',
        backgroundColor: palette.primary.light,
        marginTop: '10px'
    },
    categoryDivider: {
        height: '3px',
        backgroundColor: palette.primary.light,
        marginTop: '10px',
        width: '180px'
    },
    serviceDivider: {
        height: '3px',
        backgroundColor: palette.primary.light,
        marginTop: '10px',
        width: '140px'
    },
    listContainer: {
        marginTop: '26px',
        paddingLeft: '1rem'
    },
    listStyle: {
        listStyle: 'disc',
        color: palette.common.white,
        marginBottom: '10px'
    },
    circleOne: {
        height: '467px',
        width: '467px',
        border: `1px solid ${palette.secondary.main}`,
        borderRadius: '467px',
        position: 'absolute',
        top: '-120px',
        right: '-150px'
    },
    circleTwo: {
        height: '434px',
        width: '434px',
        backgroundColor: palette.secondary.main,
        borderRadius: '434px',
        position: 'absolute',
        top: '-105px',
        right: '-135px'
    },
    copyright: {
        marginTop: '18px !important',
        marginBottom: '20px !important'
    }
});

export default useStyles;