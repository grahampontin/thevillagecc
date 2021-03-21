$$(document).on('page:init', '.page[data-name="endInnings"]', function (e) {
    setupPageFor(e.detail.route.params.type);
});


function setupPageFor(inningsType) {
    //Bind handlers here
    $("#end-innings-done").click(function() {
        var matchId = matchState.MatchId;
        var textEditor = app.textEditor.get('.chat-text-editor');

        var postData = { 'command': "endInnings", 'matchId': matchId, 'payload': {
                InningsType: inningsType,
                WasDeclared: toBoolean($("#innings-declared-select").val()),
                Commentary: textEditor.value
            }
        };
        sendBallByBallCommand(postData);
    });
    
    //once bound...
    initializeMatchStateAndThen(false, function() {
        

    });
}


