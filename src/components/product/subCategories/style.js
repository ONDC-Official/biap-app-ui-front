import { makeStyles } from '@mui/styles';
import palette from "../../../utils/Theme/palette";

const useStyles = makeStyles({
    categoriesContainer: {
        background: '#F9F9F9',
        display: 'flex',
        gap: '29px',
        padding: '16px !important',
        justifyContent: 'center'
    },
    categoryItem: {
        textAlign: 'center'
    },
    categoryItemImageContainer: {
        height: '108px',
        width: '108px',
        borderRadius: '108px',
        background: '#E7E7E7',
        display: 'flex',
        margin: 'auto'
    },
    categoryImage: {
        height: '78px',
        maxWidth: '78px',
        minWidth: '42px',
        margin: 'auto'
    },
    categoryNameTypo: {
        fontWeight: '600 !important',
        marginTop: '5px !important'
    },
    selectedCategory: {
        background: '#EBEBEB !important',
        border: `1px solid ${palette.secondary.main}`
    }
});

export default useStyles;