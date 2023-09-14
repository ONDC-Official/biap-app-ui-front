import { makeStyles } from '@mui/styles';
import palette from "../../../utils/Theme/palette";

const useStyles = makeStyles({
    categoriesRootContainer: {
        background: '#F9F9F9',
    },
    categoriesContainer: {
        "& ul": {
            display: 'flex',
            gap: '16px',
            padding: '16px !important',
            justifyContent: 'center',
            "& li:has(.MuiPaginationItem-ellipsis)": {
                background: 'red !important',
                display: 'none'
            }
        },
    },
    categoryItem: {
        textAlign: 'center',
        cursor: 'pointer'
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
        height: '102px',
        maxWidth: '102px',
        minWidth: '42px',
        margin: 'auto',
        borderRadius: '50%'
    },
    categoryNameTypo: {
        fontWeight: '600 !important',
        marginTop: '5px !important',
        maxWidth: '120px',
        height: '40px !important'
    },
    selectedCategory: {
        background: '#EBEBEB !important',
        border: `2px solid ${palette.secondary.main}`,
        '& $categoryImage': {
            height: '98px',
            maxWidth: '98px',
        }
    },
    actionButton: {
        border: '1px solid rgba(0, 0, 0, 0.14) !important'
    },
    pageEllipsisContainer: {

    },
    previousIconContainer: {
        display: 'flex',
        gap: '29px'
    },
    allOptionsContainer: {
        textAlign: 'center',
        cursor: 'pointer'
    },
    allNameTypo: {
        fontWeight: '600 !important',
        marginTop: '8px !important',
        maxWidth: '50px',
        height: '40px !important'
    }
});

export default useStyles;