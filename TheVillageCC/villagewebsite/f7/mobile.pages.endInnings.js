$$(document).on('page:init', '.page[data-name="endInnings"]', function (e) {
    setupPageFor(e.detail.route.params.type);
});


function setupPageFor(inningsType) {
    //Bind handlers here
    $("#end-innings-done").click(function() {
        var matchId = matchState.MatchId;
        var textEditor = app.textEditor.get('.chat-text-editor');

        var payload = {
            InningsType: inningsType,
            WasDeclared: toBoolean($("#innings-declared-select").val()),
            Commentary: textEditor.value
        };
        
        app.preloader.show();
        $.ajax({
            url: "/api/livescoring/" + matchId + "/end-innings",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(payload),
            success: function(data) {
                app.preloader.hide();
                matchState = matchStateFromData(data);
                goToNextState();
            },
            error: function(data) {
                app.preloader.hide();
                showToastCenter(data.responseText);
            }
        });
    });
    
    //once bound...
    initializeMatchStateAndThen(false, function() {
        

    });
}


