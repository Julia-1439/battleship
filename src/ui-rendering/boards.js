import * as game from "../game-control.js";
import { setStatusMsg } from "./status-display.js";

/* ========================================================================== */
/* FUNCTIONS & VARIABLES */
/* ========================================================================== */

const p1 = {
  ships: document.querySelector("#p1-ships"),
  shipsCaption: document.querySelector("#p1-ships caption"),
  shipCells: document.querySelectorAll("#p1-ships .battlefield-btn"),
  attacks: document.querySelector("#p1-attacks"),
  attackBtns: document.querySelectorAll("#p1-attacks .battlefield-btn"),
  attacksCaption: document.querySelector("#p1-attacks caption"),
};

const p2 = {
  ships: document.querySelector("#p2-ships"),
  shipsCaption: document.querySelector("#p2-ships caption"),
  shipCells: document.querySelectorAll("#p2-ships .battlefield-btn"),
  attacks: document.querySelector("#p2-attacks"),
  attackBtns: document.querySelectorAll("#p2-attacks .battlefield-btn"),
  attacksCaption: document.querySelector("#p2-attacks caption"),
};

/**
 * Updates the current player's and opponent's ship board and attack board
 * @param {*} data
 */
function update(data) {
  [p1, p2].forEach((player) => {
    player.shipCells.forEach((btn) => {
      const playerBoard = player === p1 ? data.p1Board : data.p2Board;
      const col = +btn.dataset.col;
      const row = +btn.dataset.row;
      const cell = playerBoard[col][row];
      if (cell.isAttacked || cell.ship) btn.classList.remove("empty");
      else btn.classList.add("empty");
      if (cell.isAttacked) btn.classList.add("is-attacked");
      else btn.classList.remove("is-attacked");
      if (cell.ship) btn.classList.add("your-ship");
      else btn.classList.remove("your-ship");
    });

    player.attackBtns.forEach((btn) => {
      const opponentBoard = player === p1 ? data.p2Board : data.p1Board;
      const col = +btn.dataset.col;
      const row = +btn.dataset.row;
      const cell = opponentBoard[col][row];
      if (cell.isAttacked) btn.classList.remove("empty");
      else btn.classList.add("empty");
      if (cell.isAttacked) btn.classList.add("is-attacked");
      else btn.classList.remove("is-attacked");
      if (cell.isAttacked && cell.ship) btn.classList.add("landed-hit");
      else btn.classList.remove("landed-hit");
    });
  });
}

export function setBattlefieldTitles(p1Name, p2Name) {
  p1.shipsCaption.textContent = `${p1Name}'s Ships`;
  p1.attacksCaption.textContent = `${p1Name}'s Attacks`;
  p2.shipsCaption.textContent = `${p2Name}'s Ships`;
  p2.attacksCaption.textContent = `${p2Name}'s Attacks`;
}

export function showShips(playerNum) {
  if (playerNum === null) return;

  const [currPlayer, otherPlayer] = playerNum === 1 ? [p1, p2] : [p2, p1];
  otherPlayer.ships.classList.add("invisible-out-flow");
  otherPlayer.attacks.classList.add("invisible-out-flow");
  currPlayer.ships.classList.remove("invisible-out-flow");
  currPlayer.attacks.classList.add("invisible-out-flow");
}

export function show(turn) {
  if (turn === null) return;

  const [currPlayer, prevPlayer] = turn === 1 ? [p1, p2] : [p2, p1];
  prevPlayer.ships.classList.add("invisible-out-flow");
  prevPlayer.attacks.classList.add("invisible-out-flow");
  currPlayer.ships.classList.remove("invisible-out-flow");
  currPlayer.attacks.classList.remove("invisible-out-flow");
}

function showEndResults(winner) {
  [p1, p2].forEach((player) => {
    player.ships.classList.remove("invisible-out-flow");
    player.attacks.classList.remove("invisible-out-flow");
    disableAttacks(player);
  });
  const message = `${winner.name ? `Player "${winner.name}"` : "The computer"} has won!`;
  setStatusMsg(message);
}

function enableAttacks(player) {
  player.attackBtns.forEach((btn) => btn.removeAttribute("disabled"));
}

function disableAttacks(player) {
  player.attackBtns.forEach((btn) => btn.setAttribute("disabled", ""));
}

const computerDisabler = () => disableAttacks(p2);

export function initComputerListener() {
  document.addEventListener("custom:p2ScreenVisible", computerDisabler);
}

export function removeComputerListener() {
  document.removeEventListener("custom:p2ScreenVisible", computerDisabler);
}

// @todo render ship nodes

/* ========================================================================== */
/* LISTENERS */
/* ========================================================================== */

game.pubSub.subscribe(game.events.BOARD_UPDATE, update);
game.pubSub.subscribe(game.events.TURN_CHANGE, (turn) => {
  if (!game.hasBegun()) return;
  const currPlayer = turn === 1 ? p1 : p2;
  const prevPlayer = turn === 1 ? p2 : p1;
  enableAttacks(currPlayer);
  disableAttacks(prevPlayer);
});
game.pubSub.subscribe(game.events.WINNER_DECLARED, showEndResults);
[p1.attackBtns, p2.attackBtns].forEach((btnGroup) => {
  btnGroup.forEach((btn) => {
    btn.addEventListener("click", () => {
      const col = +btn.dataset.col;
      const row = +btn.dataset.row;
      try {
        const landedHit = game.playTurn(col, row);
        setStatusMsg(landedHit ? "You landed a hit!" : "You missed!");
      } catch (err) {
        setStatusMsg(err.message);
        return;
      }
    });
  });
});
