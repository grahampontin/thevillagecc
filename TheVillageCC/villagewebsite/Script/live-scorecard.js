$(function () {

    $('#analysisTabs').tab();

    var matchId = $.url().param('matchId');
    if (matchId === null || matchId === undefined) {
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

function drawTeamChart(chartType, matchData, divName) {
    $("#"+divName).html('');
    var paper = Raphael(divName, 700, 400);
    paper.setViewBox(0,0,700,400, true);
    paper.image("\\Images\\livescorecard\\vcc-logo-opaque.jpg", 100, 90, 500, 214);
    switch (chartType) {
        case "worm":
            drawTeamWorm(paper, matchData);
            break;
        case "wagon":
            drawWagonWheel(paper, matchData);
            break;
        case "manhattan":
            drawTeamManahttan(paper, matchData);
            break;
        case "partnerships":
            drawTeamPartnerships(paper, matchData);
            break;
    }

    var image = $("#"+divName+" image").detach();
    $("#"+divName+" svg").prepend(image);
    $("#"+divName+" svg").removeAttr("width");
    $("#"+divName+" svg").removeAttr("height");
}

function showError(text) {
    $("#errorModal .modal-body p").text(text);
    var errorModal = new bootstrap.Modal(document.getElementById('errorModal'), {});
    errorModal.show();
}

function addAttributesTo(playerIcon, player) {
    playerIcon.attr("playerName", player.BatsmanInningsDetails.Name);
    playerIcon.attr("playerScore", player.BatsmanInningsDetails.Score);
    playerIcon.attr("playerIsOut", player.Wicket != null);
    playerIcon.attr("playerId", player.Id);
}

function renderMatchData(matchData) {
    $(".opposition").text(matchData.Opposition);
    $("#oversRemaining").text(matchData.OversRemaining);
    
    $("#lastCompletedOver").text(matchData.OurLastCompletedOver);
    $("#teamScore").text(matchData.Score);
    $("#teamWickets").text(matchData.Wickets);
    $("#teamRunRate").text(matchData.OurInningsStatus === "NotStarted" ? "N/A" : matchData.RunRate);
    $("#oppositionScore").text(matchData.TheirScore);
    $("#oppositionWickets").text(matchData.TheirWickets);
    $("#oppositionLastCompletedOver").text(matchData.TheirOver);
    $("#oppositionRunRate").text(matchData.TheirInningsStatus === "NotStarted" ? "N/A" : matchData.TheirRunRate);
    $("#match-format").text(matchData.Declaration ? "Declaration" : matchData.Overs + " overs");
    $("#toss-winner").text(matchData.WonToss ? "The Village CC" : matchData.Opposition);
    $("#bat-or-bowl").text(matchData.TossWinnerBatted ? "bat" : "bowl");

    if (!matchData.IsMatchComplete) {
        $("#resultSummary").hide();
        $("#scoreSummary").show();
        $(".teamCurrentlyBatting").text(matchData.OurInningsStatus === "InProgress" ? "The Village" : matchData.Opposition);
        $(".teamCorrentlyBowling").text(matchData.TheirInningsStatus === "InProgress" ? "The Village" : matchData.Opposition);
        $(".leadOrTrail").text(matchData.IsFirstInnings ? "lead" : "trail");
        var leadTrailByRuns = getLeadTrailByRuns(matchData);
        $("#leadTrailByRuns").text(leadTrailByRuns);
        $("#wicketsRemaining").text(matchData.OurInningsStatus === "InProgress" ? 10 - matchData.Wickets : 10 - matchData.TheirWickets);

        var requiredRunRate = "N/A";
        if (!matchData.IsFirstInnings && !matchData.Declaration && !matchData.IsMatchComplete) {
            requiredRunRate = leadTrailByRuns / matchData.OversRemaining;
            requiredRunRate = Math.round(requiredRunRate * 100) / 100;
        }
        $("#requiredRunRate").text(requiredRunRate);

    } else {
        $("#resultSummary").show();
        $("#scoreSummary").hide();
        $("#resultSummaryText").text(matchData.ResultText);
    }
    
    


    if (matchData.OurInningsStatus === "NotStarted") {
        $("#ourScoreSummary").hide();
        $("#usYetToBat").show();
    } else {
        $("#ourScoreSummary").show();
        $("#usYetToBat").hide();
    }
    if (matchData.TheirInningsStatus === "NotStarted") {
        $("#oppositionScoreSummary").hide();
        $("#oppositionYetToBat").show();
    } else {
        $("#oppositionScoreSummary").show();
        $("#oppositionYetToBat").hide();
    }


    if (matchData.OurInningsStatus !== "NotStarted" && matchData.CompletedOvers.length > 0) {
        $("#live-batting-info").show();

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
        $("#bowlerOneThisSpell").text(spell.Overs + "-" + spell.Maidens + "-" + spell.Runs + "-" + spell.Wickets);

        //Bowler Two
        if (matchData.BowlerTwoDetails.Details === null) {
            $("#bowlerTwoRow").hide();
        } else {
            $("#bowlerTwoRow").show();

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
            $("#bowlerTwoThisSpell").text(spell.Overs + "-" + spell.Maidens + "-" + spell.Runs + "-" + spell.Wickets);

        }
        

        //Current partnership
        if (matchData.CurrentPartnership !== null) {
            $("#currentPartnershipRuns").text(matchData.CurrentPartnership.Score);
            $("#currentPartnershipRunRate").text(matchData.CurrentPartnership.RunRate);
            $("#currentPartnershipOvers").text(matchData.CurrentPartnership.OversAsString);
            $("#currentPartnershipPlayer1Name").text(matchData.CurrentPartnership.Player1Name);
            $("#currentPartnershipPlayer1Runs").text(matchData.CurrentPartnership.Player1Score);
            $("#currentPartnershipPlayer2Name").text(matchData.CurrentPartnership.Player2Name);
            $("#currentPartnershipPlayer2Runs").text(matchData.CurrentPartnership.Player2Score);
        }
        
        if (matchData.LastManOut != null) {
            $(".last-batsman").show();

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
        } else {
            $(".last-batsman").hide();
        }

        //Recent overs
        var ballsRendered = 0;
        $.each(matchData.CompletedOvers.reverse(), function(index, over) {
            if (ballsRendered >= 26) {
                return;
            }
            $.each(over.Over.Balls.sort((a,b)=>a.BallNaumber-b.BallNumber), function(ballIndex, ball) {
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
        $.each(matchData.CompletedOvers.reverse(), function(index, over) {
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
            $.each(over.Over.Balls.sort((a,b)=>a.BallNaumber-b.BallNumber), function(ballIndex, ballObj) {
                var ball = new Ball(ballObj.Amount,
                    ballObj.Thing,
                    ballObj.Batsman,
                    ballObj.BatsmanName,
                    ballObj.Bowler,
                    ballObj.Wicket);
                ball.angle = ballObj.Angle;

                var row = $("<div></div>");
                row.addClass("row ball-row");

                var ballNumber = $("<div></div>");
                ballNumber.addClass("col-sm-1");

                ballNumber.html("<strong>" + index + "." + actualBallNumber + "</strong>");

                var ballDescription = $("<div></div>");
                ballDescription.addClass("col-sm-11");
                ballDescription.html(ball.bowler + " to " + ball.batsmanName + ", " + ball.getBallDescription());
                row.append(ballNumber);
                row.append(ballDescription);

                if (ball.wicket !== null) {
                    var wicketRow = $("<div></div>");
                    wicketRow.addClass("row wicket-row");
                    var emptyColumn = $("<div></div>");
                    emptyColumn.addClass("col-sm-1");
                    wicketRow.append(emptyColumn);

                    var wicketDetails = $("<div></div>");
                    wicketDetails.addClass("col-sm-11");
                    wicketDetails.html("<strong>" + getDismissalText(ball.wicket, matchData.FallOfWickets) + "</strong>");
                    wicketRow.append(wicketDetails);

                    overBody.prepend(wicketRow);
                }
                overBody.prepend(row);
                if (!needsToBeReBowled(ball)) {
                    actualBallNumber++;
                }
            });
            overBody.prepend(overCommentary);
            overContainer.append(overBody);
            
            $("#overDetails").prepend(overContainer.clone());
            $("#accordian-over-details").prepend(overContainer.clone());
        });
        
        if (matchData.OurInningsStatus === 'Completed') {
            var endOfInningsContainer = $("<div></div>");
            endOfInningsContainer.addClass("panel panel-default");

            var header = $("<div></div>");
            header.addClass("panel-heading");
            header.html("<small><strong>End of Innings. </strong><strong>Village " + matchData.Score + "/" + matchData.Wickets + "</strong></small>");

            endOfInningsContainer.append(header);

            var body = $("<div></div>");
            body.addClass("panel-body");

            var commentary = $("<div></div>");
            commentary.addClass("over-comment");
            commentary.html(matchData.OurInningsCommentary);
            body.prepend(commentary);
            endOfInningsContainer.append(body);
            $("#overDetails").prepend(endOfInningsContainer.clone());
            $("#accordian-over-details").prepend(endOfInningsContainer.clone());

        }
        if (matchData.TheirCompletedOvers !== null) {
            $.each(matchData.TheirCompletedOvers.reverse(), function (index, over) {
                var overContainer = $("<div></div>");
                overContainer.addClass("panel panel-default");

                var overHeader = $("<div></div>");
                overHeader.addClass("panel-heading");
                overHeader.html("<small><strong>End of over " + over.Over + "</strong> <strong> " + matchData.Opposition + " " + over.Score + "/" + over.Wickets + "</strong></small>");

                overContainer.append(overHeader);

                var overBody = $("<div></div>");
                overBody.addClass("panel-body");

                var overCommentary = $("<div></div>");
                overCommentary.addClass("over-comment");
                overCommentary.html(over.Commentary);


                overBody.append(overCommentary);
                overContainer.append(overBody);

                $("#theirOverDetails").append(overContainer.clone());
                $("#accordian-oppo-commentary").append(overContainer.clone());
            });

        }
        
        if (matchData.TheirInningsStatus === 'Completed') {
            var endOfInningsContainer = $("<div></div>");
            endOfInningsContainer.addClass("panel panel-default");

            var header = $("<div></div>");
            header.addClass("panel-heading");
            header.html("<small><strong>End of Innings. </strong><strong>"+ matchData.Opposition + " " + matchData.TheirScore + "/" + matchData.TheirWickets + "</strong></small>");

            endOfInningsContainer.append(header);

            var body = $("<div></div>");
            body.addClass("panel-body");

            var commentary = $("<div></div>");
            commentary.addClass("over-comment");
            commentary.html(matchData.TheirInningsCommentary);
            body.prepend(commentary);
            endOfInningsContainer.append(body);
            $("#theirOverDetails").prepend(endOfInningsContainer.clone());
            $("#accordian-oppo-commentary").prepend(endOfInningsContainer.clone());
        }


        $.each(matchData.LiveBattingCard.Players, function (index, player) {
            var playerIcon = $("<div></div");
            var playerOption = $("<option></option>")
            playerIcon.addClass("rounded-circle player-icon float-start");
            if (index === "1"){
                playerIcon.addClass("player-icon-active");
                playerOption.attr("selected", "selected")
            }
            playerIcon.attr("playerId", player.BatsmanInningsDetails.PlayerId);
            playerOption.attr("playerId", player.BatsmanInningsDetails.PlayerId)

            var playerName = player.BatsmanInningsDetails.Name;
            playerOption.text(playerName);

            addAttributesTo(playerIcon, player);
            addAttributesTo(playerOption, player);


            var parts = playerName.split(' ');
            var shortName = "";
            $.each(parts, function (index, part) {
                shortName = shortName + part.charAt(0);
            });
            if (shortName.length > 3) {
                shortName = shortName.charAt(0) + shortName.charAt(1) + shortName.charAt(shortName.length - 1);
            }
            playerIcon.html(shortName);
            $('#player-icons').append(playerIcon);
            $('#mobile-player-analysis-select').append(playerOption);

        });
        let activePlayer = $(".player-icon-active");
        let chartToDraw = $("#chart-types button.active").attr("chartType");
        drawPlayerChart(activePlayer, matchData,  chartToDraw,  "player-analysis-chart");
        drawPlayerChart(activePlayer, matchData,  chartToDraw,  "player-analysis-chart-mobile");
        drawTeamChart("worm", matchData, "chartPlaceholder");
        drawTeamChart("worm", matchData, "accordian-chart-placeholder");

        $(".player-icon").click(function () {
            $("#chart-types").removeClass("hidden");
            var clickedPlayer = $(this);
            $('.player-icon').removeClass('player-icon-active');
            let playerOptions = $('#mobile-player-analysis-select option');
            playerOptions.removeAttr("selected");
            playerOptions.filter(function() {
                return $(this).attr('playerId')===clickedPlayer.attr('playerId');
            }).attr('selected', 'selected');
            clickedPlayer.addClass('player-icon-active');
            let chartButton = $("#chart-types button.active");
            drawPlayerChart(clickedPlayer, matchData,  chartButton.attr("chartType"),  "player-analysis-chart");
            drawPlayerChart(clickedPlayer, matchData,  chartButton.attr("chartType"),  "player-analysis-chart-mobile");
        });
        $('#mobile-player-analysis-select').change(function (){
            var clickedPlayer = $('#mobile-player-analysis-select :selected');
            $('.player-icon').removeClass('player-icon-active');
            $('.player-icon').filter(function() {
                return $(this).attr('playerId')===clickedPlayer.attr('playerId');
            }).addClass('player-icon-active');
            let chartButton = $("#player-chart-types-mobile button.active");
            drawPlayerChart(clickedPlayer, matchData,  chartButton.attr("chartType"),  "player-analysis-chart-mobile");
            drawPlayerChart(clickedPlayer, matchData,  chartButton.attr("chartType"),  "player-analysis-chart");
        });
        
    } else {
        $("#live-batting-info").hide();
    }    

    $("#chart-types button").click(function() {
        let chartType = $("#chart-types button.active").attr("chartType");
        let clickedPlayer1 = $(".player-icon-active");
        drawPlayerChart(clickedPlayer1, matchData,  chartType,  "player-analysis-chart");
        drawPlayerChart(clickedPlayer1, matchData,  chartType,  "player-analysis-chart-mobile");
    });
    $("#player-chart-types-mobile button").click(function() {
        let chartType = $("#player-chart-types-mobile button.active").attr("chartType");
        let clickedPlayer1 = $('#mobile-player-analysis-select :selected');
        drawPlayerChart(clickedPlayer1, matchData,  chartType,  "player-analysis-chart");
        drawPlayerChart(clickedPlayer1, matchData,  chartType,  "player-analysis-chart-mobile");
    });

    $('#analysisTabs button').on('shown.bs.tab', function (e) {
        var chart = $(e.target).attr("data-bs-target").replace('#', '');      
        drawTeamChart(chart, matchData, "chartPlaceholder");
        drawTeamChart(chart, matchData, "accordian-chart-placeholder");
    });
    
    $('#accordian-analysis-tabs button').on('shown.bs.tab', function (e) {
        var chart = $(e.target).attr("data-bs-target").replace('#', '');
        drawTeamChart(chart, matchData, "chartPlaceholder");
        drawTeamChart(chart, matchData, "accordian-chart-placeholder");
    });


    renderLiveBattingScoreCard(matchData, $("#inPlayScorecard"));
    renderLiveBattingScoreCard(matchData, $("#mobile-view-in-play-batting-scorecard"));
    renderLiveBowlingScoreCard(matchData, $("#inPlayBowlingScorecard"));
    renderLiveBowlingScoreCard(matchData, $("#mobile-view-in-play-bowling-scorecard"));

}

function renderLiveBowlingScoreCard(matchData, table) {
    //Scorecard
    let header = $("<thead></thead>");
    let headerRow = $("<tr></tr>");
    headerRow.append($("<th></th>"));
    headerRow.append($("<th>O</th>"));
    headerRow.append($("<th>M</th>"));
    headerRow.append($("<th>R</th>"));
    headerRow.append($("<th>W</th>"));
    headerRow.append($("<th>Econ</th>"));
    header.append(headerRow)
    
    let body = $("<tbody></tbody>");
    
    $.each(matchData.LiveBowlingCard, function(index, bowler) {
        var details = bowler.Details;
        var name = bowler.Name;

        var row = $("<tr></tr>");

        var nameCell = $("<td></td>");
        nameCell.text(name);
        row.append(nameCell);

        var oversCell = $("<td></td>");
        oversCell.text(details.Overs);
        row.append(oversCell);

        var maidensCell = $("<td></td>");
        maidensCell.text(details.Maidens);
        row.append(maidensCell);

        var runsCell = $("<td></td>");
        runsCell.text(details.Runs);
        row.append(runsCell);

        var wicketsCell = $("<td></td>");
        wicketsCell.text(details.Wickets);
        row.append(wicketsCell);

        var econCell = $("<td></td>");
        econCell.text(details.Economy);
        row.append(econCell);


        body.append(row);


    });
    table.append(header);
    table.append(body);
    
}

function showOnlyOnLargerScreens(dismissalPart1) {
    dismissalPart1.addClass("d-none");
    dismissalPart1.addClass("d-md-table-cell");
}

function renderLiveBattingScoreCard(matchData, table) {
    //Scorecard
    
    var thead = $("<thead></thead>")
    var tbody = $("<tbody></tbody>")
    var tfoot = $("<tfoot></tfoot>")
    
    var header = $("<tr></tr>");
    let nameHeaderLargeScreens = $("<th></th>");
    showOnlyOnLargerScreens(nameHeaderLargeScreens)
    header.append(nameHeaderLargeScreens);

    let nameHeaderSmallScreens = $("<th></th>");
    nameHeaderSmallScreens.addClass("d-md-none");
    header.append(nameHeaderSmallScreens);

    let dismissalPart1 = $("<th></th>");
    showOnlyOnLargerScreens(dismissalPart1);
    header.append(dismissalPart1);

    let dismissalPart2 = $("<th></th>");
    showOnlyOnLargerScreens(dismissalPart2);
    header.append(dismissalPart2);

    let runsHeader = $("<th>Runs</th>");
    header.append(runsHeader);

    let ballsHeader = $("<th>Balls</th>");
    header.append(ballsHeader);

    let dotsHeader = $("<th>Dots</th>");
    showOnlyOnLargerScreens(dotsHeader);
    header.append(dotsHeader);

    let foursHeader = $("<th>4s</th>");
    header.append(foursHeader);

    let sixesHeader = $("<th>6s</th>");
    header.append(sixesHeader);

    let srHeader = $("<th>SR</th>");
    showOnlyOnLargerScreens(srHeader);
    header.append(srHeader);

    thead.append(header);
    
    $.each(matchData.LiveBattingCard.Players, function (index, player) {
        
        var row = $("<tr></tr>");

        var name = $("<td></td>");
        name.text(player.BatsmanInningsDetails.Name);
        showOnlyOnLargerScreens(name);
        row.append(name);

        var nameAndDismissal = $("<td></td>");
        nameAndDismissal.addClass("d-md-none");
        let nameDiv = $("<div></div>");
        nameDiv.addClass("fst-italic");
        nameDiv.text(player.BatsmanInningsDetails.Name);
        let dismissalDiv = $("<div></div>");
        let smallDismissalText = $("<small></small>")
        dismissalDiv.append(smallDismissalText);
        
        
        var dismissal1 = $("<td></td>");
        showOnlyOnLargerScreens(dismissal1);
        var dismissal2 = $("<td></td>");
        showOnlyOnLargerScreens(dismissal2);
        var wicket = player.Wicket;
        if (wicket === null) {
            dismissalDiv.text("not out");
            dismissal1.text("not");
            dismissal2.text("out");
        } else {
            dismissal2.text("");
            dismissal1.text("");
            setDismissalText(dismissal1, dismissal2, wicket);
            smallDismissalText.text(dismissal1.text() + " " + dismissal2.text());

        }
        nameAndDismissal.append(nameDiv)
        nameAndDismissal.append(dismissalDiv)
        row.append(nameAndDismissal);

        row.append(dismissal1);
        row.append(dismissal2);

        var runs = $("<td></td>");
        runs.text(player.BatsmanInningsDetails.Score);
        row.append(runs);

        var balls = $("<td></td>");
        balls.text(player.BatsmanInningsDetails.Balls);
        row.append(balls);

        var dots = $("<td></td>");
        dots.text(player.BatsmanInningsDetails.Dots);
        showOnlyOnLargerScreens(dots);
        row.append(dots);

        var fours = $("<td></td>");
        fours.text(player.BatsmanInningsDetails.Fours);
        row.append(fours);

        var sixes = $("<td></td>");
        sixes.text(player.BatsmanInningsDetails.Sixes);
        row.append(sixes);


        var strikeRate = $("<td></td>");
        strikeRate.text(player.BatsmanInningsDetails.StrikeRate);
        showOnlyOnLargerScreens(strikeRate);
        row.append(strikeRate);

       tbody.append(row);
    });

    var extrasRow = $("<tr></tr>");
    let blank1 = $("<td></td>");
    showOnlyOnLargerScreens(blank1);
    extrasRow.append(blank1);
    let blank2 = $("<td></td>");
    showOnlyOnLargerScreens(blank2);
    extrasRow.append(blank2);
    var extrasTitle = $("<td>Extras</td>");
    extrasRow.append(extrasTitle);
    var extrasTotal = $("<td></td>");
    extrasTotal.text(matchData.LiveBattingCard.Extras.Total);
    extrasRow.append(extrasTotal);
    var extrasDetails = $("<td colspan=5></td>");
    showOnlyOnLargerScreens(extrasDetails);
    extrasDetails.text("(" + matchData.LiveBattingCard.Extras.DetailString + ")");
    extrasRow.append(extrasDetails);

    var extrasBlankSpace = $("<td colspan=3></td>");
    extrasBlankSpace.addClass("d-md-none");
    extrasRow.append(extrasBlankSpace);
    

    tfoot.append(extrasRow);

    var totalRow = $("<tr></tr>");
    let blank3 = $("<td></td>");
    showOnlyOnLargerScreens(blank3);
    totalRow.append(blank3);
    let blank4 = $("<td></td>");
    showOnlyOnLargerScreens(blank4);
    totalRow.append(blank4);
    var totalTitle = $("<td><strong>Total</strong></td>");
    totalRow.append(totalTitle);
    var scoreTotal = $("<td></td>");
    var scoreTotalText = $("<strong></strong>");
    scoreTotalText.text(matchData.Score);
    scoreTotal.append(scoreTotalText);
    showOnlyOnLargerScreens(scoreTotal);
    totalRow.append(scoreTotal);
    var scoreDetails = $("<td colspan=5></td>");
    showOnlyOnLargerScreens(scoreDetails);
    scoreDetails.text("for " + matchData.Wickets + " wickets");
    totalRow.append(scoreDetails);

    var smallScoreDetails = $("<td colspan=4></td>");
    smallScoreDetails.addClass("d-md-none fw-bold");
    smallScoreDetails.text(matchData.Score + " for " + matchData.Wickets);
    totalRow.append(smallScoreDetails);

    tfoot.append(totalRow);
    
    table.append(thead);
    table.append(tbody);
    table.append(tfoot);
}


function setDismissalText(dismissal1, dismissal2, wicket) {
    if (wicket.IsCaught || wicket.IsBowled) {
        dismissal2.text("b. " + wicket.Bowler);
    }
    if (wicket.IsLbw) {
        dismissal2.text("lbw b. " + wicket.Bowler);
    }
    if (wicket.IsCaughtAndBowled) {
        dismissal2.text("c&b " + wicket.Bowler);
    }
    if (wicket.IsCaught) {
        dismissal1.text("ct. " + wicket.Fielder);
    }
    if (wicket.IsRunOut) {
        dismissal1.text("run out (" + wicket.Fielder + ")");
    }
    if (wicket.IsStumped) {
        dismissal1.text("stumped (" + wicket.Fielder + ")");
    }
    if (wicket.IsHitWicket) {
        dismissal1.text("hit wicket");
    }
    if (wicket.IsRetired) {
        dismissal1.text("retired");
    }
    if (wicket.IsRetiredHurt) {
        dismissal1.text("retired hurt");
    }
}

function getLeadTrailByRuns(matchData) {
    if (matchData.IsFirstInnings) {
        if (matchData.OurInningsStatus === "InProgress") {
            return matchData.Score;
        } else {
            return matchData.TheirScore;
        }
    } else {
        if (matchData.OurInningsStatus === "InProgress") {
            return matchData.TheirScore - matchData.Score;
        } else {
            return matchData.Score - matchData.TheirScore;
        }
    }
}

function drawPlayerChart(clickedPlayer, matchData, chartToDraw, divId) {
    let divName = divId;
     
    $("#"+divName).html('');
    var paper = Raphael(divName, 700, 400);
    paper.setViewBox(0,0,700,400, true);
    paper.image("\\Images\\livescorecard\\vcc-logo-opaque.jpg", 100, 90, 500, 214);

    switch (chartToDraw) {
        case "wagon":
            drawWagonWheel(paper, matchData, clickedPlayer);
            break;
        case "zones":
            drawZones(clickedPlayer, paper, matchData.CompletedOvers);
            break;
        case "worm":
            drawPlayerWorm(clickedPlayer, paper, matchData.CompletedOvers);
            break;
    }

    let svgElement = $("#"+divName+" svg");
    svgElement.removeAttr("width");
    svgElement.removeAttr("height");
    
}


function drawPlayerWorm(player, paper, overs) {
    var colour1 = '#009933';
    var colour2 = '#ffd633';

    var xValues = [];
    var scoreValues = [];
    var strikeRateValues = [];

    var cumulativeScore = 0;
    var ballNumber = 0;
    $.each(overs, function (index, over) {
        $.each(over.Over.Balls, function (index, ball) {
            if (ball.Batsman.toString() === player.attr("playerId") && (ball.Thing === "" || (ball.Thing === "nb" && ball.Amount > 1))) {
                ballNumber++;
                cumulativeScore = cumulativeScore + ball.Amount;
                xValues.push(ballNumber);
                scoreValues.push(cumulativeScore);
                strikeRateValues.push((cumulativeScore / ballNumber) * 100);
            }
        });
    });

    if (xValues.length === 0) {
        return;
    }

    var maxStrikeRate = maxValue(strikeRateValues);
    $.each(strikeRateValues, function (index, value) {
        strikeRateValues[index] = (value / maxStrikeRate) * cumulativeScore;
    });

    drawPlayerNameAndScore(player, paper);
    var r = paper;

    var x = 10,
        y = 10,
        xlen = paper.width - 50,
        ylen = paper.height - 40,
        gutter = 40,
        xdata = xValues;
    var chrt = r.linechart(x, y, xlen, ylen, xdata, [scoreValues, strikeRateValues], {
        gutter: gutter,
        nostroke: false,
        axis: "0 0 0 1",
        symbol: "",
        smooth: false,
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
        xdata.length / 6, // number of steps 
        0, null, // the labels
        r // you need to provide the Raphael object
    );
    Raphael.g.axis(
        paper.width - gutter - 40, // 10 + gutter
        y + ylen - gutter, //y pos
        paper.height - gutter - 80, 0, maxStrikeRate, // used to pass the initial value and last value (number) if no labels are provided
        null, // number of steps 
        3, null, // the labels
        r // you need to provide the Raphael object
    );

    let keyYPosition = paper.height-20;
    paper.text(40, keyYPosition, 'Score').attr({ 'font-size': 12 });
    paper.path('M70 '+keyYPosition+'L110 '+keyYPosition).attr({ stroke: colour1, 'stroke-width': 4 });
    paper.text(160, keyYPosition, 'Strike Rate').attr({ 'font-size': 12 });
    paper.path('M200 '+keyYPosition+'L240 '+keyYPosition).attr({ stroke: colour2, 'stroke-width': 4 });

    paper.text(paper.width/2, y+ylen-gutter+30, 'Balls Faced').attr({ 'font-size': 18 });
    paper.text(10, paper.height/2, 'Score').attr({ 'font-size': 18 }).rotate(-90, true);
    paper.text(paper.width - 30, paper.height/2, 'Strike Rate').attr({ 'font-size': 18 }).rotate(90, true);

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


function needsToBeReBowled(ball) {
    return !ball.isLegalDelivery();
}

function getScoreString(score) {
    if (score === 0)
        return "maiden";
    else {
        var runOrRuns = score === 1 ? " run" : " runs";
        return score + runOrRuns;
    }
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
    if (fallOfWicket !== undefined) {
        var details = fallOfWicket.OutgoingBatsmanInningsDetails;
        string += " " + details.Score + " (" + details.Balls + "b " + details.Fours + "x4 " + details.Sixes + "x6) SR: " + details.StrikeRate + " ";
    }
    return string;
}