import * as game from "../game-control.js";
import { setStatusMsg } from "./status-display.js";
import { delay } from "../delayer.js";

const BUFFER_TIME = 1000; // Simply for utility to make a more smooth UX
const THINKING_TIME = 1000;

async function attack() {
  await delay(BUFFER_TIME);
  setStatusMsg("The computer is thinking...");
  await delay(THINKING_TIME);
  const landedHit = game.computerPlayTurn();
  setStatusMsg(landedHit ? "Computer landed a hit!" : "Computer missed!");
}

game.pubSub.subscribe(game.events.TURN_CHANGE, (turn) => {
  if (!game.isP2Computer || turn !== 2) return;
  attack();
});