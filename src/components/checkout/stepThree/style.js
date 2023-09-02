import { makeStyles } from '@mui/styles';
import palette from "../../../utils/Theme/palette";

const useStyles = makeStyles({
    paymentCard: {
        boxShadow: 'none !important',
        border: '1px solid rgba(185, 185, 185, 0.16) !important',
        cursor: 'pointer',
        '&$activeCard': {
            border: `1px solid ${palette.primary.main} !important`,
        },
        position: 'relative'
    },
    activeCard: {},
    paymentImage: {
        width: '100%',
        height: '326px !important',
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
    }
});

export default useStyles;