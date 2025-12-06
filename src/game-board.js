import Ship from "./ship";

class GameBoard {
  static BOARD_LEN = 10;
  #numAliveShips = 0;
  constructor() {
    this.board = Array.from({ length: GameBoard.BOARD_LEN }, () =>
      Array.from({ length: GameBoard.BOARD_LEN }, () => createCell()),
    );
    this.placedShips = new Map();
  }

  #clear() {
    this.board = Array.from({ length: GameBoard.BOARD_LEN }, () =>
      Array.from({ length: GameBoard.BOARD_LEN }, () => createCell()),
    ); 
    this.placedShips.clear();
    this.#numAliveShips = 0;
  }

  get state() { // an alias
    return this.board;
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
      
    if (orientation === "h") {
      if (col + (shipLen - 1) >= GameBoard.BOARD_LEN)
        throw new RangeError("Ship extends off the board");
      for (let i = 0; i < shipLen; i++) {
        const cell = this.board[col + i][row];
        if (cell.ship !== null)
          throw new Error("Ship collides with another ship");
      }
    } else if (orientation === "v") {
      if (row + (shipLen - 1) >= GameBoard.BOARD_LEN)
        throw new RangeError("Ship extends off the board");
      for (let i = 0; i < shipLen; i++) {
        const cell = this.board[col][row + i];
        if (cell.ship !== null)
          throw new Error("Ship collides with another ship");
      }
    }

    // Found a valid placement: place the ship
    const newShip = new Ship(shipLen);
    if (orientation === "h") {
      for (let i = 0; i < shipLen; i++) {
        const cell = this.board[col + i][row];
        cell.ship = newShip;
      }
    } else if (orientation === "v") {
      for (let i = 0; i < shipLen; i++) {
        const cell = this.board[col][row + i];
        cell.ship = newShip;
      }
    }
    this.placedShips.set(newShip.uuid, newShip);
    this.#numAliveShips++;
  }

  randomizeShips() {
    const currentShips = new Map(this.placedShips);
    this.#clear(); // Clear the board to replace the current ships

    currentShips.forEach((ship) => {
      let foundValidSpot = false;
      while (!foundValidSpot) {
        try {
          this.placeShip(
            ship.length,
            Math.floor(Math.random() * GameBoard.BOARD_LEN),
            Math.floor(Math.random() * GameBoard.BOARD_LEN),
            ["h", "v"][Math.floor(Math.random() * 2)]
          );
          foundValidSpot = true;
        } catch(err) {
          // console.error(err.message);
          continue;
        }
      }
    });
  }

  receiveAttack(col, row) {
    if (
      col >= GameBoard.BOARD_LEN ||
      col < 0 ||
      row >= GameBoard.BOARD_LEN ||
      row < 0
    )
      throw new RangeError("Index is out of bounds");

    const cell = this.board[col][row];
    if (cell.isAttacked) throw new Error("This cell was already attacked");
    cell.isAttacked = true;
    if (cell.ship) {
      cell.ship.hit();
      if (cell.ship.isSunk()) this.#numAliveShips--;
    } 
  }

  allShipsSunken() {
    return this.#numAliveShips === 0;
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
