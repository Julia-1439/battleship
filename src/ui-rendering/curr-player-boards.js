import * as game from "../game-control.js";

/* ========================================================================== */
/* FUNCTIONS & VARIABLES */
/* ========================================================================== */

const currPlayerShips = document.querySelector(".battlefield.your-ships");
const currPlayerAttacks = document.querySelector(".battlefield.your-attacks");
const gameUpdateMsg = document.querySelector("#game-update-msg");

function renderBoards(data) {
  const p1Board = data.p1Board;
  const p2Board = data.p2Board;

  currPlayerShips.querySelectorAll(".battlefield-btn").forEach((btn) => {
    const col = +btn.dataset.col;
    const row = +btn.dataset.row;
    const cell = p1Board[col][row];
    if (cell.isAttacked || cell.ship) {
      btn.classList.remove("empty");
      if (cell.isAttacked) btn.classList.add("is-attacked");
      if (cell.ship) btn.classList.add("your-ship");
    }
  });

  currPlayerAttacks.querySelectorAll(".battlefield-btn").forEach((btn) => {
    const col = +btn.dataset.col;
    const row = +btn.dataset.row;
    const cell = p2Board[col][row];
    if (cell.isAttacked) {
      btn.classList.remove("empty");
      btn.classList.add("is-attacked");
      if (cell.isAttacked && cell.ship) btn.classList.add("landed-hit");
    }
  });
}

// @todo render ship nodes

/* ========================================================================== */
/* LISTENERS */
/* ========================================================================== */

game.pubSub.subscribe(game.events.BOARD_UPDATE, renderBoards);

currPlayerAttacks.querySelectorAll(".battlefield-btn").forEach((btn) => {
  btn.addEventListener("click", (evt) => {
    const col = +btn.dataset.col;
    const row = +btn.dataset.row;
    try {
      game.playTurn(col, row);
    } catch (err) {
      // @todo render some message with a status update module
    }
  });
});