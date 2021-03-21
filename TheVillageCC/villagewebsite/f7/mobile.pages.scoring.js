var toast;
$$(document).on("page:init",
    '.page[data-name="scoring"]',
    function(e) {
        //Bind handlers here
        $(".runs-button").click(function() {
            if (waitingForBallType) {
                toast = showToastBottom("What was the last ball? Runs? Extras?");
                return;
            }
            var amount = parseInt($(this).attr("value"));
            addSimpleRunsBall(amount);
            refreshUi();
            if (amount > 0) {
                startPulsing();
            }
        });
        $("#wicket-button").click(function() {
            if (waitingForBallType) {
                toast = showToastBottom("What was the last ball? Runs? Extras?");
                return;
            }
            app.views.current.router.navigate("/wicket/");
        });
        $("#end-over-button").click(function() {
            if (waitingForBallType) {
                toast = showToastBottom("What was the last ball? Runs? Extras?");
                return;
            }
            app.views.current.router.navigate("/endOver/");
        });
        $("#runs-button").click(function() {
            if (matchState.Over.balls.length === 0) {
                toast = showToastBottom("Add a ball first");
                return;
            }
            $(".show-five-plus").hide();
            $(".hide-five-plus").show();
            stopPulsing();
            displayWagonWheel();
        });
        $("#change-bowler-button").click(function() {
            matchState.PreviousBowlerButOne = matchState.CurrentBowler;
            app.views.current.router.navigate("/newOver/");
        });
        $(".extras-button").click(function() {
            if (matchState.Over.balls.length === 0) {
                toast = showToastBottom("Add a ball first");
                return;
            }
            $(".show-five-plus").hide();
            $(".hide-five-plus").show();
            stopPulsing();
            var extra = $(this).attr("value");
            var ball = matchState.removeLastBall();
            if (ball.amount === 0) {
                toast = showToastBottom("Doesn't make sense to have no extras..");
                matchState.addBall(ball);
                return;
            }
            ball.thing = extra;
            matchState.addBall(ball);
            refreshUi();
        });
        $("#undo-button").click(function() {
            $(".show-five-plus").hide();
            $(".hide-five-plus").show();
            matchState.removeLastBall();
            refreshUi();
            stopPulsing();
        });
        $("#runs-five-plus-button").click(function() {
            $(".show-five-plus").show();
            $(".hide-five-plus").hide();
        });
        $("#normal-runs-button").click(function() {
            $(".show-five-plus").hide();
            $(".hide-five-plus").show();
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

        $("#share").click(function () {
            var link = "http://www.thevillagecc.org.uk/livescorecard.aspx?matchId="+matchState.MatchId;
            $("<textarea/>").appendTo("body").val(link).select().each(function () {
                document.execCommand('copy');
            }).remove();
            showToastBottom('Link copied to clipboard ('+link+'). Share it on WhatsApp or whatever the cool kids are using these days');
        });


        //once bound...
        initializeMatchStateAndThen(false,
            function() {
                
                matchState.evaluatePlayerScores();
                refreshUi();
            });
    });

var waitingForBallType = false;
function startPulsing() {
    waitingForBallType = true;
        pulse(".extras-button", 400);
    }

function stopPulsing() {
    waitingForBallType = false;
    if (toast != undefined) {
        toast.close();
    }
    $(".extras-button").each(function(i,o) {
        $(o).pulse('destroy');
    });
    $('#runs-button').pulse('destroy');
}



function pulse(elementClass, duration) {
    var properties = {
        opacity : 0.25
    };

    $(elementClass).each(function(i,o) {
        $(o).pulse(properties,
            {
                pulses: -1,
                duration: 1000
           });
    });
    $('#runs-button').pulse(properties,
        {
            pulses: -1,
            duration: 1000
        });
}

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
                refreshCurrentOverBallsView();
            },
            opened: function() {
                initializeWagonWheel("wagon-wheel-canvas",
                    function(angle, magnitude) {
                        matchState.getLastBall().angle = angle;
                        matchState.getLastBall().magnitude = magnitude;
                        updateWagonWheelUiText();

                    });
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
    refreshBowlerView();
    refreshCurrentOverView();
    refreshTeamScores();
    refreshCurrentOverBallsView();
}

function refreshCurrentOverBallsView() {
    $('#balls-this-over-list').empty();
    renderBallsList('#balls-this-over-list');
}



function refreshTeamScores() {
    $("#village-team-score").text(matchState.Over.totalScore() * 1 + matchState.Score * 1);
    $("#village-team-wickets").text(matchState.getPlayersOfStatus("Out").length);
    $("#village-team-ovs").text(matchState.LastCompletedOver + "." + matchState.Over.balls.length);
    $("#opposition-team-score").text(matchState.OppositionScore);
    $("#opposition-team-wickets").text(matchState.OppositionWickets);
    $("#opposition-team-name").text(matchState.OppositionName);
    $("#opposition-team-abbreviation").text(matchState.OppositionShortName);
}

function refreshBowlerView() {
    $("#bowler-name").text(matchState.CurrentBowler);
    var bowlerDetails = matchState.getBowlerDetails(matchState.CurrentBowler);
    var details;
    if (bowlerDetails == undefined || bowlerDetails == null) {
        details = {
            Overs: 0,
            Maidens: 0,
            Runs: 0,
            Wickets: 0
        };
    } else {
        details  = bowlerDetails.Details;
    }
    $("#bowler-overs").text(details.Overs + "." + matchState.getBallsBowledBy(matchState.CurrentBowler).length);
    $("#bowler-maidens").text(details.Maidens);
    $("#bowler-runs").text(details.Runs + matchState.getRunsConceededInCurrentOver(matchState.CurrentBowler));
    $("#bowler-wickets").text(details.Wickets + matchState.getWicketsTakenInCurrentOver(matchState.CurrentBowler));
}

function refreshBatsmenView() {
    var batsman1 = matchState.getBattingPlayers()[0];
    var batsman2 = matchState.getBattingPlayers()[1];
    if (batsman1 == undefined) {
        batsman1 = new PlayerStub();
    }
    if (batsman2 == undefined) {
        batsman2 = new PlayerStub();
    }

    $("#batsman-one-name").text(batsman1.PlayerName);
    $("#batsman-two-name").text(batsman2.PlayerName);
    //coercing strings and ints here
// ReSharper disable once CoercedEqualsUsing
    if (matchState.OnStrikeBatsmanId == batsman1.PlayerId) {
        $("#batsman-one-name").addClass("button-fill");
        $("#batsman-one-name").removeClass("button-outline");
        $("#batsman-one-name").removeClass("opacity-40");
        $("#batsman-two-name").removeClass("button-fill");
        $("#batsman-two-name").addClass("button-outline");
        $("#batsman-two-name").addClass("opacity-40");
    } else {
        $("#batsman-two-name").addClass("button-fill");
        $("#batsman-two-name").removeClass("button-outline");
        $("#batsman-two-name").removeClass("opacity-40");
        $("#batsman-one-name").removeClass("button-fill");
        $("#batsman-one-name").addClass("button-outline");
        $("#batsman-one-name").addClass("opacity-40");
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