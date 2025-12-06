import * as game from "../game-control.js";
import { show as showBoards } from "./boards.js";
import { setStatusMsg } from "./status-display.js";
import { delay } from "../delayer.js";

/* ========================================================================== */
/* FUNCTIONS & VARIABLES */
/* ========================================================================== */

let currScreen = 1;
let atGameStart = true;
const SWAPPING_TIME = 1500;
const swapScreenBtn = document.querySelector("#swap-screen-btn");

export function displaySwapBtn() {
  swapScreenBtn.classList.remove("invisible-out-flow");
}

export function hideSwapBtn() {
  swapScreenBtn.classList.add("invisible-out-flow");
}

/* ========================================================================== */
/* LISTENERS */
/* ========================================================================== */

game.pubSub.subscribe(game.events.TURN_CHANGE, (turn) => {
  if (turn === null) return;
  if (turn === 2) atGameStart = false; 
  if (!atGameStart) displaySwapBtn();
});

swapScreenBtn.addEventListener("click", async () => {
  hideSwapBtn();
  setStatusMsg("Swapping screens in a moment, look away!");
  await delay(SWAPPING_TIME);
  const otherScreen = currScreen === 1 ? 2 : 1
  showBoards(otherScreen);
  currScreen = otherScreen;
  if (currScreen === 2)
    document.dispatchEvent(new CustomEvent("custom:p2ScreenVisible"));
  setStatusMsg("");
});

