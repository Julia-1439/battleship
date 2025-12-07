/* eslint-disable  no-undef -- avoid jest's testing functions being flagged *
/**
 * More of an integration test than unit test, I believe
 */
import * as game from "../game-control.js";
import GameBoard from "../game-board.js";

const mockProcessor = jest.fn((data) => data);
const BOARD_LEN = GameBoard.BOARD_LEN;

afterEach(() => {
  game.clear();
  game.pubSub.clear();
  jest.clearAllMocks();
});

describe("setting up a game", () => {
  test("successful start", () => {
    game.pubSub.subscribe(game.events.BOARD_UPDATE, mockProcessor);
    game.pubSub.subscribe(game.events.TURN_CHANGE, mockProcessor);
    game.createPlayers("Alice", "Bob");
    game.start();

    // outgoing command messages: test only if they were sent, rather than their effects
    expect(mockProcessor).toHaveBeenCalledTimes(4);
    expect(mockProcessor).toHaveBeenCalledWith(expect.any(Object));
    expect(mockProcessor).toHaveBeenCalledWith(1);
  });

  test("unable to start game before player creation", () => {
    expect(() => game.start()).toThrow(Error);
  });
  test("unable to start game while a game is started", () => {
    game.createPlayers("Alice");
    game.start();
    expect(() => game.start()).toThrow(Error);
  });
  test("unable to create players while a game is started", () => {
    game.createPlayers("Alice");
    game.start();
    expect(() => game.createPlayers("Rupert", "Schnitzel")).toThrow(Error);
  });
});

describe("playing a game to end", () => {
  test("one human, one computer", () => {
    game.pubSub.subscribe(game.events.WINNER_DECLARED, mockProcessor);

    game.createPlayers("Alice", null, true);
    game.start();

    outer: for (let i = 0; i < BOARD_LEN; i++) {
      for (let j = 0; j < BOARD_LEN; j++) {
        try {
          game.playTurn(i, j);
          game.computerPlayTurn();
        } catch {
          // stop playing turns once the game has ended
          break outer;
        }
      }
    }

    expect(mockProcessor).toHaveBeenCalledTimes(1);
    expect(mockProcessor).toHaveBeenCalledWith(expect.any(Object)); // outgoing command messages: test only if they were sent, rather than their effects
  });

  test("two humans", () => {
    game.pubSub.subscribe(game.events.WINNER_DECLARED, mockProcessor);

    game.createPlayers("Alice", "Bob");
    game.start();

    outer: for (let i = 0; i < BOARD_LEN; i++) {
      for (let j = 0; j < BOARD_LEN; j++) {
        try {
          game.playTurn(i, j); // player 1's turn
          game.playTurn(i, j); // player 2's turn
        } catch {
          // stop playing turns once the game has ended
          break outer;
        }
      }
    }

    expect(mockProcessor).toHaveBeenCalledTimes(1);
    expect(mockProcessor).toHaveBeenCalledWith(expect.any(Object)); // outgoing command messages: test only if they were sent, rather than their effects
  });
});
