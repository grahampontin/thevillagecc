$$(document).on('page:init', '.page[data-name="scoring"]', function (e) {
    refreshUi();
    //Bind handlers here
    $(".runs-button").click(function() {
        var amount = parseInt($(this).attr('value'));
        addSimpleRunsBall(amount);
    });
    //once bound...
    initializeMatchStateAndThen(false, function() {
        
    });
});

function addSimpleRunsBall(runs) {
//    if (runs > 0) {
//        $("#wagonWheel").popup("open");
//    }
    addBall(new Ball(runs, "", getOnStrikeBatsman(), getOnStrikeBatsmanName(), getBowler()));
}


function addBall(aball) {
    matchState.Over.balls.push(aball);
    evaluatePlayerScores();
    if (shouldSwitchStrikerAfter(aball)) {
        matchState.switchBatsmen();
    }
    refreshUi();
}

function evaluatePlayerScores() {
    var batsman1 = matchState.getBattingPlayers()[0];
    var batsman2 = matchState.getBattingPlayers()[1];

    batsman1.Score = batsman1.CurrentScore + matchState.Over.scoreForPlayer(batsman1.PlayerId);
    batsman2.Score = batsman2.CurrentScore + matchState.Over.scoreForPlayer(batsman2.PlayerId);
}

function shouldSwitchStrikerAfter(ball) {
    var shouldSwitch = ball.amount % 2 !== 0;
    switch (ball.thing) {
    case "wd":
    case "nb":
        shouldSwitch = !shouldSwitch;
        break;
    default:
        //nothing to do
    }
    return shouldSwitch;
}

function refreshUi() {
    refreshBatsmenView();
    refreshCurrentOverView();
}

function refreshBatsmenView() {
    var batsman1 = matchState.getBattingPlayers()[0];
    var batsman2 = matchState.getBattingPlayers()[1];
    $('#batsman-one-name').text(batsman1.playerName);
    $('#batsman-two-name').text(batsman2.playerName);
    if (matchState.OnStrikeBatsmanId === batsman1.playerId) {
        $('#batsman-one-name').addClass('button-fill');
        $('#batsman-one-name').removeClass('button-outline');
    } else {
        $('#batsman-two-name').addClass('button-fill');
        $('#batsman-two-name').removeClass('button-outline');
    }
    $('#batsman-one-runs').text(batsman1.Score);
    $('#batsman-two-runs').text(batsman2.Score);
}

function refreshCurrentOverView() {
    var parent = $('#current-over-balls');
    parent.empty();
    $.each(matchState.Over.balls, function(index, ball) {
        var ballElement = $('<div></div>');
        ballElement.addClass('circle');
        ballElement.addClass('circle-small');
        ballElement.addClass('ball');
        if (ball.amount === 0) {
            ballElement.addClass('dot');
        }
        if (ball.amount === 4 || ball.amount === 6) {
            ballElement.addClass('boundary-ball');
        }
        if (ball.Wicket !== undefined) {
            ballElement.addClass('wicket');
        }
        var innerElement = $('<div></div>');
        innerElement.addClass('circle-inner');
        innerElement.text(ball.toBallString());
        ballElement.append(innerElement);
        parent.append(ballElement);
    });
}