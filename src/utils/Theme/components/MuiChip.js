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
        filledPrimary: {
            backgroundColor: palette.primary.light,
            color: palette.primary.main
        },
        filledSecondary: {
            backgroundColor: palette.secondary.light,
            color: palette.secondary.main
        },
        filledSuccess: {
            backgroundColor: palette.success.light,
            color: palette.success.main
        },
        filledError: {
            backgroundColor: palette.error.light,
            color: palette.error.main
        },
        filledWarning: {
            backgroundColor: palette.warning.light,
            color: palette.warning.main
        },
        label: {
            padding: '0px 3px !important'
        },
        deleteIcon: {
            "& g path": {
                fill: '#222222'
            }
        }
    }
};

export default MuiChip;
