import React from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import {ToastContainer, ToastStore} from 'react-toasts';
import API from '../../utils/API';

/**
Component Login : Connexion d'un user
**/
export class Login extends React.Component {
    // Constructeur
    constructor(props) {
        super(props);
        this.state = {
            login : "",
            password: ""
        }
        this.handleChange.bind(this);
        this.send.bind(this);
    }
    // Gestion des évenements
    send = event => {
        // Si login est manquant
        if(this.state.login.length === 0){
          ToastStore.error("Entrez un nom correct")
            return ;
        }
        // Si mot de passe est manquant
        if(this.state.password.length === 0){
          ToastStore.error("Entrez un mot de passe correct")
            return;
        }
        /* Creation de l'objet à envoyer au serveur */
        var _send = {
            login: this.state.login,
            password: this.state.password
        }
        // Envoie du login et password à l'API NodeJS
        API.login(_send).then(function(res){

          if(res.data.status === "ERROR"){
              ToastStore.error(res.data.result);
            }else{
              // Sauvegarde du token de connexion
              localStorage.setItem('login', res.data.login);
              localStorage.setItem('token', res.data.token);
              localStorage.setItem('victory', res.data.victory);
              localStorage.setItem('defeat', res.data.defeat);
              localStorage.setItem('equality', res.data.equality);
              // Redirection vers la page Dashboard
              window.location = "/dashboard"
            }
        },function(error){
            console.log(error);
            ToastStore.error("Le nom et le mot de passe sont invalides")
            return;
        })
    }
    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }
    // Rendu de la page login
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

                <Button onClick={this.send} block bsSize="large" type="submit">
                  Connexion
                </Button>
                <ToastContainer store={ToastStore}/>
            </div>
        )
    }
}
