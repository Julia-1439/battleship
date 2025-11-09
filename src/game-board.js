import Ship from "./ship";

class GameBoard {
  static BOARD_LEN = 10;
  #board;
  #numShips;
  constructor() {
    this.#board = Array.from({ length: GameBoard.BOARD_LEN }, () =>
      Array.from({ length: GameBoard.BOARD_LEN }, () => createCell()),
    );
  }

  get board() {
    return [...this.#board];
  }

  /**
   *
   * @param {Integer} col 1 to 10
   * @param {Integer} row 1 to 10
   * @param {String} orientation "h" or "v"
   */
  placeShip(ship, col, row, orientation) {
    if (
      col >= GameBoard.BOARD_LEN ||
      col < 0 ||
      row >= GameBoard.BOARD_LEN ||
      row < 0
    )
      throw new RangeError("Index is out of bounds");
    if (orientation === "h") {
      if (col + (ship.length - 1) >= GameBoard.BOARD_LEN)
        throw new RangeError("Ship extends off the board");
      for (let i = 0; i < ship.length; i++) {
        const cell = this.#board[col + i][row];
        if (cell.ship !== null)
          throw new Error("Ship collides with another ship");
        cell.ship = ship;
      }
    } else if (orientation === "v") {
      if (row + (ship.length - 1) >= GameBoard.BOARD_LEN)
        throw new RangeError("Ship extends off the board");
      for (let i = 0; i < ship.length; i++) {
        const cell = this.#board[col][row + i];
        if (cell.ship !== null)
          throw new Error("Ship collides with another ship");
        cell.ship = ship;
      }
    }
  }

  receiveAttack(col, row) {
    if (
      col >= GameBoard.BOARD_LEN ||
      col < 0 ||
      row >= GameBoard.BOARD_LEN ||
      row < 0
    )
      throw new RangeError("Index is out of bounds");
    const cell = this.#board[col][row];
    if (cell.isAttacked) throw new Error("This cell was aleady attacked"); 
    cell.isAttacked = true;
    if (cell.ship) cell.ship.hit();
  }
}

// private member of this module => no need to test
function createCell() {
  isAttacked = false;
  ship = null;

  return {
    isAttacked,
    ship,
  };
}

export default GameBoard;
