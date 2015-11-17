function initialiseMatchConditions() {
    $("#confirmMatchConditions").click(function () {
        var matchId = $.url().param('matchId');
        //Pass the player ids on the url, sucks
        var playerIds = $.url().param('playerIds');
        if (matchId == null || playerIds == null) {
            showError("Which match is this for exactly? Did you come from the home screen?");
            return;
        }
        var postData = { 'command': "startMatch", 'matchId': matchId, 'payload': new MatchConditions(playerIds) };
        $.post('./CommandHandler.ashx', JSON.stringify(postData), function () {
            //success
            $("body").pagecontainer( "change", "BallByBall.aspx?matchId=" + matchId, { transition: "slide" } );
        }, 'json')
        .fail(function (data) {
            showError(data.responseText);
        });
    });
    //need more than player ids to bind the drop downs for captain and keeper..............   
    $()
};

