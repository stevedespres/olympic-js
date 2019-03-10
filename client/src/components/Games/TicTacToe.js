import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import React from 'react';
//import { Button } from "react-bootstrap";
import { ToastContainer, ToastStore } from 'react-toasts';
import { Confirm } from 'semantic-ui-react';
import socketIOClient from 'socket.io-client';
import './TicTacToe.css';

const Square = props => {
  const { value, ...other } = props;
  return (
    <button className={'square ' + value} onClick={() => other.onClick()}>{value}</button>
  );
}

const Board = props => {
  const { cells, squares, ...other } = props,
    ArrRows = [0, 1, 2];
  let counter = 1;
  return (
    <div className="board"> {
      ArrRows.map((row) =>
        <div key={row.toString()} className="board-row">
          {
            cells.slice(row * 3, counter++ * 3).map((cellID) =>
              <Square key={cellID.toString()} value={squares[cellID]} onClick={() => other.onClick(cellID)} />
            )
          }
        </div>
      )
    }
    </div>
  );
}

const Status = props => {
  const { gameId, squares, xIsNext, players, socket, end } = props,
    winner = calculateWinner(squares),
    effect = winner ? 'bounce' : '';
  let status;
  // Si il y a un gagnant
  if (winner) {
    if (winner === 'x') {
      status = players[0] + ' à gagné !';
    }
    if (winner === 'o') {
      status = players[1] + ' à gagné !';
    }
    if (winner === '=') {
      status = 'Égalité !';
    }

    var data = {
      gameId: gameId,
      winner: winner,
    }
    // Si le résultat n'a pas déjà été émis
    if (!end) {
      // Un seul joueur envoie le résultat au serveur
      if (players[0] === localStorage.getItem('login')) {
        /* End Tic Tac Toe */
        socket.emit('end-tictactoe', data);
      }
    }
  } else {
    status = 'C\'est à ' + (xIsNext ? players[0] : players[1]) + ' de jouer';
  }

  //Renders React element ...
  return (
    <div className="game-info__status">
      <div className={'status ' + effect}>{status}</div>
    </div>
  );
}


// Moves component
const Moves = props => {
  const { history, stepNumber, ...other } = props;
  const moves = history.map((step, move) => {
    const clickIndex = step.clickIndex;
    const col = Math.floor(clickIndex % 3),
      row = Math.floor(clickIndex / 3),
      //col and row where the latest click happened
      clickPosition = '(row:' + row + ', col:' + col + ')';
    let desc = move ? 'Go to move #' + move + ' ' + clickPosition : 'Go to game start';
    //Bold the currently selected item in the move list
    const btn_highlight = (stepNumber === move) ? 'btn-primary' : 'btn-secondary';
    return (
      <li key={move}>
        <button className={"btn " + btn_highlight + " btn-block"}
          onClick={() => other.onClick(move)}>{desc}</button>
      </li>
    );
  });

  return (
    <div className="game-info__moves">
      <ol className="list-moves list-unstyled">
        {moves}
      </ol>
    </div>
  );

  //Renders React element ...
  return (
    <div className="game-info__moves">
      <ol className="list-moves list-unstyled">
        test
            </ol>
    </div>
  );
}

function calculateWinner(squares) {
  // Combinaisons gagnantes
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  var equality = true;
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
    // Il y a au moins une case non renseigné => il n'y a pas egalité
    if (squares[a] === null || squares[b] === null || squares[c] === null) {
      equality = false;
    }
  }
  // Si egualité
  if (equality) {
    return '=';
  }
  return null;
}

export class TicTacToe extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      endpoint: "http://127.0.0.1:8080",
      history: [{
        squares: Array(9).fill(null),
        //Help calculate the col and row where the latest click happened
        clickIndex: null
      }],
      xIsNext: true,
      stepNumber: 0,
      players: [],
      chat: [{ txt: String, idx: Number }],
      open: false,
      winner: "",
      end: false,
      messages: []

    };
    /* Récuperation de l'id de la partie dans l'url : get */
    this.gameId = this.props.match.params.id;

    /* Connexion avec Socket io */
    this.socket = socketIOClient(this.state.endpoint);
    /* Rejoindre la partie créée */
    var _dataGame = {
      gameId: this.gameId,
      player: localStorage.getItem("login"),
    }

    this.handleClick = this.handleClick.bind(this);
    this.jumpTo = this.jumpTo.bind(this);

    /* Init Tic Tac Toe */
    this.socket.emit('init-tictactoe', _dataGame);
    /* When Init is ok */
    this.socket.on('ack-init-tictactoe', res => {
      console.log(res)
      this.setState({
        players: res.dataTicTacToe.players,
        squares: res.dataTicTacToe.cells
      });

    });
    // MaJ partie
    this.socket.on('ack-turn-tictactoe', res => {
      console.log(res.data)

      this.setState({
        history: res.data.history,
        stepNumber: res.data.stepNumber,
        xIsNext: res.data.xIsNext
      });
    });

    // Récupération du message et ajouts dans la liste
    this.socket.on('ack-message', res => {
      this.setState(prevState => ({
        messages: [...prevState.messages, res]
      }))
    });


    // Fin de partie
    this.socket.on('ack-end-tictactoe', res => {
      this.setState({
        winner: res.winner,
        open: true,
        end: true,
      });
    });

    // Si joueur quitte la partie
    this.socket.on('ack-exit-tictactoe', res => {
      window.location = "/Dashboard";
    });

    // Si joueur quitte la partie
    this.socket.on('ack-replay-tictactoe', res => {
      window.location.reload();
    });
  }

  handleClick(i) {

    // Si c'est au bon joueur de jouer
    if ((this.state.xIsNext ? this.state.players[0] : this.state.players[1]) === localStorage.getItem("login")) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      if (squares[i] || calculateWinner(squares)) {
        return;
      }
      squares[i] = this.state.xIsNext ? 'x' : 'o';
      console.log(history.concat([{ squares: squares, clickIndex: i }]));
      this.setState({
        history: history.concat([{ squares: squares, clickIndex: i }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
        chat: {
          txt: "test",
          idx: 0
        }
      });
      /* Init game */
      var data = {
        gameId: this.gameId,
        history: history.concat([{ squares: squares, clickIndex: i }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
      }
      this.socket.emit('turn-tictactoe', data);
    }
  }

  // Rejouer une partie
  handleReplay = () => {
    this.setState({ open: false });
    this.socket.emit('replay-tictactoe', this.gameId);
  }

  // Quitter la partie
  handleExit = () => {
    this.setState({ open: false });
    this.socket.emit('exit-tictactoe', this.gameId);
    window.location = "/Dashboard";
  }

  // Concatenation de l'emoji dans le message
  handleEmoji = (emoji) => {
    this.refs.message.value = this.refs.message.value.concat(emoji);
  }

  // Envoie du message au serveur
  handleSendMessage = () => {
    var date = new Date();
    var message = {
      message: this.refs.message.value,
      gameId: this.gameId,
      user: localStorage.getItem('login'),
      heure: date.getHours(),
      minute: date.getMinutes(),
      seconde: date.getSeconds()

    }
    this.socket.emit('message', message);
    this.refs.message.value = '';
  }

  //...
  //Changes the game current step and update player's turn accordingly
  //(will influence the game history)
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }


  wellStyles = { maxWidth: 400, margin: '0 auto 10px' };
  render() {
    /* Connexion avec Socket io */
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const squares = current.squares.slice();
    const classes = this.props;
    return (

      <div className="GameConfig">
        <link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.1.0/semantic.min.css" />
        <h1>Tic Tac Toe</h1>
        <div className="game">
          <div className="container">
            <div className="row">
              <div className="col-sm-4 col-xs-4">
                <div class="row">
                  <input class="col chat-input" type="text" id="message" ref="message" />
                  <input class="col button-chat send-msg" type="submit" id="send" value="Envoyer mon message" onClick={this.handleSendMessage.bind(this)} />
                </div>
                <div class="row">
                  <button class="col button-chat emoji" id="heart" onClick={this.handleEmoji.bind(this, '❤️')}>❤️</button>
                  <button class="col button-chat emoji" id="muscle" onClick={this.handleEmoji.bind(this, '💪')}>💪</button>
                  <button class="col button-chat emoji" id="smile" onClick={this.handleEmoji.bind(this, '😃')}>😃</button>
                  <button class="col button-chat emoji" id="unhappy" onClick={this.handleEmoji.bind(this, '😒')}>😒</button>
                </div>
                <div id="messages">
                  <div id="msgtpl">
                    <div>
                      {this.state.messages.map(data_msg =>
                        <Card className={classes.card} key={data_msg}>
                          <CardHeader
                            title={data_msg.user + " |  " + data_msg.heure + "h" + data_msg.minute + "m" + data_msg.seconde + "s"}
                          />
                          <CardContent>

                            {data_msg.message}

                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                </div>

                <script src="node_modules/mustache/mustache.js"></script>
                <script src="http://localhost:3000/socket.io/socket.io.js"></script>
                <script src="chat.js"></script>
              </div>

              <div className="col-sm-8 col-xs-8">
                <div className="game-board">
                  <Board squares={squares} onClick={this.handleClick} cells={[0, 1, 2, 3, 4, 5, 6, 7, 8]} />
                </div>

              </div>
            </div>
          </div>
        </div>

        <ToastContainer store={ToastStore} />
        <div>
          <Confirm
            open={this.state.open}
            header={this.state.winner}
            content='Voulez-vous rejouer ?'
            onCancel={this.handleExit}
            onConfirm={this.handleReplay}
          />
        </div>
      </div>

    )
  }
}
