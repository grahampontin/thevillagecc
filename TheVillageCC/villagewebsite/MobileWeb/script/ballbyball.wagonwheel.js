var wagonWheelImage;
var wagonWheelPaper;

function getColour(score) {
    if (score < 4) {
        return "#ff0";
    }
    if (score < 6) {
        return "#fff";
    }
    return "#f00";
}

function initializeWagonWheel() {
    if (wagonWheelPaper == null) {
        wagonWheelPaper = Raphael("wagonWheelCanvas", 300, 296);
        wagonWheelImage = wagonWheelPaper.image("\\MobileWeb\\images\\wagon-wheel-new.jpg", 0, 0, 300, 296);
        wagonWheelPaper.text(60, 150, "Off\nSide").attr({ fill: "#fff", 'font-size': 20 });
        wagonWheelPaper.text(240, 150, "Leg\nSide").attr({ fill: "#fff", 'font-size': 20 });
        setupWagonWheel();
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
    var x = e.touches[0].pageX - $(document).scrollLeft() - $("#wagonWheelCanvas").offset().left;
    var y = e.touches[0].pageY - $("#wagonWheelCanvas").offset().top;
    var angleRadians = angleBetweenTwoPointsWithFixedPoint(x, y, 150, 0, 150, 125);
    var result = findNewPoint(150, 125, angleRadians, getDistance(scoreForBall, angleRadians));
    return "M150 125L" + result.x + " " + result.y;
}

function getDistance(scoreForBall, angleRadians) {
    var distance = scoreForBall * 35;
    if (angleRadians > (Math.PI / 2) && angleRadians <= (Math.PI)) {
        distance = distance + (scoreForBall * 10) * ((angleRadians - (Math.PI / 2)) / (Math.PI / 2));
    }
    if (angleRadians > (Math.PI) && angleRadians <= (Math.PI * 1.5)) {
        distance = distance + (scoreForBall * 10) * (((Math.PI * 1.5) - angleRadians) / (Math.PI / 2));
    }
    return distance;
}

function angleBetweenTwoPointsWithFixedPoint(point1X, point1Y, point2X, point2Y, fixedX, fixedY) {

    var angle1 = Math.atan2(point1Y - fixedY, point1X - fixedX);
    var angle2 = Math.atan2(point2Y - fixedY, point2X - fixedX);
    var result = angle1 - angle2;
    if (result < 0) {
        result = (2 * Math.PI) + result;
    }
    return result;
}

function findNewPoint(x, y, angle, distance) {
    var result = {};

    result.x = Math.round(Math.cos(angle - (Math.PI / 2)) * distance + x);
    result.y = Math.round(Math.sin(angle - (Math.PI / 2)) * distance + y);

    return result;
}

function setupWagonWheel() {
    $("#wagonWheel").on("popupafteropen",
        function() {
            $("#wagonWheelSaveButton").button();
            $("#wagonWheelSaveButton").button("disable");


            wagonWheelImage.touchstart(function(e) {
                if (line != null) {
                    line.remove();
                }
                var lastBall = matchState.Over.balls[matchState.Over.balls.length - 1];
                var batsmansScoreForBall = lastBall.amount;
                if (lastBall.thing === "nb") {
                    batsmansScoreForBall = batsmansScoreForBall - 1;
                }
                line = wagonWheelPaper.path(buildPath(e, batsmansScoreForBall))
                    .attr({ stroke: getColour(batsmansScoreForBall), 'stroke-width': 3 });
                var x = e.touches[0].pageX - $(document).scrollLeft() - $("#wagonWheelCanvas").offset().left;
                var y = e.touches[0].pageY - $("#wagonWheelCanvas").offset().top;
                var angleRadians = angleBetweenTwoPointsWithFixedPoint(x, y, 150, 0, 150, 125);
                lastBall.angle = (Math.round(angleRadians * 10000) / 10000);
                $("#wagonWheelSaveButton").text(batsmansScoreForBall + " to " + getScoringArea(angleRadians));
                e.preventDefault();
            });

            wagonWheelImage.touchend(function() {
                $("#wagonWheelSaveButton").button("enable");
                return true;
            });
            wagonWheelImage.touchmove(function(e) {
                var x = e.touches[0].pageX - $(document).scrollLeft() - $("#wagonWheelCanvas").offset().left;
                var y = e.touches[0].pageY - $("#wagonWheelCanvas").offset().top;
                var angleRadians = angleBetweenTwoPointsWithFixedPoint(x, y, 150, 0, 150, 125);
                var lastBall = matchState.Over.balls[matchState.Over.balls.length - 1];
                lastBall.angle = (Math.round(angleRadians * 10000) / 10000);
                var batsmansScoreForBall = lastBall.amount;
                if (lastBall.thing === "nb") {
                    batsmansScoreForBall = batsmansScoreForBall - 1;
                }

                line.attr({ path: buildPath(e, batsmansScoreForBall) });
                $("#wagonWheelSaveButton").text(batsmansScoreForBall + " to " + getScoringArea(angleRadians));
                e.preventDefault();
                e.stopPropagation();
                return true;
            });
        });
}