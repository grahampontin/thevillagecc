$$(document).on('page:init', '.page[data-name="oppositionScoring"]', function (e) {
    //Bind handlers here
    $("#opposition-scoring-update").click(function() {
        var matchId = matchState.MatchId;
        var textEditor = app.textEditor.get('.chat-text-editor');

        var score =     parseInt($("#opposition-runs-input").val());
        var overs =     parseInt($("#opposition-overs-input").val());
        var wickets =   parseInt($("#opposition-wickets-input").val());
        if (isNaN(wickets)) {
            wickets = 0;
        }

        if (validateOppositionScoring(score, overs, wickets)) {
            var postData = {
                'command': "updateOppositionScore",
                'matchId': matchId,
                'payload': {
                    Over: overs,
                    Wickets: wickets,
                    Score: score,
                    Commentary: textEditor.value
                }
            };

            sendBallByBallCommand(postData, function() {
                $("#opposition-runs-input").val('');
                $("#opposition-overs-input").val('');
                $("#opposition-wickets-input").val('');
            });
        }

        
    });
    
    //once bound...
    initializeMatchStateAndThen(false, function() {

    });
});


function validateOppositionScoring(score, overs, wickets) {
    if (isNaN(overs) || overs <= 0) {
        showToastBottom("You should have more than zero overs");
        return false;
    }
    if (isNaN(score)) {
        showToastBottom("The score should be a number of some sort, e.g. 0, 10 or something.");
        return false;
    }
    if (score < 0) {
        showToastBottom("The score cannot be negative, noone is that bad");
        return false;
    }
    
    if (wickets < 0) {
        showToastBottom("You can't have negative wickets, that's just not right.");
        return false;
    }
    if (wickets > 10) {
        showToastBottom("More than ten wickets down probably means it's the end of the innnings don't you think?");
        return false;
    }
    return true;
}
