import React from 'react';
import { Button } from "react-bootstrap";
import API from '../../utils/API';


export class Dashboard extends React.Component {
  constructor(props){
      super(props);

      /* Creation de l'objet à envoyer au serveur */
      var _send = {
          login: localStorage.getItem('login'),
      }
      // Envoie du login et password à l'API NodeJS
      API.getStats(_send).then(function(res){
            var stats = res.data;
            // Sauvegarde du token de connexion
            localStorage.setItem('victory', stats.victory);
            localStorage.setItem('defeat', stats.defeat);
            localStorage.setItem('equality', stats.equality);


      },function(error){
          console.log(error);
          return;
      })

  }

    wellStyles = { maxWidth: 400, margin: '0 auto 10px' };
    render() {
        return(
            <div className="Dashboard">
                <h1>Bonjour {localStorage.getItem("login")}</h1>
                  <span style={{ color: 'green' }}>{localStorage.getItem("victory")}</span> / {localStorage.getItem("equality")} / <span style={{ color: 'red' }}>{localStorage.getItem("defeat")}</span>
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
