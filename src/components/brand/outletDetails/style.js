import { makeStyles } from '@mui/styles';
import palette from "../../../utils/Theme/palette";

const useStyles = makeStyles({
    outletDetailsContainer: {
        padding: '48px 54px 28px 54px !important'
    },
    outletDetailsHeaderContainer: {

    },
    outletDetailsCard: {
        boxShadow: "none !important",
        background: '#F5F5F5 !important',
        display: 'flex',
        height: '416px !important',
        borderRadius: '16px !important',
        position: 'relative !important'
    },
    outletContactInfoCard: {
        boxShadow: "0px 0px 0px 0px rgba(0, 0, 0, 0.05), 0px 6px 13px 0px rgba(0, 0, 0, 0.05), 0px 24px 24px 0px rgba(0, 0, 0, 0.04), 0px 54px 33px 0px rgba(0, 0, 0, 0.03), 0px 97px 39px 0px rgba(0, 0, 0, 0.01), 0px 151px 42px 0px rgba(0, 0, 0, 0.00) !important",
        background: '#fff !important',
        // display: 'flex',
        minHeight: '249px !important',
        borderRadius: '16px !important',
        position: 'relative !important',
        padding: '24px !important'
    },
    outletImage: {
        width: '100%'
    },
    detailsContainer: {
      marginTop: '21px !important'
    },
    descriptionTypo: {
        marginTop: '16px !important'
    },
    outletNameTypo: {
        marginTop: '12px !important',
        fontWeight: '600 !important',
        lineHeight: '18px !important'
    },
    outletOpeningTimeTypo: {
        marginTop: '10px !important',
        fontWeight: '600 !important',
        lineHeight: '18px !important',
        color: '#4A4A4A',
        '& $isOpen': {
            color: `${palette.success.main} !important`,
            marginRight: '5px !important'
        }
    },
    isOpen: {},
    actionButtonContainer: {
      marginTop: '24px !important',
    },
    actionButton: {
        padding: '10px 56px 10px 54px !important',
        marginRight: '8px !important'
    },
    contactNumbers: {
        color: `${palette.success.main} !important`,
        marginTop: '8px !important',
        fontWeight: '600 !important',
        lineHeight: '18px !important',
    },
    directionTypo: {
      marginTop: '24px !important'
    },
    mapImage: {
        width: '100% !important',
        height: '375px !important',
        marginTop: '12px !important'
    },
    seeAllOutletTypo: {
        marginTop: '12px !important',
        fontWeight: '600 !important',
        lineHeight: '18px !important',
        cursor: 'pointer'
    },

    divider: {
        height: '1px',
        backgroundColor: '#E0E0E0 !important',
        marginTop: '24px',
        marginBottom: '24px',
    }
});

export default useStyles;