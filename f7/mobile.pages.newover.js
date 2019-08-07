$$(document).on('page:init', '.page[data-name="newOver"]', function (e) {
    //Bind handlers here
    bindNewOverPageHandlers();
    //once bound...
    initializeMatchStateAndThen(false, function() {
        //Populate new over screen from match data
        $("#batsman1select").prop('disabled', false);
        $("#batsman2select").prop('disabled', false);
        populatedBowlerChoice(matchState.PreviousBowlerButOne);
        if (matchState.getBattingPlayers().length === 0) {
            //New match initialize special case
            populateBatsmenSelects();
        } else {
            hideBatsmanSelectsAndShowNames();
        }
        validatePage();
    });
});

function validatePage() {
    app.input.validateInputs('.page');
    var valid = true;
    var errorMessage = "";
    if (matchState.getBowlers().length === 0) {
        errorMessage = "I need to know who will be bowling, it's important, really.";
        valid = false;
    }
    if (getBowlerForOver() === matchState.PreviousBowler && valid) {
        errorMessage = getBowlerForOver() + " bowled the last over You're not really allowed to bowl two in a row...";
        valid = false;
    }
    var playerId1 = $("#batsman1select").find("option:selected").attr("playerId");
    var playerId2 = $("#batsman2select").find("option:selected").attr("playerId");
    if ((playerId1 === undefined || playerId2 === undefined) && valid) {
        errorMessage = "We need two batsmen before we can start.";
        valid = false;
    }
    if (playerId1 === playerId2 && valid) {
        errorMessage = "It would be swell if we had a different batsman at end, no?";
        valid = false;
    }
    if (errorMessage.length > 0) {
        toast = showToastBottom(errorMessage);
    } else {
        toast.close();
    }
    valid = valid && $("#batsman1select")[0].validity.valid && $("#batsman2select")[0].validity.valid;

    if (valid) {
        $("#new-over-done").show();
        $("#new-over-incomplete").hide();
    } else {
        $("#new-over-done").hide();
        $("#new-over-incomplete").show();
    }
}

function populatedBowlerChoice(defaultBowler) {
    var bowlers = $("#bowlers-list");
    $("#bowlers-list li").remove();
    $.each(matchState.getBowlers(),
        function(index, bowler) {
            var input = $("<input type=\"radio\" name=\"bowler-radio\" />")
                .attr("id", "bowler-choice-"+index)
                .attr("value", bowler);
            var listItem =
                $(
                    "<li></li>");
            var label = $("<label class=\"item-radio item-content\"><i class=\"icon icon-radio\"></i><div class=\"item-inner\"><div class=\"item-title\">" +
                bowler +
                "</div></div></label>")
            if (bowler === defaultBowler) {
                input.attr("checked", "CHECKED");
            }
            label.prepend(input);
            listItem.append(label);
            bowlers.append(listItem);
        });
    $("#bowlers-list input[type='radio']").change(function () {
        validatePage();
    });

}

function bindNewOverPageHandlers() {
    $("#addNewBowlerButton").click(function() {
        chooseNewBowler();
    });
    $("#new-over-done").click(function() {
        if (getBowlerForOver() === null) {
            showToastCenter("I need to know who will be bowling, it's important, really.");
            return;
        }
        if (matchState.getBattingPlayers().length === 0) {
            var playerId1 = $("#batsman1select").find("option:selected").attr("playerId");
            var playerId2 = $("#batsman2select").find("option:selected").attr("playerId");
            
            matchState.setPlayerBattingAtPosition(playerId1, 1);
            matchState.setPlayerBattingAtPosition(playerId2, 2);
        }
        matchState.CurrentBowler = getBowlerForOver();
        app.views.current.router.navigate("/scoring/");
    });
}

function getBowlerForOver() {
    return $("#bowler-list input[type='radio']:checked").val();
}

function chooseNewBowler() {
    app.dialog.prompt('Add New Bowler', function (name) {
        if (name.trim().length === 0) {
            app.dialog.alert("That isn't a name now is it?");
            return;
        }
        if (matchState.getBowlers().indexOf(name) !== -1) {
            app.dialog.alert("The bowler " +name+ " already exists, try new name, or select them from the list.");
            return;
        }
        app.dialog.confirm('Add new bowler called ' + name + '?', function () {
            matchState.addBowler(name);
            populatedBowlerChoice(name);
            validatePage();
        });
    });
    
}

function populateBatsmenSelects() {
    $("#newOverBatsmenDiv").show();
    var striker = $("#batsman1select");
    striker.change(function() {
        validatePage();
    });
    populateSelectWithAllWaitingBatsmen(striker, 1, matchState);
    var nonStriker = $("#batsman2select");
    nonStriker.change(function() {
        validatePage();
    });

    populateSelectWithAllWaitingBatsmen(nonStriker, 2, matchState);

}

function hideBatsmanSelectsAndShowNames() {
    $("#newOverBatsmenDiv").hide();
}