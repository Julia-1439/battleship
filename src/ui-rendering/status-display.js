const statusDisplay = document.querySelector("#status-display");

/**
 * 
 * @param {String} msg
 */
export function setStatusMsg(msg) {
  statusDisplay.replaceChildren();
  statusDisplay.textContent = msg;
}

/**
 * 
 * @param {HTMLElement} content
 */
export function setStatusContent(content) {
  statusDisplay.replaceChildren();
  statusDisplay.appendChild(content);
}