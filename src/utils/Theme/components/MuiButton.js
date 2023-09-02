import palette from '../palette';
const MuiButton = {
    styleOverrides: {
        root: {
            height: '44px',
            padding: '10px 16px',
            borderRadius: '8px',
            textTransform: 'none !important'
        },
        outlined: {
            border: `1px solid rgba(0, 0, 0, 0.10)`,
            // color: palette.primary.main,
            backgroundColor: '#fff',
            '& svg path': {
                stroke: palette.common.black,
            },
            '&:hover': {
                backgroundColor: '#DCF2FF',
                color: palette.common.white,
                '& svg path': {
                    stroke: palette.common.white,
                }
            },

        },
        contained: {
            border: `1px solid rgba(0, 0, 0, 0.10)`,
            '& svg path': {
                stroke: palette.common.white,
            },
            '&:hover': {
                backgroundColor: '#DCF2FF',
                color: palette.common.black,
                '& svg path': {
                    stroke: palette.common.black,
                }
            }
        },
        outlinedPrimary: {
            border: `1px solid ${palette.primary.main}`,
            color: palette.primary.main,
            '& svg path': {
                stroke: palette.primary.main,
            },
            '&:hover': {
                backgroundColor: palette.primary.main,
                color: palette.common.white,
                '& svg path': {
                    stroke: palette.common.white,
                }
            }
        },
        containedPrimary: {
            border: `1px solid ${palette.primary.main}`,
            background: palette.primary.main,
            color: palette.common.white,
            '& svg path': {
                stroke: palette.common.white,
            }
        },
        outlinedSecondary: {
            border: `1px solid ${palette.secondary.main}`,
            color: palette.secondary.main,
            '& svg path': {
                stroke: palette.secondary.main,
            },
            '&:hover': {
                backgroundColor: palette.secondary.main,
                color: palette.common.white,
                '& svg path': {
                    stroke: palette.common.white,
                }
            }
        },
        containedSecondary: {
            border: `1px solid ${palette.secondary.main}`,
            background: palette.secondary.main,
            color: palette.common.white,
            '& svg path': {
                stroke: palette.common.white,
            }
        },
        outlinedSuccess: {
            border: `1px solid ${palette.success.main}`,
            color: palette.success.main,
            '& svg path': {
                stroke: palette.success.main,
            },
            '&:hover': {
                backgroundColor: palette.success.main,
                color: palette.common.white,
                '& svg path': {
                    stroke: palette.common.white,
                }
            }
        },
        containedSuccess: {
            border: `1px solid ${palette.success.main}`,
            background: palette.success.main,
            color: palette.common.white,
            '& svg path': {
                stroke: palette.common.white,
            }
        },
        outlinedError: {
            border: `1px solid ${palette.error.main}`,
            color: palette.error.main,
            '& svg path': {
                stroke: palette.secondary.main,
            },
            '&:hover': {
                backgroundColor: palette.error.main,
                color: palette.common.white,
                '& svg path': {
                    stroke: palette.common.white,
                }
            }
        },
        containedError: {
            border: `1px solid ${palette.error.main}`,
            background: palette.error.main,
            color: palette.common.white,
            '& svg path': {
                stroke: palette.common.white,
            }
        },
        outlinedWarning: {
            border: `1px solid ${palette.error.main}`,
            color: palette.warning.main,
            '& svg path': {
                stroke: palette.warning.main,
            },
            '&:hover': {
                backgroundColor: palette.warning.main,
                color: palette.common.white,
                '& svg path': {
                    stroke: palette.common.white,
                }
            }
        },
        containedWarning: {
            border: `1px solid ${palette.warning.main}`,
            background: palette.warning.main,
            color: palette.common.white,
            '& svg path': {
                stroke: palette.common.white,
            }
        },
        colorInherit: {
            boxShadow: 'none',
            color: palette.common.black,
            '& svg path': {
                stroke: palette.common.black,
            }
        },

        startIcon: {
            marginLeft: '0px',
        },

        endIcon: {
            marginRight: '0px',
        },


        sizeSmall: {
            height: '32px',
            minWidth: '32px',
            borderRadius: '8px',
            padding: '6px 12px',
            // '&:hover': {
            //     backgroundColor: '#0A487A'
            // }
        },
        sizeMedium: {
            height: '44px',
            minWidth: '44px',
            borderRadius: '8px',
            padding: '10px 16px',
            // '&:hover': {
            //     backgroundColor: '#0A487A'
            // }
        },
        sizeLarge: {
            height: '56px',
            minWidth: '56px',
            borderRadius: '8px',
            padding: '16px',
            // '&:hover': {
            //     backgroundColor: '#0A487A'
            // }
        },
    }
};

export default MuiButton;
