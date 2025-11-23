import { humanPlayer, computerPlayer } from "./player.js";
import GameBoard from "./game-board.js";

describe("player creation", () => {
  test("human player", () => {
    const player1 = humanPlayer("Alice");
    expect(player1.name).toBe("Alice");
    expect(player1.gameBoard).toBeInstanceOf(GameBoard);
  });

  test("computer player", () => {
    const player2 = computerPlayer();
    expect(player2.gameBoard).toBeInstanceOf(GameBoard);
  });
});
