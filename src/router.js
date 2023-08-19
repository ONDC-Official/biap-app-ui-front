import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import Application from "./components/application/application";
import Login from "./components/auth/login/login";
import SignUp from "./components/auth/sign-up/signUp";
import PageNotFound from "./components/page-not-found/pageNotFound";
import Home from "./components/home/home";

export default function OndcRoutes() {
  return (
    <Router>
      <Switch>
        <Route path={"/"} exact component={Home} />
        {/*<Route path={"/"} exact component={() => <Redirect to={"/login"} />} />*/}
        <Route path={"/login"} component={Login} />
        <Route path={"/sign-up"} component={SignUp} />
        <Route path={"/application"} component={Application} />
        <Route path="/page-not-found" component={PageNotFound} />
        <Route path="" component={() => <Redirect to="/page-not-found" />} />
      </Switch>
    </Router>
  );
}
