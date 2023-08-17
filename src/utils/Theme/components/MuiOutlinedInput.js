import palette from "../palette";
const MuiOutlinedInput = {
    styleOverrides: {
        root: {
            borderRadius: '8px',
            border: '1px solid var(--neutral-neutral-black-100, #B9B9B9)',
            '&.Mui-focused': {
                border: 'none'
            },
            '&.Mui-focused fieldset': {
                boxShadow: `0px -2px 0px 0px ${palette.primary.main} inset !important`,
                borderRadius: '8px 8px 2px 2px !important',
                border: `1px solid #B8D1E5 !important`,
                borderBottom: 'none'
            },
            '& label': {
                color: 'red',
            }
        },
        input: {
            // height: '24px !important',
            fontSize: '16px',
            fontWeight: 400,
            lineHeight: '24px',
            padding: '10px 9px',
            color: palette.common.fontColor,
        },
        notchedOutline: {
            border: 'none',
            '& legend span': {
                display: 'none'
            }
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

export default MuiOutlinedInput;
