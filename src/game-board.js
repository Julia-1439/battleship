import Ship from "./ship";

class GameBoard {
  static BOARD_LEN = 10;
  #board = Array.from({ length: GameBoard.BOARD_LEN }, () =>
    Array.from({ length: GameBoard.BOARD_LEN }, () => createCell()),
  );
  #numShips = 0;

  get board() {
    return [...this.#board];
  }

  /**
   *
   * @param {Integer} shipLen
   * @param {Integer} col 1 to 10
   * @param {Integer} row 1 to 10
   * @param {String} orientation "h" or "v"
   */
  placeShip(shipLen, col, row, orientation) {
    if (
      col >= GameBoard.BOARD_LEN ||
      col < 0 ||
      row >= GameBoard.BOARD_LEN ||
      row < 0
    )
      throw new RangeError("Index is out of bounds");
      
    const newShip = new Ship(shipLen);
    if (orientation === "h") {
      if (col + (shipLen - 1) >= GameBoard.BOARD_LEN)
        throw new RangeError("Ship extends off the board");
      for (let i = 0; i < shipLen; i++) {
        const cell = this.#board[col + i][row];
        if (cell.ship !== null)
          throw new Error("Ship collides with another ship");
        cell.ship = newShip;
      }
    } else if (orientation === "v") {
      if (row + (shipLen - 1) >= GameBoard.BOARD_LEN)
        throw new RangeError("Ship extends off the board");
      for (let i = 0; i < shipLen; i++) {
        const cell = this.#board[col][row + i];
        if (cell.ship !== null)
          throw new Error("Ship collides with another ship");
        cell.ship = newShip;
      }
    }
    this.#numShips++;
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
    if (cell.isAttacked) throw new Error("This cell was already attacked");
    cell.isAttacked = true;
    if (cell.ship) {
      cell.ship.hit();
      if (cell.ship.isSunk()) this.#numShips--;
    } 
  }

  allShipsSunken() {
    return this.#numShips === 0;
  }
}

// private member of this module => no need to test
function createCell() {
  let isAttacked = false;
  let ship = null;

  return {
    isAttacked,
    ship,
  };
}

export default GameBoard;
