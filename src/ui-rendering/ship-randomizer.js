import * as game from "../game-control.js";
import { show as showBoards, showShips } from "./boards.js";
import { displaySwapBtn, hideSwapBtn } from "./screen-swap.js";
import { setStatusMsg } from "./status-display.js";

/* ========================================================================== */
/* FUNCTIONS & VARIABLES */
/* ========================================================================== */

const p1 = {
  randomizer: document.querySelector("#randomize-p1-ships-btn"),
  showRandomizer() {
    this.randomizer.classList.remove("invisible-out-flow");
  },
  hideRandomizer() {
    this.randomizer.classList.add("invisible-out-flow");
  },
};
const p2 = {
  randomizer: document.querySelector("#randomize-p2-ships-btn"),
  showRandomizer() {
    this.randomizer.classList.remove("invisible-out-flow");
  },
  hideRandomizer() {
    this.randomizer.classList.add("invisible-out-flow");
  },
};
const attackPhase = {
  startBtn: document.querySelector("#start-attack-phase-btn"),
  showBtn() {
    this.startBtn.classList.remove("invisible-out-flow");
  },
  hideBtn() {
    this.startBtn.classList.add("invisible-out-flow");
  },
};
attackPhase.btnHandlerAgainstComputer = () => {
  shipsPlacingPhase = false;
  p1.hideRandomizer();
  attackPhase.hideBtn();
  setStatusMsg("");
  showBoards(1);
};
attackPhase.btnHandlerAgainstHuman = () => {
  shipsPlacingPhase = false;
  p2.hideRandomizer();
  attackPhase.hideBtn();
  swapScreenBtn.dispatchEvent(new Event("click"));
};
const swapScreenBtn = document.querySelector("#swap-screen-btn");
let shipsPlacingPhase = true;

export function show() {
  showShips(1);
  p1.showRandomizer();
  if (game.isP2Computer) {
    attackPhase.showBtn();
    attackPhase.startBtn.addEventListener(
      "click",
      attackPhase.btnHandlerAgainstComputer,
    );
  } else {
    displaySwapBtn();
  }
}

export function restart() {
  shipsPlacingPhase = true;
}

/* ========================================================================== */
/* LISTENERS */
/* ========================================================================== */

[p1, p2].forEach((player) => {
  player.randomizer.addEventListener("click", () => {
    game.randomizeShips(player === p1 ? 1 : 2);
  });
});

document.addEventListener("custom:p2ScreenVisible", () => {
  if (!shipsPlacingPhase) return;
  showShips(2);
  hideSwapBtn();
  p1.hideRandomizer();
  p2.showRandomizer();
  attackPhase.showBtn();
  attackPhase.startBtn.addEventListener(
    "click",
    attackPhase.btnHandlerAgainstHuman,
  );
});
