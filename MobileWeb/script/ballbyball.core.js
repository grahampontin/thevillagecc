var matchState;
//ugh
var choosingBatsmen = false;

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
		    });

		}
	);

		$(document).bind("pagechange", function (e, data) {
		    if (choosingBatsmen) {
		        choosingBatsmen = false;
		        populateBatsmenSelects();
		        bindChooseBatsmenHandlers();
		    }
		});

		function chooseBatsmen() {
		    choosingBatsmen = true;
		    $.mobile.changePage("ChooseBatsmen.aspx", { role: "dialog" });

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
		    $("#chooseBatsmenSaveButton").click(function () {
                var playerId1 = $("#batsman1select").find('option:selected').attr("playerId");
                var playerId2 = $("#batsman2select").find('option:selected').attr("playerId");
                if (playerId1 == -1 || playerId2 == -1) {
                    showError("You must select both batsmen");
                    return;
                }
                if (playerId1==playerId2) {
                    showError("Choose 2 different players");
                    return;
                }
                matchState.SetPlayerBatting(playerId1, 1);
		        matchState.SetPlayerBatting(playerId2, 2);
                write();
                $('.ui-dialog').dialog('close');
		    });  
		}

		function bindWicketHandlers() {
		    $("#saveWicketButton").click(function () {
		        var scoreForWicketBall = $("#scoreForWicketBallAmount").val();
		        var thingForWicketBall = $("#wicketRunsSelect").val();
		        if (scoreForWicketBall == 0) {
		            thingForWicketBall = "";
		        }

		        addBall(new Ball(scoreForWicketBall, thingForWicketBall, getBatsman(), $("#bowler").val(), new Wicket($("#outBatsmanSelect").val(),
                                            $("#modeOfDismissal").val(),
                                            $("#scoreSelect").val(),
                                            $("#bowler").val(),
                                            $("#fielder").val(),
                                            $("#wicketDescription").val())
                                            ));
		        history.back();
		        return false;
		    });
		}

		function bindEndOfOverHandlers() {
		    $("#overTotalScore").html(formatScore(matchState.Over.totalScore()));
		    $("#inningsWickets").html(matchState.Over.wickets());
		    $("#inningsScore").html(matchState.Over.totalScore());
		    $("#inningsRunRate").html(matchState.Over.totalScore() + ".00");
		    $("#overPlaceHolder").replaceWith(matchState.Over.toHtml());
		    $("#overDetailUl").listview('refresh');
		    $("#submitToServerButton").click(function () {
		        //Post to server and handle response.
		        matchState.Over = new Over();
		        $('.ui-dialog').dialog('close');

		        write();


		    });
		}

		$("#runsButton").click(function () {
		    var amount = $("#amountSelect").val();
		    addBall(new Ball(amount, "", getBatsman(), getBowler()));
		});

        

$("#extrasSelect").change(function () {
    var amount = $("#amountSelect").val();
    var extra = $(this).val();

    addBall(new Ball(amount, extra, getBatsman(), getBowler()));
    $(this).val("extras")
});

$("#dotBallButton").click(function () {
    addBall(new Ball(0, "", getBatsman(), getBowler()));
});

$("#undoButton").click(function () {
    var undone = matchState.Over.balls.pop();
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
        
function getBatsman() {
    return $('#strikerSelect :selected').text()
;
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
}











