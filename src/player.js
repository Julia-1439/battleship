import GameBoard from "./game-board";

function humanPlayer(name) {
  return {
    name,
    gameBoard: new GameBoard(),
  };
}

function computerPlayer() {
  return Object.assign(
    {},
    { gameBoard: new GameBoard() },
    autoAttacker(),
  );
}

// @todo refactor to use function composition for gameboard

function autoAttacker() {
  const calcRandomAttack = () => {
    let [i, j] = Array.from({ length: 2 }, () =>
      Math.floor(GameBoard.BOARD_LEN * Math.random()),
    );
    return [i, j];
  };

  return {
    calcRandomAttack,
  };
}

export { humanPlayer, computerPlayer };
