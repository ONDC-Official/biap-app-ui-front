import palette from '../palette';
const MuiAccordion = {
    styleOverrides: {
        root: {
            boxShadow: 'none',
            '& .MuiAccordionSummary-root': {
                padding: '0px !important'
            },
            '& .MuiAccordionDetails-root': {
                padding: '0px !important',
                // padding: '24px 0px !important'
            },
            '&:before': {
                display: 'none'
            }
        },
    }
};

export default MuiAccordion;
