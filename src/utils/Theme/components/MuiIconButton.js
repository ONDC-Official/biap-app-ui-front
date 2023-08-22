import palette from '../palette';
const MuiIconButton = {
    styleOverrides: {
        root: {
            // height: '44px',
            // borderRadius: '3px',
            // border: '1px solid rgba(0, 0, 0, 0.10)'
            '&:hover': {
                border: '1px solid rgba(0, 0, 0, 0.10)'
            }
        },
        colorInherit: {
            background: palette.common.white,
            color: palette.common.black,
            "& svg": {
                stroke: palette.common.black,
            },
            "& svg g": {
                stroke: palette.common.black,
            },
            "& svg path": {
                stroke: palette.common.black,
            }
        },
        colorPrimary: {
            background: palette.primary.main,
            color: palette.common.white
        },
        colorSecondary: {
            background: palette.secondary.main,
            color: palette.common.white
        },
        colorError: {
            background: palette.error.main,
            color: palette.common.white
        },
        colorSuccess: {
            background: palette.success.main,
            color: palette.common.white
        },
        colorWarning: {
            background: palette.warning.main,
            color: palette.common.white
        },
        sizeSmall: {
            height: '33px',
            width: '33px',
        },
        sizeMedium: {
            height: '45px',
            width: '45px',
        },
        sizeLarge: {
            height: '57px',
            width: '57px',
        },

    }
};

export default MuiIconButton;
