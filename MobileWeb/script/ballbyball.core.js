var matchState;
//ugh
var choosingBatsmen = false;
var recordingWicket = false;

$(document).ready(
		function () {
		    var matchId = $.url().param('matchId');
		    var postData = { 'command': "matchState", 'matchId': matchId };
		    $.post('./CommandHandler.ashx', JSON.stringify(postData), function (data) {
		        //success
		        showError(JSON.stringify(data));
		        matchState = matchStateFromData(data);
		        if (matchState.getBattingPlayers().length < 2) {
		            chooseBatsmen();
		        }
		        write();
		    }, 'json')
            .fail(function (data) {
                showError(data.responseText);
            });

		    $('div').live('pageshow', function (event, ui) {
		        bindWicketHandlers();
		        bindEndOfOverHandlers();
		        bindChooseBatsmenHandlers();
		    });

		}
	);

		$(document).bind("pagechange", function (e, data) {
		    if (choosingBatsmen) {
		        choosingBatsmen = false;
		        populateBatsmenSelects();
		    }

		    if (recordingWicket) {
		        recordingWicket = false;
		        populateOutBatsmanSelect();
		        populateNextManInSelect();
		    }

		});

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
		    populateSelectWithAllWaitingBatsmen($("#nextManInSelect"), 1);
		}

		function chooseBatsmen() {
		    choosingBatsmen = true;
		    $.mobile.changePage("ChooseBatsmen.aspx", { role: "dialog" });

		}
        
        function recordWicket() {
            recordingWicket = true;
		    $.mobile.changePage("Wicket.aspx", { role: "dialog" });
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
		        populateSelectWithAllWaitingBatsmen($("#batsman1select"), 1);
		    }
		    populateSelectWithAllWaitingBatsmen($("#batsman2select"), 2);
		}

		function populateSelectWithAllWaitingBatsmen(batsmanSelect, value) {
		    batsmanSelect.empty();
		    batsmanSelect
                 .append($("<option></option>")
                 .attr("data-placeholder", true)
                 .attr("value", value)
                 .attr("playerId", -1)
                 .text("Select..."));
		    $.each(matchState.getWaitingPlayers(), function (index, batsman) {
		        batsmanSelect
                 .append($("<option></option>")
                 .attr("value", value)
                 .attr("playerId", batsman.PlayerId)
                 .text(batsman.PlayerName));
		    });
		    batsmanSelect.selectmenu('refresh', true);
		}

		function bindChooseBatsmenHandlers() {
		    $("#batsman1select").on("change", updateChooseBatsmenSaveButtoEnabled);
		    $("#batsman2select").on("change", updateChooseBatsmenSaveButtoEnabled);
		    updateChooseBatsmenSaveButtoEnabled();
		    $("#chooseBatsmenSaveButton").click(function () {
                var playerId1 = $("#batsman1select").find('option:selected').attr("playerId");
                var playerId2 = $("#batsman2select").find('option:selected').attr("playerId");
                
                matchState.setPlayerBatting(playerId1, 1);
		        matchState.setPlayerBatting(playerId2, 2);
                write();
                $('.ui-dialog').dialog('close');
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

        function getOutBatsman() {
            return $("#outBatsmanSelect option:selected").attr("playerId");
        }

        function getNextManIn() {
            return $("#nextManInSelect option:selected").attr("playerId");
        }

        function bindWicketHandlers() {
            
            $("#saveWicketButton").unbind("click", handleSaveWicket);
            $("#saveWicketButton").bind("click", handleSaveWicket);
            
            $("#modeOfDismissal").unbind("change", handleModeOfDismissalChanged);
            $("#modeOfDismissal").bind("change", handleModeOfDismissalChanged);
            handleModeOfDismissalChanged();
            
            $("#modeOfDismissal").unbind("change", updateSaveWicketButtonIsEnabled);
            $("#modeOfDismissal").bind("change", updateSaveWicketButtonIsEnabled);
            $("#nextManInSelect").unbind("change", updateSaveWicketButtonIsEnabled);
            $("#nextManInSelect").bind("change", updateSaveWicketButtonIsEnabled);
            updateSaveWicketButtonIsEnabled();

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

		    addBall(new Ball(scoreForWicketBall, thingForWicketBall, getOnStrikeBatsman(), getOnStrikeBatsmanName(), getBowler(), new Wicket(getOutBatsman(),
                                            getModeOfDismissal(),
                                            getBowler(),
                                            $("#fielder").val(),
                                            $("#wicketDescription").val())
                                            ));

		    matchState.setPlayerOut(getOutBatsman());
		    matchState.setPlayerBatting(getNextManIn(), matchState.getNextBattingPosition());
		    write();
		    $('.ui-dialog').dialog('close');
		}

		function bindEndOfOverHandlers() {
		    $("#overTotalScore").html(formatScore(matchState.Over.totalScore() * 1 + matchState.Score*1));
		    $("#inningsWickets").html(matchState.Over.wickets());
		    $("#inningsScore").html(matchState.Over.totalScore());
		    $("#inningsRunRate").html(matchState.Over.totalScore() + ".00");
		    $("#overPlaceHolder").replaceWith(matchState.Over.toHtml(matchState.LastCompletedOver));
		    $("#overDetailUl").listview('refresh');
		    $("#submitToServerButton").click(function () {
		        var matchId = $.url().param('matchId');
		        var postData = { 'command': "submitOver", 'matchId': matchId , 'payload' : matchState};
		        //Post to server and handle response.
		        $.post('./CommandHandler.ashx', JSON.stringify(postData), function (data) {
		            //success
		            matchState = matchStateFromData(data);
		            write();
		        }, 'json')
                 .fail(function (data) {
                     showError(data.responseText);
                 });
		        $('.ui-dialog').dialog('close');

		        write();
		    });
		}

		$("#runsButton").click(function () {
		    var amount = $("#amountSelect").val();
		    addBall(new Ball(amount, "", getOnStrikeBatsman(), getOnStrikeBatsmanName(), getBowler()));
		});

        

$("#extrasSelect").change(function () {
    var amount = $("#amountSelect").val();
    var extra = $(this).val();

    addBall(new Ball(amount, extra, getOnStrikeBatsman(), getOnStrikeBatsmanName(), getBowler()));
    $(this).val("extras")
});

$("#dotBallButton").click(function () {
    addBall(new Ball(0, "", getOnStrikeBatsman(), getOnStrikeBatsmanName(), getBowler()));
});

$("#undoButton").click(function () {
    var undone = matchState.Over.balls.pop();
    write();
    evaluateShouldSwitchStrikerAfter(undone);
});

$("#wicketButton").click(function () {
    recordWicket();
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
    return $('#strikerSelect').children().not(':selected').attr("playerId");
}

function getOnStrikeBatsmanName() {
    return $('#strikerSelect').children().not(':selected').text();
}

function getBowler() {
    return "A Bowler";
}

function addBall(aball) {
    matchState.Over.balls.push(aball);
    write();
    evaluateShouldSwitchStrikerAfter(aball);
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
        var currentIndex = $("#strikerSelect").val();
        if (currentIndex == 1) {
            $("#strikerSelect").val(2);
        } else {
            $("#strikerSelect").val(1);
        }
        $("#strikerSelect").slider('refresh');
    }
}

function write() {
    $("#overSoFar").html(matchState.Over.toPrettyString());

    if (matchState.getBattingPlayers().length == 2) {
        var batsman1 = matchState.getBattingPlayers()[0];
        var batsman2 = matchState.getBattingPlayers()[1];
        $("#batsman1").text(batsman1.PlayerName).attr("playerId", batsman1.PlayerId);
        $(".ui-slider-label-a").text(batsman1.PlayerName);
        $("#batsman2").text(batsman2.PlayerName).attr("playerId", batsman2.PlayerId);
        $(".ui-slider-label-b").text(batsman2.PlayerName);
        $("#strikerSelect").slider('refresh');
    }
}











