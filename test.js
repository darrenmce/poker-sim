var ps = require('poker-sim');

var game1 = new ps.Game();

game1.addHand("Peter").addHand("Darren").addHand("Jim").addHand("Frank");
game1.dealCard().dealCard();
game1.evalHands().printGame();
game1.communityCard();
game1.communityCard();
game1.communityCard();
game1.evalHands().printGame();
game1.communityCard();
game1.evalHands().printGame();
game1.communityCard();
game1.evalHands().printGame();
console.log(game1.getGame());