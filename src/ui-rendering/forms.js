import * as game from "../game-control.js";

const setupBtn = document.querySelector("#setup-game-btn");
const dialog = document.querySelector("#setup-game-dialog");
const form = dialog.querySelector("form");
const startBtn = form.querySelector("[type=submit]");
const cancelBtn = form.querySelector(".cancel-btn");
window.addEventListener("load", () => {
  dialog.showModal();
});
setupBtn.addEventListener("click", () => {
  dialog.showModal();
});
form.addEventListener("submit", () => {
  const formData = new FormData(form);
  const player1Name = formData.get("player1Name");
  const player2Name = formData.get("player2Name");
  game.createPlayers(player1Name, player2Name);
  game.start(player1Name, player2Name);
  form.reset();
});
cancelBtn.addEventListener("click", () => {
  form.reset();
  dialog.close();
});
