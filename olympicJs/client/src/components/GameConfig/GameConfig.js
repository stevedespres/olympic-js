import React from 'react';
import { Button, FormGroup, FormControl,MenuItem, ControlLabel } from "react-bootstrap";
import Checkbox from '../../utils/Checkbox';
import {ToastContainer, ToastStore} from 'react-toasts';
import API from '../../utils/API';

const gamesAvailables = [
  'TIC TAC TOE',
  'PUISSANCE 4',
]


export class GameConfig extends React.Component {
    constructor(props){
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

    handleGamesChange(event) {
      this.setState({
        nbPlayers: event.target.value
      });
    }

    handleFormSubmit(event) {
      event.preventDefault();
      // Verification qu'au moins un jeu est selectionné
      if(this.selectedCheckboxes.size == 0){
        ToastStore.error("Selectionnez au moins un jeu");
      }
      for (const checkbox of this.selectedCheckboxes) {
        console.log(checkbox, 'is selected.');
      }

      alert(`You chose the ${this.state.nbPlayers} pizza.`);
}


    wellStyles = { maxWidth: 400, margin: '0 auto 10px' };
    render() {
        return(
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

                <div className="radio">
                  <label>
                    <input type="radio"
                    value="4"
                    checked={this.state.nbPlayers === "4"}
                    onChange={this.handleNbPlayersChange}/>
                    4
                  </label>
                 </div>

                 <div className="radio">
                    <label>
                      <input type="radio"
                      value="8"
                      checked={this.state.nbPlayers === "8"}
                      onChange={this.handleNbPlayersChange} />
                      8
                    </label>
                  </div>

                <label>Choix des jeux</label>
                  {this.createCheckboxes()}


                  <Button bsStyle="primary" type="submit" bsSize="large" block>
                  Créer la partie
                </Button>

              </form>


            </div>
            <ToastContainer store={ToastStore}/>
          </div>
        )
    }
}
