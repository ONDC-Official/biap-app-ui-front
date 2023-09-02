import React from 'react';
import useStyles from "./style";

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import ItemImage from '../../../../assets/images/item.png'
import VegIcon from '../../../../assets/images/veg.svg'
import NonVegIcon from '../../../../assets/images/nonveg.svg'
import {ReactComponent as CustomiseIcon} from '../../../../assets/images/customise.svg'
import {ReactComponent as PlusIcon} from '../../../../assets/images/plus.svg'

const MenuItem = ({item}) => {
    const classes = useStyles();
    console.log("item=====>", item.isVeg?"Veg":"NonVeg")
    const renderVegNonvegIcon = (isVeg) => {
        console.log("renderVegNonvegIcon===========>", isVeg)
        if(isVeg){
            return <img src={VegIcon} alt={"veg-icon"} className={classes.vegNonvegIcon} />;
        }else{
            return <img src={NonVegIcon} alt={"nonveg-icon"} className={classes.vegNonvegIcon} />;
        }
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={9.5} lg={9.5} xl={9.5}>
                <Typography variant="h6" className={classes.itemNameTypo}>
                    {item.name}
                </Typography>
                <Typography variant="h5" className={classes.itemPriceTypo}>
                    {item.price}
                </Typography>
                <Typography variant="body1" className={classes.itemDescriptionTypo}>
                    {item.description}
                </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={2.5} lg={2.5} xl={2.5}>
                <Card className={classes.itemCard}>
                    <img
                        className={classes.itemImage}
                        src={ItemImage}
                        alt={`item-ind-${item.id}`}
                    />
                    {renderVegNonvegIcon(item.isVeg)}
                </Card>
                <div className={classes.cardAction}>
                    <Button
                        variant="outlined" color="primary"
                        endIcon={<PlusIcon />}
                        className={classes.addToCartIcon}
                        fullWidth
                    >
                        Add to cart
                    </Button>
                    <Button
                        variant="text" color="success"
                        endIcon={<CustomiseIcon />}
                        fullWidth
                    >
                        Customise
                    </Button>
                </div>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Box
                    component={"div"}
                    className={classes.divider}
                />
            </Grid>
        </Grid>
    )
};

export default MenuItem;