import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    outletsContainer: {
        padding: '48px 54px 28px 54px !important'
    },
    brandTypoContainer: {

    },


    outletItemContainer: {
        cursor: 'pointer'
    },
    outletCard: {
        boxShadow: "none !important",
        background: '#F5F5F5 !important',
        display: 'flex',
        height: '249px !important',
        borderRadius: '12px !important',
        position: 'relative !important'
    },
    outletImage: {
        // margin: 'auto !important',
        width: '100%'
    },
    outletNameTypo: {
        fontWeight: '600 !important',
        marginTop: '13px !important',
        paddingRight: '10px',
    },
    divider: {
        height: '1px',
        backgroundColor: '#EDEDED !important',
        marginTop: '10px'
    },
    detailsContainer: {
        marginTop: '12px !important',
        display: 'flex'
    },
    timeTypo: {
        flex: 1,
        fontWeight: 500,
        fontSize: '16px !important'
    },
    distanceTypo: {
        flex: 1,
        textAlign: 'right',
        fontWeight: 600,
        fontSize: '14px !important'
    }
});

export default useStyles;