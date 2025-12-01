import * as game from "../game-control.js";

(function initSetupForm(doc, window) {
  const openDialogBtn = doc.querySelector("#setup-game-btn");
  const dialog = doc.querySelector("#setup-game-dialog");
  const form = doc.querySelector("#setup-game-form");
  const cancelBtn = doc.querySelector("#setup-game-form .cancel-btn");

  window.addEventListener("load", () => {
    dialog.showModal();
  });
  openDialogBtn.addEventListener("click", () => {
    dialog.showModal();
  });
  form.addEventListener("submit", () => {
    const formData = new FormData(form);
    const p1Name = formData.get("p1Name");
    const p2Name = formData.get("p2Name");
    game.createPlayers(p1Name, p2Name);
    game.start(p1Name, p2Name);
    // choose not to reset the form so the entered info persists if additional games wish to be played
  });
  cancelBtn.addEventListener("click", () => {
    form.reset();
    dialog.close();
  });
})(document, window);

(function initEndForm(doc) {
  const dialog = doc.querySelector("#end-game-dialog");
  const form = doc.querySelector("#end-game-form");
  const message = doc.querySelector("#end-game-form p");
  const cancelBtn = doc.querySelector("#end-game-form .cancel-btn");

  game.pubSub.subscribe(game.events.WINNER_DECLARED, async () => {
    await setTimeout(() => {
      dialog.showModal();
    }, 1000);
  });
  game.pubSub.subscribe(game.events.WINNER_DECLARED, (winner) => {
    message.textContent = `${winner.name ? `Player "${winner.name}"` : "The computer"} has won!`;
  });
  form.addEventListener("submit", () => {
    // @todo
  });
  cancelBtn.addEventListener("click", () => {
    form.reset();
    dialog.close();
  });
})(document);
