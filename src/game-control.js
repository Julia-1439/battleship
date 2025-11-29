import { humanPlayer, computerPlayer } from "./player.js";
import PubSub from "./pub-sub.js";

let p1;
let p2;
let turn = null;
export const pubSub = new PubSub(); // to be used by a UI controller to receive game events as they happen
export const events = Object.freeze({
  TURN_SWITCH: Symbol("TURN_SWITCH"), // @todo rename to "TURN_CHANGE"
  BOARD_UPDATE: Symbol("BOARD_UPDATE"),
  WINNER_DECLARED: Symbol("WINNER_DECLARED"),
});

function hasBegun() {
  return turn !== null;
}

function setTurn(val) {
  if (![1, 2, null].includes(val)) throw new Error("Invalid turn value");
  turn = val;
  pubSub.publish(events.TURN_SWITCH, turn);
}

function toggleTurn() {
  if (!hasBegun()) throw new Error("A game has not started yet");
  turn = turn === 1 ? 2 : 1;
  pubSub.publish(events.TURN_SWITCH, turn);
}

export function createPlayers(p1Name="Unnamed Person", p2Name) {
  if (hasBegun()) throw new Error("A game is already in progress");

  p1 = humanPlayer(p1Name);

  if (p2Name) {
    p2 = humanPlayer(p2Name);
  } else {
    p2 = computerPlayer();
    pubSub.subscribe(events.TURN_SWITCH, (turn) => {
      if (turn === 2) computerPlayTurn();
    });
  }
}

export function start() {
  if (p1 === undefined || p2 === undefined)
    throw new Error("Players must be created first");
  if (hasBegun()) throw new Error("A game is already in progress");

  placeShips();
  setTurn(1);
}

// @todo left as public to enable randomized placements in the future
export function placeShips() {
  p1.gameBoard.placeShip(4, 0, 0, "h");
  p1.gameBoard.placeShip(2, 5, 4, "v");

  p2.gameBoard.placeShip(4, 6, 0, "h");
  p2.gameBoard.placeShip(2, 1, 1, "v");

  pubSub.publish(events.BOARD_UPDATE, {
    p1Board: p1.gameBoard.state,
    p2Board: p2.gameBoard.state,
  });
}

export function playTurn(col, row) {
  if (!hasBegun()) throw new Error("A game has not started yet");

  // Attempt attack
  const opponent = turn === 1 ? p2 : p1;
  try {
    opponent.gameBoard.receiveAttack(col, row);
  } catch (err) {
    throw err;
  }
  pubSub.publish(events.BOARD_UPDATE, {
    p1Board: p1.gameBoard.state,
    p2Board: p2.gameBoard.state,
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
    const [col, row] = p2.calcRandomAttack();
    try {
      playTurn(col, row);
    } catch (err) {
      continue;
    }
    foundValidAttack = true;
  }
}

export function clear() {
  p1 = undefined;
  p2 = undefined;

  setTurn(null);
  pubSub.clear();
}

function handleWin() {
  const winner = turn === 1 ? p1 : p2;
  pubSub.publish(events.WINNER_DECLARED, winner);

  setTurn(null);
  pubSub.clear();
}