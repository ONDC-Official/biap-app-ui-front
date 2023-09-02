import React, {Fragment} from 'react';
import useStyles from './style';

import Grid from '@mui/material/Grid';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';

import {ReactComponent as ExpandMoreIcon} from '../../../../assets/images/chevron-down.svg';
import MenuItem from './menuItem';
import Box from "@mui/material/Box";

const customMenuList = [
    {id: '1', name: 'Kings Burgers', items: [
        {id: '1', name: 'Crispy Veg Burger+Fries(M)', price: 499, description: 'Save Rs. 261 | Veg Whopper + Paneer Royale + Crispy Veg', isVeg: true},
        {id: '2', name: 'Crispy Veg Burger+Fries(M)', price: 599, description: 'Save Rs. 321 | Veg Whopper + Paneer Royale + Crispy Veg', isVeg: true},
        {id: '3', name: 'Crispy Veg Burger+Fries(M)', price: 249, description: 'Save Rs. 61 | Veg Whopper + Paneer Royale + Crispy Veg', isVeg: true},
        {id: '4', name: 'Crispy Veg Burger+Fries(M)', price: 349, description: 'Save Rs. 169 | Veg Whopper + Paneer Royale + Crispy Veg', isVeg: false},
        {id: '5', name: 'Crispy Veg Burger+Fries(M)', price: 799, description: 'Save Rs. 311 | Veg Whopper + Paneer Royale + Crispy Veg', isVeg: true},
    ]},
    {id: '2', name: 'Burger Doubles', items: [
        {id: '11', name: 'Crispy Veg Burger+Fries(M)', price: 899, description: 'Save Rs. 201 | Veg Whopper + Paneer Royale + Crispy Veg', isVeg: true},
        {id: '12', name: 'Crispy Veg Burger+Fries(M)', price: 999, description: 'Save Rs. 101 | Veg Whopper + Paneer Royale + Crispy Veg', isVeg: true},
    ]},
    {id: '3', name: 'New BK DUOS', items: [
        {id: '21', name: 'Crispy Veg Burger+Fries(M)', price: 110, description: 'Save Rs. 32 | Veg Whopper + Paneer Royale + Crispy Veg', isVeg: true},
        {id: '22', name: 'Crispy Veg Burger+Fries(M)', price: 222, description: 'Save Rs. 64 | Veg Whopper + Paneer Royale + Crispy Veg', isVeg: true},
        {id: '23', name: 'Crispy Veg Burger+Fries(M)', price: 420, description: 'Save Rs. 111 | Veg Whopper + Paneer Royale + Crispy Veg', isVeg: false},
    ]},
]
const CustomeMenu = () => {
    const classes = useStyles();

    return (
        <div>
            {
                customMenuList.length > 0
                    ? (
                        <>
                            {
                                customMenuList.map((menu, ind) => (
                                    <Accordion
                                        key={`custom-menu-ind-${ind}`}
                                        // square={true}
                                        defaultExpanded={true}
                                    >
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon className={classes.expandIcon}/>}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography variant="h5">{`${menu.name} (${menu.items.length})`}</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {
                                                menu.items.length > 0
                                                    ? (
                                                        <Grid
                                                            container spacing={3}
                                                        >
                                                            {
                                                                menu.items.map((item, itemInd) => (
                                                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} key={`menu-item-ind-${itemInd}`}>
                                                                        <MenuItem
                                                                            item={item}
                                                                        />
                                                                    </Grid>
                                                                ))
                                                            }
                                                        </Grid>
                                                    ) : (
                                                        <Typography variant="body1">
                                                            There is not items available in this menu
                                                        </Typography>
                                                    )
                                            }
                                        </AccordionDetails>
                                    </Accordion>
                                ))
                            }
                        </>
                    ) : (
                        <Typography variant="body1">
                            Menu not available
                        </Typography>
                    )
            }
        </div>
    );

};

export default CustomeMenu;