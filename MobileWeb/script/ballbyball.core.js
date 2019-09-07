function bindCoreHandlers() {
    initPhotoCapture("imageInput", "blah");
    initializeWagonWheel();

    $("#batsman1").change(function() {
        matchState.OnStrikeBatsmanName = getOnStrikeBatsmanName();
        matchState.OnStrikeBatsmanId = getOnStrikeBatsman();
    });
    $("#wicketButton").click(function() {
        matchState.OnStrikeBatsmanName = getOnStrikeBatsmanName();
        matchState.OnStrikeBatsmanId = getOnStrikeBatsman();
    });

    $("#endOfInningsButton").click(function() {
        showConfirmationDialog();
    });

    $("#endOfInningsGoBack").click(function() {
        $("#confirmationDialog").popup("close");
    });

    $("#takeAPicture").click(function() {
        $("#addPictureDialog").popup("open");
    });

    $("#getLink").click(function () {
        var link = "http://www.thevillagecc.org.uk/livescorecard.aspx?matchId="+matchState.MatchId;
        $("<textarea/>").appendTo("body").val(link).select().each(function () {
            document.execCommand('copy');
        }).remove();
        showInfo('Link copied to clipboard ('+link+'). Share it on WhatsApp or whatever the cool kids are using these days');
    });


    $("#singleButton").click(function() {
        addSimpleRunsBall(1);
    });

    $("#fourButton").click(function() {
        addSimpleRunsBall(4);
    });

    $("#sixButton").click(function() {
        addSimpleRunsBall(6);
    });

    $("#undoButton").click(function() {
        var undone = matchState.Over.balls.pop();
        evaluateBattingStatuses(undone);
        updateUi();
        evaluateShouldSwitchStrikerAfter(undone);
    });
    $("#runsButton").click(function() {
        var amount = parseInt($("#amountSelect").val());
        addSimpleRunsBall(amount);
    });

    $("#extrasSelect").change(function() {
        var amount = $("#amountSelect").val();
        var extra = $(this).val();
        if (amount > 1 && extra === "nb") {
            $("#wagonWheel").popup("open");
        }
        addBall(new Ball(amount, extra, getOnStrikeBatsman(), getOnStrikeBatsmanName(), getBowler()));
        $(this).val("extras");
    });

    $("#wagonWheelSaveButton").click(function() {
        if (line != null) {
            line.remove();
        }
        $("#wagonWheel").popup("close");
    });

    $("#dotBallButton").click(function() {
        addSimpleRunsBall(0);
    });

};

function showConfirmationDialog() {
    $("#confirmationDialog").popup("open");
}








function addSimpleRunsBall(runs) {
    if (runs > 0) {
        $("#wagonWheel").popup("open");
    }
    addBall(new Ball(runs, "", getOnStrikeBatsman(), getOnStrikeBatsmanName(), getBowler()));
}


function formatScore(score) {
    if (score === 0) {
        score = "maiden";
    } else if (score === 1) {
        score += " run";
    } else {
        score += " runs";
    }
    return score;

}

function getOnStrikeBatsman() {
    if ($("#batsman1").prop("checked")) {
        return $("#batsman1").attr("playerId");
    } else {
        return $("#batsman2").attr("playerId");
    }
}

function getOnStrikeBatsmanName() {
    if ($("#batsman1").prop("checked")) {
        return $("#batsman1").attr("playerName");
    } else {
        return $("#batsman2").attr("playerName");
    }
}

function getBowler() {
    return matchState.CurrentBowler;
}

function addBall(aball) {
    matchState.Over.balls.push(aball);
    updateUi();
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
    var shouldSwitch = ball.amount % 2 !== 0;
    switch (ball.thing) {
        case "wd":
        case "nb":
            shouldSwitch = !shouldSwitch;
            break;
        default:
        //nothing to do
    }
    if (shouldSwitch) {
        switchBatsmen();
    }

}

function switchBatsmen() {
    if ($("#batsman1").prop("checked")) {
        $("#batsman1").prop("checked", false).change().checkboxradio("refresh");
        $("#batsman2").prop("checked", true).change().checkboxradio("refresh");
    } else if ($("#batsman2").prop("checked")) {
        $("#batsman1").prop("checked", true).change().checkboxradio("refresh");
        $("#batsman2").prop("checked", false).change().checkboxradio("refresh");
    }

}

function updateUi() {
    evaluatePlayerScores();
    $("#overSoFar").html(matchState.Over.toPrettyString());
    $("#overs").html(matchState.LastCompletedOver + "." + matchState.Over.balls.length);
    $("#score").html(matchState.Over.totalScore() * 1 + matchState.Score * 1);
    $("#wickets").html(matchState.getPlayersOfStatus("Out").length);
    $("#currentBowler").html(matchState.CurrentBowler);

    var batsman1 = matchState.getBattingPlayers()[0];
    var batsman2 = matchState.getBattingPlayers()[1];
    $("#batsman1Label").text(batsman1.PlayerName + " (" + batsman1.Score + ")");
    $("#batsman1").attr("playerId", batsman1.PlayerId).attr("playerName", batsman1.PlayerName);
    $("#batsman2Label").text(batsman2.PlayerName + " (" + batsman2.Score + ")");
    $("#batsman2").attr("playerId", batsman2.PlayerId).attr("playerName", batsman2.PlayerName);
    
}

function reloadBallByBall() {
    window.location.replace("/MobileWeb/BallByBall/SelectMatch.aspx");
}

function assertMatchIdIsDefined() {
    if (matchId == undefined) {
        reloadBallByBall();
        return;
    }
}

function loadMatchState(matchId, callback) {
    var postData = { 'command': "matchState", 'matchId': matchId };
    $.post("./CommandHandler.ashx",
            JSON.stringify(postData),
            function(data) {
                //success
                matchState = matchStateFromData(data);
                callback();
            },
            "json")
        .fail(function(data) {
            showError(data.responseText);
        });
};

function initializeCoreView() {
    if (matchState === undefined) {
        assertMatchIdIsDefined();
        loadMatchState(matchId, updateUi);
        return;
    }
    updateUi();
}