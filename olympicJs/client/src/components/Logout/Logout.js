import React, { Component } from 'react';
import API from '../../utils/API';

export class Logout extends React.Component {
    // Constructeur
    constructor(props) {
        super(props);
        API.logout();
        window.location = "/";
    }

   render(){ return(null);}
  }
