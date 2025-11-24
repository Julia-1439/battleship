import * as game from "./game-control.js";

const mockProcessor = jest.fn((data) => data);

afterEach(() => {
  game.end();
  jest.clearAllMocks();
});

describe("setting up a game", () => {
  test("successful start", () => {
    const subId1 = game.pubSub.subscribe(game.events.BOARD_UPDATE, mockProcessor); 
    const subId2 = game.pubSub.subscribe(game.events.TURN_SWITCH, mockProcessor); 
    game.createPlayers("Alice", "Bob");
    game.start();

    // outgoing command messages: test only if they were sent, rather than their effects
    expect(mockProcessor).toHaveBeenCalledTimes(2); 
    expect(mockProcessor).toHaveBeenCalledWith(expect.any(Object)); 
    expect(mockProcessor).toHaveBeenCalledWith(1);

    // clean up
    game.pubSub.unsubscribe(game.events.BOARD_UPDATE, subId1);
    game.pubSub.unsubscribe(game.events.TURN_SWITCH, subId2);
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

describe("playing a game to end", () => {
  test("two humans", () => {
    const subId = game.pubSub.subscribe(game.events.GAME_END, mockProcessor); 

    game.createPlayers("Alice", "Bob");
    game.start();

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        try {
          game.playTurn(i, j);
          game.playTurn(i, j);
        } catch (err) { // stop playing turns once the game has ended
          break;
        }
      }
    }

    expect(mockProcessor).toHaveBeenCalledTimes(1); 
    expect(mockProcessor).toHaveBeenCalledWith(expect.any(Object)); 

    // clean up
    game.pubSub.unsubscribe(game.events.GAME_END, subId);
  });

  test.todo("one human, one computer");
});