import { humanPlayer, computerPlayer } from "./player.js";
import PubSub from "./pub-sub.js";

let p1;
let p2;
export let isP2Computer;
let turn = null;
const defaultShipsConfig = new Set([
  [2, 1, 1, "v"],
  [4, 6, 2, "h"],
  [2, 3, 6, "h"],
  [3, 7, 5, "h"],
  [2, 0, 7, "v"],
  [3, 2, 6, "v"],
]);
export const pubSub = new PubSub(); // to be used by a UI controller to receive game events as they happen
export const events = Object.freeze({
  TURN_CHANGE: Symbol("TURN_CHANGE"),
  BOARD_UPDATE: Symbol("BOARD_UPDATE"),
  WINNER_DECLARED: Symbol("WINNER_DECLARED"),
});

export function hasBegun() {
  return turn !== null;
}

function setTurn(val) {
  if (![1, 2, null].includes(val)) throw new Error("Invalid turn value");
  turn = val;
  pubSub.publish(events.TURN_CHANGE, turn);
}

function toggleTurn() {
  if (!hasBegun()) throw new Error("A game has not started yet");
  turn = turn === 1 ? 2 : 1;
  pubSub.publish(events.TURN_CHANGE, turn);
}

export function createPlayers(p1Name = "Unnamed Person", p2Name, _isP2Computer) {
  if (hasBegun()) throw new Error("A game is already in progress");

  p1 = humanPlayer(p1Name);
  p2 = _isP2Computer ? computerPlayer() : humanPlayer(p2Name);
  isP2Computer = _isP2Computer;
}

export function start() {
  if (p1 === undefined || p2 === undefined)
    throw new Error("Players must be created first");
  if (hasBegun()) throw new Error("A game is already in progress");

  placeShips();
  randomizeShips(1);
  randomizeShips(2);
  setTurn(1);
}

function placeShips() {
  [p1, p2].forEach((player) => {
    defaultShipsConfig.forEach((config) =>
      player.gameBoard.placeShip(...config),
    );
  });
  pubSub.publish(events.BOARD_UPDATE, {
    p1Board: p1.gameBoard.state,
    p2Board: p2.gameBoard.state,
  });
}

export function randomizeShips(playerNum) {
  const player = playerNum === 1 ? p1 : p2;
  player.gameBoard.randomizeShips();
  pubSub.publish(events.BOARD_UPDATE, {
    p1Board: p1.gameBoard.state,
    p2Board: p2.gameBoard.state,
  });
}

export function playTurn(col, row) {
  if (!hasBegun()) throw new Error("A game has not started yet");

  // Attempt attack
  const opponent = turn === 1 ? p2 : p1;
  opponent.gameBoard.receiveAttack(col, row);
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
  
  // Return the outcome of the attack
  const attackedCell = opponent.gameBoard.state[col][row];
  return attackedCell.ship ? 1 : 0;
}

export function computerPlayTurn() {
  if (!hasBegun()) throw new Error("A game has not started yet");
  if (turn !== 2) throw new Error("It is not the computer's turn yet");
    
  let outcome;
  let foundValidAttack = false;
  while (!foundValidAttack) {
    const [col, row] = p2.calcRandomAttack();
    try {
      outcome = playTurn(col, row);
    } catch {
      continue;
    }
    foundValidAttack = true;
  }
  return outcome;
}

export function clear() {
  p1 = undefined;
  p2 = undefined;
  isP2Computer = undefined;
  setTurn(null);
}

function handleWin() {
  const winner = turn === 1 ? p1 : p2;
  pubSub.publish(events.WINNER_DECLARED, winner);

  setTurn(null);
}
