import * as game from "../game-control.js";
import {
  show as showShipRandomizer,
  restart as restartShipRandomizer,
} from "./ship-randomizer.js";
import { setStatusMsg, clear as clearStatusDisplay } from "./status-display.js";
import {
  setBattlefieldTitles,
  initComputerListener as initComputerBoardDisabler,
  removeComputerListener as removeComputerBoardDisabler,
} from "./boards.js";
import { delay } from "../delayer.js";

(function initSetupForm(doc, window) {
  const openDialogBtn = doc.querySelector("#setup-game-btn");
  const dialog = doc.querySelector("#setup-game-dialog");
  const form = dialog.querySelector("#setup-game-form");
  const p1NameInput = form.querySelector("#p1-name");
  const p2NameInput = form.querySelector("#p2-name");
  const isComputerChkbox = form.querySelector("#is-p2-computer");
  const cancelBtn = form.querySelector(".cancel-btn");

  const customValidator = ((p1Name, p2Name, isComputer) => {
    function setErrorMsgP1Name() {
      p1Name.setCustomValidity("Please fill out the player name");
    }
    function setErrorMsgP2Name() {
      p2Name.setCustomValidity("Please fill out the player name");
    }
    function handleP1NameInput() {
      if (!p1Name.validity.valueMissing && p1Name.value.trim() !== "") {
        p1Name.setCustomValidity("");
      } else {
        setErrorMsgP1Name();
        p1Name.reportValidity();
      }
    }
    function handleP2NameInput() {
      if (!p2Name.validity.valueMissing && p2Name.value.trim() !== "") {
        p2Name.setCustomValidity("");
      } else {
        setErrorMsgP2Name();
        p2Name.reportValidity();
      }
    }

    p1Name.addEventListener("input", handleP1NameInput);
    isComputer.addEventListener("change", () => {
      if (isComputer.checked) {
        p2Name.disabled = true;
        p2Name.placeholder = "N/A";
        p2Name.required = false;
        p2Name.removeEventListener("input", handleP2NameInput);
      } else {
        p2Name.disabled = false;
        p2Name.placeholder = "";
        p2Name.required = true;
        p2Name.addEventListener("input", handleP2NameInput);
        if (p2Name.validity.valueMissing) setErrorMsgP2Name();
      }
    });

    return {
      setErrorMsgP1Name,
    };
  })(p1NameInput, p2NameInput, isComputerChkbox);

  window.addEventListener("load", () => {
    dialog.showModal();
    customValidator.setErrorMsgP1Name();
  });
  openDialogBtn.addEventListener("click", () => {
    dialog.showModal();
  });
  form.addEventListener("submit", () => {
    const formData = new FormData(form);
    const p1Name = formData.get("p1Name");
    const p2Name = formData.get("p2Name");
    const isP2Computer = formData.get("isP2Computer") !== null;

    game.clear();
    game.createPlayers(p1Name, p2Name, isP2Computer);
    game.start();

    if (game.isP2Computer) initComputerBoardDisabler();
    else removeComputerBoardDisabler();
    restartShipRandomizer();
    clearStatusDisplay();
    setBattlefieldTitles(p1Name, isP2Computer ? "Computer" : p2Name);
    setStatusMsg("Game started! Choose your ships placement");
    showShipRandomizer();
    openDialogBtn.textContent = "Restart Game";
    // choose not to reset the form so the entered info persists if additional games wish to be played
  });
  cancelBtn.addEventListener("click", () => {
    dialog.close();
  });
})(document, window);

(function initEndForm(doc) {
  const dialog = doc.querySelector("#end-game-dialog");
  const form = dialog.querySelector("#end-game-form");
  const message = form.querySelector("p");
  const cancelBtn = form.querySelector(".cancel-btn");

  game.pubSub.subscribe(game.events.WINNER_DECLARED, async () => {
    await delay(1000);
    dialog.showModal();
  });
  game.pubSub.subscribe(game.events.WINNER_DECLARED, (winner) => {
    message.textContent = `${winner.name ? `Player "${winner.name}"` : "The computer"} has won!`;
  });
  form.addEventListener("submit", () => {
    dialog.close();
    const setupGameDialog = doc.querySelector("#setup-game-dialog");
    setupGameDialog.showModal();
  });
  cancelBtn.addEventListener("click", () => {
    dialog.close();
  });
})(document);
