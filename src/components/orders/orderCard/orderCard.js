import React from 'react';
import useStyles from "./style";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";

import no_image_found from "../../../assets/images/no_image_found.png";
import {ReactComponent as VegIcon} from "../../../assets/images/veg.svg";
import {ReactComponent as NonVegIcon} from "../../../assets/images/nonveg.svg";
import Typography from "@mui/material/Typography";
import {useHistory} from "react-router-dom";
import moment from "moment/moment";

const OrderCard = ({data, orderDetails}) => {
    const classes = useStyles();
    const history = useHistory();
    const {provider, items, createdAt, quote, state} = orderDetails;
    const {descriptor} = provider;
    const renderItemsName = (quoteBreakup, items) => {
        const filterItems = quoteBreakup.filter((item) => item["@ondc/org/title_type"] === "item")
        return (
            <>
                {
                    filterItems.map((item, itemIndex) => {
                        const findItem = items.find((prod) => prod.id === item["@ondc/org/item_id"]);
                        const findVegNonvegTag = undefined; //findItem?.product?.tags.find((tag) => tag.code === "veg_nonveg");
                        let isVeg = false;
                        if(findVegNonvegTag){
                            const tag = findVegNonvegTag.list[0];
                            if(tag.code === "veg" && (tag.value === "yes" || tag.value === "Yes")){
                                isVeg = true;
                            }else{
                                isVeg = false;
                            }
                        }else{}
                        return (
                            <span key={`veg-nonveg-${itemIndex}`}>
                                {
                                    findVegNonvegTag
                                    ?(
                                        <>
                                            {
                                                isVeg?<VegIcon className={classes.vegNonVegIcon}/>:<NonVegIcon className={classes.vegNonVegIcon}/>
                                            }
                                        </>
                                    ):<></>
                                }
                                <span className={classes.itemTypo}>{item?.title}</span>
                            </span>
                        );

                    })
                }
            </>
        );
    };

    const fetchAddress = (address) => {
        const {locality, building, city, state, country, areaCode} = address;
        let addressString = "";
        addressString = `${locality?`${locality}`:""} ${building?`,${building}`:""} ${city?`,${city}`:""} ${state?`,${state}`:""} ${country?`,${country}`:""} ${areaCode?`- ${areaCode}`:""}`;
        return addressString;
    };

    return (
        <Grid container spacing={0} className={classes.orderItemContainer}>
            <Grid item xs={12} sm={12} md={2.5} lg={2.5} xl={2.5}>
                <Card className={classes.orderCard}>
                    <img className={classes.orderImage} src={descriptor?.images?.length > 0 ? descriptor?.images[0] : no_image_found} alt={`sub-cat-img-${orderDetails?.id}`}/>
                </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={9.5} lg={9.5} xl={9.5} className={classes.orderDetailsTypo}>
                <Typography component="div" variant="h5" className={classes.productNameTypoList}>
                    {descriptor?.name}
                    <Chip
                        className={classes.statusChip}
                        color={state === "Confirmed" || state === "Created"?"primary":state === "Delivered"?"success":state === "Cancelled"?"error":"primary"}
                        label={state}
                    />
                </Typography>
                <Typography variant="body1" className={classes.addressTypo}>
                    {orderDetails?.address}
                    {orderDetails?.fulfillments[0]?.end?.location?.address?fetchAddress(orderDetails?.fulfillments[0]?.end?.location?.address):""}
                </Typography>
                <Typography variant="body1" className={classes.itemNameTypo}>
                    {renderItemsName(quote.breakup, items)}
                </Typography>
                <Typography variant="h4" className={classes.priceTypo}>
                    <span className={classes.priceTypoLabel}>{`Total Paid: `}</span>
                    {`₹${Number.isInteger(Number(quote?.price?.value))
                        ? Number(quote?.price?.value).toFixed(2)
                        : Number(quote?.price?.value).toFixed(2)}`}
                </Typography>
                <Typography component="div" variant="body1" className={classes.orderDateTime}>
                    {`Ordered On: ${moment(createdAt).format("DD MMMM YYYY")} at ${moment(createdAt).format("hh:mma")}`}

                    {
                        orderDetails?.state === "Confirmed" && (
                            <Button
                                className={classes.trackOrderButton}
                                variant="contained"
                            >
                                Track Order
                            </Button>
                        )
                    }

                    {
                        orderDetails?.state === "Delivered" && (
                            <Button
                                className={classes.downloadInvoiceButton}
                                variant="outlined"
                            >
                                Download Invoice
                            </Button>
                        )
                    }

                    <Button
                        className={classes.viewSummaryButton}
                        variant="outlined"
                        onClick={() => {
                            history.push(`/application/order/${orderDetails?.id}`)
                        }}
                    >
                        View summary
                    </Button>
                </Typography>
            </Grid>
        </Grid>
    )

};

export default OrderCard;