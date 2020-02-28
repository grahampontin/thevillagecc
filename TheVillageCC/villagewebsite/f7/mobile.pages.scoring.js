$$(document).on("page:init",
    '.page[data-name="scoring"]',
    function(e) {
        //Bind handlers here
        $(".runs-button").click(function() {
            var amount = parseInt($(this).attr("value"));
            addSimpleRunsBall(amount);
            refreshUi();
        });
        $("#wicket-button").click(function() {
            app.views.current.router.navigate("/wicket/");
        });
        $("#end-over-button").click(function() {
            app.views.current.router.navigate("/endOver/");
        });
        $("#runs-button").click(function() {
            if (matchState.Over.balls.length === 0) {
                showToastBottom("Add a ball first");
                return;
            }
            displayWagonWheel();
        });
        $(".extras-button").click(function() {
            if (matchState.Over.balls.length === 0) {
                showToastBottom("Add a ball first");
                return;
            }
            var extra = $(this).attr("value");
            var ball = matchState.removeLastBall();
            if (ball.amount === 0) {
                showToastBottom("Doesn't make sense to have no extras..");
                matchState.addBall(ball);
                return;
            }
            ball.thing = extra;
            matchState.addBall(ball);
            refreshUi();
        });
        $("#undo-button").click(function() {
            matchState.removeLastBall();
            refreshUi();
        });
        var switchIfRequired = function() {
            if ($(this).attr("playerId") == matchState.OnStrikeBatsmanId) {
                return;
            }
            matchState.switchBatsmanOnStrike();
            refreshUi();
        };
        $("#batsman-one-name").click(switchIfRequired);
        $("#batsman-two-name").click(switchIfRequired);

        //once bound...
        initializeMatchStateAndThen(false,
            function() {
                initializeWagonWheel("wagon-wheel-canvas",
                    function(angle, magnitude) {
                        matchState.getLastBall().angle = angle;
                        matchState.getLastBall().magnitude = magnitude;
                        updateWagonWheelUiText();

                    });
                matchState.evaluatePlayerScores();
                refreshUi();
            });
    });

function addSimpleRunsBall(runs) {
    var batsmanForThisBall = matchState.OnStrikeBatsmanId;
    matchState.addBall(new Ball(
        runs,
        "",
        batsmanForThisBall,
        matchState.getPlayer(batsmanForThisBall).PlayerName,
        matchState.CurrentBowler));
}

function displayWagonWheel() {

    var sheet = app.sheet.create({
        el: "#wagon-wheel-sheet",
        on: {
            close: function() {
                closeWagonWheel();
            },
            opened: function() {
                if (matchState.getLastBall().isFour() || matchState.getLastBall().isSix()) {
                    setWagonWheelTrackBoundary(true);
                } else {
                    setWagonWheelTrackBoundary(false);
                }
                updateWagonWheelUiText();
            }
        }
    });
    sheet.open();
}

function updateWagonWheelUiText() {
    $("#ww-batsman-name").text(matchState.getLastBall().batsmanName);
    $("#ww-bowler-name").text(matchState.getLastBall().bowler);
    $("#ww-short-ball-score-description").text(matchState.getLastBall().toBallString());
    $("#ww-scoring-area").text(getScoringArea(matchState.getLastBall().angle));
    $("#ww-long-ball-score-description").text(matchState.getLastBall().toBallString());
}

function refreshUi() {
    refreshBatsmenView();
    refreshCurrentOverView();
    refreshTeamScores();
}

function refreshTeamScores() {
    $("#village-team-score").text(matchState.Over.totalScore() * 1 + matchState.Score * 1);
    $("#village-team-wickets").text(matchState.getPlayersOfStatus("Out").length);
    $("#village-team-ovs").text(matchState.LastCompletedOver + "." + matchState.Over.balls.length);
    $("#opposition-team-score").text("0");
    $("#opposition-team-wickets").text("0");
}

function refreshBatsmenView() {
    var batsman1 = matchState.getBattingPlayers()[0];
    var batsman2 = matchState.getBattingPlayers()[1];
    $("#batsman-one-name").text(batsman1.PlayerName);
    $("#batsman-two-name").text(batsman2.PlayerName);
    //coercing strings and ints here
// ReSharper disable once CoercedEqualsUsing
    if (matchState.OnStrikeBatsmanId == batsman1.PlayerId) {
        $("#batsman-one-name").addClass("button-fill");
        $("#batsman-one-name").removeClass("button-outline");
        $("#batsman-two-name").removeClass("button-fill");
        $("#batsman-two-name").addClass("button-outline");
    } else {
        $("#batsman-two-name").addClass("button-fill");
        $("#batsman-two-name").removeClass("button-outline");
        $("#batsman-one-name").removeClass("button-fill");
        $("#batsman-one-name").addClass("button-outline");
    }
    $("#batsman-one-runs").text(batsman1.Score);
    $("#batsman-one-balls").text(batsman1.CurrentBallsFaced);
    $("#batsman-one-fours").text(batsman1.CurrentFours);
    $("#batsman-one-sixes").text(batsman1.CurrentSixes);
    $("#batsman-one-strike-rate").text(batsman1.CurrentStrikeRate);
    $("#batsman-one-name").attr("playerId", batsman1.PlayerId);

    $("#batsman-two-runs").text(batsman2.Score);
    $("#batsman-two-balls").text(batsman2.CurrentBallsFaced);
    $("#batsman-two-fours").text(batsman2.CurrentFours);
    $("#batsman-two-sixes").text(batsman2.CurrentSixes);
    $("#batsman-two-strike-rate").text(batsman2.CurrentStrikeRate);
    $("#batsman-two-name").attr("playerId", batsman2.PlayerId);

    $("#partnership-runs").text(matchState.Partnership.CurrentScore);
    $("#partnership-balls").text(matchState.Partnership.CurrentBalls);
    $("#partnership-fours").text(matchState.Partnership.CurrentFours);
    $("#partnership-sixes").text(matchState.Partnership.CurrentSixes);
}

function refreshCurrentOverView() {
    var parent = $("#current-over-balls");
    parent.empty();
    $.each(matchState.Over.balls,
        function(index, ball) {
            var ballElement = $("<div></div>");
            ballElement.addClass("circle");
            ballElement.addClass("circle-small");
            ballElement.addClass("ball");
            if (ball.amount === 0 && ball.wicket == null) {
                ballElement.addClass("dot");
            }
            if ((ball.amount === 4 || ball.amount === 6) && ball.thing === "") {
                ballElement.addClass("boundary-ball");
            }
            if (ball.wicket !== undefined) {
                ballElement.addClass("wicket");
            }
            var innerElement = $("<div></div>");
            innerElement.addClass("circle-inner");
            if (ball.amount !== 0 || ball.wicket != null) {
                innerElement.text(ball.toBallString());
            }
            ballElement.append(innerElement);
            parent.append(ballElement);
        });
}