import { makeStyles } from '@mui/styles';
import palette from "../../../utils/Theme/palette";

const useStyles = makeStyles({
    topBrandsContainer: {
        marginTop: '32px !important',
        overflow: 'hidden'
    },
    brandsContainer: {
        display: 'flex',
        gap: '25px',
        overflow: 'auto',
        paddingBottom: '10px',
        '&::-webkit-scrollbar': {
            display: 'none'
        }
    },
    paginationActionContainer:{
        display: 'flex',
        gap: '25px',
    },
    brandCard: {
        cursor: 'pointer',
        height: '171px !important',
        width: '171px !important',
        minWidth: '171px !important',
        borderRadius: '24.5px !important',
        background:'#F5F5F5 !important',
        display: 'flex',
        boxShadow: "none !important",
    },
    brandImage: {
        margin: 'auto !important',
        width: '100%'
    },
    dotsContainer: {
      textAlign: 'center'
    },
    dot: {
        height: '10px',
        width: '10px',
        backgroundColor: '#D9D9D9',
        borderRadius: '50%',
        display: 'inline-block',
        marginLeft: '5px'
    },
    selectedDot: {
        height: '10px',
        width: '20px',
        backgroundColor: palette.primary.main,
        borderRadius: '10px',
        display: 'inline-block',
        marginLeft: '5px'
    },
    categoriesContainer: {
        "& ul": {
            overflow: 'auto',
            display: 'flex',
            gap: '10px',
            // padding: '16px !important',
            justifyContent: 'center',
            "& li:has(.MuiPaginationItem-ellipsis)": {
                background: 'red !important',
                display: 'none'
            }
        },
        textAlign: 'center',
        // margin: 'auto'
    },
    isActive: {
        border: `2px solid ${palette.primary.main}`
    }
});

export default useStyles;