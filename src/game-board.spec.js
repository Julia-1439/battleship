import GameBoard from "./game-board";
import Ship from "./ship";

let gb;
beforeEach(() => {
  gb = new GameBoard();
});

describe("placing ships", () => {
  describe("no out-of-bounds, no collisions", () => {
    test("length 2, horizontal", () => {
      gb.placeShip(new Ship(2), 0, 0, "h");
      expect(gb.board[0][0].ship).toBeInstanceOf(Ship);
      expect(gb.board[1][0].ship).toBeInstanceOf(Ship);
      expect(gb.board[2][0].ship).not.toBeInstanceOf(Ship);
    });

    test("length 3, vertical", () => {
      gb.placeShip(new Ship(3), 6, 3, "v");
      expect(gb.board[6][3].ship).toBeInstanceOf(Ship);
      expect(gb.board[6][4].ship).toBeInstanceOf(Ship);
      expect(gb.board[6][5].ship).toBeInstanceOf(Ship);
      expect(gb.board[6][6].ship).not.toBeInstanceOf(Ship);
    });
  });

  describe("error cases: out-of-bounds", () => {
    describe("arguments are immediately out of range: upper end", () => {
      test("column case (1)", () => {
        expect(() => gb.placeShip(new Ship(2), 10, 0, "h")).toThrow(RangeError);
      });
      test("column case (2)", () => {
        expect(() => gb.placeShip(new Ship(2), 11, 0, "h")).toThrow(RangeError);
      });
      test("row case (1)", () => {
        expect(() => gb.placeShip(new Ship(2), 0, 10, "h")).toThrow(RangeError);
      });
      test("row case (2)", () => {
        expect(() => gb.placeShip(new Ship(2), 0, 11, "h")).toThrow(RangeError);
      });
    });
    describe("arguments are immediately out of range: lower end", () => {
      test("column case (1)", () => {
        expect(() => gb.placeShip(new Ship(2), -1, 0, "h")).toThrow(RangeError);
      });
      test("column case (2)", () => {
        expect(() => gb.placeShip(new Ship(2), -2, 0, "h")).toThrow(RangeError);
      });
      test("row case (1)", () => {
        expect(() => gb.placeShip(new Ship(2), 0, -1, "h")).toThrow(RangeError);
      });
      test("row case (2)", () => {
        expect(() => gb.placeShip(new Ship(2), 0, -2, "h")).toThrow(RangeError);
      });
    });

    describe("ship extends past board", () => {
      test("horizontal case (1)", () => {
        expect(() => gb.placeShip(new Ship(3), 8, 0, "h")).toThrow(RangeError);
      });
      test("horizontal case (2)", () => {
        expect(() => gb.placeShip(new Ship(10), 1, 0, "h")).toThrow(RangeError);
      });
      test("vertical case (1)", () => {
        expect(() => gb.placeShip(new Ship(4), 8, 7, "v")).toThrow(RangeError);
      });
      test("vertical case (2)", () => {
        expect(() => gb.placeShip(new Ship(9), 3, 2, "v")).toThrow(RangeError);
      });
    });
  });

  describe("error cases: collision with a ship", () => {
    beforeEach(() => {
      gb.placeShip(new Ship(3), 4, 4, "h");
    });

    describe("placing horizontal", () => {
      test("case (1)", () => {
        expect(() => gb.placeShip(new Ship(4), 1, 4, "h")).toThrow(Error);
      });
      test("case (2)", () => {
        expect(() => gb.placeShip(new Ship(2), 4, 4, "h")).toThrow(Error);
      });
    });
    describe("placing vertical", () => {
      test("case (1)", () => {
        expect(() => gb.placeShip(new Ship(3), 4, 2, "v")).toThrow(Error);
      });
      test("case (2)", () => {
        expect(() => gb.placeShip(new Ship(5), 4, 1, "v")).toThrow(Error);
      });
    });
  });
});

describe("receiving attacks", () => {
  beforeEach(() => {
    gb.placeShip(new Ship(3), 4, 4, "v");
  });
  describe("happy path cases", () => {
    test("a ship is not sunk", () => {
      gb.receiveAttack(4, 4);
      gb.receiveAttack(4, 5);
      expect(gb.board[4][4].ship.isSunk()).toBe(false);
    });
    test("a ship is sunk", () => {
      gb.receiveAttack(4, 4);
      gb.receiveAttack(4, 5);
      gb.receiveAttack(4, 6);
      expect(gb.board[4][4].ship.isSunk()).toBe(true);
    });
    test("miss a shot", () => {
      gb.receiveAttack(7, 7);
      expect(gb.board[7][7].isAttacked).toBe(true);
    });
  });

  describe("errors", () => {
    describe("bad coordinates", () => {
      test("column case (1)", () => {
        expect(() => gb.receiveAttack(-1, 0)).toThrow(RangeError);
      });
      test("row case (1)", () => {
        expect(() => gb.receiveAttack(0, 10)).toThrow(RangeError);
      });
    });
    describe("already attacked this spot", () => {
      test("no ship present", () => {
        gb.receiveAttack(8, 6);
        expect(() => gb.receiveAttack(8, 6)).toThrow(Error);
      });
      test("ship present", () => {
        gb.receiveAttack(4, 6);
        expect(() => gb.receiveAttack(4, 6)).toThrow(Error);
        expect(() => gb.board[4][6].ship.isSunk());
      });
    });
  });
});
