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
}

function getBattingPlayers() {
   return getPlayersOfStatus("Batting", this);
}

function getWaitingPlayers() {
    return getPlayersOfStatus("Waiting", this);
}

function getPlayersOfStatus(status, matchState) {
    var players = new Array();
    $.each(matchState.Players, function (index, value) {
        if (value.State == status) {
            players.push(value);
        }
    });
    return players;
}

function matchStateFromData(data) {
    return new MatchState(data.Players, data.LastCompletedOver, new Over(), data.Score, data.RunRate);
}