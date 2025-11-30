/**
 * @module 
 * Utility module used by UI-rendering modules to display messages to the players
 */

const statusMsg = document.querySelector("#status-msg");

/**
 * 
 * @param {String} msg
 */
export function setStatusMsg(msg) {
  statusMsg.textContent = msg;
}

/**
 * 
 * @param {HTMLElement} content
 */
// export function setStatusContent(content) {
//   statusDisplay.replaceChildren();
//   statusDisplay.appendChild(content);
// }