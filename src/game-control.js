import { humanPlayer, computerPlayer } from "./player.js";
import PubSub from "./pub-sub.js";

let player1;
let player2;
let turn = null;
export const pubSub = new PubSub(); // to be used by a UI controller to receive game events as they happen
export const events = Object.freeze({
  TURN_SWITCH: Symbol("TURN_SWITCH"),
  BOARD_UPDATE: Symbol("BOARD_UPDATE"), 
  GAME_END: Symbol("GAME_END"),
});

function hasBegun() {
  return turn !== null;
}

function toggleTurn() {
  if (!hasBegun()) throw new Error("A game has not started yet");

  turn = turn === 1 ? 2 : 1;
}

export function createPlayers(player1Name, player2Name) {
  if (hasBegun()) 
    throw new Error("A game is already in progress");

  player1 = humanPlayer(player1Name);
  player2 =
    player2Name !== undefined ? humanPlayer(player2Name) : computerPlayer();
}

export function start() {
  if (player1 === undefined || player2 === undefined) 
    throw new Error("Players must be created first");
  if (hasBegun()) 
    throw new Error("A game is already in progress");

  placeShips();
  turn = 1;

  pubSub.publish(events.BOARD_UPDATE, { player1, player2 });
  pubSub.publish(events.TURN_SWITCH, turn);
}

// @todo left as public to enable randomized placements in the future
export function placeShips() {
  player1.gameBoard.placeShip(4, 0, 0, "h");
  player1.gameBoard.placeShip(2, 4, 4, "v");

  player2.gameBoard.placeShip(4, 6, 0, "h");
  player2.gameBoard.placeShip(2, 1, 1, "v");
}

export function playTurn(col, row) {
  if (!hasBegun()) throw new Error("A game has not started yet");
  const opponent = turn === 1 ? player2 : player1;
  try {
    opponent.gameBoard.receiveAttack(col, row);
  } catch (err) {
    throw err;
  }
  pubSub.publish(events.BOARD_UPDATE, {
    player1,
    player2,
  });

  toggleTurn(); 
  pubSub.publish(events.TURN_SWITCH, turn);

  if (opponent.gameBoard.allShipsSunken()) {
    end();
    pubSub.publish(events.GAME_END,);
  }
}

export function end() { 
  turn = null;
}

