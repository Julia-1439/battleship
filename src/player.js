import GameBoard from "./game-board";

/**
 * 
 * @param {String} type "human" or "computer"
 * @returns {Object}
 */
function createPlayer(type) {
  return {
    type,
    gameBoard: new GameBoard(),
  };
}

export {
  createPlayer,
};