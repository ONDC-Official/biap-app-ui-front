import React, { useContext, useEffect, useState } from "react";
import useStyles from "./styles";
import { useHistory } from "react-router-dom";
import { CartContext } from "../../../context/cartContext";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Button, Card, Divider, Grid, TextField, Typography } from "@mui/material";
import { getCall } from "../../../api/axios";
import { getValueFromCookie } from "../../../utils/cookies";

export default function Cart() {
  const classes = useStyles();
  const history = useHistory();
  const [cartItems, setCartItems] = useState([]);

  const getCartItems = async () => {
    const user = JSON.parse(getValueFromCookie("user"));
    const url = `/clientApis/v2/cart/${user.id}`;
    const res = await getCall(url);
    setCartItems(res);
  };

  useEffect(() => {
    getCartItems();
  }, []);

  const emptyCartScreen = () => {
    return (
      <div className={classes.emptyCartScreen}>
        <InfoOutlinedIcon color="warning" sx={{ fontSize: 90, marginBottom: 2 }} />
        <Typography variant="h3" sx={{ fontFamily: "Inter", fontWeight: 700, textTransform: "none" }}>
          Your Cart is Empty. Please add items
        </Typography>
        <Typography variant="body" sx={{ marginTop: 2, marginBottom: 2 }}>
          Explore our wide selection and find something you like
        </Typography>
        <Button variant="contained">Explore Now</Button>
      </div>
    );
  };

  const renderTableHeads = () => {
    return (
      <>
        <Grid container sx={{ paddingTop: "20px" }}>
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
    return cartItems.map((cartItem) => {
      return (
        <>
          <Divider sx={{ backgroundColor: "#CACDD8", margin: "20px 0", width: "98.5%" }} />
          <Grid container key={cartItem.item.id}>
            <Grid item xs={4.3}>
              <Grid container>
                <div className={classes.moreImages}>
                  <div className={classes.greyContainer}>
                    <img
                      className={classes.moreImage}
                      alt="product-image"
                      src={cartItem.item.product.descriptor.images[0]}
                    />
                  </div>
                </div>
                <Grid>
                  <Typography variant="body1" sx={{ width: 200, fontWeight: 600 }}>
                    {cartItem.item.product.descriptor.name}
                  </Typography>
                  <Grid container sx={{ marginTop: "4px" }} alignItems="center">
                    <div className={classes.logoContainer}>
                      <img
                        className={classes.logo}
                        //  FIX STORE LOGO
                        alt={"item.storeLogo"}
                        src={"item.storeLogo"}
                      />
                    </div>
                    <Typography variant="body1" color="#686868" sx={{ fontWeight: 500 }}>
                      {/* Fix STORE NAME */}
                      {"item.storeName"}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={1}>
              <Typography variant="body" sx={{ fontWeight: 600 }}>
                {cartItem.item.product.price.value}
              </Typography>
            </Grid>
            <Grid item xs={1.2}>
              <div className={classes.qtyContainer}>
                <Typography variant="body1" sx={{ marginRight: "6px", fontWeight: 600 }}>
                  {cartItem.item.quantity.count}
                </Typography>
                <KeyboardArrowUpIcon className={classes.qtyArrowUp} />
                <KeyboardArrowDownIcon className={classes.qtyArrowDown} />
              </div>
            </Grid>
            <Grid item xs={1.2}>
              <Typography variant="body" sx={{ fontWeight: 600 }}>
                {parseInt(cartItem.item.quantity.count) * parseInt(cartItem.item.product.price.value)}
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

      {cartItems.length === 0 ? (
        emptyCartScreen()
      ) : (
        <Grid container className={classes.cartContainer}>
          <Grid item xs={8}>
            {renderTableHeads()}
            {renderProducts()}
          </Grid>

          <Grid item xs={4}>
            {renderSummaryCard()}
          </Grid>
        </Grid>
      )}
    </>
  );
}
