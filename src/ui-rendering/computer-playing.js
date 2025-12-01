import * as game from "../game-control.js";
import { setStatusMsg } from "./status-display.js";

const THINKING_TIME = 1000;
const SWAPPING_TIME = 1000;
const swapScreenBtn = document.querySelector("#swap-screen-btn");

document.addEventListener("custom:p2ScreenVisible", async () => {
  setStatusMsg("The computer is thinking...");
  await setTimeout(() => {
    game.computerPlayTurn();
    setTimeout(() => { // @todo need to unnest this. idk why doing the await doesn't work. need to investigate this next
      swapScreenBtn.dispatchEvent(new Event("click"));
    }, SWAPPING_TIME);
  }, THINKING_TIME);
});
