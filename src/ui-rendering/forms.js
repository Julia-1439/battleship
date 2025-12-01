import * as game from "../game-control.js";

/* ========================================================================== */
/* FUNCTIONS & VARIABLES */
/* ========================================================================== */

const setup = {
  openDialogBtn: document.querySelector("#setup-game-btn"),
  dialog: document.querySelector("#setup-game-dialog"),
  form: document.querySelector("#setup-game-dialog form"),
  cancelBtn: document.querySelector("#setup-game-dialog .cancel-btn"),
};

/* ========================================================================== */
/* LISTENERS */
/* ========================================================================== */

window.addEventListener("load", () => {
  setup.dialog.showModal();
});
setup.openDialogBtn.addEventListener("click", () => {
  setup.dialog.showModal();
});
setup.form.addEventListener("submit", () => {
  const formData = new FormData(setup.form);
  const player1Name = formData.get("player1Name");
  const player2Name = formData.get("player2Name");
  game.createPlayers(player1Name, player2Name);
  game.start(player1Name, player2Name);
  setup.form.reset();
});
setup.cancelBtn.addEventListener("click", () => {
  setup.form.reset();
  setup.dialog.close();
});

game.pubSub.subscribe(game.events.WINNER_DECLARED, (winner) => {
  
});