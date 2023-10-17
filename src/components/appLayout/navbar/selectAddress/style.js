import { makeStyles } from '@mui/styles';
import palette from "../../../../utils/Theme/palette";

const useStyles = makeStyles({
    formControlRoot: {
      display: 'block !important',


    },
    selectAddressRadioContainer: {
        display: 'flex !important',
        padding: '16px !important',
        borderRadius: '10px',
        "&:hover": {
            background: palette.primary.light
        }
    },
    formControlLabel: {
        flex: '1 !important',
        alignItems: 'start !important',
        marginLeft: '0px !important',
        "& .MuiFormControlLabel-label": {
            marginLeft: '24px !important',
            "& .MuiTypography-root": {
                marginBottom: '5px !important'
            }
        },
        "& .MuiRadio-root": {
            marginTop: '2px !important'
        }
    },
    addAddressContainer: {
        display: 'flex !important',
    },
    addAddress: {
        display: 'flex !important',
        cursor: 'pointer'
    },
    addIcon: {
        marginTop: '-2px !important',
        marginRight: '5px !important'
    },
    editAddressButton: {
        padding: '0px !important',
        height: '20px !important'
    }
});

export default useStyles;