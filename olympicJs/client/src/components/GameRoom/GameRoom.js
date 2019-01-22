import React from 'react';
import { Button } from "react-bootstrap";
import {ToastContainer, ToastStore} from 'react-toasts';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/HighlightOff';
import deepPurple from '@material-ui/core/colors/deepPurple';
import socketIOClient from 'socket.io-client';

const styles = theme => ({
  card: {
    maxWidth: 400,
  },
  actions: {
    display: 'flex',
  },
  avatar: {
    backgroundColor: deepPurple[500],
  },
});



export class GameRoom extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            endpoint: "http://127.0.0.1:8080",
            test : 0,
            players : [],
        }
        /* Récuperation de l'id de la partie dans l'url : get */
        this.gameId = this.props.match.params.id;

        // Si la partie n'est pas valide
        if(!this.isGameValid()){
            console.log("Partie non valide");
        }else{
          console.log("Partie valide");
        }
    }

    /** Fonction de verification de la partie **/
    isGameValid() {

      var idgameRegex = /[a-zA-Z0-9]{6}/;
      // Verification de la syntaxe de l'identifiant
      if (idgameRegex.test(this.gameId)) return true;
    }

    getColor = (id) => {

      switch(id){
        case 0 : return "#000000";
        case 1 : return "#0000FF";
        case 2 : return "#00FF00";
        case 3 : return "#00FFFF";
        case 4 : return "#FF0000";
        case 5 : return "#FF00FF";
        case 6 : return "#FFFF00";
        case 7 : return "#000000";
        default : return "#FF0000";
      }
    }

    wellStyles = { maxWidth: 400, margin: '0 auto 10px' };
    render() {
      /* Connexion avec Socket io */
      const socket = socketIOClient(this.state.endpoint);
      /* Rejoindre la partie créée */
      var _dataGame = {
        gameId : this.gameId,
        player : localStorage.getItem("login"),
      }
      /* Init game */
      socket.emit('init-game', _dataGame);
      /* When Init is ok */
      socket.on('ack-init-game', function(res){
        /* Join game */
        socket.emit('join-game', _dataGame);
      });
      /* Mise a jour game */
      socket.on('ack-join-game', res => {
          this.setState({players :  res.dataGame.players});
      });


       const  classes  = this.props;
        return(
          <div className="GameConfig">
            <h1>Salon de jeu</h1>
            <div className="well" style={this.wellStyles}>
                      <h2>Informations</h2>
                      Code de la partie : {this.gameId}
                      <br></br>
                      <h2>Joueurs (0/2)</h2>
                      <div id="cards">
                      </div>
                      {this.state.players.map(player =>
                            <Card className={classes.card} key={player}>
                                <CardHeader
                                    avatar={
                                        <Avatar style={{ backgroundColor: this.getColor(player.length%8) }} aria-label="Recipe">
                                            {player.charAt(0)}
                                        </Avatar>
                                    }
                                    action={
                                        <IconButton>
                                            <MoreVertIcon />
                                        </IconButton>
                                    }
                                    title={player}
                                    subheader=""
                                />
                            </Card>
                          )}
                      <form onSubmit={this.handleFormSubmit}>
                    <br></br>
                  <Button bsStyle="primary" type="submit" bsSize="large" block>
                  Lancer la partie
                </Button>

              </form>
            </div>
            <ToastContainer store={ToastStore}/>
          </div>
        )
    }
}
GameRoom.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GameRoom);
