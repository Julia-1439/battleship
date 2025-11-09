class Ship {
  #hits = 0;
  constructor(length) {
    if (typeof length !== "number") throw new TypeError("Length must be a number");
    if (length < 1) throw new RangeError("Length must be at least 1");
    this.length = length;
  }

  hit() {
    this.#hits = Math.min(this.#hits + 1, this.length);
  }

  isSunk() {
    return this.#hits === this.length;
  }
}

export default Ship;