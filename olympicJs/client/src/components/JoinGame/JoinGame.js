import React from 'react';
import { Button, FormGroup, FormControl } from "react-bootstrap";
import {ToastContainer, ToastStore} from 'react-toasts';
import API from '../../utils/API';

export class JoinGame extends React.Component {
    constructor(props){
        super(props);
        this.state = {
          gameId: ''
        };
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.send.bind(this);

    }

    //Vérification de l'identifiant entré
    getValidationState() {
      const length = this.state.gameId.length;
      if (length===0) return null;
      else if(length !== 6 && length>0) return 'error';
      else return 'success';
    }

    handleFormSubmit(event) {
      event.preventDefault();
      this.setState({ gameId: event.target.value });
    }

    // Gestion des évenements
    send = event => {
        // Si login est manquant
        if(this.state.gameId.length !== 6){
          ToastStore.error("Entrez un identifiant de partie correct")
            return ;
        }

        var _send = {
            login : localStorage.getItem("login"),
            gameId: this.state.gameId

        }
        // Envoie de l'id de la partie à l'API NodeJS
        API.joingame(_send).then(function(res){

          if(res.data.status === "ERROR"){
                ToastStore.error(res.data.result);
              }else{

                // Redirection vers la page de la partie
                window.location = "/dashboard"
              }
        },function(error){
            console.log(error);
            ToastStore.error("La partie n'existe pas ou est complète")
            return;
        })
    }
    wellStyles = { maxWidth: 400, margin: '0 auto 10px' };
    render() {
        return(
          <div className="JoinGame">
            <div className="well" style={this.wellStyles}>


                <FormGroup controlId="formBasicText" validationState={this.getValidationState()}>

                 <FormControl
                   type="text"
                   value={this.state.gameId}
                   placeholder="Entrer l'identifiant de la partie"
                   onChange={this.handleFormSubmit}
                 />
                 <FormControl.Feedback />

                 </FormGroup>
                <Button onClick={this.send} bsStyle="primary" type="submit" bsSize="large" block>
                  Rejoindre la partie
                </Button>

            </div>
            <ToastContainer store={ToastStore}/>
          </div>
        )
    }
}
