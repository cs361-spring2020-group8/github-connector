import React, {Component} from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import EditProfile from "./components/EditProfile";
import { isLoggedIn } from './helpers/auth';

// Adapted from https://tylermcginnis.com/react-router-protected-routes-authentication/
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    isLoggedIn() === true
      ? <Component {...props} />
      : <Redirect to='/login' />
  )} />
)

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/signup" render={() => (
          isLoggedIn() ? (
            <Dashboard />
          ) : (
            <Signup/>
          )
        )}>
        </Route>
        <PrivateRoute path='/editprofile' component={EditProfile}/>
        <PrivateRoute path='/dashboard' component={Dashboard}/>
        <PrivateRoute path='/' component={Dashboard}/>
      </Switch>
    </Router>
  );
}

export default App;
