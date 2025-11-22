import GameBoard from "./game-board";

function humanPlayer(name) {
  return {
    name,
    gameBoard: new GameBoard(),
  };
}

function computerPlayer() {
  return {
    gameBoard: new GameBoard(),
  };
}

export {
  humanPlayer,
  computerPlayer,
};