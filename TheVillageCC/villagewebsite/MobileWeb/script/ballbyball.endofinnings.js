
function bindEndOfInningsPageHandlers() {
       
    $("#endOfInningsPageConfirmButton").click(function () {
        var commentary = $("#endOfInningsPageCommentary").val();
        var wasDeclared = $("#endOfInningsPageWasDeclared").prop('checked');

        var postData = {
            'command': "endInnings",
            'matchId': matchId,
            'payload': {
                InningsType: innings,
                WasDeclared: wasDeclared,
                Commentary: commentary
            }
        };

        $.post('./CommandHandler.ashx', JSON.stringify(postData), function (data) {
            //success
            if (data.NextInnings === 'Batting') {
                innings = "Batting";
                $("body").pagecontainer("change", "NewOver.aspx", { transition: "slide" });
            }
            if (data.NextInnings === 'Bowling') {
                innings = "Bowling";
                $("body").pagecontainer("change", "OppositionInnings.aspx", { transition: "slide" });
            }
            if (data.NextInnings === 'GameOver') {
                innings = "GameOver";
                $("body").pagecontainer("change", "GameOver.aspx", { transition: "slide" });
            }
        }, 'json')
        .fail(function (data) {
            showError(data.responseText);
        });

    });
};


function refreshEndOfInningsPageView() {
    $("#endOfInningsPageCommentary").val("");
}

