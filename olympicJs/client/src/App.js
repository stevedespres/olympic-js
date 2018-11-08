import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Dashboard } from './components/Dashboard/Dashboard.js';
import { Login } from './components/Login/Login.js';
import { Signup } from './components/Signup/Signup.js';
import { PrivateRoute } from './components/PrivateRoute.js';
import { PublicRoute } from './components/PublicRoute.js';
import API from './utils/API';
import './App.css';

import { Navbar, MenuItem, NavItem, Nav, NavDropdown } from "react-bootstrap";

class App extends Component {

  renderNavItems() {

    if(API.isAuth()){
      return (
        <Nav>
          <NavItem eventKey={1}>
          Se deconnecter
        </NavItem>
        </Nav>
      );
    }else{
      return (
        <Nav>
        <NavItem eventKey={1} href="/">
          Se connecter
        </NavItem>
        <NavItem eventKey={2} href="/signup">
          Créer un compte
        </NavItem>
        </Nav>
      );
    }

  }


  render() {
    return (
            <div className="App">
            <Navbar>
              <Navbar.Header>
                <Navbar.Brand>
                  <a href="/">OlympicJS</a>
                </Navbar.Brand>
              </Navbar.Header>
              {this.renderNavItems()}
            </Navbar>

             <div className="App-content">
                 <Switch>
                     <PublicRoute exact path="/" component={Login}/>
                     <PublicRoute exact path ="/signup" component={Signup}/>
                     <PrivateRoute path='/dashboard' component={Dashboard} />
                 </Switch>
             </div>
      </div>
    );
  }
}

export default App;
