import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Login from "./components/auth/login/login";
import SignUp from "./components/auth/sign-up/signUp";
import PageNotFound from "./components/page-not-found/pageNotFound";

export default class OndcRoutes extends React.Component {
  render() {
    return (
      <Switch>
        <Route path={"/"} exact component={() => <Redirect to={"/login"} />} />
        <Route path={"/login"} component={Login} />
        <Route path={"/sign-up"} component={SignUp} />
        <Route path="/page-not-found" component={PageNotFound} />
        <Route path="" component={() => <Redirect to="/page-not-found" />} />
      </Switch>
    );
  }
}
