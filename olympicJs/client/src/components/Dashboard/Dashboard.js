import React from 'react';
import { Button } from "react-bootstrap";

import API from '../../utils/API';

export class Dashboard extends React.Component {
    constructor(props){
        super(props);
    }
    wellStyles = { maxWidth: 400, margin: '0 auto 10px' };
    render() {
        return(
            <div className="Dashboard">
                <h1>Bienvenue {localStorage.getItem("login")}</h1>
                <div className="well" style={this.wellStyles}>
                   <Button bsStyle="primary" bsSize="large" href="/gameconfig" block>
                     Créer une partie
                   </Button>
                   <Button bsSize="large" href="/joinGame" block>
                     Rejoindre une partie
                   </Button>
               </div>
            </div>
        )
    }
}
