import React from "react";
import { Redirect, Route } from "react-router-dom";
import { isLoggedIn } from "./utils/validateToken";

export default function PrivateRoute({ children, ...props }) {
  return (
    <Route
      {...props}
      render={() => {
        return isLoggedIn() ? children : <Redirect to={{ pathname: "/" }} />;
      }}
    />
  );
}
