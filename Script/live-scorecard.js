$(function () {
    var matchId = $.url().param('matchId');
    if (matchId == null) {
        showError("No match id speified. How did you get here exactly?");
        return;
    }
    var postData = { 'command': "liveScorecard", 'matchId': matchId };
    $.post("./MobileWeb/BallByBall/CommandHandler.ashx", JSON.stringify(postData), function (data) {
        //success
            renderMatchData(data);
        }, 'json')
        .fail(function (data) {
            showError(data.responseText);
        });
});

function showError(text) {
    BootstrapDialog.show({
        title: "Oops! Something went wrong.",
        message: text,
        closable: false,
        buttons: [{
            label: 'Close',
            cssClass: 'btn-default',
            action: function (dialogRef) {
                dialogRef.close();
            }
        }]
    });
}

function renderMatchData(matchData) {
    $(".opposition").text(matchData.Opposition);
    $("#oversRemaining").text(matchData.OversRemaining);
    $("#lastCompletedOver").text(matchData.LastCompletedOver);
    $("#teamScore").text(matchData.Score);
    $("#teamWickets").text(matchData.Wickets);
    $("#wicketsRemaining").text(10 - matchData.Wickets);
    $("#teamRunRate").text(matchData.RunRate);

    //On strike batsman
    $("#onStrikeBatsmanName").text(matchData.OnStrikeBatsman.Name);
    $("#onStrikeBatsmanScore").text(matchData.OnStrikeBatsman.Score);
    $("#onStrikeBatsmanBalls").text(matchData.OnStrikeBatsman.Balls);
    $("#onStrikeBatsmanFours").text(matchData.OnStrikeBatsman.Fours);
    $("#onStrikeBatsmanSixes").text(matchData.OnStrikeBatsman.Sixes);
    $("#onStrikeBatsmanStrikeRate").text(matchData.OnStrikeBatsman.StrikeRate);
    $("#onStrikeBatsmanScoreForThisBowler").text(matchData.OnStrikeBatsman.ScoreForThisBowler);
    $("#onStrikeBatsmanBallsFacedFromThisBowler").text(matchData.OnStrikeBatsman.BallsFacedFromThisBowler);
    $("#onStrikeBatsmanScoreForLastTenOvers").text(matchData.OnStrikeBatsman.ScoreForLastTenOvers);
    $("#onStrikeBatsmanBallsFacedInLastTenOvers").text(matchData.OnStrikeBatsman.BallsFacedInLastTenOvers);
    $("#onStrikeBatsmanMatches").text(matchData.OnStrikeBatsman.Matches);
    $("#onStrikeBatsmanCareerRuns").text(matchData.OnStrikeBatsman.CareerRuns);
    $("#onStrikeBatsmanCareerHighScore").text(matchData.OnStrikeBatsman.CareerHighScore);
    $("#onStrikeBatsmanCareerAverage").text(matchData.OnStrikeBatsman.CareerAverage);

    //Off strike batsman
    $("#otherBatsmanName").text(matchData.OtherBatsman.Name);
    $("#otherBatsmanScore").text(matchData.OtherBatsman.Score);
    $("#otherBatsmanBalls").text(matchData.OtherBatsman.Balls);
    $("#otherBatsmanFours").text(matchData.OtherBatsman.Fours);
    $("#otherBatsmanSixes").text(matchData.OtherBatsman.Sixes);
    $("#otherBatsmanStrikeRate").text(matchData.OtherBatsman.StrikeRate);
    $("#otherBatsmanScoreForThisBowler").text(matchData.OtherBatsman.ScoreForThisBowler);
    $("#otherBatsmanBallsFacedFromThisBowler").text(matchData.OtherBatsman.BallsFacedFromThisBowler);
    $("#otherBatsmanScoreForLastTenOvers").text(matchData.OtherBatsman.ScoreForLastTenOvers);
    $("#otherBatsmanBallsFacedInLastTenOvers").text(matchData.OtherBatsman.BallsFacedInLastTenOvers);
    $("#otherBatsmanMatches").text(matchData.OtherBatsman.Matches);
    $("#otherBatsmanCareerRuns").text(matchData.OtherBatsman.CareerRuns);
    $("#otherBatsmanCareerHighScore").text(matchData.OtherBatsman.CareerHighScore);
    $("#otherBatsmanCareerAverage").text(matchData.OtherBatsman.CareerAverage);

    //Bowler One
    $("#bowlerOneName").text(matchData.BowlerOneDetails.Name);
    $("#bowlerOneOvers").text(matchData.BowlerOneDetails.Details.Overs);
    $("#bowlerOneMaidens").text(matchData.BowlerOneDetails.Details.Maidens);
    $("#bowlerOneRuns").text(matchData.BowlerOneDetails.Details.Runs);
    $("#bowlerOneWickets").text(matchData.BowlerOneDetails.Details.Wickets);
    $("#bowlerOneDots").text(matchData.BowlerOneDetails.Details.Dots);
    $("#bowlerOneFours").text(matchData.BowlerOneDetails.Details.Fours);
    $("#bowlerOneSixes").text(matchData.BowlerOneDetails.Details.Sixes);
    $("#bowlerOneEconomy").text(matchData.BowlerOneDetails.Details.Economy);
    var spell = matchData.BowlerOneDetails.JustThisSpell;
    $("#bowlerOneThisSpell").text(spell.Overs+"-"+spell.Maidens+"-"+spell.Runs+"-"+spell.Wickets);

    //Bowler Two
    $("#bowlerTwoName").text(matchData.BowlerTwoDetails.Name);
    $("#bowlerTwoOvers").text(matchData.BowlerTwoDetails.Details.Overs);
    $("#bowlerTwoMaidens").text(matchData.BowlerTwoDetails.Details.Maidens);
    $("#bowlerTwoRuns").text(matchData.BowlerTwoDetails.Details.Runs);
    $("#bowlerTwoWickets").text(matchData.BowlerTwoDetails.Details.Wickets);
    $("#bowlerTwoDots").text(matchData.BowlerTwoDetails.Details.Dots);
    $("#bowlerTwoFours").text(matchData.BowlerTwoDetails.Details.Fours);
    $("#bowlerTwoSixes").text(matchData.BowlerTwoDetails.Details.Sixes);
    $("#bowlerTwoEconomy").text(matchData.BowlerTwoDetails.Details.Economy);
    spell = matchData.BowlerTwoDetails.JustThisSpell;
    $("#bowlerTwoThisSpell").text(spell.Overs+"-"+spell.Maidens+"-"+spell.Runs+"-"+spell.Wickets);


    //Current partnership
    $("#currentPartnershipRuns").text(matchData.CurrentPartnership.Score);
    $("#currentPartnershipRunRate").text(matchData.CurrentPartnership.RunRate);
    $("#currentPartnershipOvers").text(matchData.CurrentPartnership.OversAsString);
    $("#currentPartnershipPlayer1Name").text(matchData.CurrentPartnership.Player1Name);
    $("#currentPartnershipPlayer1Runs").text(matchData.CurrentPartnership.Player1Score);
    $("#currentPartnershipPlayer2Name").text(matchData.CurrentPartnership.Player2Name);
    $("#currentPartnershipPlayer2Runs").text(matchData.CurrentPartnership.Player2Score);
    
    //Last batsman
    $("#lastBatsmanWicketText").text(getDismissalText(matchData.LastManOut.Wicket, matchData.FallOfWickets));

    //Fall of last wicket
    $("#fallOfWicketWicketNumber").text(matchData.LastManOut.WicketNumber);
    $("#fallOfWicketTeamScore").text(matchData.LastManOut.TeamScore);
    $("#fallOfWicketOver").text(matchData.LastManOut.OverAsString);
    $("#lastPartnershipRuns").text(matchData.LastManOut.Partnership.Score);
    $("#lastPartnershipRunRate").text(matchData.LastManOut.Partnership.RunRate);
    $("#lastPartnershipOvers").text(matchData.LastManOut.Partnership.OversAsString);
    $("#lastPartnershipPlayer1Name").text(matchData.LastManOut.Partnership.Player1Name);
    $("#lastPartnershipPlayer1Runs").text(matchData.LastManOut.Partnership.Player1Score);
    $("#lastPartnershipPlayer2Name").text(matchData.LastManOut.Partnership.Player2Name);
    $("#lastPartnershipPlayer2Runs").text(matchData.LastManOut.Partnership.Player2Score);

    //Recent overs
    var ballsRendered = 0;
    $.each(matchData.CompletedOvers.reverse(), function(index, over) {
        if (ballsRendered >= 26) {
            return;
        }
        $.each(over.Over.Balls.reverse(), function (ballIndex, ball) {
            if (ballsRendered >= 26) {
                return;
            }
            if (ball.Wicket != null) {
                if (ball.Amount !== 0) {
                    $("#recentOvers").prepend("<div class=\"ball-score\"><small><strong>W</strong></small>," + ball.Amount + ball.Thing + "</div>");
                } else {
                    $("#recentOvers").prepend("<div class=\"ball-score\"><small><strong>W</strong></small></div>");
                }
            } else if (ball.Amount === 0) {
                $("#recentOvers").prepend("<div class=\"ball-score\">•</div>");
            } else {
                $("#recentOvers").prepend("<div class=\"ball-score\"><small>" + ball.Amount + ball.Thing + "</small></div>");
            }
            ballsRendered++;
        });
        $("#recentOvers").prepend("<div class=\"over-divider\">&nbsp</div>");
    });

    //Overs text
    $.each(matchData.CompletedOvers.reverse(), function (index, over) {
        var overContainer = $("<div></div>");
        overContainer.addClass("panel panel-default");

        var overHeader = $("<div></div>");
        overHeader.addClass("panel-heading");
        overHeader.html("<small><strong>End of over " + over.Over.OverNumber + "</strong> (" + getScoreString(over.ScoreForThisOver) + ") <strong>Village " + over.ScoreAtEndOfOver + "/" + over.WicketsAtEndOfOver + "</strong></small>");

        overContainer.append(overHeader);

        var overBody = $("<div></div>");
        overBody.addClass("panel-body");

        var overCommentary = $("<div></div>");
        overCommentary.addClass("over-comment");
        overCommentary.html(over.Over.Commentary);


        var actualBallNumber = 1;
        $.each(over.Over.Balls.reverse(), function (ballIndex, ball) {
            var row = $("<div></div>");
            row.addClass("row ball-row");

            var ballNumber = $("<div></div>");
            ballNumber.addClass("col-sm-1");

            ballNumber.html("<strong>" + index + "." + actualBallNumber+ "</strong>");

            var ballDescription = $("<div></div>");
            ballDescription.addClass("col-sm-11");
            ballDescription.html(ball.Bowler + " to " + ball.BatsmanName + ", " + getBallDescription(ball));
            row.append(ballNumber);
            row.append(ballDescription);

            if (ball.Wicket != null) {
                var wicketRow = $("<div></div>");
                wicketRow.addClass("row wicket-row");
                var emptyColumn = $("<div></div>");
                emptyColumn.addClass("col-sm-1");
                wicketRow.append(emptyColumn);

                var wicketDetails = $("<div></div>");
                wicketDetails.addClass("col-sm-11");
                wicketDetails.html("<strong>" + getDismissalText(ball.Wicket, matchData.FallOfWickets) + "</strong>");
                wicketRow.append(wicketDetails);

                overBody.prepend(wicketRow);
            }
            overBody.prepend(row);
            if (!needsToBeReBowled(ball)) {
                actualBallNumber ++;
            }
        });
        overBody.prepend(overCommentary);
        overContainer.append(overBody);
        $("#overDetails").prepend(overContainer);
    });

    $.each(matchData.LiveBattingCard.Players, function(index, player) {
        var playerIcon = $("<div></div");
        playerIcon.addClass("img-circle player-icon pull-left");
        playerIcon.attr("playerId", player.BatsmanInningsDetails.PlayerId);
        var playerName = player.BatsmanInningsDetails.Name;
        playerIcon.attr("playerName", player.BatsmanInningsDetails.Name);
        playerIcon.attr("playerScore", player.BatsmanInningsDetails.Score);
        playerIcon.attr("playerIsOut", player.Wicket != null);


        var parts = playerName.split(' ');
        var shortName = "";
        $.each(parts, function(index, part) {
            shortName = shortName + part.charAt(0);
        });
        if (shortName.length > 3) {
            shortName = shortName.charAt(0) + shortName.charAt(1) + shortName.charAt(shortName.length - 1);
        }
        playerIcon.html(shortName);
        $('#player-icons').append(playerIcon);
        
    });
    $('#player-icons').width($(".player-icon").length * 60);



    $(".player-icon").click(function() {
        $("#chart-types").removeClass("hidden");
        var clickedPlayer = $(this);
        $('.player-icon').removeClass('player-icon-active');
        clickedPlayer.addClass('player-icon-active');
        drawChart(clickedPlayer);


    });

    function drawChart(clickedPlayer) {
        $('#wagon-wheel').html('');

        var chartToDraw = $(".chart-type-active").attr("chartType");
        var paper;
        if (chartToDraw === "wagon") {
            paper = initializeWagonWheel();
            drawWagonWheel(clickedPlayer, matchData.CompletedOvers, paper);
        }
        if (chartToDraw === "zones") {
            paper = initializeZones();
            drawZones(clickedPlayer, paper, matchData.CompletedOvers);
        }
        if (chartToDraw === "worm") {
            paper = initializeWorm();
            drawWorm(clickedPlayer, paper, matchData.CompletedOvers);
        }
    }

    function drawZones(player, paper, overs) {
        var scoreBuckets = [0,0,0,0,0,0,0,0];
        drawPlayerNameAndScore(player, paper);
        $.each(overs, function (index, over) {
            $.each(over.Over.Balls, function (index, ball) {
                if (ball.Batsman.toString() === player.attr("playerId") && (ball.Thing === "" || (ball.Thing === "nb" && ball.Amount > 1))) {
                    addBallToBucket(ball, scoreBuckets);
                }
            });
        });
        $.each(scoreBuckets, function(index) {
            addScoreToZone(index, scoreBuckets, paper);
        });
    }

    function drawWorm(player, paper, overs) {
        var colour1 = '#009933';
        var colour2 = '#ffd633';

        paper.image("\\Images\\livescorecard\\vcc-logo-opaque.jpg", 35, 90, 200, 85);
        var xValues = [];
        var scoreValues = [];
        var strikeRateValues = [];

        var cumulativeScore = 0;
        var ballNumber = 0;
        $.each(overs, function (index, over) {
            $.each(over.Over.Balls, function (index, ball) {
                if (ball.Batsman.toString() === player.attr("playerId") && (ball.Thing === "" || (ball.Thing === "nb" && ball.Amount > 1))) {
                    ballNumber ++;
                    cumulativeScore = cumulativeScore + ball.Amount;
                    xValues.push(ballNumber);
                    scoreValues.push(cumulativeScore);
                    strikeRateValues.push((cumulativeScore / ballNumber) * 100);
                }
            });
        });

        var maxStrikeRate = maxValue(strikeRateValues);
        $.each(strikeRateValues, function (index, value) {
            strikeRateValues[index] = (value / maxStrikeRate) * cumulativeScore;
        });

        drawPlayerNameAndScore(player, paper);
        var r = paper;

        // Creates a simple line chart at 10, 10
        // width 300, height 200
        var x = 10,
            y = 10,
            xlen = paper.width-30,
            ylen = paper.height-40,
            gutter = 20,
            xdata = xValues;
        var chrt = r.linechart(x, y, xlen, ylen, xdata, [scoreValues, strikeRateValues], {
            gutter: gutter,
            nostroke: false,
            axis: "0 0 0 1",
            symbol: "",
            smooth: true,
            colors: [
                        colour1, 
                        colour2  
            ]
        });
        // default gutter: 10
        //x, y, length, from, to, steps, orientation, labels, type, dashsize, paper
        Raphael.g.axis(
            x + gutter, // 10 + gutter
            y + ylen - gutter, //y pos
            xlen - 2 * gutter, 1, xdata.length, // used to pass the initial value and last value (number) if no labels are provided
            xdata.length - 5, // number of steps 
            0, null, // the labels
            r // you need to provide the Raphael object
        );
        Raphael.g.axis(
            paper.width - gutter - 20, // 10 + gutter
            y + ylen - gutter, //y pos
            paper.height - 80, 0, maxStrikeRate, // used to pass the initial value and last value (number) if no labels are provided
            null, // number of steps 
            3, null, // the labels
            r // you need to provide the Raphael object
        );

        paper.text(40, 320, 'Score').attr({ 'font-size': 12 });
        
        paper.path('M70 320L110 320').attr({ stroke: colour1, 'stroke-width': 4 });
        paper.text(160, 320, 'Strike Rate').attr({ 'font-size': 12 });
        paper.path('M200 320L240 320').attr({ stroke: colour2, 'stroke-width': 4 });
        paper.text(5, 160, 'Runs').attr({ 'font-size': 12 }).rotate(-90, true);
        paper.text(275, 160, 'Strike Rate').attr({ 'font-size': 12 }).rotate(90, true);

    }

    function maxValue(values) {
        var maxValue = 0;
        $.each(values, function (index, value) {
            if (value > maxValue) {
                maxValue = value;
            }
        });
        return maxValue;
    }

    function addScoreToZone(zoneIndex, scoreBuckets, paper) {
        var point = findNewPoint(paper.width / 2, paper.height / 2, Math.PI / 8 * (zoneIndex*2+1), paper.width / 3);
        paper.text(point.x, point.y, scoreBuckets[zoneIndex]).attr({
            'font-size': 20, fill : '#fff'  
    });

    }

    function addBallToBucket(ball, scoreBuckets) {
        var modulo = Math.floor(ball.Angle / (Math.PI / 4));
        scoreBuckets[modulo] += ball.Amount;
    }

    $(".chart-type").click(function() {
        var clickedChart = $(this);
        $(".chart-type").removeClass("chart-type-active");
        clickedChart.addClass("chart-type-active");

        drawChart($(".player-icon-active"));
    });
}

function drawWagonWheel(player, overs, paper) {
    drawPlayerNameAndScore(player, paper);
    $.each(overs, function(index, over) {
        $.each(over.Over.Balls, function (index, ball) {
            if (ball.Batsman.toString() === player.attr("playerId") && (ball.Thing ==="" || (ball.Thing === "nb" && ball.Amount > 1))) {
                drawBall(ball, paper);
            }
        });
    });
}

function drawPlayerNameAndScore(player, paper) {
    var playerText = player.attr("playerName") + " (" + player.attr("playerScore");
    if (player.attr("playerIsOut") !== "true") {
        playerText = playerText + "*";
    }
    playerText = playerText + ")";
    paper.text(paper.width / 2, 20, playerText).attr({ 'font-size': 20 });
}

function drawBall(ball, paper) {
    var stumpsX = Math.round(paper.width * 0.5);
    var stumpsY = Math.round((paper.height-30) * .4 + 30);
    var batsmansScoreForBall = ball.Amount;
    if (ball.Thing === "nb") {
        batsmansScoreForBall = batsmansScoreForBall - 1;
    }
    var result = findNewPoint(stumpsX, stumpsY, ball.Angle, getDistance(batsmansScoreForBall, ball.Angle));
    paper.path("M" + stumpsX + " " + stumpsY + "L" + result.x + " " + result.y).attr({ stroke: getColour(batsmansScoreForBall), 'stroke-width': 2 });
}

function initializeWagonWheel() {
    var wagonWheelPaper = Raphael("wagon-wheel", 283, 330);
    var wagonWheelImage = wagonWheelPaper.image("\\MobileWeb\\images\\wagon-wheel-new.jpg", 0, 30, 283, 280);
    wagonWheelPaper.text(55, 175, 'Off\nSide').attr({ fill: '#fff', 'font-size': 20 });
    wagonWheelPaper.text(235, 175, 'Leg\nSide').attr({ fill: '#fff', 'font-size': 20 });
    wagonWheelPaper.text(20, 325, 'Runs').attr({ 'font-size': 12 });
    wagonWheelPaper.path('M40 325L80 325').attr({ stroke: '#ff0', 'stroke-width': 4 });
    wagonWheelPaper.text(120, 325, 'Fours').attr({ 'font-size': 12 });
    wagonWheelPaper.path('M140 325L180 325').attr({ stroke: '#00f', 'stroke-width': 4 });
    wagonWheelPaper.text(220, 325, 'Sixes').attr({ 'font-size': 12 });
    wagonWheelPaper.path('M240 325L280 325').attr({ stroke: '#f00', 'stroke-width': 4 });

    return wagonWheelPaper;
}


function initializeZones() {
    var paper = Raphael("wagon-wheel", 283, 330);
    paper.image("\\Images\\liveScorecard\\zones-background.png", 0, 30, 280, 280);
    return paper;
}

function initializeWorm() {
    var paper = Raphael("wagon-wheel", 283, 330);
    return paper;
}

function needsToBeReBowled(ball) {
    return ball.Thing === "nb" || ball.Thing === "wd";
}

function getScoreString(score) {
    if (score === 0)
        return "maiden";
    else {
        var runOrRuns = score === 1 ? " run" : " runs";
        return score + runOrRuns;
    }
}

function getBallDescription(ball) {
    if (ball.Wicket != null) {
        return "<strong>OUT!</strong> " + ball.Wicket.Description;
    }
    var sOrNoS = ball.Amount > 1 ? "s" : "";
    switch (ball.Thing) {
        case "":
            switch (ball.Amount) {
                case 0:
                    return "no run";
                case 1:
                    return "single to " + getLocationFrom(ball);
                case 4:
                    return "<strong>FOUR</strong> through " + getLocationFrom(ball);
                case 6:
                    return "<strong>SIX!</strong> over " + getLocationFrom(ball);
                default:
                    return ball.Amount + " runs to " + getLocationFrom(ball);
            }
        case "wd":
            return ball.Amount + " wide" + sOrNoS;
        case "nb":
            return ball.Amount + " no ball" + sOrNoS;
        case "b":
            return ball.Amount + " bye" + sOrNoS;
        case "lb":
            return ball.Amount + " leg bye" + sOrNoS;
        case "p":
            return ball.Amount + " penalty run" + sOrNoS;
        default:
            return ball.Amount + " " + ball.Thing;

    }
}

function getLocationFrom(ball) {
    if (ball.Angle < Math.PI / 4) {
        return "fine leg";
    }
    if (ball.Angle < Math.PI / 2) {
        return "backwards square leg";
    }
    if (ball.Angle < Math.PI * 0.6) {
        return "square leg";
    }
    if (ball.Angle < Math.PI * 0.8) {
        return "mid wicket";
    }
    if (ball.Angle < Math.PI) {
        return "mid on";
    }
    if (ball.Angle < Math.PI * 1.2) {
        return "mid off";
    }
    if (ball.Angle < Math.PI * 1.35) {
        return "extra cover";
    }
    if (ball.Angle < Math.PI * 1.5) {
        return "cover";
    }
    if (ball.Angle < Math.PI * 1.65) {
        return "point";
    }
    if (ball.Angle < Math.PI * 1.8) {
        return "backwards point";
    }
    return "third man";
}

function getFallOfWicketForPlayer(playerId, fallOfWickets) {
    var wicketToReturn;
        $.each(fallOfWickets, function(index, fallOfWicket) {
            if (fallOfWicket.OutGoingPlayerId === playerId) {
                return wicketToReturn = fallOfWicket;
            }
        }
    );
    return wicketToReturn;
}

function getDismissalText(wicket, fallOfWickets) {
    var string = wicket.PlayerName + " ";
    var fallOfWicket = getFallOfWicketForPlayer(wicket.Player, fallOfWickets);
    switch (wicket.ModeOfDismissal) {
        case "bowled":
            string += "b " + wicket.Bowler;
            break;
        case "caught":
            string += "ct " + wicket.Fielder + " b " + wicket.Bowler;
            break;
        case "lbw":
            string += "lbw " + wicket.Bowler;
            break;
        case "run out":
            string += "run out " + wicket.Fielder;
            break;
        case "stumped":
            string += "stumped " + wicket.Fielder;
            break;
        case "hit wicket":
            string += "hit wicket";
            break;
        case "handled the ball":
            string += "handled the ball";
            break;
    }
    var details = fallOfWicket.OutgoingBatsmanInningsDetails;
    string += " " + details.Score + " (" + details.Balls + "b " + details.Fours + "x4 " + details.Sixes + "x6) SR: "+details.StrikeRate+" ";
    return string;
}