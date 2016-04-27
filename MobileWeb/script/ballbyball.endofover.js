function initialiseEndOfOver() {
    $("#overTotalScore").html(formatScore(matchState.Over.totalScore() * 1 + matchState.Score * 1));
    $("#inningsWickets").html(matchState.Over.wickets());
    $("#inningsScore").html(matchState.Over.totalScore());
    $("#inningsRunRate").html(matchState.Over.totalScore() + ".00");
    $("#overPlaceHolder").replaceWith(matchState.Over.toHtml(matchState.LastCompletedOver));
    $("#overDetailUl").listview('refresh');
    $("#submitToServerButton").prop('disabled', false);
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
            $("body").pagecontainer("change", "BallByBall.aspx", { transition: "fade" });

            write();
        }, 'json')
         .fail(function (data) {
             showError(data.responseText);
         });
    });
}