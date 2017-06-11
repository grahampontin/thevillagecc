var matchState;
var wagonWheelImage;
var wagonWheelPaper;
var line;


function initialiseBallByBallCore(force) {
    initPhotoCapture('imageInput', 'blah');
    var matchId = $.url().param('matchId');
    if (force) {
        matchId = matchState.MatchId;
        matchState = null;
    }
    if (matchState == null) {
        if (matchId == null) {
            showError("No match id specified. Did you come from the entry page?");
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
        if (matchState.getBattingPlayers().length < 2) {
            chooseBatsmen();
        } else {
            evaluatePlayerScores();
        } 
        write();
    }

    bindChooseBatsmenHandlers();
    bindChooseBowlerHandlers();
    initializeWagonWheel();
    $("#batsman1").change(function() {
        matchState.OnStrikeBatsmanName = getOnStrikeBatsmanName();
        matchState.OnStrikeBatsmanId = getOnStrikeBatsman();
    });
    $("#wicketButton").click(function() {
        matchState.OnStrikeBatsmanName = getOnStrikeBatsmanName();
        matchState.OnStrikeBatsmanId = getOnStrikeBatsman();
    });
    $("#wagonWheel").on("popupafteropen", function () {
        $("#wagonWheelSaveButton").button();
        $("#wagonWheelSaveButton").button('disable');
        
        
        wagonWheelImage.touchstart(function (e) {
            if (line != null) {
                line.remove();
            }
            var lastBall = matchState.Over.balls[matchState.Over.balls.length - 1];
            var batsmansScoreForBall = lastBall.amount;
            if (lastBall.thing === "nb") {
                batsmansScoreForBall = batsmansScoreForBall - 1;
            }
            line = wagonWheelPaper.path(buildPath(e, batsmansScoreForBall)).attr({ stroke: getColour(batsmansScoreForBall), 'stroke-width': 3 });
            var x = e.touches[0].pageX - $(document).scrollLeft() - $('#wagonWheelCanvas').offset().left;
            var y = e.touches[0].pageY - $('#wagonWheelCanvas').offset().top;
            var angleRadians = angleBetweenTwoPointsWithFixedPoint(x, y, 150, 0, 150, 125);
            lastBall.angle = (Math.round(angleRadians * 10000) / 10000);
            $("#wagonWheelSaveButton").text(batsmansScoreForBall + " to " + getScoringArea(angleRadians));
        });

        wagonWheelImage.touchend(function () {
            $("#wagonWheelSaveButton").button('enable');
        });
        wagonWheelImage.touchmove(function (e) {
            var x = e.touches[0].pageX - $(document).scrollLeft() - $('#wagonWheelCanvas').offset().left;
            var y = e.touches[0].pageY - $('#wagonWheelCanvas').offset().top;
            var angleRadians = angleBetweenTwoPointsWithFixedPoint(x, y, 150, 0, 150, 125);
            var lastBall = matchState.Over.balls[matchState.Over.balls.length - 1];
            lastBall.angle = (Math.round(angleRadians * 10000) / 10000);
            var batsmansScoreForBall = lastBall.amount;
            if (lastBall.thing === "nb") {
                batsmansScoreForBall = batsmansScoreForBall - 1;
            }

            line.attr({ path: buildPath(e, batsmansScoreForBall) });
            $("#wagonWheelSaveButton").text(batsmansScoreForBall + " to " + getScoringArea(angleRadians));
        });
    });

    $("#endOfInningsButton").click(function () {
        showConfirmationDialog();
    });

    $("#endOfInningsConfirmButton").click(function () {
        $("body").pagecontainer("change", "EndOfInnings.aspx?innings=Batting&matchId=" + matchState.MatchId, { transition: "slide" });
    });

    $("#endOfInningsGoBack").click(function () {
        $("#confirmationDialog").popup('close');
    });

    $("#takeAPicture").click(function () {
        $("#addPictureDialog").popup('open');
    });
    

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
        evaluateBattingStatuses(undone);
        write();
        evaluateShouldSwitchStrikerAfter(undone);
    });
    $("#runsButton").click(function () {
        var amount = parseInt($("#amountSelect").val());
        addSimpleRunsBall(amount);
    });

    $("#extrasSelect").change(function () {
        var amount = $("#amountSelect").val();
        var extra = $(this).val();
        if (amount > 1 && extra === "nb") {
            $("#wagonWheel").popup("open");
        }
        addBall(new Ball(amount, extra, getOnStrikeBatsman(), getOnStrikeBatsmanName(), getBowler()));
        $(this).val("extras");
    });

    $("#wagonWheelSaveButton").click(function () {
        if (line != null) {
            line.remove();
        }
        $("#wagonWheel").popup("close");
    });

    $("#dotBallButton").click(function () {
        addSimpleRunsBall(0);
    });

};

function showConfirmationDialog() {
    $("#confirmationDialog").popup('open');
}

function getColour(score) {
    if (score < 4) {
        return '#ff0';
    }
    if (score < 6) {
        return '#fff';
    }
    return '#f00';
}

function initializeWagonWheel() {
    if (wagonWheelPaper == null) {
        wagonWheelPaper = Raphael("wagonWheelCanvas", 300, 296);
        wagonWheelImage = wagonWheelPaper.image("\\MobileWeb\\images\\wagon-wheel-new.jpg", 0, 0, 300, 296);
        wagonWheelPaper.text(60, 150, 'Off\nSide').attr({ fill: '#fff', 'font-size': 20 });
        wagonWheelPaper.text(240, 150, 'Leg\nSide').attr({ fill: '#fff', 'font-size': 20 });
    }
}

function getScoringArea(angleInRadians) {
    if (angleInRadians < (Math.PI * 0.25)) {
        return "Fine Leg";
    }
    if (angleInRadians < (Math.PI * 0.5)) {
        return "Square Leg";
    }
    if (angleInRadians < (Math.PI * 0.75)) {
        return "Mid-wicket";
    }
    if (angleInRadians < (Math.PI)) {
        return "Mid-on";
    }
    if (angleInRadians < (Math.PI * 1.25)) {
        return "Mid-off";
    }
    if (angleInRadians < (Math.PI * 1.5)) {
        return "Cover";
    }
    if (angleInRadians < (Math.PI * 1.75)) {
        return "Point";
    }
    return "Third Man";
}
		
function buildPath(e, scoreForBall) {
    var x = e.touches[0].pageX - $(document).scrollLeft() - $('#wagonWheelCanvas').offset().left;
    var y = e.touches[0].pageY - $('#wagonWheelCanvas').offset().top;
    var angleRadians = angleBetweenTwoPointsWithFixedPoint(x, y, 150, 0, 150, 125);
    var result = findNewPoint(150, 125, angleRadians, getDistance(scoreForBall, angleRadians));
    return "M150 125L" + result.x + " " + result.y;
}

function getDistance(scoreForBall, angleRadians) {
    var distance = scoreForBall * 35;
    if (angleRadians > (Math.PI / 2) && angleRadians <= (Math.PI)) {
        distance = distance + (scoreForBall * 10) * ((angleRadians - (Math.PI / 2)) / (Math.PI / 2));
    }
    if (angleRadians > (Math.PI) && angleRadians <= (Math.PI*1.5)) {
        distance = distance + (scoreForBall * 10) * (((Math.PI*1.5)-angleRadians) / (Math.PI/2));
    }
    return distance;
}

function angleBetweenTwoPointsWithFixedPoint(point1X, point1Y, point2X, point2Y, fixedX, fixedY) {

    var angle1 = Math.atan2(point1Y - fixedY, point1X - fixedX);
    var angle2 = Math.atan2(point2Y - fixedY, point2X - fixedX);
    var result = angle1 - angle2;
    if (result < 0) {
        result = (2*Math.PI) + result;
    }
    return result; 
}

function findNewPoint(x, y, angle, distance) {
    var result = {};

    result.x = Math.round(Math.cos(angle - (Math.PI / 2)) * distance + x);
    result.y = Math.round(Math.sin(angle - (Math.PI / 2)) * distance + y);

    return result;
}

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
                
        matchState.setPlayerBattingAtPosition(playerId1, 1);
		matchState.setPlayerBattingAtPosition(playerId2, 2);
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

        

		


function addSimpleRunsBall(runs) {
    if (runs > 0) {
        $("#wagonWheel").popup("open");
    }
    addBall(new Ball(runs, "", getOnStrikeBatsman(), getOnStrikeBatsmanName(), getBowler()));
}


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


function evaluateBattingStatuses(ball) {
    if (ball.wicket != null) {
        var outBatsman = ball.wicket.player;
        var notOutBatsman = ball.wicket.notOutPlayer.PlayerId;

        var batters = matchState.getBattingPlayers();
        if (batters[0].PlayerId === notOutBatsman) {
            matchState.setPlayerWaiting(batters[1].PlayerId);
        } else {
            matchState.setPlayerWaiting(batters[0].PlayerId);
        }

        matchState.setPlayerBatting(outBatsman);
    }

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

function reloadBallByBall() {
    window.location.replace("/MobileWeb/BallByBall/SelectMatch.aspx");
}











