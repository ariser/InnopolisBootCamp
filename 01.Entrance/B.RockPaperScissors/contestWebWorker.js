(function () {
  'use strict';

  // region constants
  var ROCK     = 0,
      PAPER    = 1,
      SCISSORS = 2;

  var STRATEGIES = [
    [ROCK, ROCK, PAPER, SCISSORS],
    [ROCK, PAPER, PAPER, SCISSORS],
    [ROCK, PAPER, SCISSORS, SCISSORS]
  ];

  var STRATEGIES_NAMES = ['Rock', 'Paper', 'Scissors'];

  var winnerMap = {};
  winnerMap[ROCK] = {};
  winnerMap[ROCK][ROCK] = 0;
  winnerMap[ROCK][PAPER] = -1;
  winnerMap[ROCK][SCISSORS] = 1;

  winnerMap[PAPER] = {};
  winnerMap[PAPER][ROCK] = 1;
  winnerMap[PAPER][PAPER] = 0;
  winnerMap[PAPER][SCISSORS] = -1;

  winnerMap[SCISSORS] = {};
  winnerMap[SCISSORS][ROCK] = -1;
  winnerMap[SCISSORS][PAPER] = 1;
  winnerMap[SCISSORS][SCISSORS] = 0;
  // endregion

  // region Player
  function Player(name) {
    if (!(this instanceof Player)) {
      throw new Error('Missing "new" keyword');
    }

    if (arguments.length < 1) {
      throw new Error('Not enough arguments to Player');
    }

    var strategyIndex = Math.floor(Math.random() * STRATEGIES.length),
        strategy      = STRATEGIES[strategyIndex],
        strategyName  = STRATEGIES_NAMES[strategyIndex];

    this.strategy = strategy;
    this.strategyName = strategyName;
    this.name = name;
  }

  Player.prototype.getFigure = function () {
    return this.strategy[Math.floor(Math.random() * this.strategy.length)];
  };
  // endregion

  // region Game
  function Game(playerOne, playerTwo) {
    if (!(this instanceof Game)) {
      throw new Error('Missing "new" keyword');
    }

    if (arguments.length < 2) {
      throw new TypeError('Not enough arguments to Game');
    }

    this.playerOne = playerOne;
    this.playerTwo = playerTwo;
  }

  Game.prototype.getWinner = function () {
    var playerOneFigure = this.playerOne.getFigure(),
        playerTwoFigure = this.playerTwo.getFigure();

    var playerOneWins = winnerMap[playerOneFigure][playerTwoFigure];

    if (playerOneWins > 0) {
      return this.playerOne;
    } else if (playerOneWins < 0) {
      return this.playerTwo;
    } else {
      return undefined; // just for clarity
    }
  };
  // endregion

  // region Contest
  function Contest(roundsNumber) {
    if (!(this instanceof Contest)) {
      throw new Error('Missing "new" keyword.');
    }

    if (arguments.length < 1) {
      throw new TypeError('Not enough arguments to Contest');
    }

    if (isNaN(roundsNumber) || roundsNumber === '') {
      throw new TypeError('Rounds number must be... a number');
    }

    this.roundsNumber = parseInt(roundsNumber);
    this.players = [];

    this.observers = {};
    this.roundsPlayed = 0;
  }

  // region observable contest
  Contest.prototype.notify = function (event/*[, params...]*/) {
    var eventObservers, index, length, params;

    eventObservers = this.observers[event];
    index = 0;
    length = eventObservers.length;

    params = Array.prototype.slice.call(arguments, 1);

    for (; index < length; index += 1) {
      eventObservers[index].apply(null, params);
    }
  };
  Contest.prototype.subscribe = function (event, observer) {
    if (typeof this.observers[event] === 'undefined') {
      this.observers[event] = [];
    }
    this.observers[event].push(observer);
  };
  // endregion

  Contest.prototype.play = function () {
    this._initPlayers();

    while (this.players.length > 1) {
      this._playRound();
    }
  };

  Contest.prototype._initPlayers = function () {
    var playersNumber = Math.pow(2, this.roundsNumber);
    for (var i = 0; i < playersNumber; i += 1) {
      this.players.push(new Player(i + 1));
    }

    this.notify('playersInited', this.players);
  };

  Contest.prototype._playRound = function () {
    this.roundsPlayed += 1;

    this.notify('roundStart', this.roundsPlayed, this.players.length === 2);

    var playersNumber = this.players.length,
        roundWinners  = [];

    for (var i = 0; i < playersNumber; i += 2) {
      var playerOne = this.players[i],
          playerTwo = this.players[i + 1];

      var winner = this._getRoundWinner(playerOne, playerTwo);
      roundWinners.push(winner);

      this.notify('roundPlayed', playerOne, playerTwo, winner);
    }

    this.players = roundWinners;
  };

  Contest.prototype._getRoundWinner = function (playerOne, playerTwo) {
    var playerOneVictories = 0,
        playerTwoVictories = 0,

        game               = new Game(playerOne, playerTwo);

    while (Math.abs(playerOneVictories - playerTwoVictories) < 2) {
      if (game.getWinner() === playerOne) {
        playerOneVictories += 1;
      } else if (game.getWinner() === playerTwo) {
        playerTwoVictories += 1;
      }
    }

    return playerOneVictories > playerTwoVictories ? playerOne : playerTwo;
  };
  // endregion

  onmessage = function (e) {
    var roundsNumber = e.data;
    try {
      var contest = new Contest(roundsNumber);

      contest.subscribe('playersInited', function (players) {
        players.forEach(function (player) {
          console.log('Player ' + player.name + ': ' + player.strategyName);
        });
      });

      contest.subscribe('roundStart', function (roundIndex, isLast) {
        console.log(isLast ? 'Final' : 'Round ' + roundIndex + '');
        if (isLast) {
          postMessage('done');
        }
      });

      contest.subscribe('roundPlayed', function (playerOne, playerTwo, winner) {
        console.log('Player ' + playerOne.name + ' vs Player ' + playerTwo.name + '. Player ' + winner.name + ' wins!');
      });

      contest.play();
    } catch (e) {
      postMessage(e.message);
    }
  }
})();