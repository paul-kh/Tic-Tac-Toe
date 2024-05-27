import { act, useState } from "react";

import Player from "./components/player";
import GameBoard from "./components/GameBoard";
import Log from "./components/Log";
import GameOver from "./components/GameOver";
import { WINNING_COMBINATIONS } from "./winning-combinations";

// Lifted from <GameBoard> for determining winner
const initialGameboard = [
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

function App() {
  const [gameTurns, setGameTurns] = useState([]);
  // Line below was commented out because we try to manage little state as possible
  //const [activePlayer, setActivePlayer] = useState("X");

  const activePlayer = deriveCurrentPlayer(gameTurns);

  // DETERMINING WINNER !!!!
  // Winner should have symbol in all 3 squares of any element oject of the array WINNING_COMBINATION
  // We need to check for symbol of the 3 squares in gameBoard array of the <GameBoard> to determine the winner.
  // We have to lift the state of <GameBoard> so we can access its gameBoard array here

  //Always deep copy array or object by NOT immutating them
  let gameBoard = [...initialGameboard].map((innerArray) => [...innerArray]);

  for (const turn of gameTurns) {
    const { square, player } = turn;
    const { row, col } = square;

    gameBoard[row][col] = player;
  }

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
      winner = firstSquareSymbol;
    }
  }

  // CHECKING FOR A DRAW
  // There's a draw when all the 9 game turns completed and no winner
  const hasDraw = gameTurns.length === 9 && !winner;

  //RESETTING GAME
  // To reset the game, simply empty the gameTurns state array
  function resetGame(gameTurns) {
    setGameTurns([]);
  }

  function handleSelectSquare(rowIndex, colIndex) {
    //setActivePlayer((curActivePlayer) => (curActivePlayer === "X" ? "O" : "X"));
    setGameTurns((prevTurns) => {
      const currentPlayer = deriveCurrentPlayer(prevTurns);

      const updatedTurns = [
        { square: { row: rowIndex, col: colIndex }, player: currentPlayer },
        ...prevTurns,
      ];

      return updatedTurns;
    });
  }
  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player
            initialName="Player 1"
            symbol="X"
            isActive={activePlayer === "X"}
          />
          <Player
            initialName="Player 2"
            symbol="O"
            isActive={activePlayer === "O"}
          />
        </ol>
        {(winner || hasDraw) && (
          <GameOver winner={winner} resetGame={resetGame} />
        )}
        {/* same as this code: {winner ? <p>You won, {winer}! : null} */}
        <GameBoard onSelectSquare={handleSelectSquare} board={gameBoard} />
      </div>
      <Log turns={gameTurns} />
    </main>
  );
}

export default App;
