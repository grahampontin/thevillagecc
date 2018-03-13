function bindMatchConditionsPageHandlers() {
    $("#confirmMatchConditions").click(function () {
        var players = playersForThisMatch;
        var wicketKeeperId = $("#keeperSelect").find('option:selected').attr("playerId");
        var captainId = $("#captainSelect").find('option:selected').attr("playerId");
        var tossWinnerBatted = getTossWinnerBatted();
        var weWonToss = getWeWonTheToss();
        var wasDeclaration = getWasDeclaration();
        var numberOfOvers = $("#numberOfOversInput").val();
        if (captainId < 0) {
            showError("Every team needs a leader, a man to look up to, someone to stand up and be counted. At the very least someone should set the field don't you think?");
            return;
        }
        if (wicketKeeperId < 0) {
            showError("Not having a wicket keeper seems pretty village, even for us. Did we forget the kit again? Go borrow some.");
            return;
        }
        if (numberOfOvers <= 0 && !wasDeclaration) {
            showError("We need to play some overs, or have a declaration game. Timeless tests are not supported.");
            return;
        }
        if ((Math.floor(numberOfOvers) != numberOfOvers || !$.isNumeric(numberOfOvers)) && !wasDeclaration) {
            showError("A match needs to be some whole number of overs long or a declaration game.");
            return;
        }
        
        if (players == null) {
            showError("There don't seem to be any players which is weird. Go back to select the team again.");
            return;
        }
        var postData = { 'command': "startMatch", 'matchId': matchId, 'payload': 
            new MatchConditions(getPlayerIds(players), wicketKeeperId, captainId, weWonToss, tossWinnerBatted, wasDeclaration, numberOfOvers)
        };
        $.post('./CommandHandler.ashx', JSON.stringify(postData), function () {
            //success
            if ((weWonToss && tossWinnerBatted) || (!weWonToss && !tossWinnerBatted)) {
                innings = "Batting";
                $("body").pagecontainer("change", "NewOver.aspx", { transition: "slide" });
            } else {
                innings = "Bowling";
                $("body").pagecontainer("change", "OppositionInnings.aspx", { transition: "slide" });
            }
            
        }, 'json')
        .fail(function (data) {
            showError(data.responseText);
        });
    });

    $("#numberOfOversInput").change(function() {
        var ovs = $("#numberOfOversInput").val();
        if (ovs < 20) {
            showWarning("This seems like a REALLY short match, you sure it's only " + ovs + " overs?");
            return;
        }
        if (ovs > 40) {
            showWarning("This seems like a REALLY long match, you sure it's " + ovs + " overs?");
            return;
        }
        hideWarning();
    });

    $("input[name='matchFormatSelect']").change(function() {
        if (getWasDeclaration()) {
            $("#numberOfOversContainer").hide('fast');
            $("#numberOfOversInput").val("");
        } else {
            $("#numberOfOversContainer").show('fast');

        }
        
    })
};


function initializeMatchConditionsView() {
    populateSelectWithAllPlayers($("#captainSelect"), playersForThisMatch);
    populateSelectWithAllPlayers($("#keeperSelect"), playersForThisMatch);
}


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
