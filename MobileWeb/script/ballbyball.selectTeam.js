function initialiseSelectTeam() {
    $("#confirmTeamSelection").click(function () {
        var selectedPlayers = $('input[type="checkbox"]').filter('.custom').map(function () {
            var playerId = $(this).attr('playerId');
            if ($(this).is(':checked'))
                return playerId;

        });
        if (selectedPlayers.length != 11) {
            showError("That's " + selectedPlayers.length + " players, not 11. Dumbass.");
        } else {
            var playerIds = jQuery.makeArray(selectedPlayers);
            var matchId = $.url().param('matchId');
            if (matchId == null) {
                showError("Which match is this for exactly? Did you come from the home screen?");
                return;
            }
            var postData = { 'command': "startMatch", 'matchId': matchId, 'payload': playerIds };
            $.post('./CommandHandler.ashx', JSON.stringify(postData), function (data) {
                //success
                $("body").pagecontainer( "change", "BallByBall.aspx?matchId=" + matchId, { transition: "fade" } );
            }, 'json')
            .fail(function (data) {
                showError(data.responseText);
            });
        }

    });
};

