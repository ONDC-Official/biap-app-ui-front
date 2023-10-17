import { makeStyles } from '@mui/styles';
import palette from "../../../utils/Theme/palette";

const useStyles = makeStyles({
    paymentCard: {
        backgroundColor: 'rgba(242, 242, 242, 0.60) !important',
        boxShadow: 'none !important',
        border: '1px solid rgba(185, 185, 185, 0.16) !important',
        cursor: 'pointer',
        '&$activeCard': {
            border: `1px solid ${palette.primary.main} !important`,
        },
        position: 'relative',
        // textAlign: 'center !important'
    },
    activeCard: {},
    paymentImage: {
        width: '100% !important',
        height: '326px !important',
        "& rect": {
            width: '100% !important',
            height: '100% !important',
            strokeOpacity: '0',
            fill: "rgba(242, 242, 242, 0.60) !important"
        }
    },
    paymentTypo: {
        fontSize: '16px !important',
        fontWeight: '500 !important',
        lineHeight: '20px !important',
        textAlign: 'center',
        marginTop: '12px !important'
    },
    checkedIcon: {
        position: 'absolute',
        top: '8px',
        right: '8px',
    },
    nonClickable: {
        cursor: "not-allowed !important"
    }
});

export default useStyles;