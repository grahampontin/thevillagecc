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
    $("#teamScore").text(matchData.Score);
    $("#teamWickets").text(matchData.Wickets);
    $("#teamRunRate").text(matchData.RunRate);

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

    //Current partnership
    $("#currentPartnershipRuns").text(matchData.CurrentPartnership.Score);
    $("#currentPartnershipRunRate").text(matchData.CurrentPartnership.RunRate);
    $("#currentPartnershipOvers").text(matchData.CurrentPartnership.OversAsString);
    $("#currentPartnershipPlayer1Name").text(matchData.CurrentPartnership.Player1Name);
    $("#currentPartnershipPlayer1Runs").text(matchData.CurrentPartnership.Player1Score);
    $("#currentPartnershipPlayer2Name").text(matchData.CurrentPartnership.Player2Name);
    $("#currentPartnershipPlayer2Runs").text(matchData.CurrentPartnership.Player2Score);
    
    //Last batsman
    $("#lastBatsmanScore").text(matchData.LastManOut.OutgoingBatsmanInningsDetails.Score);
    $("#lastBatsmanBalls").text(matchData.LastManOut.OutgoingBatsmanInningsDetails.Balls);
    $("#lastBatsmanFours").text(matchData.LastManOut.OutgoingBatsmanInningsDetails.Fours);
    $("#lastBatsmanSixes").text(matchData.LastManOut.OutgoingBatsmanInningsDetails.Sixes);
    $("#lastBatsmanStrikeRate").text(matchData.LastManOut.OutgoingBatsmanInningsDetails.StrikeRate);
    $("#lastBatsmanWicketText").text(getDismissalText(matchData.LastManOut));

    //Fall of last wicket
    $("#fallOfWicketWicketNumber").text(matchData.LastManOut.WicketNumber);
    $("#fallOfWicketTeamScore").text(matchData.LastManOut.TeamScore);
    $("#fallOfWicketOver").text(matchData.LastManOut.OverAsString);
    $("#lastPartnershipRuns").text(matchData.LastManOut.Partnership.Score);
    $("#lastPartnershipRunRate").text(matchData.LastManOut.Partnership.RunRate);
    $("#lastPartnershipOvers").text(matchData.LastManOut.Partnership.OversAsString);
    $("#lastPartnershipPlayer1Name").text(matchData.LastManOut.Partnership.Player1Name);
    $("#lastPartnershipPlayer1Runs").text(matchData.LastManOut.Partnership.Player1Score);
    $("#lastPartnershipPlayer2Name").text(matchData.LastManOut.Partnership.Player2Name);
    $("#lastPartnershipPlayer2Runs").text(matchData.LastManOut.Partnership.Player2Score);

    //Recent overs
    var ballsRendered = 0;
    $.each(matchData.CompletedOvers.reverse(), function(index, over) {
        if (ballsRendered >= 26) {
            return;
        }
        $.each(over.Balls.reverse(), function (ballIndex, ball) {
            if (ballsRendered >= 26) {
                return;
            }
            if (ball.Wicket != null) {
                if (ball.Amount !== 0) {
                    $("#recentOvers").prepend("<div class=\"ball-score\"><small><strong>W</strong></small>," + ball.Amount + ball.Thing + "</div>");
                } else {
                    $("#recentOvers").prepend("<div class=\"ball-score\"><small><strong>W</strong></small></div>");
                }
            } else if (ball.Amount === 0) {
                $("#recentOvers").prepend("<div class=\"ball-score\">•</div>");
            } else {
                $("#recentOvers").prepend("<div class=\"ball-score\"><small>" + ball.Amount + ball.Thing + "</small></div>");
            }
            ballsRendered++;
        });
        $("#recentOvers").prepend("<div class=\"over-divider\">&nbsp</div>");
    });

}

function getDismissalText(fallOfWicket) {
    var string = fallOfWicket.OutgoingPlayerName + " ";
    switch (fallOfWicket.Wicket.ModeOfDismissal) {
        case "b":
            string += "b " + fallOfWicket.Bowler;
            break;
        case "ct":
            string += "ct " + fallOfWicket.Fielder + " b " + fallOfWicket.Bowler;
            break;
        case "lbw":
            string += "lbw " + fallOfWicket.Bowler;
            break;
        case "ro":
            string += "run out " + fallOfWicket.Fielder;
            break;
        case "st":
            string += "stumped " + fallOfWicket.Fielder;
            break;
        case "hw":
            string += "hit wicket";
            break;
        case "htb":
            string += "handled the ball";
            break;
    }
    return string;
}