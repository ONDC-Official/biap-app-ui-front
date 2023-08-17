import palette from '../palette';
const MuiButton = {
    styleOverrides: {
        root: {
            height: '44px',
            padding: '10px 16px',
            borderRadius: '8px',
        },
        outlined: {
            border: `2px solid ${palette.primary.main}`,
            color: palette.primary.main,
            '&:hover': {
                backgroundColor: '#DCF2FF'
            }
        },
        startIcon: {
            marginLeft: '0px',
        },

        endIcon: {
            marginRight: '0px',
        },


        sizeSmall: {
            height: '56px',
            minWidth: '56px',
            borderRadius: '8px',
            padding: '16px',
            '&:hover': {
                backgroundColor: '#0A487A'
            }
        },
        sizeMedium: {
            height: '44px',
            minWidth: '44px',
            borderRadius: '8px',
            padding: '10px 16px',
            '&:hover': {
                backgroundColor: '#0A487A'
            }
        },
        sizeLarge: {
            height: '32px',
            minWidth: '32px',
            borderRadius: '8px',
            padding: '6px 12px',
            '&:hover': {
                backgroundColor: '#0A487A'
            }
        },
    }
};

export default MuiButton;
