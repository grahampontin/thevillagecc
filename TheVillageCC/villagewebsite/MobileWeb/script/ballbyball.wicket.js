function Wicket(player, playerName, playerScore, modeOfDismissal, bowler, fielder, description, notOutPlayer, nextManIn, batsmenCrossed) {
    this.player = player;
    this.playerName = playerName;
    this.playerScore = playerScore;
    this.modeOfDismissal = modeOfDismissal;
    this.bowler = bowler;
    this.fielder = fielder;
    this.description = description;
    this.notOutPlayer = notOutPlayer;
    this.nextManIn = nextManIn;
    this.batsmenCrossed = batsmenCrossed;
}

function toString() {
    var string = this.playerName + ' ' + this.modeOfDismissal;
    switch (this.modeOfDismissal) {
        case "b":
            string += "b." + this.bowler;
        case "ct":
            string += "ct." + this.fielder + " b." + this.bowler;
        case "lbw":
            string += "lbw." + this.bowler;
        case "ro":
            string += "run out " + this.fielder;
        case "st":
            string += "stumped " + this.fielder;
        case "hw":
            string += "hit wicket";
        case "htb2":
            string += "handled the ball";
    }
    string += " " + this.playerScore;
    return string;
}
