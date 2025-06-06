﻿function MatchState(Players, LastCompletedOver, Over, Score, RunRate, Bowlers, MatchId, PreviousBowler, PreviousBowlerButOne, Partnership, OnStrikeBatsmanId, OppositionScore, OppositionWickets, BowlerDetails, OppositionName, OppositionShortName, LiveScorecard) {
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
    this.LiveScorecard = LiveScorecard;
    
    this.OriginalExtras = {
        Byes: LiveScorecard.LiveBattingCard.Extras.Byes,
        LegByes: LiveScorecard.LiveBattingCard.Extras.LegByes,
        Wides: LiveScorecard.LiveBattingCard.Extras.Wides,
        NoBalls: LiveScorecard.LiveBattingCard.Extras.NoBalls,
        Penalty: LiveScorecard.LiveBattingCard.Extras.Penalty,
    }
    


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
    this.updateBatterStatsInLiveScorecard = updateBatterStatsInLiveScorecard;
    this.updateScorecardData = updateScorecardData;
    this.updateExtrasAndScoreInLiveScorecard = updateExtrasAndScoreInLiveScorecard;
    
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
    partnership.CurrentFours = partnership.Fours + this.Over.totalFours();
    partnership.CurrentSixes = partnership.Sixes + this.Over.totalSixes();
}

function updateBatterStatsInLiveScorecard(batsman1) {
    let players = this.LiveScorecard.LiveBattingCard.Players;
    let found = false;
    let maxIndex = 0;
    let lastBall = this.Over.balls[this.Over.balls.length - 1];
    
    
    $.each(players, (index, player)=>{
        if (player.BatsmanInningsDetails.PlayerId === batsman1.PlayerId){
            player.BatsmanInningsDetails.Score = batsman1.Score;
            player.BatsmanInningsDetails.Balls = batsman1.CurrentBallsFaced;
            player.BatsmanInningsDetails.Fours = batsman1.CurrentFours;
            player.BatsmanInningsDetails.Sixes = batsman1.CurrentSixes;
            if (batsman1.CurrentBallsFaced === 0) {
                player.BatsmanInningsDetails.StrikeRate = 0;
            } else {
                player.BatsmanInningsDetails.StrikeRate = batsman1.CurrentStrikeRate;
            }
            
            found = true;
        }
        if (lastBall !== undefined && lastBall.wicket !== undefined && lastBall.wicket != null) {
            if (lastBall.wicket.player === player.BatsmanInningsDetails.PlayerId) {
                player.Wicket = {
                    PlayerId: lastBall.wicket.player,
                    PlayerName: lastBall.wicket.playerName,
                    ModeOfDismissal: lastBall.wicket.modeOfDismissal,
                    Description: lastBall.wicket.description,
                    Fielder : lastBall.wicket.fielder,
                    Bowler: lastBall.wicket.bowler,
                    IsBowled: lastBall.wicket.modeOfDismissal === "b",
                    IsCaught: lastBall.wicket.modeOfDismissal === "ct",
                    IsLbw: lastBall.wicket.modeOfDismissal === "lbw",
                    IsRunOut: lastBall.wicket.modeOfDismissal === "ro",
                    IsStumped: lastBall.wicket.modeOfDismissal === "st",
                    IsHitWicket: lastBall.wicket.modeOfDismissal === "hw",
                    IsRetired: lastBall.wicket.modeOfDismissal === "rt",
                    IsRetiredHurt: lastBall.wicket.modeOfDismissal === "rth",
                    IsCaughtAndBowled: lastBall.wicket.modeOfDismissal === "c&b"
                    
                }
            }
        }

        maxIndex = index;
    });
    if (!found) {
        let newPlayer = {
            BatsmanInningsDetails: {
                PlayerId: batsman1.PlayerId,
                Name: batsman1.PlayerName,
                Score: batsman1.Score,
                Balls: batsman1.CurrentBallsFaced,
                Fours: batsman1.CurrentFours,
                Sixes: batsman1.CurrentSixes,
                StrikeRate: batsman1.CurrentStrikeRate
            },
            Wicket: null
        };
        players[maxIndex+1] = newPlayer;
    }
}

function updateScorecardData() {
    this.updateBatterStatsInLiveScorecard(this.getBattingPlayers()[0]);
    this.updateBatterStatsInLiveScorecard(this.getBattingPlayers()[1]);
    this.updateExtrasAndScoreInLiveScorecard();

}

function updateExtrasAndScoreInLiveScorecard() {
    this.LiveScorecard.Score = this.Over.totalScore() * 1 + matchState.Score * 1;
    let extras = this.LiveScorecard.LiveBattingCard.Extras;
    extras.Byes = this.Over.totalByes() + this.OriginalExtras.Byes;
    extras.LegByes = this.Over.totalLegByes() + this.OriginalExtras.LegByes;
    extras.Wides = this.Over.totalWides() + this.OriginalExtras.Wides;
    extras.Penalty = this.Over.totalPenalties() + this.OriginalExtras.Penalty;
    extras.NoBalls = this.Over.totalNoBalls() + this.OriginalExtras.NoBalls;
    extras.Total = extras.Byes + extras.LegByes + extras.Wides + extras.Penalty + extras.NoBalls;

    extras.DetailString = extras.Byes + "b, " + extras.LegByes + "lb, " + extras.Wides + "wd, " + extras.NoBalls + "nb, " + extras.Penalty + "p";
}


function evalStatsFor(batsman1) {
    if (batsman1 == undefined) {
        return;
    }
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
    return new MatchState(data.Players, data.LastCompletedOver, new Over(), data.Score, data.RunRate, data.Bowlers, data.MatchId, data.PreviousBowler, data.PreviousBowlerButOne, data.Partnership, data.OnStrikeBatsmanId, data.OppositionScore, data.OppositionWickets, data.BowlerDetails, data.OppositionName, data.OppositionShortName, data.LiveScorecard.InPlayData);
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