import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import EditProfile from "./components/EditProfile";
import { isLoggedIn } from './helpers/auth';
import { PrivateRoute } from './helpers/privateRoute';
import Connections from './components/Connections';
import UserProfile from "./components/UserProfile";

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
        <PrivateRoute path='/connections' component={Connections} />
        <PrivateRoute path='/users/:id' component={UserProfile} />
        <PrivateRoute path='/' component={Dashboard}/>
      </Switch>
    </Router>
  );
}

export default App;
