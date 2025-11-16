import { createPlayer } from "./player";

const p1 = createPlayer("human");
const p2 = createPlayer("human");

p1.gameBoard.placeShip(4, 0, 0, "h");
p1.gameBoard.placeShip(2, 4, 4, "v");

p2.gameBoard.placeShip(4, 6, 0, "h");
p2.gameBoard.placeShip(2, 1, 1, "v");
