function Ball(number, thing, batsman, batsmanName, bowler) {
    this.amount = number;
    this.thing = thing;
    this.batsman = batsman;
    this.batsmanName = batsmanName;
    this.bowler = bowler;
    this.wicket = null;
    this.toBallString = toBallString;
}

function Ball(number, thing, batsman, batsmanName, bowler, wicket) {
    this.amount = number;
    this.thing = thing;
    this.batsman = batsman;
    this.batsmanName = batsmanName;
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