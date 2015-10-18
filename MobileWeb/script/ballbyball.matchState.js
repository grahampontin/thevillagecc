function MatchState(Players, LastCompletedOver, Over, Score, RunRate, Bowlers, MatchId) {
    //Fields
    this.Players = Players;
    this.Over = Over;
    this.LastCompletedOver = LastCompletedOver;
    this.Score = Score;
    this.RunRate = RunRate;
    this.Bowlers = Bowlers;
    this.MatchId = MatchId;
    this.CurrentBowler = Bowlers.length >= 1 ? Bowlers[0] : "";
    this.OnStrikeBatsmanId = -1;
    this.OnStrikeBatsmanName = "Not set";



    //Methods
    this.getBattingPlayers = getBattingPlayers;
    this.getWaitingPlayers = getWaitingPlayers;
    this.getPlayersOfStatus = getPlayersOfStatus;
    this.setPlayerBatting = setPlayerBatting;
    this.setPlayerOut = setPlayerOut;
    this.getCurrentScoreForBatsman = getCurrentScoreForBatsman;
    this.getPlayer = getPlayer;
    this.getNextBattingPosition = getNextBattingPosition;
    this.getBowlers = getBowlers;
    this.addBowler = addBowler;
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
        if (value.State == status) {
            players.push(value);
        }
    });
    return players;
}

function getBowlers() {
    return this.Bowlers;
}

function addBowler(name) {
    this.Bowlers.unshift(name);
}

function matchStateFromData(data) {
    return new MatchState(data.Players, data.LastCompletedOver, new Over(), data.Score, data.RunRate, data.Bowlers, data.MatchId);
}

function setPlayerBatting(playerId, position) {
    $.each(this.Players, function (index, player) {
        if (player.PlayerId == playerId) {
            player.State = "Batting";
            player.Position = position;
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
    var score = 0;
    $.each(this.Over.balls, function (index, ball) {
        if (ball.batsman == playerId) {
            score += (ball.amount*1); //force to be number
        }
    });
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