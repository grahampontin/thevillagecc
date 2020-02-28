function getOutBatsman() {
    return $("#outBatsmanSelect option:selected").attr("playerId");
}

function getNotOutBatsman() {
    var batters = matchState.getBattingPlayers();
    if (batters[0] === getOutBatsman()) {
        return batters[1];
    }
    return batters[0];
}

function getOutBatsmanName() {
    return $("#outBatsmanSelect option:selected").text();
}

function getOutBatsmanScore() {
    return getCurrentScoreForPlayer(getOutBatsman());
}

function getCurrentScoreForPlayer(playerId) {
    return matchState.getPlayer(playerId).Score;
}


function getNextManIn() {
    return $("#nextManInSelect option:selected").attr("playerId");
}

function bindWicketPageHandlers() {
    $("#modeOfDismissal").unbind("change", handleModeOfDismissalChanged);
    $("#modeOfDismissal").bind("change", handleModeOfDismissalChanged);
    handleModeOfDismissalChanged();

    $("#saveWicketButton").on("buttoncreate", function () {
        updateSaveWicketButtonIsEnabled();
    });

    

    $("#saveWicketButton").click(function () {
        handleSaveWicket();
    });
}

function refreshWicketPageView() {
    populateOutBatsmanSelect();
    populateNextManInSelect();
    $("#fielder").val("");
    $("#wicketDescription").val("");
}


function updateSaveWicketButtonIsEnabled() {
    //validateWicketInputs
    if (getNextManIn() === -1 || getModeOfDismissal() === " ") {
        $("#saveWicketButton").button('disable');
    } else {
        $("#saveWicketButton").button('enable');
    }
    $("#saveWicketButton").button('refresh');
}

function handleModeOfDismissalChanged() {
    if (getModeOfDismissal() === "ro" || getModeOfDismissal() === "st") {
        $("#runsForThisBallContainer").show('fast');
    } else {
        $("#runsForThisBallContainer").hide('fast');
        $("#scoreForWicketBallAmount").val(0);
    }

    if (getModeOfDismissal() === "ro" || getModeOfDismissal() === "ct" || getModeOfDismissal() === "st") {
        $("#fielderContainer").show('fast');
    } else {
        $("#fielderContainer").hide('fast');
        $("#fielder").val("");
    }
}

function getModeOfDismissal() {
    return $("#modeOfDismissal").val();
}

function handleSaveWicket() {
   
    if (getOutBatsman() == undefined) {
        showError("Who was out?");
        return;
    }
    if (getNextManIn() == undefined) {
        showError("would you mind telling me who will be batting next?");
        return;
    }
    
    if (verifyWicketDetails()) {
        var scoreForWicketBall = parseInt($("#scoreForWicketBallAmount").val());
        var thingForWicketBall = $("#wicketRunsSelect").val();
        if (scoreForWicketBall === 0) {
            thingForWicketBall = "";
        }

        addBall(new Ball(scoreForWicketBall, thingForWicketBall, matchState.OnStrikeBatsmanId, matchState.OnStrikeBatsmanName, matchState.CurrentBowler, new Wicket(getOutBatsman(), getOutBatsmanName(), getOutBatsmanScore(),
                getModeOfDismissal(),
                matchState.CurrentBowler,
                $("#fielder").val(),
                $("#wicketDescription").val(), getNotOutBatsman())  //Add not out batsman id here
        ));

        matchState.setPlayerOut(getOutBatsman());
        matchState.setPlayerBattingAtPosition(getNextManIn(), matchState.getNextBattingPosition());
        $.mobile.changePage("BallByBall.aspx", "slide", true, true);
    }


}

function verifyWicketDetails() {
    //TODO: confirm wicket
    return true;
}

function populateOutBatsmanSelect() {
    var outBatsmanSelect = $("#outBatsmanSelect");
    outBatsmanSelect.empty();
    $.each(matchState.getBattingPlayers(), function (index, player) {
        outBatsmanSelect
             .append($("<option></option>")
             .attr("value", player.PlayerId)
             .attr("playerId", player.PlayerId)
             .text(player.PlayerName));

    });
    outBatsmanSelect.val(getOnStrikeBatsman());
    outBatsmanSelect.selectmenu('refresh', true);
}

function populateNextManInSelect() {
    populateSelectWithAllWaitingBatsmen($("#nextManInSelect"), 1, matchState);
}