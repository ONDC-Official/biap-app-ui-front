import { makeStyles } from '@mui/styles';
import palette from "../../../utils/Theme/palette";

const useStyles = makeStyles({
    popperContainerMultiselect: {
        background: palette.common.white,
        zIndex: '100 !important',
        marginTop: '5px !important',
        boxShadow: '0px 4px 10px 0px rgba(96, 96, 96, 0.20) !important',
        width: '250px !important',
        // borderRadius: '6px !important',
        // border: '1px solid var(--gray-300, #DEE2E7) !important'
    },
    menuPaper: {
        padding: '8px 16px !important',
        borderRadius: '6px !important',
        border: '1px solid var(--gray-300, #DEE2E7) !important'
    },
    formControlLabelAlign: {
        alignItems: 'flex-start !important',
        marginTop: '10px !important',
        wordBreak: 'break-all !important',
        marginLeft: '0px !important',
        "& .MuiFormControlLabel-label": {
            lineHeight: '22px !important',
            marginLeft: '12px !important',
        }
    },
    categoryCheckbox: {
        padding: '0 9px !important'
    },
    checkboxOptionsContainer: {
        maxHeight: '250px !important',
        overflowY: 'auto !important'
    },
    applyFilterButton: {
        float: 'right',
        marginLeft: '10px !important'
    },
    clearFilterButton: {
        float: 'right',
        marginLeft: '10px !important',
    },
    marginTop10: {
        marginTop: '10px !important'
    },
    marginBottom10: {
        marginBottom: '10px !important'
    },
    marginRight10: {
        marginRight: '10px !important'
    },
    filterName: {
        textTransform: 'capitalize'
    },
    downIcon: {
        marginLeft: '10px !important',
        height: '18px !important',
        width: '18px',
        "& g path": {
            fill: '#222222'
        }
    }
});

export default useStyles;