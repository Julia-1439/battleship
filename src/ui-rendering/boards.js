import * as game from "../game-control.js";
import { setStatusMsg } from "./status-display.js";

/* ========================================================================== */
/* FUNCTIONS & VARIABLES */
/* ========================================================================== */

const p1 = {
  ships: document.querySelector(`.battlefield.your-ships[data-player="1"]`),
  attacks: document.querySelector(`.battlefield.your-attacks[data-player="1"]`),
};
p1.shipCells = p1.ships.querySelectorAll(".battlefield-btn");
p1.attackBtns = p1.attacks.querySelectorAll(".battlefield-btn");

const p2 = {
  ships: document.querySelector(`.battlefield.your-ships[data-player="2"]`),
  attacks: document.querySelector(`.battlefield.your-attacks[data-player="2"]`),
};
p2.shipCells = p2.ships.querySelectorAll(".battlefield-btn");
p2.attackBtns = p2.attacks.querySelectorAll(".battlefield-btn");

/**
 * Updates the current player's and opponent's ship board and attack board 
 * @param {*} data 
 */
function update(data) {
  // @todo eliminate the redundancy here
  p1.shipCells.forEach((btn) => {
    const col = +btn.dataset.col;
    const row = +btn.dataset.row;
    const cell = data.p1Board[col][row];
    if (cell.isAttacked || cell.ship) {
      btn.classList.remove("empty");
      if (cell.isAttacked) btn.classList.add("is-attacked");
      if (cell.ship) btn.classList.add("your-ship");
    }
  });

  p2.shipCells.forEach((btn) => {
    const col = +btn.dataset.col;
    const row = +btn.dataset.row;
    const cell = data.p2Board[col][row];
    if (cell.isAttacked || cell.ship) {
      btn.classList.remove("empty");
      if (cell.isAttacked) btn.classList.add("is-attacked");
      if (cell.ship) btn.classList.add("your-ship");
    }
  });

  p1.attackBtns.forEach((btn) => {
    const col = +btn.dataset.col;
    const row = +btn.dataset.row;
    const cell = data.p2Board[col][row];
    if (cell.isAttacked) {
      btn.classList.remove("empty");
      btn.classList.add("is-attacked");
      if (cell.isAttacked && cell.ship) btn.classList.add("landed-hit");
    }
  });

  p2.attackBtns.forEach((btn) => {
    const col = +btn.dataset.col;
    const row = +btn.dataset.row;
    const cell = data.p1Board[col][row];
    if (cell.isAttacked) {
      btn.classList.remove("empty");
      btn.classList.add("is-attacked");
      if (cell.isAttacked && cell.ship) btn.classList.add("landed-hit");
    }
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

function enableAttacks(turn) {
  if (turn === null) return;
  const currPlayer = turn === 1 ? p1 : p2;
  currPlayer.attackBtns.forEach((btn) => btn.removeAttribute("disabled"));
}

// @todo disable attacks func?

// @todo render ship nodes

/* ========================================================================== */
/* LISTENERS */
/* ========================================================================== */

game.pubSub.subscribe(game.events.BOARD_UPDATE, update);
game.pubSub.subscribe(game.events.TURN_SWITCH, enableAttacks);

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
      setStatusMsg(""); // @todo write something
      btnGroup.forEach((btn) => btn.setAttribute("disabled", ""));
    });
  });
});

// @todo add ids to each of the tables. can have ids and classes you know! would simplify the query selection process