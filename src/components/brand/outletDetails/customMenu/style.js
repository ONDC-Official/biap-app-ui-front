import { makeStyles } from '@mui/styles';
import palette from "../../../../utils/Theme/palette";

const useStyles = makeStyles({
    expandIcon: {
        height: '30px !important',
        width: '30px !important',
        '& g path': {
            fill: `${palette.common.black} !important`
        }
    },
    divider: {
        height: '1px',
        backgroundColor: '#E0E0E0 !important',
    },

    itemNameTypo: {
        marginTop: '12px !important',
        fontWeight: '500 !important',
        lineHeight: '22px !important'
    },
    itemPriceTypo: {
        marginTop: '12px !important',
        fontWeight: '600 !important',
        lineHeight: '18px !important'
    },
    itemDescriptionTypo: {
        color: '#686868 !important',
        marginTop: '12px !important',
        fontWeight: '500 !important',
        lineHeight: '18px !important'
    },
    itemCard: {
        display: 'flex',
        borderRadius: '16px !important',
        background: '#F5F5F5 !important',
        height: '152px !important',
        width: '100% !important',
        position: 'relative !important',
        float: 'right'
    },
    cardAction: {
        marginTop: '-27px',
        // width: '152px !important',
        float: 'right'
    },
    addToCartIcon: {
        borderRadius: '60px !important',
        background: '#fff'
    },
    itemImage: {
        margin: 'auto !important'
    },
    vegNonvegIcon: {
        position: 'absolute !important',
        height: '20px !important',
        width: '20px !important',
        top: '8px',
        right: '8px',
    },
});

export default useStyles;