import { humanPlayer, computerPlayer } from "./player.js";

let player1;
let player2;
let turn = null;

function hasGameBegun() {
  return turn !== null;
}

function toggleTurn() {
  if (!hasGameBegun()) throw new Error("A game has not started yet");

  turn = turn === 1 ? 2 : 1;
}

function startGame(player1Name, player2Name) {
  player1 = humanPlayer(player1Name);
  player2 = computerPlayer();
  placeShips();

  function placeShips() {
    player1.gameBoard.placeShip(4, 0, 0, "h");
    player1.gameBoard.placeShip(2, 4, 4, "v");

    player2.gameBoard.placeShip(4, 6, 0, "h");
    player2.gameBoard.placeShip(2, 1, 1, "v");
  }
}

function attemptAttack(col, row) {
  if (!hasGameBegun()) throw new Error("A game has not started yet");
  const opponent = turn === 1 ? player2 : player1;
  try {
    opponent.gameBoard.receiveAttack(col, row);
  } catch (err) {
    return false;
  }
  toggleTurn();
  return true;
}

export { player1, player2, hasGameBegun, startGame, playTurn };
