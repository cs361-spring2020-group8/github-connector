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
import Home from "./components/Home";
import { isLoggedIn } from './helpers/auth';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/signup">
          <Signup />
        </Route>
        <Route path="/dashboard">
          <Dashboard />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/" render={() => (
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
