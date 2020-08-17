$$(document).on('page:init', '.page[data-name="wicket"]', function (e) {
    if (e.detail.position != "next") {
        return;
    }
    $("#wicket-runs-type-element").hide();

    //Bind handlers here
    $("#dismissal-type-select").change(function() {
        setInputVisibility();
        validateWicketPage();
    });
    $("#next-batter-in-select").change(function() {
        validateWicketPage();
    });
    $("#completed-runs-input").change(function() {
        if ($("#completed-runs-input").val() > 0) {
            $("#wicket-runs-type-element").show();
        } else {
            $("#wicket-runs-type-element").hide();
        }
        validateWicketPage();
    });
    $("#wicket-confirm-button").click(function() {
        var scoreForWicketBall = parseInt($("#completed-runs-input").val());
        if (isNaN(scoreForWicketBall)) {
            scoreForWicketBall = 0;
        }
        var thingForWicketBall = $("#wicket-runs-type-select").val();
        if (scoreForWicketBall === 0) {
            thingForWicketBall = "";
        }

        var outBatsman = matchState.getPlayer($("#batter-out-select").val());

        var wicket = new Wicket( 
            outBatsman.PlayerId, 
            outBatsman.PlayerName, 
            matchState.getCurrentScoreForBatsman(outBatsman.PlayerId),
            getDismissalType(),
            matchState.CurrentBowler,
            $("#fielder-name-input").val(),
            $("#wicket-commentary-textarea").val(), 
            getNotOutBatsman(outBatsman),
            $("#next-batter-in-select").val(),
            toBoolean($("#batters-crossed-select").val()));

        matchState.addBall(new Ball(
                scoreForWicketBall, 
                thingForWicketBall, 
                matchState.OnStrikeBatsmanId, 
                matchState.getPlayer(matchState.OnStrikeBatsmanId).PlayerName, 
                matchState.CurrentBowler, 
                wicket  //Add not out batsman id here
        ));

        
        app.views.current.router.navigate("/scoring/");
    });
    //once bound...
    initializeMatchStateAndThen(false, function() {
        //Populate new over screen from match data
        populateBatterOutSelect();
        populateNextBatterInSelect();
        setInputVisibility();
        validateWicketPage();
    });
});



function getNotOutBatsman(outBatsman) {
    var batters = matchState.getBattingPlayers();
    if (batters[0] === outBatsman) {
        return batters[1];
    }
    return batters[0];
}

function validateWicketPage() {
    $("#wicket-confirm-element").hide();
    $("#wicket-incomplete-element").show();
    if (getDismissalType() == " ") {
        toast = showToastBottom("What happened to the poor chap?");
        return;
    }
    if ($("#next-batter-in-select").val() == -1 && matchState.getWaitingPlayers().length > 0) {
        toast = showToastBottom("Who's next in?");
        return;
    }
    toast.close();
    $("#wicket-confirm-element").show();
    $("#wicket-incomplete-element").hide();

}

function setInputVisibility() {
    var dismissalType = getDismissalType();
    $("#completed-runs-element").val(0);
    switch (dismissalType) {
        case "ro":
            $("#fielder-element").show();
            $("#completed-runs-element").show();
            $("#batters-crossed-element").hide();
            break;
        case "ct":
            $("#fielder-element").show();
            $("#completed-runs-element").hide();
            $("#batters-crossed-element").show();
            break;
        default:
            $("#fielder-element").hide();
            $("#batters-crossed-element").hide();
            $("#completed-runs-element").hide();
    }

}

function getDismissalType() {
    return $("#dismissal-type-select").val();
}

function populateBatterOutSelect() {
    var outBatsmanSelect = $("#batter-out-select");
    outBatsmanSelect.empty();
    $.each(matchState.getBattingPlayers(), function (index, player) {
        outBatsmanSelect
            .append($("<option></option>")
                .attr("value", player.PlayerId)
                .attr("playerId", player.PlayerId)
                .text(player.PlayerName));

    });
    outBatsmanSelect.val(matchState.OnStrikeBatsmanId);
}

function populateNextBatterInSelect() {
    var nextBatterInSelect = $("#next-batter-in-select");
    nextBatterInSelect.empty();
    nextBatterInSelect
        .append($("<option></option>")
            .attr("value", -1)
            .attr("playerId", -1)
            .text("Select..."));
    $.each(matchState.getWaitingPlayers(), function (index, player) {
        nextBatterInSelect
            .append($("<option></option>")
                .attr("value", player.PlayerId)
                .attr("playerId", player.PlayerId)
                .text(player.PlayerName));  

    });
    nextBatterInSelect.val(-1);
}