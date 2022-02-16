import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
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
      <Route path={"/application/products"} component={ProductList} />
      <Route path={"/application/checkout"} component={Checkout} />
    </Switch>
  );
}
