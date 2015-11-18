function initialiseMatchConditions() {
    $("#confirmMatchConditions").click(function () {
        var matchId = $.url().param('matchId');
        //Pass the player ids on the url, sucks
        var players = playersForThisMatch;
        var wicketKeeperId = $("#keeperSelect").find('option:selected').attr("playerId");
        var captainId = $("#captainSelect").find('option:selected').attr("playerId");
        var tossWinnerBatted = getTossWinnerBatted();
        var weWonToss = getWeWonTheToss();
        var wasDeclaration = getWasDeclaration();
        var numberOfOvers = $("#numberOfOversInput").val();
        
        
        if (matchId == null || players == null) {
            showError("Which match is this for exactly? Did you come from the home screen?");
            return;
        }
        var postData = { 'command': "startMatch", 'matchId': matchId, 'payload': 
            new MatchConditions(getPlayerIds(players), wicketKeeperId, captainId, weWonToss, tossWinnerBatted, wasDeclaration, numberOfOvers)
        };
        $.post('./CommandHandler.ashx', JSON.stringify(postData), function () {
            //success
            $("body").pagecontainer( "change", "BallByBall.aspx?matchId=" + matchId, { transition: "slide" } );
        }, 'json')
        .fail(function (data) {
            showError(data.responseText);
        });
    });  
    populateSelectWithAllPlayers($("#captainSelect"), playersForThisMatch);
    populateSelectWithAllPlayers($("#keeperSelect"), playersForThisMatch);
};



function populateSelectWithAllPlayers(select, players) {
    select.empty();
    select
         .append($("<option></option>")
         .attr("data-placeholder", true)
         .attr("playerId", -1)
         .text("Select..."));
    $.each(players, function (index, player) {
        select
         .append($("<option></option>")
         .attr("playerId", player.playerId)
         .text(player.playerName));
    });
    select.selectmenu('refresh', true);
}

function getTossWinnerBatted() {
    return $('#electedToBat').prop("checked");
}
function getWeWonTheToss() {
    return $('#weWonToss').prop("checked");
}

function getWasDeclaration() {
    return $('#declaration').prop("checked");
}

function getPlayerIds(playerStubs) {
    var playerIds = $.map(playerStubs, function(element) {
        return element.playerId;
    });
    return jQuery.makeArray(playerIds);

}
