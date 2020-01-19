function Ball(number, thing, batsman, batsmanName, bowler) {
    this.amount = number;
    this.thing = thing;
    this.batsman = batsman;
    this.batsmanName = batsmanName;
    this.bowler = bowler;
    this.wicket = null;
    this.angle = null;
    this.toBallString = toBallString;
    this.isLegalDelivery = isLegalDelivery;

    this.isFour = isFour;
    this.isSix = isSix;
    this.getBallDescription = getBallDescription;
}

function Ball(number, thing, batsman, batsmanName, bowler, wicket) {
    this.amount = number;
    this.thing = thing;
    this.batsman = batsman;
    this.batsmanName = batsmanName;
    this.bowler = bowler;
    this.wicket = wicket;
    this.angle = null;
    this.toBallString = toBallString;
    this.isLegalDelivery = isLegalDelivery;

    this.isFour = isFour;
    this.isSix = isSix;
    this.getBallDescription = getBallDescription;
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
        output = "W";
    }
    return output;
}

function isLegalDelivery() {
    if (this.thing === "wd" || this.thing === "nb") {
        return false;
    }
    return true;
}

function isFour() {
    switch(this.thing) {
    case "":
        if (this.amount == 4) {
            return true;
        }
        break;
    case "nb":
        if (this.amount == 5) {
            return true;
        }
        break;
    }
    return false;
}

function isSix() {
    switch(this.thing) {
    case "":
        if (this.amount == 6) {
            return true;
        }
        break;
    case "nb":
        if (this.amount == 7) {
            return true;
        }
        break;
    }
    return false;
}

function getBallDescription() {
    if (this.wicket != null) {
        return "<strong>OUT!</strong> " + this.wicket.description;
    }
    var sOrNoS = this.amount > 1 ? "s" : "";
    switch (this.thing) {
        case "":
            switch (this.amount) {
                case 0:
                    return "no run";
                case 1:
                    return "single to " + getLocationFrom(this);
                case 4:
                    return "<strong>FOUR</strong> through " + getLocationFrom(this);
                case 6:
                    return "<strong>SIX!</strong> over " + getLocationFrom(this);
                default:
                    return this.amount + " runs to " + getLocationFrom(this);
            }
        case "wd":
            return this.amount + " wide" + sOrNoS;
        case "nb":
            return this.amount + " no ball" + sOrNoS;
        case "b":
            return this.amount + " bye" + sOrNoS;
        case "lb":
            return this.amount + " leg bye" + sOrNoS;
        case "p":
            return this.amount + " penalty run" + sOrNoS;
        default:
            return this.amount + " " + this.thing;

    }
}

function getLocationFrom(ball) {
    if (ball.angle == undefined || ball.angle == null) {
        return "somewhere, I dunno, noone told me";
    }
    if (ball.angle < Math.PI / 4) {
        return "fine leg";
    }
    if (ball.angle < Math.PI / 2) {
        return "backwards square leg";
    }
    if (ball.angle < Math.PI * 0.6) {
        return "square leg";
    }
    if (ball.angle < Math.PI * 0.8) {
        return "mid wicket";
    }
    if (ball.angle < Math.PI) {
        return "mid on";
    }
    if (ball.angle < Math.PI * 1.2) {
        return "mid off";
    }
    if (ball.angle < Math.PI * 1.35) {
        return "extra cover";
    }
    if (ball.angle < Math.PI * 1.5) {
        return "cover";
    }
    if (ball.angle < Math.PI * 1.65) {
        return "point";
    }
    if (ball.angle < Math.PI * 1.8) {
        return "backwards point";
    }
    return "third man";
}