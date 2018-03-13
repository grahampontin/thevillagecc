function initialiseHelp() {
    $("#deleteLastOver").click(function () {
        $("#deleteLastOver").prop('disabled', true);
        var postData = { 'command': "deleteLastOver", 'matchId': matchState.MatchId, 'payload': '{}' };
        $.post('./CommandHandler.ashx', JSON.stringify(postData), function (data) {
            //success
            matchState = matchStateFromData(data);
            $("body").pagecontainer("change", "BallByBall.aspx", { transition: "fade" });
            updateUi();
        }, 'json')
         .fail(function (data) {
             showError(data.responseText);
         });
    });
    $("#forceReload").click(function () {
        $("#forceReload").prop('disabled', true);
        window.location.replace("/MobileWeb/BallByBall/BallByBall.aspx?matchId=" + matchState.MatchId);
    });
    $("#backToMatchSelect").click(function () {
        $("#backToMatchSelect").prop('disabled', true);
        window.location.replace("/MobileWeb/BallByBall/SelectMatch.aspx");
    });
};