import { humanPlayer, computerPlayer } from "./player.js";
import PubSub from "./pub-sub.js";

let player1;
let player2;
let turn = null;
export const pubSub = new PubSub(); // to be used by a UI controller to receive game events as they happen
export const events = Object.freeze({
  TURN_SWITCH: Symbol("TURN_SWITCH"),
  BOARD_UPDATE: Symbol("BOARD_UPDATE"),
  WINNER_DECLARED: Symbol("WINNER_DECLARED"),
});

function hasBegun() {
  return turn !== null;
}

function setTurn(val) {
  turn = val;
  pubSub.publish(events.TURN_SWITCH, turn);
}

function toggleTurn() {
  if (!hasBegun()) throw new Error("A game has not started yet");
  turn = turn === 1 ? 2 : 1;
  pubSub.publish(events.TURN_SWITCH, turn);
}

export function createPlayers(player1Name="Unnamed Person", player2Name) {
  if (hasBegun()) throw new Error("A game is already in progress");

  player1 = humanPlayer(player1Name);

  if (player2Name) {
    player2 = humanPlayer(player2Name);
  } else {
    player2 = computerPlayer();
    pubSub.subscribe(events.TURN_SWITCH, (turn) => {
      if (turn === 2) computerPlayTurn();
    });
  }
}

export function start() {
  if (player1 === undefined || player2 === undefined)
    throw new Error("Players must be created first");
  if (hasBegun()) throw new Error("A game is already in progress");

  placeShips();
  setTurn(1);
}

// @todo left as public to enable randomized placements in the future
export function placeShips() {
  player1.gameBoard.placeShip(4, 0, 0, "h");
  player1.gameBoard.placeShip(2, 4, 4, "v");

  player2.gameBoard.placeShip(4, 6, 0, "h");
  player2.gameBoard.placeShip(2, 1, 1, "v");

  pubSub.publish(events.BOARD_UPDATE, { player1, player2 });
}

export function playTurn(col, row) {
  if (!hasBegun()) throw new Error("A game has not started yet");

  // Attempt attack
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

  // Assess game state
  if (!opponent.gameBoard.allShipsSunken()) {
    toggleTurn();
  } else {
    handleWin();
  }
}

function computerPlayTurn() {
  let foundValidAttack = false;
  while (!foundValidAttack) {
    const [col, row] = player2.calcRandomAttack();
    try {
      playTurn(col, row);
    } catch (err) {
      continue;
    }
    foundValidAttack = true;
  }
}

export function clear() {
  player1 = undefined;
  player2 = undefined;

  setTurn(null);
  pubSub.clear();
}

function handleWin() {
  const winner = turn === 1 ? player1 : player2;
  pubSub.publish(events.WINNER_DECLARED, winner);

  setTurn(null);
  pubSub.clear();
}