class Ship {
  #hits;
  constructor(length) {
    this.length = length;
    this.#hits = 0;
  }

  hit() {
    
  }

  isSunk() {
    return false;
  }
}

export default Ship;