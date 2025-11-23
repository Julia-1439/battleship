import { humanPlayer, computerPlayer } from "./player.js";
import PubSub from "./pub-sub.js";

let player1;
let player2;
let turn = null;
export const pubSub = new PubSub(); // to be used by a UI controller to recognize game events, as defined in `events`
export const events = { // replace with symbols?
  GAME_START: "GAME_START",
  SUCCESSFUL_ATTACK: "SUCCESSFUL_ATTACK", 
  GAME_END: "GAME_END",
};

function hasGameBegun() {
  return turn !== null;
}

function toggleTurn() {
  if (!hasGameBegun()) throw new Error("A game has not started yet");

  turn = turn === 1 ? 2 : 1;
}

export function createPlayers(player1Name, player2Name) {
  if (hasGameBegun()) 
    throw new Error("A game is already in progress")

  player1 = humanPlayer(player1Name);
  player2 = computerPlayer();
}

export function startGame() {
  if (player1 === undefined || player2 === undefined) 
    throw new Error("Players must be created first");
  if (hasGameBegun()) 
    throw new Error("A game is already in progress")

  placeShips();
  turn = 1;
  pubSub.publish(events.GAME_START,);
}

// will be randomized in the future
export function placeShips() {
  player1.gameBoard.placeShip(4, 0, 0, "h");
  player1.gameBoard.placeShip(2, 4, 4, "v");

  player2.gameBoard.placeShip(4, 6, 0, "h");
  player2.gameBoard.placeShip(2, 1, 1, "v");
}

export function playTurn(col, row) {
  if (!hasGameBegun()) throw new Error("A game has not started yet");
  const opponent = turn === 1 ? player2 : player1;
  try {
    opponent.gameBoard.receiveAttack(col, row);
  } catch (err) {
    throw err;
  }
  if (opponent.gameBoard.allShipsSunken()) {
    endGame();
    pubSub.publish(events.GAME_END);
  }
  
  toggleTurn(); 
  pubSub.publish(events.SUCCESSFUL_ATTACK,);
}

function endGame() { 
  turn = null;
}

