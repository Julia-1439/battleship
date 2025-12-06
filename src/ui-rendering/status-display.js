/**
 * @module 
 * Utility module used by UI-rendering modules to display messages to the players
 */

const statusDisplay = document.querySelector("#status-display-container");
const statusMsg = statusDisplay.querySelector("#status-msg");
const actionBtnsRow = statusDisplay.querySelector("#game-action-btns-row");

/**
 * 
 * @param {String} msg
 */
export function setStatusMsg(msg) {
  console.log(msg);
  statusMsg.textContent = msg;
}

export function clear() {
  setStatusMsg("");
  actionBtnsRow
    .querySelectorAll("button")
    .forEach((btn) => btn.classList.add("invisible-out-flow"));
}