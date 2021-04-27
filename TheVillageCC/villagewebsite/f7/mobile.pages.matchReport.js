var matchReportData;
$$(document).on('page:init', '.page[data-name="matchReport"]', function(e) {
    //Do stuff
    app.preloader.show();
    
        var postData = { 'command': "getMatchReport", 'matchId': matchId };
        $.post("/MobileWeb/ballbyball/CommandHandler.ashx",
                JSON.stringify(postData),
                function(data) {
                    //success
                    matchReportData = data;
                    var conditions = data.Conditions;
                    if (conditions != "Not recorded") {
                        $("#match-report-conditions-textarea").val(conditions);
                    }
                    var report = data.Report;
                    if (report != "No report") {
                        app.textEditor.get("#match-report-text-editor").setValue(report);
                    }
                    app.preloader.hide();
                },
                "json")
            .fail(function(data) {
                app.preloader.hide();
                showToastCenter(data.responseText);
            });

    $("#save-match-report-button").click(() => {
        matchReportData.Conditions = $("#match-report-conditions-textarea").val();
        matchReportData.Report = app.textEditor.get("#match-report-text-editor").getValue();
        app.preloader.show();
        var postData = { 'command': "saveMatchReport", 'matchId': matchId, 'payload': matchReportData };
        $.post("/MobileWeb/ballbyball/CommandHandler.ashx",
                JSON.stringify(postData),
                function(data) {
                    //success
                    app.preloader.hide();
                },
                "json")
            .fail(function(data) {
                app.preloader.hide();
                showToastCenter(data.responseText);
            });
    });

});

