import React, { useContext } from "react";
import useStyles from "./styles";
import { useHistory } from "react-router-dom";
import { CartContext } from "../../../context/cartContext";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Button, Card, Divider, Grid, TextField, Typography } from "@mui/material";

const products = [
  {
    img: "https://www.recipetineats.com/wp-content/uploads/2023/05/Garlic-cheese-pizza_9.jpg?w=500&h=500&crop=1",
    name: "Garden Delight Pizza A classic veg pizza that combines the zing",
    storeLogo:
      "https://scontent.fdel27-5.fna.fbcdn.net/v/t1.6435-9/76751710_3219243534783822_6287676884046053376_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=dIE2V0jkRzcAX-pN8EI&_nc_ht=scontent.fdel27-5.fna&oh=00_AfAujFCqt9HFw47qdYPxu_icgEtrxPbYQKH6uFJLgj5TIQ&oe=650F0BDB",
    storeName: "Pizza hut",
    price: "₹999",
    qty: 1,
    subTotal: " ₹1999",
  },
  {
    img: "https://www.recipetineats.com/wp-content/uploads/2023/05/Garlic-cheese-pizza_9.jpg?w=500&h=500&crop=1",
    name: "Garden Delight Pizza A classic veg pizza that combines the zing",
    storeLogo:
      "https://scontent.fdel27-5.fna.fbcdn.net/v/t1.6435-9/76751710_3219243534783822_6287676884046053376_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=dIE2V0jkRzcAX-pN8EI&_nc_ht=scontent.fdel27-5.fna&oh=00_AfAujFCqt9HFw47qdYPxu_icgEtrxPbYQKH6uFJLgj5TIQ&oe=650F0BDB",
    storeName: "Pizza hut",
    price: "₹999",
    qty: 1,
    subTotal: " ₹1999",
  },
  {
    img: "https://www.recipetineats.com/wp-content/uploads/2023/05/Garlic-cheese-pizza_9.jpg?w=500&h=500&crop=1",
    name: "Garden Delight Pizza A classic veg pizza that combines the zing",
    storeLogo:
      "https://scontent.fdel27-5.fna.fbcdn.net/v/t1.6435-9/76751710_3219243534783822_6287676884046053376_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=dIE2V0jkRzcAX-pN8EI&_nc_ht=scontent.fdel27-5.fna&oh=00_AfAujFCqt9HFw47qdYPxu_icgEtrxPbYQKH6uFJLgj5TIQ&oe=650F0BDB",
    storeName: "Pizza hut",
    price: "₹999",
    qty: 1,
    subTotal: " ₹1999",
  },
];

export default function Cart() {
  const classes = useStyles();
  const { cartItems } = useContext(CartContext);
  const history = useHistory();

  const renderTableHeads = () => {
    return (
      <>
        <Grid container>
          <Grid item xs={4.3}>
            <Typography variant="body1" className={classes.tableHead}>
              Item
            </Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography variant="body1" className={classes.tableHead}>
              Price
            </Typography>
          </Grid>
          <Grid item xs={1.2}>
            <Typography variant="body1" className={classes.tableHead} sx={{ marginLeft: "12px" }}>
              Qty
            </Typography>
          </Grid>
          <Grid item xs={1.4}>
            <Typography variant="body1" className={classes.tableHead}>
              Subtotal
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body1" className={classes.tableHead}>
              Special Instructions
            </Typography>
          </Grid>
        </Grid>
      </>
    );
  };

  const renderProducts = () => {
    return products.map((item) => {
      return (
        <>
          <Divider sx={{ backgroundColor: "#CACDD8", margin: "20px 0", width: "98.5%" }} />
          <Grid container>
            <Grid item xs={4.3}>
              <Grid container>
                <div className={classes.moreImages}>
                  <div className={classes.greyContainer}>
                    <img className={classes.moreImage} src={item.img} />
                  </div>
                </div>
                <Grid>
                  <Typography variant="body1" sx={{ width: 200, fontWeight: 600 }}>
                    {item.name}
                  </Typography>
                  <Grid container sx={{ marginTop: "4px" }} alignItems="center">
                    <div className={classes.logoContainer}>
                      <img className={classes.logo} src={item.storeLogo} />
                    </div>
                    <Typography variant="body1" color="#686868" sx={{ fontWeight: 500 }}>
                      {item.storeName}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={1}>
              <Typography variant="body" sx={{ fontWeight: 600 }}>
                {item.price}
              </Typography>
            </Grid>
            <Grid item xs={1.2}>
              <div className={classes.qtyContainer}>
                <Typography variant="body1" sx={{ marginRight: "6px", fontWeight: 600 }}>
                  {item.qty}
                </Typography>
                <KeyboardArrowUpIcon className={classes.qtyArrowUp} />
                <KeyboardArrowDownIcon className={classes.qtyArrowDown} />
              </div>
            </Grid>
            <Grid item xs={1.2}>
              <Typography variant="body" sx={{ fontWeight: 600 }}>
                {item.subTotal}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                multiline
                rows={2}
                size="small"
                placeholder="Write here"
                sx={{ padding: "6px 12px" }}
              />

              <Grid container sx={{ margin: "16px 0" }} alignItems="center" justifyContent="flex-end">
                <Button variant="text" startIcon={<DeleteOutlineIcon size="small" />} color="error">
                  <Typography>Delete</Typography>
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </>
      );
    });
  };

  const renderSummaryCard = () => {
    return (
      <Card className={classes.summaryCard}>
        <Typography variant="h4" className={classes.summaryTypo}>
          Summary
        </Typography>
        <Divider sx={{ background: "#CACDD8", margin: "20px 0" }} />
        <Grid container justifyContent="space-between" sx={{ marginBottom: "14px" }}>
          <Typography variant="subtitle1" className={classes.summaryLabel}>
            Subtotal
          </Typography>
          <Typography variant="subtitle1" className={classes.summaryLabel}>
            ₹4,300.00
          </Typography>
        </Grid>
        <Grid container justifyContent="space-between" sx={{ marginBottom: "14px" }}>
          <Grid xs={8}>
            <Typography variant="subtitle1" className={classes.summaryLabel}>
              Shipping
            </Typography>
            <Typography variant="subtitle2" color="#A2A6B0">
              (Standard Rate - Price may vary depending on the item/destination. TECS Staff will contact you.)
            </Typography>
          </Grid>
          <Typography variant="subtitle1" className={classes.summaryLabel}>
            ₹21.00
          </Typography>
        </Grid>
        <Grid container justifyContent="space-between" sx={{ marginBottom: "14px" }}>
          <Typography variant="subtitle1" className={classes.summaryLabel}>
            Tax
          </Typography>
          <Typography variant="subtitle1" className={classes.summaryLabel}>
            ₹1.91
          </Typography>
        </Grid>
        <Grid container justifyContent="space-between" sx={{ marginBottom: "14px" }}>
          <Typography variant="subtitle1" className={classes.summaryLabel}>
            GST (10%)
          </Typography>
          <Typography variant="subtitle1" className={classes.summaryLabel}>
            ₹1.91
          </Typography>
        </Grid>
        <Divider sx={{ background: "#CACDD8", margin: "20px 0" }} />
        <Grid container justifyContent="space-between" sx={{ marginBottom: "14px" }}>
          <Typography variant="subtitle1" className={classes.summaryLabel}>
            Order Total
          </Typography>
          <Typography variant="subtitle1" sx={{ fontSize: 18, fontWeight: 600 }}>
            ₹4,324
          </Typography>
        </Grid>

        <Button variant="contained" sx={{ marginTop: 1, marginBottom: 2 }}>
          Proceed to buy
        </Button>
      </Card>
    );
  };

  return (
    <>
      <div className={classes.headingContainer}>
        <Typography variant="h3" className={classes.heading}>
          My Cart
        </Typography>
      </div>

      <Grid container className={classes.cartContainer}>
        <Grid item xs={8}>
          {renderTableHeads()}
          {renderProducts()}
        </Grid>

        <Grid item xs={4}>
          {renderSummaryCard()}{" "}
        </Grid>
      </Grid>
    </>
  );
}
