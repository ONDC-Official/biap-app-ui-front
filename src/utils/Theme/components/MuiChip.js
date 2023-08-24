import palette from "../palette";
const MuiChip = {
    styleOverrides: {
        root: {
            borderRadius: '60px !important',
            color: '#222222',
            padding: '10px',
            fontSize: '14px',
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
        },
        deleteIcon: {
            "& g path": {
                fill: '#222222'
            }
        }
    }
};

export default MuiChip;
