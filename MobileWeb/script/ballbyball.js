var over = new Over();

$(document).ready(
		function () {
		    if ($.Storage.get("currentOver") != null) {
		        var scabbyOver = $.parseJSON($.Storage.get("currentOver"))
		        for (var i = 0; i < scabbyOver.balls.length; i++) {
		            var aball = new ball(scabbyOver.balls[i].amount, scabbyOver.balls[i].thing);
		            over.balls.push(aball)
		        }
		    }
		    write();
		}
	);

		$("#runsButton").click(function () {
		    var amount = $("#amountSelect").val();
            addBall(new ball(amount, ""));
        });

        $("#wicketButton").click(function () {
            addBall(new ball(0, "w"));
        });

        $("#extrasSelect").change(function () {
            var amount = $("#amountSelect").val();
            var extra = $(this).val();

            addBall(new ball(amount, extra));
            $(this).val("extras")
        });

        $("#dotBallButton").click(function () {
            addBall(new ball(0, ""));
        });

        $("#undoButton").click(function () {
            var undone = over.balls.pop();
            write();
            evaluateShouldSwitchStrikerAfter(undone);
            saveCurrentOver(over);
        });

        $("#saveWicketButton").click(function () {
            history.back();
            return false;
        });

        


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


function ball(number, thing) {
    this.amount = number;
    this.thing = thing;
    this.toBallString = toBallString;
}

function toBallString() {
    var output = "";
    switch (this.thing) {
        case "w":
            output = "W";
            break;
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
    return output;
}

function Over() {
    this.balls = new Array();
    this.toPrettyString = toPrettyString;
}

function toPrettyString() {
    var output = "";
    for (i = 0; i < this.balls.length; i++) {
        var ball = this.balls[i];
        output += this.balls[i].toBallString() + " ";
    }
    return output;
}




