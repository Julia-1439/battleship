import * as game from "./game-control.js";

const mockProcessor = jest.fn((data) => data);

afterEach(() => {
  game.end();
});

describe("setting up a game", () => {
  test("successful start", () => {
    game.pubSub.subscribe(game.events.BOARD_UPDATE, mockProcessor); 
    game.pubSub.subscribe(game.events.TURN_SWITCH, mockProcessor); 
    game.createPlayers("Alice", "Bob");
    game.start();

    // outgoing command messages: test only if they were sent, rather than their effects
    expect(mockProcessor).toHaveBeenCalledTimes(2); 
    expect(mockProcessor).toHaveBeenCalledWith(expect.any(Object)); 
    expect(mockProcessor).toHaveBeenCalledWith(1);
  });

  test("unable to start game before player creation", () => {
    expect(() => game.start()).toThrow(Error);
  });
  test("unable to start game while a game is started", () => {
    game.createPlayers("Alice",);
    game.start();
    expect(() => game.start()).toThrow(Error);
  });
  test("unable to create players while a game is started", () => {
    game.createPlayers("Alice",);
    game.start();
    expect(() => game.createPlayers("Rupert", "Schnitzel")).toThrow(Error);
  });
});