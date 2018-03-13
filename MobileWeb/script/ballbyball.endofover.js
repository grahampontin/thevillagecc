function refreshEndOfOverPageView() {
    $("#overTotalScore").html(formatScore(matchState.Over.totalScore()));
    $("#inningsWickets").html(matchState.Over.wickets());
    var scoreAfterThisOver = matchState.Over.totalScore() * 1 + matchState.Score * 1;
    $("#inningsScore").html(scoreAfterThisOver);
    $("#inningsRunRate").html((scoreAfterThisOver / (matchState.LastCompletedOver+1)).toFixed(2));
    $(".overBallListItem").remove();
    $("#overDetailUl").append(matchState.Over.toHtml(matchState.LastCompletedOver));
    $("#overDetailUl").listview('refresh');
    $("#submitToServerButton").prop('disabled', false);
    var numberOfBalls = matchState.Over.legalBallCount();
    if (numberOfBalls < 6) {
        showWarning("There are only " + numberOfBalls + " legal balls in this over. Sure you didn't miss one?");
    }
    if (numberOfBalls > 6) {
        showWarning("There are " + numberOfBalls + " legal balls in this over. Seems like too many don't you think?");
    }
}

function bindEndOfOverPageHandlers() {
    $("#submitToServerButton").click(function () {
        $("#submitToServerButton").prop('disabled', true);
        //Fix this
        var matchId = matchState.MatchId;
        matchState.Over.Commentary = $("#overCommentery").val();
        var postData = { 'command': "submitOver", 'matchId': matchId, 'payload': matchState };
        //Post to server and handle response.
        $.post('./CommandHandler.ashx', JSON.stringify(postData), function (data) {
                //success
                matchState = matchStateFromData(data);
                switchBatsmen();
                $("body").pagecontainer("change", "NewOver.aspx", { transition: "slide" });

                updateUi();
            }, 'json')
            .fail(function (data) {
                showError(data.responseText);
            });
    });
}