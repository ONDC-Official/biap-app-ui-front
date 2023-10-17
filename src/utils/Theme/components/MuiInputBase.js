import palette from "../palette";
const MuiInputBase = {
    styleOverrides: {
        root: {
            borderRadius: '8px',
            // border: '1px solid var(--neutral-neutral-black-100, #B9B9B9)',
            '&.Mui-focused': {
                border: 'none'
            },
        },
        input: {
            // height: '24px !important',
            fontSize: '16px',
            fontWeight: 400,
            lineHeight: '24px',
            padding: '10px 9px',
            color: palette.common.fontColor,
        },
        inputSizeSmall: {
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: '20px',
            padding: '6px 9px',
            color: palette.common.fontColor,

        }
    }
};

export default MuiInputBase;
