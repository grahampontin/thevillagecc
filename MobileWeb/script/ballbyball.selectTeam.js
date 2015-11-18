var playersForThisMatch;

function initialiseSelectTeam() {
    $("#confirmTeamSelection").click(function () {
        var selectedPlayers = $('input[type="checkbox"]').filter('.custom').map(function () {
            var playerId = $(this).attr('playerId');
            var playerName = $(this).attr('playerName');
            if ($(this).is(':checked'))
                return new PlayerStub(playerId, playerName);

        });
        if (selectedPlayers.length != 11) {
            showError("That's " + selectedPlayers.length + " players, not 11. Dumbass.");
        } else {
            playersForThisMatch = selectedPlayers;
            var matchId = $.url().param('matchId');
            if (matchId == null) {
                showError("Which match is this for exactly? Did you come from the home screen?");
                return;
            }
            $("body").pagecontainer( "change", "MatchConditions.aspx?matchId=" + matchId, { transition: "fade" } );
        }

    });
};

