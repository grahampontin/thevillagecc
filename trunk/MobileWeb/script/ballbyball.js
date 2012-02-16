var over = new Over();

$(document).ready(
		function () {
		    if ($.Storage.get("currentOver") != null) {
		        var scabbyOver = $.parseJSON($.Storage.get("currentOver"))
		        for (var i = 0; i < scabbyOver.balls.length; i++) {
		            var aball = new Ball(scabbyOver.balls[i].amount, scabbyOver.balls[i].thing, scabbyOver.balls[i].wicket);
		            over.balls.push(aball)
		        }
		    }
		    write();
		    $('div').live('pageshow', function (event, ui) {
		        bindWicketHandlers();
		        bindEndOfOverHandlers();
		    });

		}
	);

function bindWicketHandlers() {
	$("#saveWicketButton").click(function () {
		var scoreForWicketBall = $("#scoreForWicketBallAmount").val();
		var thingForWicketBall = $("#wicketRunsSelect").val();
		if (scoreForWicketBall == 0) {
		    thingForWicketBall = "";
		}

		addBall(new Ball(scoreForWicketBall, thingForWicketBall, getBatsman(), $("#bowler").val(), new Wicket($("#outBatsmanSelect").val(),
                                            $("#modeOfDismissal").val(),
                                            $("#scoreSelect").val(),
                                            $("#bowler").val(),
                                            $("#fielder").val(),
                                            $("#wicketDescription").val())
                                            ));
		history.back();
		return false;
	});
}

function bindEndOfOverHandlers() {
    $("#overTotalScore").html(formatScore(over.totalScore()));
    $("#inningsWickets").html(over.wickets());
    $("#inningsScore").html(over.totalScore());
    $("#inningsRunRate").html(over.totalScore() + ".00");
    $("#overPlaceHolder").replaceWith(over.toHtml());
    $("#overDetailUl").listview('refresh');
}

$("#runsButton").click(function () {
	var amount = $("#amountSelect").val();
    addBall(new Ball(amount, "", getBatsman(), getBowler()));
});

        

$("#extrasSelect").change(function () {
    var amount = $("#amountSelect").val();
    var extra = $(this).val();

    addBall(new Ball(amount, extra, getBatsman(), getBowler()));
    $(this).val("extras")
});

$("#dotBallButton").click(function () {
    addBall(new Ball(0, "", getBatsman(), getBowler()));
});

$("#undoButton").click(function () {
    var undone = over.balls.pop();
    write();
    evaluateShouldSwitchStrikerAfter(undone);
    saveCurrentOver(over);
});


function formatScore(score) {
    if (score == 0) {
        score = "maiden";
    } else {
        score += " runs";
    }
    return score;
    
}
        
function getBatsman() {
    return $('#strikerSelect :selected').text()
;
}

function getBowler() {
    return "A Bowler";
}

function addBall(aball) {
    over.balls.push(aball);
    write();
    evaluateShouldSwitchStrikerAfter(aball);
    saveCurrentOver(over);
}

function saveCurrentOver(over) {
    $.Storage.set("currentOver", $.toJSON(over))
}

function evaluateShouldSwitchStrikerAfter(ball) {
    var shouldSwitch = ball.amount % 2 != 0;
    switch (ball.thing) {
        case "wd":
        case "nb":
            shouldSwitch = !shouldSwitch;
            break;
        default:
            //nothing to do
    }
    if (shouldSwitch) {
        var currentIndex = $("#strikerSelect").val();
        if (currentIndex == 1) {
            $("#strikerSelect").val(2);
        } else {
            $("#strikerSelect").val(1);
        }
        $("#strikerSelect").slider('refresh');
    }
}

function write() {
    $("#overSoFar").html(over.toPrettyString());
}


function Ball(number, thing, batsman, bowler) {
    this.amount = number;
    this.thing = thing;
    this.batsman = batsman;
    this.bowler = bowler;
    this.wicket = null;
    this.toBallString = toBallString;
}

function Ball(number, thing, batsman, bowler, wicket) {
    this.amount = number;
    this.thing = thing;
    this.batsman = batsman;
    this.bowler = bowler;
    this.wicket = wicket;
    this.toBallString = toBallString;
}

function toBallString() {
    var output = "";
    switch (this.thing) {
        case "":
            if (this.amount == 0) {
                output = ".";
            } else {
                output = this.amount;
            }
            break;
        default:
            output = this.amount + this.thing;

    }
    if (this.wicket != null) {
        if (output == ".") {
            output = "W";
        } else {
            output += ",W";
        }
        
    }
    return output;
}

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

function Wicket(player, modeOfDismissal, score, bowler, fielder, description) {
    this.player = player;
    this.modeOfDismissal = modeOfDismissal;
    this.score = score;
    this.bowler = bowler;
    this.fielder = fielder;
    this.description = description;
}





