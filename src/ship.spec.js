import Ship from "./ship.js";

describe("public side effects", () => {
  test("length is set", () => expect(new Ship(4).length).toBe(4));
});

describe("hitting", () => {
  test("hit", () => {
    const ship = new Ship(3);
    ship.hit();
    expect(ship.isSunk()).toBe(false);
  });
});