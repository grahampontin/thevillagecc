﻿function getOutBatsman() {
    return $("#outBatsmanSelect option:selected").attr("playerId");
}

function getOutBatsmanName() {
    return $("#outBatsmanSelect option:selected").text();
}

function getOutBatsmanScore() {
    return 0;
}

function getNextManIn() {
    return $("#nextManInSelect option:selected").attr("playerId");
}

function initialiseWicketPage() {

    $("#modeOfDismissal").unbind("change", handleModeOfDismissalChanged);
    $("#modeOfDismissal").bind("change", handleModeOfDismissalChanged);
    handleModeOfDismissalChanged();

    $("#saveWicketButton").on("buttoncreate", function (event, ui) {
        updateSaveWicketButtonIsEnabled()
    });

    populateOutBatsmanSelect();
    populateNextManInSelect();

    $("#saveWicketButton").click(function () {
        handleSaveWicket();
    });
}

function updateSaveWicketButtonIsEnabled() {
    //validateWicketInputs
    if (getNextManIn() == -1 || getModeOfDismissal() == " ") {
        $("#saveWicketButton").button('disable');
    } else {
        $("#saveWicketButton").button('enable');
    }
    $("#saveWicketButton").button('refresh');
}

function handleModeOfDismissalChanged() {
    if (getModeOfDismissal() == "ro" || getModeOfDismissal() == "st") {
        $("#runsForThisBallContainer").show('fast');
    } else {
        $("#runsForThisBallContainer").hide('fast');
        $("#scoreForWicketBallAmount").val(0);
    }
}

function getModeOfDismissal() {
    return $("#modeOfDismissal").val();
}

function handleSaveWicket() {

    var scoreForWicketBall = $("#scoreForWicketBallAmount").val();
    var thingForWicketBall = $("#wicketRunsSelect").val();
    if (scoreForWicketBall == 0) {
        thingForWicketBall = "";
    }

    addBall(new Ball(scoreForWicketBall, thingForWicketBall, matchState.OnStrikeBatsmanId, matchState.OnStrikeBatsmanName, matchState.CurrentBowler, new Wicket(getOutBatsman(), getOutBatsmanName(), getOutBatsmanScore(),
                                    getModeOfDismissal(),
                                    matchState.CurrentBowler,
                                    $("#fielder").val(),
                                    $("#wicketDescription").val())
                                    ));

    matchState.setPlayerOut(getOutBatsman());
    matchState.setPlayerBatting(getNextManIn(), matchState.getNextBattingPosition());
    $.mobile.changePage("BallByBall.aspx", "slide", true, true);
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