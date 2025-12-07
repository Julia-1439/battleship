# battleship

A browser Battleship game played against a computer or against another person. Created with test-driven development and SOLID principles. 

Tools used: 
- jest for testing
- javascript/html/css
- workflow enhancements:
  - git branching, merging, rebasing
  - webpack for bundling and dev/prod environments
  - eslint & prettier for code styling

Major concepts utilized:
- test-driven development: unit testing, mocking, some integration tests
  - following the [minimal unit testing](https://www.youtube.com/watch?v=URSWYvyc42M) framework
- OOP principles: single responsibility, loose coupling, dependency inversion
- organizing code into modules, objects, classes, iifes, factories, and function composition
- git branching workflow: branching often, merging, rebasing, history overriding, scout pattern
- following [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/#specification) messages
- asynchronous code
- constraint validation api for custom form validation
- (overengineering) using pubsub & custom events
- more practice with css: responsiveness with flex

Did well:
- followed TDD rigorously to develop the lowest-level objects, thoroughly unit testing them and making them bug-free
- code organization: functions have a single responsibility, using pubsub & custom events, organizing each DOM section into its own module, using classes when appropriate, using factories when classes were not necessary or function composition was desired, using objects to organize DOM elements, iife modules for in-file encapsulation
- open to extensibility: function composition for player objects to allow smarter computer behavior, a game-control module to encapsulate more complicated features like drag-and-drop ships (in fact, I was able to implement a 2-player option and a restart game feature)
- following the git branching workflow. I really saw the value in it, and viewing git history as a graph with multiple pathways really helped
- user experience

Room for improvement:
- simplicity: not using pubsub or custom events. loose coupling is <em>not always</em> good as it can make things harder to read and follow. 
- probably don't need so many safeguards within the game-control module (e.g. playTurn relies on a 'turn' variable). let the safeguards be defined by how the DOM presents interactions to the user. 
- not be lazy with tests: mid-way through got lazy. would have diagnosed a bug quicker if I thought of a smarter way to test randomized ships. 

Design choices:
- a "game control" module to dictate the flow of the game. 
  - pros: allows the game to be played in the console if the DOM stuff were removed. defines how the game should be played. allows more complicated features like restarting a game and swapping opponent (computer or human)
  - cons: not necessary. the abstraction makes certain information hard to access by the DOM-level stuff. the flow of the game can instead be defined by how interactions are presented to the user. 
- a pubsub system to announce changes to the game's internals (board update, turn change, winner declared):
  - pros: understand what events trigger what. helps reduce redundancy and safeguards against forgetting to call functions to update the DOM (most notably the visual boards being automatically updated when the internal boards update). simplify return values of the game-control module. allows modules to be removed/added easily (e.g. it was a smooth experience removing the "swap screen" feature when playing against a computer)
  - cons: pubsub is not necessary since interactions are not asynchronous. might lead to confusion about how the logic flows as everything is async and non-linear. having obscures what modules actually depend on each other and which ones are optional. harder to test. "requires well-defined policy for message formatting and message exchange", which I tried in but can be improved; @see https://www.redhat.com/en/blog/pub-sub-pros-and-cons

<details>
  <summary>additional sources of help</summary>
  <ul>
    <li>no devtools for custom events, use mutation observer: https://stackoverflow.com/questions/2157963/is-it-possible-to-listen-to-a-style-change-event</li>
    <li>setTimeout and promises: https://stackoverflow.com/a/33292942/22151685</li>
    <li>cloning recursively: https://stackoverflow.com/questions/30626070/shallow-clone-a-map-or-set</li>
    <li>testing async code: https://jestjs.io/docs/asynchronous</li>
    <li>favicon: https://www.w3schools.com/html/html_favicon.asp</li>
    <li>disabling eslint for certain files or sections: https://eslint.org/docs/latest/use/configure/rules#disabling-rules</li>
    <li>reordering git commits: https://stackoverflow.com/questions/33388210/how-to-reorder-last-two-commits-in-git</li>
  </ul>
</details>