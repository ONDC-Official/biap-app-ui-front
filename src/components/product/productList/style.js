import { makeStyles } from '@mui/styles';
import palette from "../../../utils/Theme/palette";

const useStyles = makeStyles({
    productContainer: {
        padding: '28px 54px !important'
    },
    productItemContainer: {
        cursor: 'pointer'
    },
    productCard: {
        boxShadow: "none !important",
        background: '#F5F5F5 !important',
        display: 'flex',
        height: '334px !important',
        borderRadius: '12px !important'
    },
    productImage: {
        margin: 'auto !important',
    },
    productNameTypo: {
        fontWeight: '600 !important',
        marginTop: '13px !important',
        // textAlign: 'center',
        // paddingLeft: '10px',
        paddingRight: '10px',
    },
    providerTypo: {
        marginTop: '2px !important',
        fontWeight: '500 !important',
        color: '#686868 !important'
    },
    divider: {
        height: '1px',
        backgroundColor: '#EDEDED !important',
        marginTop: '10px'
    },
    priceTypo: {
        fontWeight: '600 !important',
        lineHeight: '18px !important',
        marginTop: '12px !important'
    }
});

export default useStyles;