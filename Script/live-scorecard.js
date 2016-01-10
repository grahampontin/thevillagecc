$(function () {
    var matchId = $.url().param('matchId');
    if (matchId == null) {
        showError("No match id speified. How did you get here exactly?");
        return;
    }
    var postData = { 'command': "liveScorecard", 'matchId': matchId };
    $.post("./MobileWeb/BallByBall/CommandHandler.ashx", JSON.stringify(postData), function (data) {
        //success
            renderMatchData(data);
        }, 'json')
        .fail(function (data) {
            showError(data.responseText);
        });
});

function showError(text) {
    BootstrapDialog.show({
        title: "Oops! Something went wrong.",
        message: text,
        closable: false,
        buttons: [{
            label: 'Close',
            cssClass: 'btn-default',
            action: function (dialogRef) {
                dialogRef.close();
            }
        }]
    });
}

function renderMatchData(matchData) {
    $(".opposition").text(matchData.Opposition);
    $("#oversRemaining").text(matchData.OversRemaining);
    $("#lastCompletedOver").text(matchData.LastCompletedOver);

    //On strike batsman
    $("#onStrikeBatsmanName").text(matchData.OnStrikeBatsman.Name);
    $("#onStrikeBatsmanScore").text(matchData.OnStrikeBatsman.Score);
    $("#onStrikeBatsmanBalls").text(matchData.OnStrikeBatsman.Balls);
    $("#onStrikeBatsmanFours").text(matchData.OnStrikeBatsman.Fours);
    $("#onStrikeBatsmanSixes").text(matchData.OnStrikeBatsman.Sixes);
    $("#onStrikeBatsmanStrikeRate").text(matchData.OnStrikeBatsman.StrikeRate);
    $("#onStrikeBatsmanScoreForThisBowler").text(matchData.OnStrikeBatsman.ScoreForThisBowler);
    $("#onStrikeBatsmanBallsFacedFromThisBowler").text(matchData.OnStrikeBatsman.BallsFacedFromThisBowler);
    $("#onStrikeBatsmanScoreForLastTenOvers").text(matchData.OnStrikeBatsman.ScoreForLastTenOvers);
    $("#onStrikeBatsmanBallsFacedInLastTenOvers").text(matchData.OnStrikeBatsman.BallsFacedInLastTenOvers);
    $("#onStrikeBatsmanMatches").text(matchData.OnStrikeBatsman.Matches);
    $("#onStrikeBatsmanCareerRuns").text(matchData.OnStrikeBatsman.CareerRuns);
    $("#onStrikeBatsmanCareerHighScore").text(matchData.OnStrikeBatsman.CareerHighScore);
    $("#onStrikeBatsmanCareerAverage").text(matchData.OnStrikeBatsman.CareerAverage);

    //Off strike batsman
    $("#otherBatsmanName").text(matchData.OtherBatsman.Name);
    $("#otherBatsmanScore").text(matchData.OtherBatsman.Score);
    $("#otherBatsmanBalls").text(matchData.OtherBatsman.Balls);
    $("#otherBatsmanFours").text(matchData.OtherBatsman.Fours);
    $("#otherBatsmanSixes").text(matchData.OtherBatsman.Sixes);
    $("#otherBatsmanStrikeRate").text(matchData.OtherBatsman.StrikeRate);
    $("#otherBatsmanScoreForThisBowler").text(matchData.OtherBatsman.ScoreForThisBowler);
    $("#otherBatsmanBallsFacedFromThisBowler").text(matchData.OtherBatsman.BallsFacedFromThisBowler);
    $("#otherBatsmanScoreForLastTenOvers").text(matchData.OtherBatsman.ScoreForLastTenOvers);
    $("#otherBatsmanBallsFacedInLastTenOvers").text(matchData.OtherBatsman.BallsFacedInLastTenOvers);
    $("#otherBatsmanMatches").text(matchData.OtherBatsman.Matches);
    $("#otherBatsmanCareerRuns").text(matchData.OtherBatsman.CareerRuns);
    $("#otherBatsmanCareerHighScore").text(matchData.OtherBatsman.CareerHighScore);
    $("#otherBatsmanCareerAverage").text(matchData.OtherBatsman.CareerAverage);





}

