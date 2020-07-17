$$(document).on('page:init', '.page[data-name="matchConditions"]', function (e) {
    $("#match-conditions-done").parent().click(function() {
        if (selectedPlayers === null) {
            showToastCenter("There don't seem to be any players which is weird. Go back to select the team again.");
            return;
        }
        var wicketKeeperId = $("#wicketKeeperSelect").find('option:selected').attr("playerId");
        var captainId = $("#captainSelect").find('option:selected').attr("playerId");
        var tossWinnerBatted = $("#tossWinnerBatBowlSelect").find('option:selected').val() === "Bat"; //ew
        var weWonToss = $("#tossWinnerSelect").find('option:selected').val() === "We";
        var wasDeclaration = $("#matchFormatSelect").find('option:selected').val() === "Declaration";
        var numberOfOvers = $("#numberOfOvers").val();
        
        var postData = { 'command': "startMatch", 'matchId': matchId, 'payload': 
            new MatchConditions(getPlayerIds(selectedPlayers), wicketKeeperId, captainId, weWonToss, tossWinnerBatted, wasDeclaration, numberOfOvers)
        };
        sendBallByBallCommand(postData);
    });
    

    $("#numberOfOversInput").hide();
    enableDisableConfirmButton();
    $.each(selectedPlayers,
        function(i, o) {
            $("[name='captainSelect']").append(
                $("<option></option>")
                .attr("value", o.playerId)
                .attr("playerId", o.playerId)
                .text(o.playerName));
            $("[name='wicketKeeperSelect']").append(
                $("<option></option>")
                .attr("value", o.playerId)
                .attr("playerId", o.playerId)
                .text(o.playerName));
        });
    $("[name='matchFormatSelect']").change(function() {
        if ($("[name='matchFormatSelect'] :selected").text() === "Limited Overs") {
            $("#numberOfOversInput").show();
        } else {
            $("#numberOfOversInput").hide();
        }
    });
    $(".form-validation").change(function() {
        enableDisableConfirmButton();
    });
});

function enableDisableConfirmButton() {
    if (isMatchConditionsComplete()) {
        $("#match-conditions-done").parent().show();
        $("#match-conditions-incomplete").parent().hide();
    }
    else
    {
        $("#match-conditions-done").parent().hide();
        $("#match-conditions-incomplete").parent().show();
    }
}

function isMatchConditionsComplete() {
    if ($("#captainSelect option:selected").attr("playerId") === undefined) {
        toast = showToastBottom(
            "Every team needs a leader, a man to look up to, someone to stand up and be counted. At the very least someone should set the field don't you think?");
        return false;
    } else {
        toast.close();
    }
    if ($("#wicketKeeperSelect option:selected").attr("playerId") === undefined) {
        toast = showToastBottom(
            "Not having a wicket keeper seems pretty village, even for us. Did we forget the kit again? Go borrow some.");
        return false;
    } else {
        toast.close();
    }
    if ($("#matchFormatSelect option:selected").val() === "") {
        toast = showToastBottom(
            "What kind of a game is this? It's not a test match, etc.");
        return false;
    } else {
        toast.close();
    }
    if ($("#matchFormatSelect option:selected").val() === "Limited Overs") {
        var numberOfOvers = $("#numberOfOvers").val();
        if (!isNormalInteger(numberOfOvers)) {
            toast = showToastBottom(
                "If we're playing a limited overs game it would be tremendous to know how many overs each team is allowed. It should be a whole number, if that wasn't obvious.");
            return false;
        } else {
            toast.close();
        }
    }
    if ($("#tossWinnerSelect option:selected").val() === "") {
        toast = showToastBottom(
            "Who won the toss? Is it time for the Official Tosser clause to be enacted?");
        return false;
    } else {
        toast.close();
    }
    if ($("#tossWinnerBatBowlSelect option:selected").val() === "") {
        toast = showToastBottom(
            "Always bat first. Unless it looks like a bowling day, then think about bowling first, but bat first anyway.");
        return false;
    } else {
        toast.close();
    }
    
    return true;
}

function getPlayerIds(playerStubs) {
    var playerIds = $.map(playerStubs, function(element) {
        return element.playerId;
    });
    return $.makeArray(playerIds);

}