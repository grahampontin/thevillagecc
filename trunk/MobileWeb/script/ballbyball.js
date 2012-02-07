$(document).ready(
		function () {
		    addBall(new ball("4", "wd"));
		    addBall(new ball("2", ""));
		    addBall(new ball("0", ""));
		    addBall(new ball("4", ""));
		    addBall(new ball("0", ""));
		    addBall(new ball("0", "w"));
            
		    write();
		}
	);

function addBall(aball) {
	over.balls.push(aball);
}

function write() {
    $("#overSoFar").html(over.toPrettyString());
}

var over = new Over();

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




