import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import TestYourCatalogue from "./components/TestYourCatalogue/testYourCatalogue";
import Application from "./components/application/application";
import Login from "./components/auth/login/login";
import SignUp from "./components/auth/sign-up/signUp";
import PageNotFound from "./components/page-not-found/pageNotFound";

import Home from "./components/home/home";
import Category from "./components/category/category";
import SubCategory from "./components/product/product";
import Products from "./components/products/products";
import AppLayout from "./components/appLayout";

export default function OndcRoutes() {
  return (
    <Router>
      <Switch>
        {/*<Route path={"/"} exact component={() => <AppLayout><Home /></AppLayout>} />*/}
        {/*<Route path={"/category/:categoryName"} exact component={() => <AppLayout><Category /></AppLayout>} />*/}
        {/*<Route path={"/category/:categoryName/:subCategoryName"} exact component={() => <AppLayout><SubCategory /></AppLayout>} />*/}
        {/*<Route path={"/products"} exact component={() => <AppLayout><Products /></AppLayout>} />*/}
        <Route path={"/"} exact component={() => <Redirect to={"/login"} />} />
        <Route path={"/login"} component={Login} />
        <Route path={"/sign-up"} component={SignUp} />
        <Route path={"/application"} component={Application} />
        <Route path={"/testYourCatalogue"} component={TestYourCatalogue} />
        <Route path="/page-not-found" component={PageNotFound} />
        <Route path="" component={() => <Redirect to="/page-not-found" />} />
      </Switch>
    </Router>
  );
}
