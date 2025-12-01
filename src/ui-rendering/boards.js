import * as game from "../game-control.js";
import { setStatusMsg } from "./status-display.js";

/* ========================================================================== */
/* FUNCTIONS & VARIABLES */
/* ========================================================================== */

const p1 = {
  ships: document.querySelector("#p1-ships"),
  attacks: document.querySelector("#p1-attacks"),
};
p1.shipCells = p1.ships.querySelectorAll(".battlefield-btn");
p1.attackBtns = p1.attacks.querySelectorAll(".battlefield-btn");

const p2 = {
  ships: document.querySelector("#p2-ships"),
  attacks: document.querySelector("#p2-attacks"),
};
p2.shipCells = p2.ships.querySelectorAll(".battlefield-btn");
p2.attackBtns = p2.attacks.querySelectorAll(".battlefield-btn");

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
      if (cell.isAttacked || cell.ship) {
        btn.classList.remove("empty");
        if (cell.isAttacked) btn.classList.add("is-attacked");
        if (cell.ship) btn.classList.add("your-ship");
      }
    });

    player.attackBtns.forEach((btn) => {
      const opponentBoard = player === p1 ? data.p2Board : data.p1Board;
      const col = +btn.dataset.col;
      const row = +btn.dataset.row;
      const cell = opponentBoard[col][row];
      if (cell.isAttacked) {
        btn.classList.remove("empty");
        btn.classList.add("is-attacked");
        if (cell.isAttacked && cell.ship) btn.classList.add("landed-hit");
      }
    });
  });
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
        game.playTurn(col, row);
      } catch (err) {
        setStatusMsg(err.message);
        return; 
      }

      // valid attack was done
      // setStatusMsg(""); // @todo write something // NOTE: overrides the winner message
    });
  });
});
