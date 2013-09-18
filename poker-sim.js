var pokereval = require("poker-evaluator");

var cfg = {
    "handMax": 7,
    "handsMax": 4,

    "playerCards": 2,
    "communityCards": 5,

    deck: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
        41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52]
};


var CardUtil = function () {
    this.suits = {
        "0": "s",
        "1": "c",
        "2": "h",
        "3": "s"
    };
    this.cards = {
        "1": "2",
        "2": "3",
        "3": "4",
        "4": "5",
        "5": "6",
        "6": "7",
        "7": "8",
        "8": "9",
        "9": "10",
        "10": "J",
        "11": "Q",
        "12": "K",
        "13": "A"
    };
    this.cardString = function (card) {
        var cardNum = this.cards[Math.ceil(card / 4)];
        var suit = this.suits[card % 4];
        return cardNum + suit;
    }

}


var Hand = function (name) {
    this.name = name;
    this.hand = [];
    for (i = 1; i < Math.min(arguments.length - 1, cfg.handMax + 1); i++) {
        this.hand.push(arguments[i]);
    }
    this.CardUtil = new CardUtil();
}

Hand.prototype = {
    addCard: function (card) {
        if (this.hand.length < cfg.handMax) {
            this.hand.push(card);
            return true;
        } else {
            return false;
        }
    },
    stringOf: function () {
        var self = this;
        return self.name + ': ' + self.hand.map(function (card) {
            return self.CardUtil.cardString(card);
        });
    },
    valueOf: function () {
        var self=this;
        return {
            "name": self.name,
            "hand": self.hand.map(function (card) {
                return self.CardUtil.cardString(card);
            })
        };
    }

}

var Game = function () {
    this.hands = [];
    this.cardsDealt = 0;
    this.unturned = cfg.deck.slice(0);
    this.turned = [];
    this.community = [];
    this.CardUtil = new CardUtil();
    for (i = 0; i < Math.min(arguments.length, cfg.handsMax); i++) {
        var hand = arguments[i];
        var type = Object.prototype.toString.call(hand);
        if (type === "[object Object]" && hand.hand) {
            this.hands.push(hand);
        }
    }
}

Game.prototype = {
    drawCard: function (card) {
        this.unturned.splice(unturned.indexOf(card), 1);
        this.turned.push(card);
        return card;
    },
    drawRandom: function () {
        var random = Math.floor((Math.random() * this.unturned.length));
        var card = this.unturned[random];
        this.turned.push(card);
        this.unturned.splice(random, 1);
        return card;
    },
    drawNext: function () {
        var card = this.unturned[0];
        this.turned.push(card);
        this.unturned.splice(0, 1);
        return card;
    },
    addHand: function (name) {
        if (this.hands.length < cfg.handsMax) {
            this.hands.push(new Hand(name));
            return this;
        } else {
            return false;
        }
    },
    dealCard: function () {
        var self = this;
        if (self.cardsDealt < cfg.playerCards) {
            self.hands.forEach(function (hand) {
                hand.addCard(self.drawRandom());
            });
            return self;
        } else {
            return false;
        }
    },
    communityCard: function () {
        if (this.community.length < cfg.communityCards) {
            this.community.push(this.drawRandom());
            return this;
        } else {
            return false;
        }
    },

    evalHands: function () {
        var self = this;

        var totalHands = 0;
        var wins = {};

        var rem = cfg.communityCards - self.community.length;

        //counter for simulated hands
        self.totalSimHands = 0;

        var dt = new Date();
        var timer = dt.getTime();

        //evaluate hands (if no cards left to draw, calculate based on actuals)
        if (rem > 0) {
            self.chooseEval(wins, [], self.unturned, rem);
        } else {
            self.calcWinners(wins, self.community);
        }

        //output evaluate duration
        dt = new Date();
        console.log('Evaluation took ' + (dt.getTime() - timer)/1000 + ' seconds.');

        //determine percentages
        self.hands.forEach(function (hand) {
            wins[hand.name] = (wins[hand.name] || 0) / self.totalSimHands;
        });

        //set eval object
        self.eval = wins;

        return self;
    },

    //recursive function to do combinations
    chooseEval: function (wins, start, elements, length) {
        var self = this;
        elements.forEach(function (ele, i) {
            if (length === 1) {
                var combo = start.concat([ele]);
                var community = self.community.concat(combo);
                self.calcWinners(wins, community);
            } else {
                self.chooseEval(wins, start.concat([ele]), elements.slice(i + 1, elements.length), length - 1);
            }
        });

    },
    //calculate winners into the wins object using the community cards given
    //uses self.hands, increments self.totalSimHands
    calcWinners: function (wins, community) {
        var self = this;
        var winners = [];
        var maxValue = 0;
        self.totalSimHands++;
        self.hands.forEach(function (hand) {
            var value = pokereval.evalHand(community.concat(hand.hand)).value;
            if (value == maxValue) {
                winners.push(hand.name);
            } else if (value > maxValue) {
                winners = [hand.name];
                maxValue = value;
            }
        });
        winners.forEach(function (winner) {
            if (wins[winner]) {
                wins[winner]++
            } else {
                wins[winner] = 1;
            }
        });

    },
    //console.logs the game status (to be used AFTER eval)
    printGame: function () {
        this.hands.forEach(function (hand) {
            console.log(hand.stringOf());
        });
        console.log('Community: ' + this.community.map(function (card) {
            return new CardUtil().cardString(card);
        }));
        console.log(this.eval);
        return this;
    },
    //returns the JSON for the game
    getGame: function () {
        return {
            "hands" : this.hands.map(function (hand) {
                return hand.valueOf();
            }),
            "community": this.community,
            "eval" : this.eval
        };
    }

}

//export;
module.exports = {
    cfg: cfg,
    CardUtil: CardUtil,
    Hand: Hand,
    Game: Game
};


