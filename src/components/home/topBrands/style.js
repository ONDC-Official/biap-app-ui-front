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
    brandCard: {
        height: '171px !important',
        width: '171px !important',
        minWidth: '171px !important',
        borderRadius: '24.5px !important',
        background:'#F5F5F5 !important',
        display: 'flex',
        boxShadow: "none !important",
    },
    brandImage: {
        margin: 'auto'
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
    }
});

export default useStyles;