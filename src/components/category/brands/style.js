import { makeStyles } from '@mui/styles';
import palette from "../../../utils/Theme/palette";

const useStyles = makeStyles({
    brandContainer: {
        // marginTop: '56px !important'
        padding: '0px 54px 39px 54px !important'
    },
    brandItemContainer: {
        cursor: 'pointer'
    },
    brandCard: {
        boxShadow: "none !important",
        background: '#F5F5F5 !important',
        display: 'flex',
        height: '245px !important',
    },
    brandImage: {
        margin: 'auto !important',
        maxWidth: '100%'
    },
    brandNameTypo: {
        fontWeight: '600 !important',
        marginTop: '13px !important',
        textAlign: 'center',
        paddingLeft: '10px',
        paddingRight: '10px',
    }
});

export default useStyles;