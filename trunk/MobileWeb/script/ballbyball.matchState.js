function MatchState(Players, LastCompletedOver, Over, Score, RunRate) {
    //Fields
    this.Players = Players;
    this.Over = Over;
    this.LastCompletedOver = LastCompletedOver;
    this.Score = Score;
    this.RunRate = RunRate;

    //Methods
    this.getBattingPlayers = getBattingPlayers;
    this.getWaitingPlayers = getWaitingPlayers;
    this.getPlayersOfStatus = getPlayersOfStatus;
    this.setPlayerBatting = setPlayerBatting;
    this.setPlayerOut = setPlayerOut;
    this.getCurrentScoreForBatsman = getCurrentScoreForBatsman;
    this.getPlayer = getPlayer;
    this.getNextBattingPosition = getNextBattingPosition;
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

function matchStateFromData(data) {
    return new MatchState(data.Players, data.LastCompletedOver, new Over(), data.Score, data.RunRate);
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
    $.each(matchState.Players, function (index, player) {
        if (player.PlayerId == playerId) {
            return player;
        }
    });
}

function getNextBattingPosition() {
    var positions = new Array();
    $.each(matchState.Players, function (index, player) {
        positions.push(player.Position);
    });
    var highestBatter = Math.max.apply(null, positions);
    return (highestBatter * 1) + 1;
}