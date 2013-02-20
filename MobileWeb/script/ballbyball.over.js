function Over() {
    this.balls = new Array();
    this.toPrettyString = toPrettyString;
    this.totalScore = totalScore;
    this.wickets = wickets;
    this.toHtml = toHtml;
}

function toPrettyString() {
    var output = "";
    for (i = 0; i < this.balls.length; i++) {
        var ball = this.balls[i];
        output += this.balls[i].toBallString() + " ";
    }
    return output;
}

function totalScore() {
    var score = parseInt(0);
    for (i = 0; i < this.balls.length; i++) {
        var ball = this.balls[i];
        score += parseInt(ball.amount);
    }
    return score;
}

function wickets() {
    var wkts = parseInt(0);
    for (i = 0; i < this.balls.length; i++) {
        var ball = this.balls[i];
        if (ball.thing == "w") {
            wkts += parseInt(1);
        }
    }
    return wkts;
}

function toHtml() {
    var html = "";
    for (i = 0; i < this.balls.length; i++) {
        var ball = this.balls[i];
        html += "<li>";
        html += ball.bowler + " to " + ball.batsman + ", ";
        switch (ball.thing) {
            case "":
                if (ball.wicket != null) {
                    html += "<strong>OUT!</strong>, " + ball.wicket.description;
                } else {
                    switch (ball.amount) {
                        case 0:
                            html += "no run";
                            break;
                        case "4":
                            html += "<strong>FOUR</strong>";
                            break;
                        case "6":
                            html += "<strong>SIX!</strong>";
                            break;
                        case "1":
                            html += "1 run";
                            break;
                        default:
                            html += ball.amount + " runs";
                    }
                }
                break;
            case "wd":
                html += htmlForBallType("wide", ball.amount);
                break;
            case "nb":
                html += htmlForBallType("no ball", ball.amount);
                break;
            case "b":
                html += htmlForBallType("bye", ball.amount);
                break;
            case "lb":
                html += htmlForBallType("leg bye", ball.amount);
                break;
            case "p":
                html += htmlForBallType("penalty", ball.amount);
                break;

        }
        html += "</li>";

    }
    return html;
}

function htmlForBallType(type, amount) {
    html = amount + " " + type;
    if (parseInt(amount) > 1) {
        html += "s";
    }
    return html;
}