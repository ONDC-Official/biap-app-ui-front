import palette from "../palette";
const MuiChip = {
    styleOverrides: {
        root: {
            // borderRadius: '6px !important',
            // height: '20px !important',
            // width: '20px',
            // border: '2px solid #979797'
            padding: '8px 20px'
        },
        outlinedPrimary: {
            backgroundColor: palette.primary.light
        },
        outlinedSecondary: {
            backgroundColor: palette.secondary.light
        },
        outlinedSuccess: {
            backgroundColor: palette.success.light
        },
        outlinedWarning: {
            backgroundColor: palette.warning.light
        },
        outlinedError: {
            backgroundColor: palette.error.light
        }
    }
};

export default MuiChip;
