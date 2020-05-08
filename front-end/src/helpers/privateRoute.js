import React, {Component} from "react";
import {
  Route,
  Redirect,
} from "react-router-dom";
import {isLoggedIn} from "./auth";

export const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    isLoggedIn() === true
      ? <Component {...props} />
      : <Redirect to='/login' />
  )} />
)
