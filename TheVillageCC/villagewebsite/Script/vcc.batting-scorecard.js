function renderLiveBattingScoreCard(matchData, table) {
    if (matchData.LiveBattingCard === null){
        return;
    }
    //Scorecard
    var {thead, tbody, tfoot} = setupBattingScoreCardTable();

    $.each(matchData.LiveBattingCard.Players, function (index, player) {

        var batsmanName = player.BatsmanInningsDetails.Name;
        var wicket = player.Wicket;
        var batsmanStrikeRate = player.BatsmanInningsDetails.StrikeRate;
        var ballsFaced = player.BatsmanInningsDetails.Balls;
        var foursHit = player.BatsmanInningsDetails.Fours;
        var dotsPlayed = player.BatsmanInningsDetails.Dots;
        var sixesHit = player.BatsmanInningsDetails.Sixes;
        var score = player.BatsmanInningsDetails.Score;

        addBatsmanRowToBattingScoreCard(batsmanName, wicket, score, ballsFaced, dotsPlayed, foursHit, sixesHit, batsmanStrikeRate, tbody);
    });

    var totalExtras = matchData.LiveBattingCard.Extras.Total;
    var extrasDetail = matchData.LiveBattingCard.Extras.DetailString;
    var matchScore = matchData.Score;
    var matchWickets = matchData.Wickets;

    addBattingScoreCardFoooter(totalExtras, extrasDetail, tfoot, matchScore, matchWickets, table, thead, tbody);
}

function addBattingScoreCardFoooter(totalExtras, extrasDetail, tfoot, matchScore, matchWickets, table, thead, tbody) {
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
    extrasTotal.text(totalExtras);
    extrasRow.append(extrasTotal);
    var extrasDetails = $("<td colspan=5></td>");
    showOnlyOnLargerScreens(extrasDetails);

    extrasDetails.text("(" + extrasDetail + ")");
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
    scoreTotalText.text(matchScore);
    scoreTotal.append(scoreTotalText);
    showOnlyOnLargerScreens(scoreTotal);
    totalRow.append(scoreTotal);
    var scoreDetails = $("<td colspan=5></td>");
    showOnlyOnLargerScreens(scoreDetails);
    scoreDetails.text("for " + matchWickets + " wickets");
    totalRow.append(scoreDetails);

    var smallScoreDetails = $("<td colspan=4></td>");
    smallScoreDetails.addClass("d-md-none fw-bold");
    smallScoreDetails.text(matchScore + " for " + matchWickets);
    totalRow.append(smallScoreDetails);

    tfoot.append(totalRow);

    table.append(thead);
    table.append(tbody);
    table.append(tfoot);
}

function addBatsmanRowToBattingScoreCard(batsmanName, wicket, score, ballsFaced, dotsPlayed, foursHit, sixesHit, batsmanStrikeRate, tbody) {
    var row = $("<tr></tr>");
    var name = $("<td></td>");
    name.text(batsmanName);
    showOnlyOnLargerScreens(name);
    row.append(name);

    var nameAndDismissal = $("<td></td>");
    nameAndDismissal.addClass("d-md-none");
    let nameDiv = $("<div></div>");
    nameDiv.addClass("fst-italic");
    nameDiv.text(batsmanName);
    let dismissalDiv = $("<div></div>");
    let smallDismissalText = $("<small></small>")
    dismissalDiv.append(smallDismissalText);


    var dismissal1 = $("<td></td>");
    showOnlyOnLargerScreens(dismissal1);
    var dismissal2 = $("<td></td>");
    showOnlyOnLargerScreens(dismissal2);
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
    runs.text(score);
    row.append(runs);

    var balls = $("<td></td>");
    balls.text(ballsFaced);
    row.append(balls);

    var dots = $("<td></td>");
    dots.text(dotsPlayed);
    showOnlyOnLargerScreens(dots);
    row.append(dots);

    var fours = $("<td></td>");
    fours.text(foursHit);
    row.append(fours);

    var sixes = $("<td></td>");
    sixes.text(sixesHit);
    row.append(sixes);


    var strikeRate = $("<td></td>");
    strikeRate.text(batsmanStrikeRate);
    showOnlyOnLargerScreens(strikeRate);
    row.append(strikeRate);

    tbody.append(row);
}

function setupBattingScoreCardTable() {
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
    return {thead, tbody, tfoot};
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



