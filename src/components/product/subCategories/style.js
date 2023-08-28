import { makeStyles } from '@mui/styles';
import palette from "../../../utils/Theme/palette";

const useStyles = makeStyles({
    categoriesRootContainer: {
        background: '#F9F9F9',
    },
    categoriesContainer: {
        "& ul": {
            display: 'flex',
            gap: '29px',
            padding: '16px !important',
            justifyContent: 'center',
            "& li > .MuiPaginationItem-ellipsis": {
                // background: 'red !important',
                display: 'none',
                gap: '0px',
                marginLeft: '-29px !important',
                marginRight: '-29px !important'
            }
        },
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
        marginTop: '5px !important',
        maxWidth: '120px',
        height: '40px !important'
    },
    selectedCategory: {
        background: '#EBEBEB !important',
        border: `1px solid ${palette.secondary.main}`
    },
    actionButton: {
        border: '1px solid rgba(0, 0, 0, 0.14) !important'
    },
    pageEllipsisContainer: {

    }
});

export default useStyles;