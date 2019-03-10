import React from 'react';
import { Button } from "react-bootstrap";
import { ToastContainer, ToastStore } from 'react-toasts';
import API from '../../utils/API';
import Checkbox from '../../utils/Checkbox';

const gamesAvailables = [
  'TicTacToe',
]


export class GameConfig extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nbPlayers: '2',
    }

    this.handleNbPlayersChange = this.handleNbPlayersChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  /** Gestion des checkboxes**/
  componentWillMount = () => {
    this.selectedCheckboxes = new Set();
  }

  toggleCheckbox = label => {
    if (this.selectedCheckboxes.has(label)) {
      this.selectedCheckboxes.delete(label);
    } else {
      this.selectedCheckboxes.add(label);
    }
  }
  createCheckbox = label => (
    <Checkbox
      label={label}
      handleCheckboxChange={this.toggleCheckbox}
      key={label}
    />
  )
  createCheckboxes = () => (
    gamesAvailables.map(this.createCheckbox)
  )

  /** Gestion des actions **/
  handleNbPlayersChange(event) {
    this.setState({
      nbPlayers: event.target.value
    });
  }

  handleFormSubmit(event) {
    event.preventDefault();
    // Verification qu'au moins un jeu est selectionné
    if (this.selectedCheckboxes.size === 0) {
      ToastStore.error("Selectionnez au moins un jeu");

    } else {

      let gamesSelected = Array.from(this.selectedCheckboxes)
      console.log(gamesSelected);

      /* Creation de l'objet à envoyer au serveur */
      var _send = {
        creator: localStorage.getItem("login"),
        nbplayers: this.state.nbPlayers,
        gamesSelected: gamesSelected,
      }
      // Envoie des infos de la partie à l'API NodeJS
      API.createGame(_send).then(function (res) {
        ToastStore.success("OK");
        // Redirection vers la page GameRoom
        window.location = "/gameroom:" + res.data;
      }, function (error) {
        console.log(error);
        ToastStore.error("Impossible de crer la partie");
        return;
      })
    }
  }


  wellStyles = { maxWidth: 400, margin: '0 auto 10px' };
  render() {
    return (
      <div className="GameConfig">
        <div className="well" style={this.wellStyles}>
          <form onSubmit={this.handleFormSubmit}>
            <label>Nombre de joueurs</label>

            <div className="radio">
              <label>
                <input type="radio"
                  value="2"
                  checked={this.state.nbPlayers === "2"}
                  onChange={this.handleNbPlayersChange} />
                2
                  </label>
            </div>
            <label>Choix des jeux</label>
            {this.createCheckboxes()}


            <Button bsStyle="primary" type="submit" bsSize="large" block>
              Créer la partie
                </Button>

          </form>


        </div>
        <ToastContainer store={ToastStore} />
      </div>
    )
  }
}
