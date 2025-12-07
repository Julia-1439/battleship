/* eslint-disable  no-undef -- avoid jest's testing functions being flagged */
import Ship from "../ship.js";

describe("public side effects", () => {
  test("length is set", () => expect(new Ship(4).length).toBe(4));
  test("length type error", () => expect(() => new Ship("4")).toThrow(TypeError));
  test("length range error", () => expect(() => new Ship(0)).toThrow(RangeError));
});

describe("errors", () => {
  test("length type error", () =>
    expect(() => new Ship("4")).toThrow(TypeError));
  test("length range error", () =>
    expect(() => new Ship(0)).toThrow(RangeError));
});

describe("hitting & sinking", () => {
  test("hit, no sink", () => {
    const ship = new Ship(3);
    ship.hit();
    expect(ship.isSunk()).toBe(false);
  });
  test("hit, sunk", () => {
    const ship = new Ship(3);
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });
  test("num hits > length", () => {
    const ship = new Ship(3);
    ship.hit();
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });
});
