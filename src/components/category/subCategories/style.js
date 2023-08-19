import { makeStyles } from '@mui/styles';
import palette from "../../../utils/Theme/palette";

const useStyles = makeStyles({
    subCatContainer: {
        // marginTop: '56px !important'
        padding: '56px 54px !important'
    },
    subCategoryItemContainer: {
        cursor: 'pointer'
    },
    subCategoryCard: {
        boxShadow: "none !important",
        background: '#F5F5F5 !important',
        display: 'flex',
        height: '245px !important',
    },
    subCatImage: {
        margin: 'auto !important',
    },
    subCatNameTypo: {
        fontWeight: '600 !important',
        marginTop: '13px !important',
        textAlign: 'center',
        paddingLeft: '10px',
        paddingRight: '10px',
    }
});

export default useStyles;