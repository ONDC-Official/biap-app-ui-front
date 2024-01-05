import { makeStyles } from '@mui/styles';
import palette from "../../../utils/Theme/palette";

const useStyles = makeStyles({
    ordersContainer: {
        padding: '45px 52px'
    },
    orderHistoryTypo: {
        fontSize: '32px !important'
    },
    loaderContainer: {
        marginTop: '100px !important'
    },
    paginationContainer: {
        marginTop: '24px !important',
        // marginBottom: '24px !important',
    },
    pagination: {
        '& ul': {
            justifyContent: 'center !important'
        }
    }
});

export default useStyles;