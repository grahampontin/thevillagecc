function MatchState(Players, LastCompletedOver, Over, Score, RunRate, Bowlers, MatchId, PreviousBowler, PreviousBowlerButOne, Partnership, OnStrikeBatsmanId, OppositionScore, OppositionWickets, BowlerDetails, OppositionName, OppositionShortName) {
    //Fields
    this.Players = Players;
    this.Over = Over;
    this.LastCompletedOver = LastCompletedOver;
    this.Score = Score;
    this.RunRate = RunRate;
    this.Bowlers = Bowlers;
    this.MatchId = MatchId;
    this.PreviousBowler = PreviousBowler;
    this.PreviousBowlerButOne = PreviousBowlerButOne;
    this.Partnership = Partnership;
    this.CurrentBowler = Bowlers.length >= 1 ? Bowlers[0] : "";
    this.OnStrikeBatsmanId = OnStrikeBatsmanId;
    if (this.OnStrikeBatsmanId == undefined || this.OnStrikeBatsmanId == null) {
        this.OnStrikeBatsmanId = -1;
    }
    this.OnStrikeBatsmanName = "Not set";
    this.OppositionScore = OppositionScore;
    this.OppositionWickets = OppositionWickets;
    this.BowlerDetails = BowlerDetails;
    this.OppositionName = OppositionName;
    this.OppositionShortName = OppositionShortName;


    //Methods
    this.getBattingPlayers = getBattingPlayers;
    this.getWaitingPlayers = getWaitingPlayers;
    this.getPlayersOfStatus = getPlayersOfStatus;
    this.setPlayerBattingAtPosition = setPlayerBattingAtPosition;
    this.setPlayerOut = setPlayerOut;
    this.setPlayerBatting = setPlayerBatting;
    this.setPlayerWaiting = setPlayerWaiting;
    this.getCurrentScoreForBatsman = getCurrentScoreForBatsman;
    this.getPlayer = getPlayer;
    this.getNextBattingPosition = getNextBattingPosition;
    this.getBowlers = getBowlers;
    this.addBowler = addBowler;
    this.switchBatsmanOnStrike = switchBatsmanOnStrike;
    this.addBall = addBall;
    this.removeLastBall = removeLastBall;
    this.evaluatePlayerScores = evaluatePlayerScores;
    this.evaluateBattingStatusesAfterRemovingBall = evaluateBattingStatusesAfterRemovingBall;
    this.shouldSwitchStrikerAfter = shouldSwitchStrikerAfter;
    this.evalStatsFor = evalStatsFor;
    this.evalPartnership = evalPartnership;
    this.getCurrentBallsFacedForBatsman = getCurrentBallsFacedForBatsman;
    this.getCurrentFoursForBatsman = getCurrentFoursForBatsman;
    this.getCurrentSixesForBatsman = getCurrentSixesForBatsman;
    this.getLastBall = getLastBall;
    this.getBowlerDetails = getBowlerDetails;
    this.getBallsBowledBy = getBallsBowledBy;
    this.getRunsConceededInCurrentOver = getRunsConceededInCurrentOver;
    this.getWicketsTakenInCurrentOver = getWicketsTakenInCurrentOver;
}

function addBall(ball) {
    this.Over.balls.push(ball);
    this.evaluatePlayerScores();
    if (ball.wicket != undefined) {
        this.setPlayerOut(ball.wicket.player);
        this.setPlayerBattingAtPosition(ball.wicket.nextManIn, this.getNextBattingPosition());
        if (this.OnStrikeBatsmanId === ball.wicket.player) {
            this.OnStrikeBatsmanId = ball.wicket.nextManIn;
        }
    }
    this.evaluatePlayerScores();
    if (this.shouldSwitchStrikerAfter(ball)) {
        this.switchBatsmanOnStrike();
    }
}

function getBowlerDetails(bowlerName) {
    var theDeets;
    $.each(this.BowlerDetails, function(index, details) {
        if (details.Name == bowlerName) {
            theDeets = details;
        }
    });
    return theDeets;
}

function getBallsBowledBy(bowlerName) {
    var balls = new Array();
    $.each(this.Over.balls, function(index, ball) {
        if (ball.bowler == bowlerName) {
            balls.push(ball);
        }
    });
    return balls;
}

function getRunsConceededInCurrentOver(bowlerName) {
    var runs = 0;
    $.each(this.getBallsBowledBy(bowlerName), function(index, ball) {
        if (ball.bowler == bowlerName) {
            if (ball.thing != "lb" && ball.thing != "b") {
                runs += ball.amount;
            }
        }
    });
    return runs;
}

function getWicketsTakenInCurrentOver(bowlerName) {
    var wickets = 0;
    $.each(this.getBallsBowledBy(bowlerName), function(index, ball) {
        if (ball.wicket != undefined && ball.wicket != null) {
            if (ball.wicket.modeOfDismissal != "ro") {
                wickets ++;
            }
        }
    });
    return wickets;
}

function removeLastBall() {
    var undone = matchState.Over.balls.pop();
    this.evaluateBattingStatusesAfterRemovingBall(undone);
    this.evaluatePlayerScores();
    if (this.shouldSwitchStrikerAfter(undone)) {
        this.switchBatsmanOnStrike();
    }
    return undone;
}

function getLastBall() {
    return this.Over.balls[this.Over.balls.length - 1];
}

function shouldSwitchStrikerAfter(ball) {
    if (ball.wicket != undefined && ball.wicket.batsmenCrossed) {
        return true;
    }
    var shouldSwitch = ball.amount % 2 !== 0;
    switch (ball.thing) {
    case "wd":
    case "nb":
        shouldSwitch = !shouldSwitch;
        break;
    default:
        //nothing to do
    }
    return shouldSwitch;
}

function evaluateBattingStatusesAfterRemovingBall(ball) {
    if (ball.wicket != undefined) {
        var outBatsman = ball.wicket.player;
        var notOutBatsman = ball.wicket.notOutPlayer.PlayerId;

        var batters = matchState.getBattingPlayers();
        if (batters[0].PlayerId === notOutBatsman) {
            matchState.setPlayerWaiting(batters[1].PlayerId);
        } else {
            matchState.setPlayerWaiting(batters[0].PlayerId);
        }

        matchState.setPlayerBatting(outBatsman);
        matchState.OnStrikeBatsmanId = outBatsman;
    }

}

function evaluatePlayerScores() {
    var batsman1 = this.getBattingPlayers()[0];
    var batsman2 = this.getBattingPlayers()[1];
    this.evalStatsFor(batsman1);
    this.evalStatsFor(batsman2);
    this.evalPartnership();
}

function evalPartnership() {
    var partnership = this.Partnership;
    partnership.CurrentScore = partnership.Runs + this.Over.totalScore();
    partnership.CurrentBalls = partnership.Balls + this.Over.balls.length;
    partnership.CurrentFours = partnership.Balls + this.Over.totalFours();
    partnership.CurrentSixes = partnership.Balls + this.Over.totalSixes();
}

function evalStatsFor(batsman1) {
    batsman1.Score = this.getCurrentScoreForBatsman(batsman1.PlayerId);
    batsman1.CurrentBallsFaced = this.getCurrentBallsFacedForBatsman(batsman1.PlayerId);
    batsman1.CurrentFours = this.getCurrentFoursForBatsman(batsman1.PlayerId);
    batsman1.CurrentSixes = this.getCurrentSixesForBatsman(batsman1.PlayerId);
    if (batsman1.CurrentBallsFaced == 0) {
        batsman1.CurrentStrikeRate = 0;
    } else {
        batsman1.CurrentStrikeRate = Math.round((batsman1.Score / batsman1.CurrentBallsFaced)*1000)/10;
    }
    

}

function getBattingPlayers() {
   return this.getPlayersOfStatus("Batting");
}

function getWaitingPlayers() {
    return this.getPlayersOfStatus("Waiting");
}

function getPlayersOfStatus(status) {
    var players = new Array();
    $.each(this.Players, function (index, value) {
        if (value.State === status) {
            players.push(value);
        }
    });
    return players;
}

function getBowlers() {
    return this.Bowlers;
}

function addBowler(name) {
    this.Bowlers.push(name);
}

function matchStateFromData(data) {
    return new MatchState(data.Players, data.LastCompletedOver, new Over(), data.Score, data.RunRate, data.Bowlers, data.MatchId, data.PreviousBowler, data.PreviousBowlerButOne, data.Partnership, data.OnStrikeBatsmanId, data.OppositionScore, data.OppositionWickets, data.BowlerDetails, data.OppositionName, data.OppositionShortName);
}

function setPlayerBattingAtPosition(playerId, position) {
    $.each(this.Players, function (index, player) {
        if (player.PlayerId == playerId) {
            player.State = "Batting";
            player.Position = position;
        }
    });
}

function setPlayerBatting(playerId) {
    $.each(this.Players, function (index, player) {
        if (player.PlayerId == playerId) {
            player.State = "Batting";
        }
    });

}function setPlayerWaiting(playerId) {
    $.each(this.Players, function (index, player) {
        if (player.PlayerId == playerId) {
            player.State = "Waiting";
            player.Position = 0;
        }
    });
}
function setPlayerOut(playerId) {
    $.each(this.Players, function (index, player) {
        if (player.PlayerId == playerId) {
            player.State = "Out";
        }
    });
}

function getCurrentScoreForBatsman(playerId) {
    var score = getPlayer(playerId).CurrentScore + this.Over.scoreForPlayer(playerId);
    return score;
}

function getCurrentFoursForBatsman(playerId) {
    var score = getPlayer(playerId).Fours + this.Over.foursForPlayer(playerId);
    return score;
}

function getCurrentSixesForBatsman(playerId) {
    var score = getPlayer(playerId).Sixes + this.Over.sixesForPlayer(playerId);
    return score;
}

function getCurrentBallsFacedForBatsman(playerId) {
    var score = getPlayer(playerId).BallsFaced + this.Over.ballsFacedByPlayer(playerId);
    return score;
}

function getPlayer(playerId) {
    var theRightPlayer;
    $.each(matchState.Players, function (index, player) {
        if (player.PlayerId == playerId) {
            theRightPlayer = player;
        }
    });
    return theRightPlayer;
}

function getNextBattingPosition() {
    var positions = new Array();
    $.each(matchState.Players, function (index, player) {
        positions.push(player.Position);
    });
    var highestBatter = Math.max.apply(null, positions);
    return (highestBatter * 1) + 1;
}

function switchBatsmanOnStrike() {
    var battingPlayers = this.getBattingPlayers();

// ReSharper disable once CoercedEqualsUsing
    if (battingPlayers[0].PlayerId == this.OnStrikeBatsmanId) {
        this.OnStrikeBatsmanId = battingPlayers[1].PlayerId;
        this.OnStrikeBatsmanName = battingPlayers[1].PlayerName;
    } else {
        this.OnStrikeBatsmanId = battingPlayers[0].PlayerId;
        this.OnStrikeBatsmanName = battingPlayers[0].PlayerName;
    }
}