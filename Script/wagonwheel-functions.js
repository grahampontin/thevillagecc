function findNewPoint(x, y, angle, distance) {
    var result = {};

    result.x = Math.round(Math.cos(angle - (Math.PI / 2)) * distance + x);
    result.y = Math.round(Math.sin(angle - (Math.PI / 2)) * distance + y);

    return result;
}

function getDistance(scoreForBall, angleRadians) {
    var scale = 34;
    if (scoreForBall === 6) {
        scale = 24;
    }
    var distance = scoreForBall * scale;
    if (angleRadians <= (Math.PI / 2)) {
        distance = distance - (scoreForBall * 5) * (((Math.PI / 2) - (angleRadians)) / (Math.PI / 2));
    }
    if (angleRadians > (Math.PI / 2) && angleRadians <= (Math.PI)) {
        distance = distance + (scoreForBall * 5) * ((angleRadians - (Math.PI / 2)) / (Math.PI / 2));
    }
    if (angleRadians > (Math.PI) && angleRadians <= (Math.PI * 1.5)) {
        distance = distance + (scoreForBall * 5) * (((Math.PI * 1.5) - angleRadians) / (Math.PI / 2));
    }
    if (angleRadians > (Math.PI*1.5) && angleRadians <= (Math.PI * 2)) {
        distance = distance - (scoreForBall * 5) * ((angleRadians - (Math.PI * 1.5)) / (Math.PI / 2));
    }
    
    return distance;
}

function getColour(score) {
    if (score < 4) {
        return '#ff0';
    }
    if (score < 6) {
        return '#00f';
    }
    return '#f00';
}
