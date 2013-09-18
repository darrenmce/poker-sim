var pokerSim = require("./poker-sim");

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