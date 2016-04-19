function drawTeamWorm(paper, matchData) {
    var colour1 = '#009933';
    var colour2 = '#ffd633';

    var xBallNumber = [];
    var yOurScoreValues = [];
    var yThierScoreValues = [];

    var cumulativeScore = 0;
    var ballNumber = 0;
    $.each(matchData.CompletedOvers, function (index, over) {
        $.each(over.Over.Balls, function (index, ball) {
            xBallNumber.push(ballNumber);
            ballNumber++;
            cumulativeScore = cumulativeScore + ball.Amount;
            yOurScoreValues.push(cumulativeScore);
        });
    });

    var theirRawData = [];
    var maxBallNumber;
    $.each(matchData.TheirCompletedOvers, function (index, over) {
        var ballNumber = over.Over * 6;
        theirRawData.push([ballNumber, over.Score]);
        maxBallNumber = ballNumber;
    });

    var beginSegmentAtBall = 0;
    var segmentNumber = 0;
    var endSegmantAtBall = theirRawData[0][0];
    var scoreAtEndOfSegment = theirRawData[0][1];
    var ourMaxBallNumber = xBallNumber.length;
    cumulativeScore = 0;
    for (var i = 0; i <= maxBallNumber; i++) {
        var scoreForThisBall = scoreAtEndOfSegment/(endSegmantAtBall-beginSegmentAtBall);
        cumulativeScore = cumulativeScore + scoreForThisBall;
        yThierScoreValues.push(cumulativeScore);
        if (i === endSegmantAtBall && i!==maxBallNumber) {
            segmentNumber++;
            beginSegmentAtBall = i + 1;
            endSegmantAtBall = theirRawData[segmentNumber][0];
            scoreAtEndOfSegment = theirRawData[segmentNumber][1];
        }
        if (i > ourMaxBallNumber) {
            xBallNumber.push(i);
        }
    }


    if (xBallNumber.length === 0) {
        return;
    }

    var r = paper;

    var x = 10,
        y = 10,
        xlen = paper.width - 30,
        ylen = paper.height - 40,
        gutter = 20,
        xdata = xBallNumber;
    var chrt = r.linechart(x, y, xlen, ylen, xdata, [yOurScoreValues, yThierScoreValues], {
        gutter: gutter,
        nostroke: false,
        axis: "0 1 0 0",
        symbol: "",
        smooth: false,
        colors: [
                    colour1, colour2
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

    var yPos = paper.height - 15;
    paper.text(40, yPos, 'Village CC').attr({ 'font-size': 12 });
    paper.path('M80 ' + yPos + 'L130 ' + yPos).attr({ stroke: colour1, 'stroke-width': 4 });
    paper.text(180, yPos, matchData.Opposition).attr({ 'font-size': 12 });
    paper.path('M210 '+yPos+'L260 ' + yPos).attr({ stroke: colour2, 'stroke-width': 4 });

}

function drawTeamWagonWheel(paper, matchData) {
    var image = drawWagonWheelBackground(paper);
    drawWagonWheelKey(paper);
    $.each(matchData.CompletedOvers, function (index, over) {
        $.each(over.Over.Balls, function (index, ball) {
            if (ball.Thing === "" || (ball.Thing === "nb" && ball.Amount > 1)) {
                drawBall(ball, paper, image);
            }
        });
    });
}

function drawBall(ball, paper, image) {
    var stumpsX = Math.round(paper.width * 0.5);
    var stumpsY = Math.round((paper.height - 30) * .4 + 30);
    var batsmansScoreForBall = ball.Amount;
    if (ball.Thing === "nb") {
        batsmansScoreForBall = batsmansScoreForBall - 1;
    }
    var result = findNewPoint(stumpsX, stumpsY, ball.Angle, getDistance(batsmansScoreForBall, ball.Angle, image.attrs.width/2));
    paper.path("M" + stumpsX + " " + stumpsY + "L" + result.x + " " + result.y).attr({ stroke: getColour(batsmansScoreForBall), 'stroke-width': 2 });
}

function drawWagonWheelBackground(paper) {
    var widthOfWheel = paper.height-30;
    var image = paper.image("\\MobileWeb\\images\\wagon-wheel-new.jpg", (paper.width/2)-(widthOfWheel/2), 30, widthOfWheel, widthOfWheel);
    paper.text(image.attrs.x + (image.attrs.width * (1 / 4)), image.attrs.height / 2 + image.attrs.y, 'Off\nSide').attr({ fill: '#fff', 'font-size': 20 });
    paper.text(image.attrs.x + (image.attrs.width * (3 / 4)), image.attrs.height / 2 + image.attrs.y, 'Leg\nSide').attr({ fill: '#fff', 'font-size': 20 });
    paper.text(350, 15, 'Village CC Batting').attr({ fill: '#000', 'font-size': 20 });;
    return image;
}

function drawWagonWheelKey(paper) {
    var yPos = paper.height/2 - 30;
    paper.text(20, yPos, 'Runs').attr({ 'font-size': 16 });
    paper.path(getKeyPath(yPos)).attr({ stroke: '#ff0', 'stroke-width': 8 });
    yPos = paper.height /2;
    paper.text(20, yPos, 'Fours').attr({ 'font-size': 16 });
    paper.path(getKeyPath(yPos)).attr({ stroke: '#00f', 'stroke-width': 8 });
    yPos = paper.height / 2 + 30;
    paper.text(20, yPos, 'Sixes').attr({ 'font-size': 16 });
    paper.path(getKeyPath(yPos)).attr({ stroke: '#f00', 'stroke-width': 8 });
}

function getKeyPath(yPos) {
    return 'M60 ' + yPos + 'L120 ' + yPos;
}


function drawTeamManahttan(paper, matchData) {
    var overScores = [];
    var overNumbers = [];

    var overNumber = 0;
    $.each(matchData.CompletedOvers, function (index, over) {
        overScores.push(over.ScoreForThisOver);
        overNumber++;
        overNumbers.push(overNumber);
    });
    var x = 10;
    var y = 10;
    var xlen = paper.width - 20;
    var ylen = paper.height - 20;
    var gutter = 20;
    var bc = paper.barchart(x+gutter, y, xlen, ylen, [overScores], {
        stacked: false,
        type: "soft",
        axis: "1 1 0 0"
    });
    
    var axis = Raphael.g.axis(
        x + gutter, // 10 + gutter
        y + ylen - gutter, //y pos
        ylen - 2 * gutter, 0,maxValue(overScores), // used to pass the initial value and last value (number) if no labels are provided
        null, // number of steps 
        1, null, // the labels
        paper // you need to provide the Raphael object
    );

    

    for (var i = 0; i < axis.text.items.length; i++) {
        var colour = '#EEE';
        if (i === 0) {
            colour = '#000';
        }
        paper.path(['M', x+gutter, axis.text.items[i].attrs.y, 'H', xlen + x]).attr({
            stroke: colour
        }).toBack();
    }

    labelBarChart(paper, bc, overNumbers, {});
}

function labelBarChart(r, bc, labels, attrs) {
    // Label a bar chart bc that is part of a Raphael object r
    // Labels is an array of strings. Attrs is a dictionary
    // that provides attributes such as fill (text color)
    // and font (text font, font-size, font-weight, etc) for the
    // label text.

    for (var i = 0; i < bc.bars[0].length; i++) {
        var bar = bc.bars[0][i];
        var gutter_y = bar.w * 0.4;
        var label_x = bar.x;
        var label_y = bar.y + bar.h + 10;
        var label_text = labels[i];
        var label_attr = { fill: "#2f69bf", font: "16px sans-serif" };

        r.text(label_x, label_y, label_text).attr(label_attr);
    }

}

function drawTeamPartnerships(paper, matchData) {
    var scorePairs = [];
    $.each(matchData.Partnerships, function(index, partnership) {
        var pair = [];
        pair.push({
            value: partnership.Player1Score,
            label: partnership.Player1Name
        });
        pair.push({
            value: partnership.Player2Score,
            label: partnership.Player2Name
        });
        scorePairs.push(pair);
    });

    partnershipChart(paper.width, paper.height, scorePairs, paper);
}

function partnershipChart(width, height, scorePairs, paper) {
    var numberOfPairs = scorePairs.length;
    var barHeight = (height / numberOfPairs) - (height/10);
    var highScore = highestScore(scorePairs);

    var yPos = 0;
    var center = paper.width / 2;

    $.each(scorePairs, function(index, pair) {
        var leftScore = pair[0].value;
        var rightScore = pair[1].value;

        //left
        var size = barSize(leftScore, highScore, width);
        var leftRect = paper.rect(center - size, yPos, size, barHeight).attr({ stroke: 'none', fill: Raphael.g.colors[0], 'fill-opacity': 100 });
        paper.text(center - (width/2) + 20, leftRect.attrs.y + (leftRect.attrs.height / 2), pair[0].label + ' (' + pair[0].value + ')').attr({ 'text-anchor': 'start', 'font-size': '14pt' });
        //right
        var rightRect = paper.rect(center, yPos, barSize(rightScore, highScore, width), barHeight).attr({ stroke: 'none', fill: Raphael.g.colors[1], 'fill-opacity': 100 });
        paper.text(center + (width / 2) - 20, rightRect.attrs.y + (rightRect.attrs.height / 2), pair[1].label + ' (' + pair[1].value + ')').attr({ 'text-anchor': 'end', 'font-size': '14pt' });

    });
}

function barSize(score, highScore, width) {
    return ((score / highScore) * (width / 2));

}

function highestScore(pairs) {
    var max = 0;
    $.each(pairs, function (index, pair) {
        $.each(pair, function(i, entry) {
            if (entry.value > max) {
                max = entry.value;
            }
        });
    });
    return max;
}

