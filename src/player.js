import GameBoard from "./game-board";

export function humanPlayer(name) {
  return Object.assign(player(), { name });
}

export function computerPlayer() {
  return Object.assign(player(), autoAttacker());
}

function player() {
  return {
    gameBoard: new GameBoard(),
  };
}

function autoAttacker() {
  const calcRandomAttack = () => {
    const [i, j] = Array.from({ length: 2 }, () =>
      Math.floor(GameBoard.BOARD_LEN * Math.random()),
    );
    return [i, j];
  };

  return {
    calcRandomAttack,
  };
}
