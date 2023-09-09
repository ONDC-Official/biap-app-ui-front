import React from 'react';
import useStyles from "./style";
import Typography from "@mui/material/Typography";

const SummaryItems = ({items, hideHeader = false}) => {
    const classes = useStyles();

    // const items = [
    //     {id: '1', name: 'The Veg Chicken Burger', price: '₹900.00', quantity: '1'},
    //     {id: '2', name: 'Tomato Roll', price: '₹230.00', quantity: '2'},
    //     {id: '3', name: 'Non - Veg Chicken', price: '₹320.00', quantity: '1'}
    // ]
    return (
        <div>
            {
                !hideHeader && (
                    <div className={classes.itemSummaryHeaderContainer}>
                        <Typography variant="body1" className={classes.itemSummaryHeaderLabel}>
                            Quantity & Item Name
                        </Typography>
                        <Typography variant="body" className={classes.itemSummaryHeaderValue}>
                            Total
                        </Typography>
                    </div>
                )
            }
            {
                items.map((item, itemIndex) => (
                    <div key={`item-idx-${itemIndex}`}>
                        {
                            item["@ondc/org/title_type"] === "customization"
                                ? (
                                    <div className={classes.itemContainer}>
                                        <Typography variant="subtitle2" className={classes.customizationLabel}>
                                            {`${item?.title}`}
                                        </Typography>
                                        <Typography variant="subtitle2" className={classes.customizationValue}>
                                            {item.price.value}
                                        </Typography>
                                    </div>
                                ) : (
                                    <div className={classes.itemContainer}>
                                        <Typography variant="body1" className={hideHeader?classes.summaryItemLabel:classes.itemLabel}>
                                            {`${item["@ondc/org/title_type"] === "item"?item["@ondc/org/item_quantity"]?.count+" x":""} ${item?.title}`}
                                        </Typography>
                                        <Typography variant="body1" className={hideHeader?classes.summaryItemValue:classes.itemValue}>
                                            {item.price.value}
                                        </Typography>
                                    </div>
                                )
                        }
                    </div>
                ))
            }
        </div>
    );

};

export default  SummaryItems;