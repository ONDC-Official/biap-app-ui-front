import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import PrivateRoute from "../../privateRoutes";
import Checkout from "./checkout/checkout";
import ProductList from "./product-list/productList";

export default function Application() {
  return (
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
    </Switch>
  );
}
