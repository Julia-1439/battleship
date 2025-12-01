import * as game from "../game-control.js";
import { setStatusMsg } from "./status-display.js";
import { delay } from "../delayer.js";

const THINKING_TIME = 1000;
const swapScreenBtn = document.querySelector("#swap-screen-btn");

document.addEventListener("custom:p2ScreenVisible", async () => {
  setStatusMsg("The computer is thinking...");
  await delay(THINKING_TIME);
  game.computerPlayTurn();
  swapScreenBtn.dispatchEvent(new Event("click"));
});
