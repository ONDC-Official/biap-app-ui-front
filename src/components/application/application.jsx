import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { AddressContextProvider } from "../../context/addressContext";
import { CartContextProvider } from "../../context/cartContext";
import PrivateRoute from "../../privateRoutes";
import Cart from "./cart/cart";
import Checkout from "./checkout/checkout";
import Orders from "./orders/orders";
import ProductList from "./product-list/productList";
import Profile from "./profile/profile";
import Support from "./support/support";
import ProductDetails from "./product-list/product-details/productDetails";
import InitializeOrder from "./initialize-order/initializeOrder";
import MyTickets from "./my-tickets/myTickets";

import AppLayout from "../appLayout";

export default function Application() {
  return (
    <CartContextProvider>
      <Switch>
        <AddressContextProvider>
          <Route path={"/application"} exact component={() => <Redirect to={"/application/products"} />} />
          <PrivateRoute path={"/application/products/:id"}>
            <AppLayout>
              <ProductDetails />
            </AppLayout>
          </PrivateRoute>
          <PrivateRoute exact path={"/application/products"}>
            <AppLayout>
              <ProductList />
            </AppLayout>
          </PrivateRoute>
          {/* <PrivateRoute path={"/application/cart"}>
            <Cart />
          </PrivateRoute> */}
          <PrivateRoute path={"/application/orders"}>
            <Orders />
          </PrivateRoute>
          <PrivateRoute path={"/application/tickets"}>
            <MyTickets />
          </PrivateRoute>
          <PrivateRoute path={"/application/profile"}>
            <Profile />
          </PrivateRoute>
          <PrivateRoute path={"/application/support"}>
            <Support />
          </PrivateRoute>
          <PrivateRoute path={"/application/initialize"}>
            <InitializeOrder />
          </PrivateRoute>
          <PrivateRoute path={"/application/checkout"}>
            <Checkout />
          </PrivateRoute>
        </AddressContextProvider>
      </Switch>
    </CartContextProvider>
  );
}
