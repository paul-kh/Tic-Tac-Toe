import { act, useState } from "react";

import Player from "./components/player";
import GameBoard from "./components/GameBoard";
import Log from "./components/Log";
import GameOver from "./components/GameOver";
import { WINNING_COMBINATIONS } from "./winning-combinations";

const PLAYERS = {
  X: "Player 1",
  O: "Player 2",
};

// Lifted from <GameBoard> for determining winner
const INITIAL_GAME_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function deriveCurrentPlayer(gameTurns) {
  let currentPlayer = "X"; //Initializing starting turn to player "X"

  if (gameTurns.length > 0 && gameTurns[0].player === "X") {
    currentPlayer = "O";
  }

  return currentPlayer;
}

function deriveGameBoard(gameTurns) {
  //Always deep copy array or object by NOT immutating them
  let gameBoard = [...INITIAL_GAME_BOARD].map((innerArray) => [...innerArray]);

  for (const turn of gameTurns) {
    const { square, player } = turn;
    const { row, col } = square;

    gameBoard[row][col] = player;
  }
  return gameBoard;
}

function deriveWinner(gameBoard, players) {
  // DETERMINING WINNER !!!!
  // Winner should have symbol in all 3 squares of any element oject of the array WINNING_COMBINATION
  // We need to check for symbol of the 3 squares in gameBoard array of the <GameBoard> to determine the winner.
  // We have to lift the state of <GameBoard> so we can access its gameBoard array here

  let winner;
  //Checking symbol of each square
  for (const combination of WINNING_COMBINATIONS) {
    const firstSquareSymbol =
      gameBoard[combination[0].row][combination[0].column];
    const secondSquareSymbol =
      gameBoard[combination[1].row][combination[1].column];
    const thirdSquareSymbol =
      gameBoard[combination[2].row][combination[2].column];

    // If firstSquareSybol is null the we don't need to check for equality with 2nd and 3rd square symbols
    if (
      firstSquareSymbol &&
      firstSquareSymbol === secondSquareSymbol &&
      firstSquareSymbol === thirdSquareSymbol
    ) {
      winner = players[firstSquareSymbol];
    }
  }
  return winner;
}

function App() {
  /* SHOWING PLAYER NAME AS WINNER INSTEAD OF SYMBOL*/
  // It's not recommended to lift the state of <Player> component since it brings complexity
  // Instead, we created another state in the <App> component for controlling player names & symbols
  const [players, setPlayers] = useState(PLAYERS);

  const [gameTurns, setGameTurns] = useState([]);

  const activePlayer = deriveCurrentPlayer(gameTurns);

  const gameBoard = deriveGameBoard(gameTurns);

  const winner = deriveWinner(gameBoard, players);

  // CHECKING FOR A DRAW
  // There's a draw when all the 9 game turns completed and no winner
  const hasDraw = gameTurns.length === 9 && !winner;

  function handleSelectSquare(rowIndex, colIndex) {
    setGameTurns((prevTurns) => {
      const currentPlayer = deriveCurrentPlayer(prevTurns);

      const updatedTurns = [
        { square: { row: rowIndex, col: colIndex }, player: currentPlayer },
        ...prevTurns,
      ];

      return updatedTurns;
    });
  }

  //RESETTING GAME
  // To reset the game, simply empty the gameTurns state array
  function handleGameRestart() {
    setGameTurns([]);
  }

  function handlePlayerName(symbol, newName) {
    // We don't want to lose other player info
    // since we're updating only 1 player's info
    // so we have to immutate the state object by
    // using the Spread operator in an anomymous function
    setPlayers((prevPlayers) => {
      return {
        ...prevPlayers,
        //modifying the symbol property to new player name  after spreading
        [symbol]: newName,
      };
    });
  }
  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player
            initialName={PLAYERS.X}
            symbol="X"
            isActive={activePlayer === "X"}
            onChangeName={handlePlayerName}
          />
          <Player
            initialName={PLAYERS.O}
            symbol="O"
            isActive={activePlayer === "O"}
            onChangeName={handlePlayerName}
          />
        </ol>
        {(winner || hasDraw) && (
          <GameOver winner={winner} onResetGame={handleGameRestart} />
        )}
        {/* same as this code: {winner ? <p>You won, {winer}! : null} */}
        <GameBoard onSelectSquare={handleSelectSquare} board={gameBoard} />
      </div>
      <Log turns={gameTurns} />
    </main>
  );
}

export default App;
