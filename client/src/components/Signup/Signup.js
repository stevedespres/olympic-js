import React from 'react';
import { Button, FormGroup, FormControl, HelpBlock, ControlLabel } from "react-bootstrap";
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
        API.signup(_send).then(function(res){
            console.log(res)
          // Si un code d'erreur est renvoyé
          if(res.data.status === "ERROR"){
            ToastStore.error(res.data.result);
          }else{
            // Sauvegarde du login et du token de connexion
            localStorage.setItem('login', res.data.login);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('victory', res.data.victory);
            localStorage.setItem('defeat', res.data.defeat);
            localStorage.setItem('equality', res.data.equality);
            // Rediraction vers la page Dashboard
            window.location = "/dashboard"
          }
        })
    }
    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    getLoginValidationState() {
      if(this.state.login.length === 0){
        return true;
      }else {
        var regex = /[a-zA-Z0-9._-]{3,16}/;
        if (regex.test(this.state.login)) return 'success';
        else return 'error';

      }
    }

    getPasswordValidationState() {
      if(this.state.password.length === 0){
        return true;
      }else {
        var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/;
        if (regex.test(this.state.password)) return 'success';
        else return 'error';

      }
    }

    getCPasswordValidationState() {
      if(this.state.cpassword.length === 0){
        return true;
      }else{
          if (this.state.password === this.state.cpassword) return 'success';
          else return 'error';

      }
    }

    // Rendu de la page
    render() {
        return(
            //add an error class to the div for styling if invalid
            <div className="Login">

                <FormGroup controlId="login" bsSize="large" validationState={this.getLoginValidationState()}>
                  <ControlLabel>Nom</ControlLabel>
                  <FormControl autoFocus type="login" value={this.state.login} onChange={this.handleChange}/>
                  <HelpBlock>Le login doit contenir entre 3 et 16 caractères</HelpBlock>
                </FormGroup>

                <FormGroup controlId="password" bsSize="large" validationState={this.getPasswordValidationState()}>
                  <ControlLabel>Mot de passe</ControlLabel>
                  <FormControl value={this.state.password}
                               onChange={this.handleChange}
                               type="password"/>
                  <HelpBlock>Le mot de passe doit contenir au moins 6 caractères, 1 Majuscule et 1 minuscule </HelpBlock>
                </FormGroup>

                <FormGroup controlId="cpassword" bsSize="large" validationState={this.getCPasswordValidationState()}>
                  <ControlLabel>Confirmation du mot de passe</ControlLabel>
                  <FormControl value={this.state.cpassword} onChange={this.handleChange} type="password"/>
                  <HelpBlock>Les deux mots de passe doivent être identique</HelpBlock>
                </FormGroup>

                <Button onClick={this.send} block bsSize="large" type="submit">
                  Inscription
                </Button>

                <ToastContainer store={ToastStore}/>
            </div>
        )
    }


}
