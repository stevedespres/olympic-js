import React from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import API from '../../utils/API';
import {ToastContainer, ToastStore} from 'react-toasts';

/**
Inscription d'un user
**/
export class Signup extends React.Component {
  // Constructeur
    constructor(props) {
        super(props);
        this.state = {
            login : "",
            password: "",
            cpassword: ""
        }
        this.handleChange.bind(this);
        this.send.bind(this);
    }
    // Gestion des évenements
    send = event => {
        // Si le login est manquant
        if(this.state.login.length === 0){
          ToastStore.error("Entrez un nom correct")
            return;
        }
        // Le mot de passe est manquant ou si la confirmation du mdp est incorrecte
        if(this.state.password.length === 0 || this.state.password !== this.state.cpassword){
          ToastStore.error("Entrez un mot de passe correct")
            ToastStore.error("Le mot de passe de confirmation doit être identique au mot de passe")
            return;
        }
        // Sinon
        var _send = {
            login: this.state.login,
            password: this.state.password
        }
        // Envoie du Login et Password à l'API NodeJS
        API.signup(_send).then(function(data){
          // Sauvegarde du token de connexion
            localStorage.setItem('token', data.data.token);
            // Rediraction vers la page Dashboard
            window.location = "/dashboard"
        },function(error){
            ToastStore.error("Ce nom existe déjà. Veuillez entrez un autre nom")
            console.log(error);
            return;
        })
    }
    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }
    // Rendu de la page
    render() {
        return(
            <div className="Login">

                <FormGroup controlId="login" bsSize="large">
                  <ControlLabel>Nom</ControlLabel>
                  <FormControl autoFocus type="login" value={this.state.login} onChange={this.handleChange}/>
                </FormGroup>

                <FormGroup controlId="password" bsSize="large">
                  <ControlLabel>Mot de passe</ControlLabel>
                  <FormControl value={this.state.password} onChange={this.handleChange} type="password"/>
                </FormGroup>

                <FormGroup controlId="cpassword" bsSize="large">
                  <ControlLabel>Confirmation du mot de passe</ControlLabel>
                  <FormControl value={this.state.cpassword} onChange={this.handleChange} type="password"/>
                </FormGroup>

                <Button onClick={this.send} block bsSize="large" type="submit">
                  Inscription
                </Button>

                <ToastContainer store={ToastStore}/>
            </div>
        )
    }
}
