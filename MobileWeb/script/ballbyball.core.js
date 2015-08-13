var matchState;

function initialiseBallByBallCore() {
    if (matchState == null) {
        var matchId = $.url().param('matchId');
        if (matchId == null) {
            showError("No match id speified. Did you come from the entry page?");
            return;
        }
        var postData = { 'command': "matchState", 'matchId': matchId };
        $.post('./CommandHandler.ashx', JSON.stringify(postData), function(data) {
                //success
                matchState = matchStateFromData(data);

                if (matchState.getBattingPlayers().length < 2) {
                    chooseBatsmen();
                }
                if (matchState.getBowlers().length < 2) {
                    chooseNewBowler();
                }
                evaluatePlayerScores();
                write();
            }, 'json')
            .fail(function(data) {
                showError(data.responseText);
            });
    } else {
        if (matchState.getBowlers().length < 2) {
            chooseNewBowler();
        }
        evaluatePlayerScores();
        write();
    }

    bindChooseBatsmenHandlers();
    bindChooseBowlerHandlers();

    $("#batsman1").change(function() {
        matchState.OnStrikeBatsmanName = getOnStrikeBatsmanName();
        matchState.OnStrikeBatsmanId = getOnStrikeBatsman();
    });
    $("#wicketButton").click(function() {
        matchState.OnStrikeBatsmanName = getOnStrikeBatsmanName();
        matchState.OnStrikeBatsmanId = getOnStrikeBatsman();
    });
};
		

function chooseBatsmen() {
	populateBatsmenSelects();
	$("#chooseBatsmen").popup("open");
}

function chooseNewBowler() {
	$("#chooseNewBowler").popup("open");
}
        
function populateBatsmenSelects() {
	var batsman1select = $("#batsman1select");
	if (matchState.getBattingPlayers().length == 1) {
		var batsman1 = matchState.getBattingPlayers()[0];
		batsman1select
            .append($("<option></option>")
            .attr("value", 1)
            .attr("playerId", batsman1.PlayerId)
            .text(batsman1.PlayerName));
		batsman1select.selectmenu('refresh', true);
	} else {
		populateSelectWithAllWaitingBatsmen($("#batsman1select"), 1, matchState);
	}
	populateSelectWithAllWaitingBatsmen($("#batsman2select"), 2, matchState);
}

function populateBowlerSelect() {
    var bowlerSelect = $("#bowlerSelect");
    bowlerSelect.empty();
    $.each(matchState.getBowlers(), function (index, bowler) {
        bowlerSelect
            .append($("<option></option>")
            .attr("value", bowler)
            .text(bowler));
    });
    bowlerSelect
            .append($("<option></option>")
            .text("New Bowler..."));
    bowlerSelect.selectmenu('refresh', true);
    var bowlerName = $("#bowlerSelect").find('option:selected').val();
    matchState.CurrentBowler = bowlerName;
}

function bindChooseBatsmenHandlers() {
	$("#chooseBatsmenSaveButton").button();
	$("#batsman1select").on("change", updateChooseBatsmenSaveButtoEnabled);
	$("#batsman2select").on("change", updateChooseBatsmenSaveButtoEnabled);
	$("#chooseBatsmen").on("popupafterclose", function() {
	    if (matchState.getBowlers().length < 2) {
	        chooseNewBowler();
	    }
	});
	$("#chooseBatsmenSaveButton").click(function () {
        var playerId1 = $("#batsman1select").find('option:selected').attr("playerId");
        var playerId2 = $("#batsman2select").find('option:selected').attr("playerId");
                
        matchState.setPlayerBatting(playerId1, 1);
		matchState.setPlayerBatting(playerId2, 2);
		write();
		$("#chooseBatsmen").popup("close");
	});
}

function bindChooseBowlerHandlers() {
	$("#chooseBowlerSaveButton").button();
	$("#chooseBowlerSaveButton").click(function () {
        var newBowler = $("#newBowlerInput").val();
                
        matchState.addBowler(newBowler);
		$("#chooseNewBowler").popup("close");
	});
	$("#chooseNewBowler").on("popupafterclose", populateBowlerSelect);
	$("#bowlerSelect").on("change", function () {
	    var bowlerName = $("#bowlerSelect").find('option:selected').val();
	    matchState.CurrentBowler = bowlerName;
		if (bowlerName == "New Bowler...") {
		    chooseNewBowler();
		}
	});
}

function updateChooseBatsmenSaveButtoEnabled() {
    var playerId1 = $("#batsman1select").find('option:selected').attr("playerId");
    var playerId2 = $("#batsman2select").find('option:selected').attr("playerId");
    if (playerId1 == -1 || playerId2 == -1 || playerId1 == playerId2) {
        $("#chooseBatsmenSaveButton").button('disable');
    } else {
        $("#chooseBatsmenSaveButton").button('enable');
    }
    $("#chooseBatsmenSaveButton").button('refresh');
}

        

		

$("#runsButton").click(function () {
	var amount = parseInt($("#amountSelect").val());
	addBall(new Ball(amount, "", getOnStrikeBatsman(), getOnStrikeBatsmanName(), getBowler()));
});

        

$("#extrasSelect").change(function () {
    var amount = $("#amountSelect").val();
    var extra = $(this).val();

    addBall(new Ball(amount, extra, getOnStrikeBatsman(), getOnStrikeBatsmanName(), getBowler()));
    $(this).val("extras")
});

$("#dotBallButton").click(function () {
    addSimpleRunsBall(0);
});

function addSimpleRunsBall(runs) {
    addBall(new Ball(runs, "", getOnStrikeBatsman(), getOnStrikeBatsmanName(), getBowler()));
}

$("#singleButton").click(function () {
    addSimpleRunsBall(1);
});

$("#fourButton").click(function () {
    addSimpleRunsBall(4);
});

$("#sixButton").click(function () {
    addSimpleRunsBall(6);
});

$("#undoButton").click(function () {
    var undone = matchState.Over.balls.pop();
    evaluatePlayerScores();
    write();
    evaluateShouldSwitchStrikerAfter(undone);
});

function formatScore(score) {
    if (score == 0) {
        score = "maiden";
    } else {
        score += " runs";
    }
    return score;
    
}
        
function getOnStrikeBatsman() {
    if ($('#batsman1').prop("checked")) {
        return $('#batsman1').attr("playerId");
    } else {
        return $('#batsman2').attr("playerId"); 
    }
}

function getOnStrikeBatsmanName() {
    if ($('#batsman1').prop("checked")) {
        return $('#batsman1').attr("playerName");
    } else {
        return $('#batsman2').attr("playerName");
    }
}

function getBowler() {
    return $('#bowlerSelect').find('option:selected').val();
}

function addBall(aball) {
    matchState.Over.balls.push(aball);
    evaluatePlayerScores();
    write();
    evaluateShouldSwitchStrikerAfter(aball);
    
}

function evaluatePlayerScores() {
    var batsman1 = matchState.getBattingPlayers()[0];
    var batsman2 = matchState.getBattingPlayers()[1];

    batsman1.Score = batsman1.CurrentScore + matchState.Over.scoreForPlayer(batsman1.PlayerId);
    batsman2.Score = batsman2.CurrentScore + matchState.Over.scoreForPlayer(batsman2.PlayerId);
}

function evaluateShouldSwitchStrikerAfter(ball) {
    var shouldSwitch = ball.amount % 2 != 0;
    switch (ball.thing) {
        case "wd":
        case "nb":
            shouldSwitch = !shouldSwitch;
            break;
        default:
            //nothing to do
    }
    if (shouldSwitch) {
        if ($('#batsman1').prop("checked")) {
            $('#batsman1').prop("checked", false).change().checkboxradio("refresh");
            $('#batsman2').prop("checked", true).change().checkboxradio("refresh");
        } else if ($('#batsman2').prop("checked")) {
            $('#batsman1').prop("checked", true).change().checkboxradio("refresh");
            $('#batsman2').prop("checked", false).change().checkboxradio("refresh");
        }
    }
    
}

function write() {
    populateBowlerSelect();
   
    $("#overSoFar").html(matchState.Over.toPrettyString());
    $("#overs").html(matchState.LastCompletedOver + "." + matchState.Over.balls.length);
    $("#score").html(matchState.Over.totalScore() * 1 + matchState.Score * 1);
    $("#wickets").html(matchState.getPlayersOfStatus("Out").length);

    if (matchState.getBattingPlayers().length == 2) {
        var batsman1 = matchState.getBattingPlayers()[0];
        var batsman2 = matchState.getBattingPlayers()[1];
        $("#batsman1Label").text(batsman1.PlayerName + " ("+batsman1.Score+")");
        $("#batsman1").attr("playerId", batsman1.PlayerId).attr("playerName", batsman1.PlayerName);
        $("#batsman2Label").text(batsman2.PlayerName + " (" + batsman2.Score + ")");
        $("#batsman2").attr("playerId", batsman2.PlayerId).attr("playerName", batsman2.PlayerName);
    }
}











