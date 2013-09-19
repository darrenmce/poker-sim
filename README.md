poker-sim
=========

Node library that simulates a poker game and calculates winning percentages

```
npm install poker-sim
```

Dependencies
---------

poker-evaluator

moment (not really needed, could be removed in future)

USAGE:
---------

```js
var pokerSim = require("poker-sim");

var game = new pokerSim.Game();

//add "Hands" or players
game.addHand("Peter").addHand("Darren").addHand("Jim").addHand("Frank");

//Deal two cards (getting fancy with this and trying to add more or less than 2 will probably get you in trouble)
game.dealCard().dealCard();

//call evalHands() to process win percentages using the current state of the game
game.evalHands()

//output the status of the game to the console
game.printGame();

//flop (3 cards)
game.communityCard().communityCard().communityCard();

//eval and print
game.evalHands().printGame();

//turn
game.communityCard();

//eval and print
game.evalHands().printGame();

//river
game.communityCard();

//eval and print
game.evalHands().printGame();

//at any time you can return the JSON of the game status
console.log(game.getGame());
```
Extras:
--------
poker-sim.getGame (useful to send to the client)
poker-sim.getSave (useful to save the game state, returns the options you need to feed into constructor to resume)

Notes:
---------

Fairly untested, use at own risk or modify and make it better!
