import { useRef } from "react";
import React, { useState } from "react";
import useStyles from "./styles";
import OfferCard from "./OfferCard";
import { Grid, IconButton, Typography } from "@mui/material";
import { ReactComponent as PreviousIcon } from "../../../assets/images/previous.svg";
import { ReactComponent as NextIcon } from "../../../assets/images/next.svg";

const _offers = [
  {
    id: "sellerNP.com_ONDC:RET11_P1_L1_TRYNEW",
    local_id: "TRYNEW",
    domain: "ONDC:RET11",
    provider: "sellerNP.com_ONDC:RET11_P1",
    provider_descriptor: {
      name: "Store 1",
      symbol: "https://sellerNP.com/images/store1.png",
      short_desc: "Store 1",
      long_desc: "Store 1",
      images: ["https://sellerNP.com/images/store1.png"],
    },
    descriptor: {
      code: "Disc_Pct",
      images: ["https://sellerNP.com/images/offer2-banner.png"],
    },
    location_id: "sellerNP.com_ONDC:RET11_P1_L1",
    item_ids: ["sellerNP.com_ONDC:RET11_P1_I1"],
    time: {
      label: "valid",
      range: {
        start: "2023-06-21T16:00:00.000Z",
        end: "2023-06-21T23:00:00.000Z",
      },
    },
    tags: [
      {
        code: "cart",
        list: [
          {
            code: "min_value",
            value: "159",
          },
        ],
      },
      {
        code: "offer",
        list: [
          {
            code: "offered_value_type",
            value: "percent",
          },
          {
            code: "offered_value_amt",
            value: "-60.00",
          },
          {
            code: "offered_value_cap",
            value: "-120.00",
          },
        ],
      },
    ],
    timestamp: "2023-06-03T08:00:30.000Z",
    location: "sellerNP.com_ONDC:RET11_P1_L1",
  },
  {
    id: "sellerNP.com_ONDC:RET11_P1_L1_FLAT150",
    local_id: "FLAT150",
    domain: "ONDC:RET11",
    provider: "sellerNP.com_ONDC:RET11_P1",
    provider_descriptor: {
      name: "Store 1",
      symbol: "https://sellerNP.com/images/store1.png",
      short_desc: "Store 1",
      long_desc: "Store 1",
      images: ["https://sellerNP.com/images/store1.png"],
    },
    descriptor: {
      code: "Disc_Amt",
      images: ["https://sellerNP.com/images/offer2-banner.png"],
    },
    location_id: "sellerNP.com_ONDC:RET11_P1_L1",
    item_ids: ["sellerNP.com_ONDC:RET11_P1_I1"],
    time: {
      label: "valid",
      range: {
        start: "2023-06-22T16:00:00.000Z",
        end: "2023-06-22T23:00:00.000Z",
      },
    },
    tags: [
      {
        code: "cart",
        list: [
          {
            code: "min_value",
            value: "499.00",
          },
        ],
      },
      {
        code: "offer",
        list: [
          {
            code: "offered_value_type",
            value: "amount",
          },
          {
            code: "offered_value_amt",
            value: "-150.00",
          },
        ],
      },
    ],
    timestamp: "2023-06-03T08:00:30.000Z",
    location: "sellerNP.com_ONDC:RET11_P1_L1",
  },
  {
    id: "sellerNP.com_ONDC:RET11_P1_L1_BUY2GET3",
    local_id: "BUY2GET3",
    domain: "ONDC:RET11",
    provider: "sellerNP.com_ONDC:RET11_P1",
    provider_descriptor: {
      name: "Store 1",
      symbol: "https://sellerNP.com/images/store1.png",
      short_desc: "Store 1",
      long_desc: "Store 1",
      images: ["https://sellerNP.com/images/store1.png"],
    },
    descriptor: {
      code: "BuyXGetY",
      images: ["https://sellerNP.com/images/offer1-banner.png"],
    },
    location_id: "sellerNP.com_ONDC:RET11_P1_L1",
    item_ids: ["sellerNP.com_ONDC:RET11_P1_I1"],
    time: {
      label: "valid",
      range: {
        start: "2023-06-23T16:00:00.000Z",
        end: "2023-06-23T23:00:00.000Z",
      },
    },
    tags: [
      {
        code: "cart",
        list: [
          {
            code: "item_count",
            value: "2",
          },
        ],
      },
      {
        code: "offer",
        list: [
          {
            code: "item_count",
            value: "3",
          },
          {
            code: "item_id",
            value: "sku_id_for_extra_item",
          },
        ],
      },
    ],
    timestamp: "2023-06-03T08:00:30.000Z",
    location: "sellerNP.com_ONDC:RET11_P1_L1",
  },
  {
    id: "sellerNP.com_ONDC:RET11_P1_L1_FREEBIE",
    local_id: "FREEBIE",
    domain: "ONDC:RET11",
    provider: "sellerNP.com_ONDC:RET11_P1",
    provider_descriptor: {
      name: "Store 1",
      symbol: "https://sellerNP.com/images/store1.png",
      short_desc: "Store 1",
      long_desc: "Store 1",
      images: ["https://sellerNP.com/images/store1.png"],
    },
    descriptor: {
      code: "Freebie",
      images: ["https://sellerNP.com/images/offer3-banner.png"],
    },
    location_id: "sellerNP.com_ONDC:RET11_P1_L1",
    item_ids: ["sellerNP.com_ONDC:RET11_P1_I1"],
    time: {
      label: "valid",
      range: {
        start: "2023-06-24T16:00:00.000Z",
        end: "2023-06-24T23:00:00.000Z",
      },
    },
    tags: [
      {
        code: "cart",
        list: [
          {
            code: "min_value",
            value: "598.00",
          },
        ],
      },
      {
        code: "offer",
        list: [
          {
            code: "offered_value",
            value: "0.00",
          },
          {
            code: "item_count",
            value: "1",
          },
          {
            code: "item_id",
            value: "sku_id_for_extra_item",
          },
          {
            code: "item_value",
            value: "200.00",
          },
        ],
      },
    ],
    timestamp: "2023-06-03T08:00:30.000Z",
    location: "sellerNP.com_ONDC:RET11_P1_L1",
  },
];

const Offers = () => {
  const ref = useRef(null);
  const classes = useStyles();

  const [offers, setOffers] = useState(_offers);

  const scroll = (scrollOffset) => {
    ref.current.scrollLeft += scrollOffset;
  };

  return (
    <>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <Typography variant="h4" style={{ marginTop: 20 }}>
          Offers
        </Typography>
      </Grid>

      <div className={classes.offersContainer}>
        <div className={classes.leftIcon}>
          <IconButton
            color="inherit"
            className={classes.actionButton}
            onClick={() => {
              scroll(-1000);
            }}
          >
            <PreviousIcon />
          </IconButton>
        </div>
        <div className={classes.rightIcon}>
          <IconButton
            color="inherit"
            className={classes.actionButton}
            onClick={() => {
              scroll(1000);
            }}
          >
            <NextIcon style={{ fontSize: 30 }} />
          </IconButton>
        </div>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className={classes.offersRow} ref={ref}>
          {offers.map((offer) => {
            return (
              <OfferCard
                title={offer.provider_descriptor.name}
                offerText={offer.offerText}
                link={offer.link}
                brandImage={offer.provider_descriptor.symbol}
              />
            );
          })}
        </Grid>
      </div>
    </>
  );
};

export default Offers;
