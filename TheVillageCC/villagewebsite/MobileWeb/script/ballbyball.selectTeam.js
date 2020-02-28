var playersForThisMatch;

function bindSelectTeamPageHandlers() {
    $("#confirmTeamSelection").click(function () {
        var selectedPlayers = $('input[type="checkbox"]').filter('.custom').map(function () {
            var playerId = $(this).attr('playerId');
            var playerName = $(this).attr('playerName');
            if ($(this).is(':checked'))
                return new PlayerStub(playerId, playerName);

        });
        if (selectedPlayers.length !== 11) {
            showError("That's " + selectedPlayers.length + " players, not 11. Dumbass.");
        } else {
            playersForThisMatch = selectedPlayers;
            $("body").pagecontainer( "change", "MatchConditions.aspx", { transition: "slide" } );
        }

    });
};

