import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { CartContext } from "../../../context/cartContext";
import { Typography } from "@mui/material";
import useStyles from "./styles";

export default function Cart() {
  const classes = useStyles();
  const { cartItems } = useContext(CartContext);
  const history = useHistory();

  return (
    <>
      <div onClick={() => {}}>
        <Typography variant="h3">My cart</Typography>
      </div>
    </>
  );
}
