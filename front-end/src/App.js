import React from "react";
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

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/signup" render={() => (
          isLoggedIn() ? (
            <Dashboard />
          ) : (
            <Signup/>
          )
        )}>
        </Route>
        <Route path="/dashboard" render={() => (
          isLoggedIn() ? (
            <Dashboard />
          ) : (
            <Login />
          )
        )}>
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/editprofile" render={() => (
          isLoggedIn() ? (
            <EditProfile />
          ) : (
            <Login />
          )
        )}>
        </Route>
        <Route exact path="/" render={() => (
          isLoggedIn() ? (
            <Redirect to="/dashboard"/>
          ) : (
            <Login />
          )
        )}>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
