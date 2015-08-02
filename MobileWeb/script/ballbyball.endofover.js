function initialiseEndOfOver() {
    $("#overTotalScore").html(formatScore(matchState.Over.totalScore() * 1 + matchState.Score * 1));
    $("#inningsWickets").html(matchState.Over.wickets());
    $("#inningsScore").html(matchState.Over.totalScore());
    $("#inningsRunRate").html(matchState.Over.totalScore() + ".00");
    $("#overPlaceHolder").replaceWith(matchState.Over.toHtml(matchState.LastCompletedOver));
    $("#overDetailUl").listview('refresh');
    $("#submitToServerButton").click(function () {
        //Fix this
        var matchId = matchState.MatchId;
        var postData = { 'command': "submitOver", 'matchId': matchId, 'payload': matchState };
        //Post to server and handle response.
        $.post('./CommandHandler.ashx', JSON.stringify(postData), function (data) {
            //success
            matchState = matchStateFromData(data);
            $.mobile.changePage("BallByBall.aspx", "slide", true, true);

            write();
        }, 'json')
         .fail(function (data) {
             showError(data.responseText);
         });
    });
}