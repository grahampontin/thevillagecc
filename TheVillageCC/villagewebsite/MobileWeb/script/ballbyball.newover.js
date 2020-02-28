function refreshNewOverPageView() {
    if (matchState == null) {
        innings = "Batting";
        loadMatchState(matchId, refreshNewOverPageView);
        return;
    }
     $("#batsman1select").prop('disabled', false);
    $("#batsman2select").prop('disabled', false);
    populatedBowlerChoice(matchState.PreviousBowlerButOne);
    if (matchState.getBattingPlayers().length === 0) {
        //New match initialize special case
        populateBatsmenSelects();
    } else {
        hideBatsmanSelectsAndShowNames();
    }
    
}

function populatedBowlerChoice(defaultBowler) {
    var bowlers = $("#bowlersControlGroup");
    $("#bowlersControlGroup input").remove();
    $("#bowlersControlGroup label").remove();
    $.each(matchState.getBowlers(),
        function(index, bowler) {
            var input = $("<input type='radio' name='bowler-choice'/>");
            bowlers.controlgroup("container")
                .append(input
                    .attr("id", "bowler-choice-"+index)
                    .attr("value", bowler)
                    .text(bowler));
            bowlers.controlgroup("container")
                .append($("<label></label>")
                    .attr("for", "bowler-choice-"+index)
                    .text(bowler));
            if (bowler === defaultBowler) {
                input.attr("checked", "CHECKED");
            }
        });
    $("#bowlersControlGroup input[type='radio']").checkboxradio().checkboxradio("refresh"); 
    bowlers.controlgroup("refresh");
    $("#bowlersControlGroup input[type='radio']").change(function () {
        if (getBowlerForOver() === matchState.PreviousBowler) {
            showWarning(getBowlerForOver() + " bowled the last over You're not really allowed to bowl two in a row...");
        } else {
            hideWarning();
        }             
    });

}

function bindNewOverPageHandlers() {
    $("#addNewBowlerButton").click(function() {
        chooseNewBowler();
    });
    bindChooseBowlerHandlers();
    $("#newOverConfirmButton").click(function() {
        hideWarning();
        if (getBowlerForOver() == null) {
            showWarning("I need to know who will be bowling, it's important, really.");
            return;
        }
        if (matchState.getBattingPlayers().length === 0) {
            var playerId1 = $("#batsman1select").find("option:selected").attr("playerId");
            var playerId2 = $("#batsman2select").find("option:selected").attr("playerId");
            if (playerId1 == null || playerId2 == null) {
                showWarning("Please select two batsmen to start the match");
                return;
            }
            if (playerId1 === playerId2) {
                showWarning("It would be swell if we had a different batsman at end, no?");
                return;
            }
            matchState.setPlayerBattingAtPosition(playerId1, 1);
            matchState.setPlayerBattingAtPosition(playerId2, 2);
        }
        matchState.CurrentBowler = getBowlerForOver();
        $("body").pagecontainer("change", "BallByBall.aspx", { transition: "fade" });

    });
}

function getBowlerForOver() {
    return $("#bowlersControlGroup input[type='radio']:checked").val();
}

function chooseNewBowler() {
    hideWarning();
    $("#addNewBowler").popup("open");
    $("#newBowlerInput").focus();
}

function bindChooseBowlerHandlers() {
    $("#chooseBowlerSaveButton").click(function() {
        var newBowler = $("#newBowlerInput").val().trim();
        if (newBowler == null || newBowler === "") {
            return;
        }
        $("#addNewBowler").popup("close");
        $("#newBowlerInput").val("");
        if (matchState.getBowlers().indexOf(newBowler) !== -1) {
            showWarning("The bowler " +newBowler+ " already exists, try new name, or select them from the list.");
        } else {
            matchState.addBowler(newBowler);
            populatedBowlerChoice(newBowler);
        }
    });

    $("#chooseBowlerCancelButton").click(function() {
        $("#addNewBowler").popup("close");
        $("#newBowlerInput").val("");
    });
}

function populateBatsmenSelects() {
    $("#newOverBatsmenDiv").show();
    populateSelectWithAllWaitingBatsmen($("#batsman1select"), 1, matchState);
    populateSelectWithAllWaitingBatsmen($("#batsman2select"), 2, matchState);
}

function hideBatsmanSelectsAndShowNames() {
    $("#newOverBatsmenDiv").hide();


} 

function addSinglePlayerToSelect(select, player) {
    var option = $("<option></option>");
    option.text(player.PlayerName);
    option.val(player.PlayerId);
    select.append(option);
    select.val(player.PlayerId);
    select.selectmenu('refresh', true);
    select.parent().removeClass("ui-btn-icon-right");
    


}