import * as game from "../game-control.js";
import { setStatusMsg } from "./status-display.js";
import { delay } from "../delayer.js";

const THINKING_TIME = 1000;
const swapScreenBtn = document.querySelector("#swap-screen-btn");

async function attack() {
  setStatusMsg("The computer is thinking..."); // @todo bug: not displaying
  await delay(THINKING_TIME);
  game.computerPlayTurn();
  swapScreenBtn.dispatchEvent(new Event("click"));
}

export function initComputerListener() {
  document.addEventListener("custom:p2ScreenVisible", attack);
}

export function removeComputerListener() {
  document.removeEventListener("custom:p2ScreenVisible", attack);
}