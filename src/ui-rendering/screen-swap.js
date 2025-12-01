import * as game from "../game-control.js";
import { show as showBoards } from "./boards.js";
import { setStatusMsg } from "./status-display.js";

/* ========================================================================== */
/* FUNCTIONS & VARIABLES */
/* ========================================================================== */

let turn;
let atGameStart = true;
const swapScreenBtn = document.querySelector("#swap-screen-btn");

function setTurn(val) {
  turn = val;
}

function displaySwapBtn() {
  swapScreenBtn.classList.remove("invisible-in-flow");
}

function hideSwapBtn() {
  swapScreenBtn.classList.add("invisible-in-flow");
}

/* ========================================================================== */
/* LISTENERS */
/* ========================================================================== */

game.pubSub.subscribe(game.events.TURN_CHANGE, (val) => {
  setTurn(val);
  if (turn === null) return;
  if (turn === 2) atGameStart = false; 
  if (!atGameStart) displaySwapBtn();
});

swapScreenBtn.addEventListener("click", async () => {
  hideSwapBtn();
  setStatusMsg("Swapping screens in a moment, look away!");
  await setTimeout(() => {
    showBoards(turn);
    if (turn === 2)
      document.dispatchEvent(new CustomEvent("custom:p2ScreenVisible"));
    setStatusMsg(""); // @todo no clue why this does not work if I move it to after setTimeout. try isolating the problem
  }, 1500);
});

