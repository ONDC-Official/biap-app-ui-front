import React from 'react';

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";

import no_image_found from "../../../assets/images/no_image_found.png";
import { ReactComponent as VegIcon } from "../../../assets/images/veg.svg";
import { ReactComponent as NonVegIcon } from "../../../assets/images/nonveg.svg";
import Typography from "@mui/material/Typography";
import { useHistory } from "react-router-dom";
import moment from "moment/moment";
import useStyles from '../../orders/orderCard/style';
import { ISSUE_TYPES } from '../../../constants/issue-types';

const TicketCard = ({ data, orderDetails }) => {
    const classes = useStyles();
    const history = useHistory();
    const { category, sub_category, issueId, issue_status, created_at } = data;
    const descriptor = orderDetails?.items[0]?.product?.descriptor;
    const allCategory = ISSUE_TYPES.map((item) => {
        return item.subCategory.map((subcategoryItem) => {
            return {
                ...subcategoryItem,
                category: item.value,
            };
        });
    }).flat();

    const fetchAddress = (address) => {
        const { locality, building, city, state, country, areaCode } = address;
        let addressString = "";
        addressString = `${locality ? `${locality}` : ""} ${building ? `,${building}` : ""} ${city ? `,${city}` : ""} ${state ? `,${state}` : ""} ${country ? `,${country}` : ""} ${areaCode ? `- ${areaCode}` : ""}`;
        return addressString;
    };

    return (
        <Grid container width={'90%'} spacing={0} className={classes.orderItemContainer}>
            <Grid item xs={12} sm={12} md={2.5} lg={2.5} xl={2.5}>
                <Card className={classes.orderCard}>
                    <img className={classes.orderImage} src={descriptor?.images?.length > 0 ? descriptor?.images[0] : no_image_found} alt={`sub-cat-img-${orderDetails?.id}`} />
                </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={9.5} lg={9.5} xl={9.5} className={classes.orderDetailsTypo}
            >
                <Typography component="div" variant="h5" className={classes.productNameTypoList}>
                    {descriptor?.name}
                    <Chip
                        className={classes.statusChip}
                        color={issue_status === "Close" ? "error" : "success"}
                        label={issue_status}
                    />
                </Typography>
                <Typography variant="body1" className={classes.addressTypo}>
                    {orderDetails?.address}
                    {orderDetails?.fulfillments[0]?.end?.location?.address ? fetchAddress(orderDetails?.fulfillments[0]?.end?.location?.address) : ""}
                </Typography>
                <Typography variant="h4" className={classes.priceTypo}>
                    <span className={classes.priceTypoLabel}>{`${category}: `}</span>
                    {allCategory.find(x => x.enums === sub_category)?.value ?? "NA"}
                </Typography>
                <Typography variant="body1" className={classes.itemNameTypo}>
                    <span className={classes.priceTypoLabel}>{`Issue Id: `}</span>
                    {issueId}
                </Typography>
                <Typography component="div" variant="body1" className={classes.orderDateTime}>
                    {`Issue Raised On: ${moment(created_at).format("DD MMMM YYYY")} at ${moment(created_at).format("hh:mma")}`}

                    <Button
                        className={classes.viewSummaryButton}
                        variant="outlined"
                        onClick={() => {
                            history.push(`/application/complaint/${issueId}`, { data })
                        }}
                    >
                        View summary
                    </Button>
                </Typography>
            </Grid>
        </Grid>
    )

};

export default TicketCard;