import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { CartContextProvider } from "../../context/cartContext";
import PrivateRoute from "../../privateRoutes";
import Cart from "./cart/cart";
import Checkout from "./checkout/checkout";
import Orders from "./orders/orders";
import ProductList from "./product-list/productList";
import Profile from "./profile/profile";

export default function Application() {
  return (
    <CartContextProvider>
      <Switch>
        <Route
          path={"/application"}
          exact
          component={() => <Redirect to={"/application/products"} />}
        />
        <PrivateRoute path={"/application/products"}>
          <ProductList />
        </PrivateRoute>
        <PrivateRoute path={"/application/checkout"}>
          <Checkout />
        </PrivateRoute>
        <PrivateRoute path={"/application/cart"}>
          <Cart />
        </PrivateRoute>
        <PrivateRoute path={"/application/orders"}>
          <Orders />
        </PrivateRoute>
        <PrivateRoute path={"/application/profile"}>
          <Profile />
        </PrivateRoute>
      </Switch>
    </CartContextProvider>
  );
}
