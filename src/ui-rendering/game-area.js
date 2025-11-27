import * as game from "../game-control.js";

const p1BoardDOM = document.querySelector(`.battlefield[data-player="1"]`);
const p1CellsDOM = p1BoardDOM.querySelectorAll(".battlefield-btn");
const p2BoardDOM = document.querySelector(`.battlefield[data-player="2"]`);

game.pubSub.subscribe(game.events.BOARD_UPDATE, render)

function render(data) {
  console.log("errerer")
  const p1Board = data.p1Board; 
  const p2Board = data.p2Board;

  p1CellsDOM.forEach((btnDOM) => {
    const col = +btnDOM.dataset.col;
    const row = +btnDOM.dataset.row;
    const cell = p1Board[col][row];
    if (cell.isAttacked || cell.ship) {
      btnDOM.classList.remove("empty");
      if (cell.isAttacked) btnDOM.classList.add("is-attacked");
      if (cell.ship) btnDOM.classList.add("has-ship");
    }
  })
}