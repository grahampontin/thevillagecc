
function initialiseEndOfInnings() {
    var matchId = $.url().param('matchId');
    var innings = $.url().param('innings');
        
    $("#endOfInningsButton").click(function () {
        var commentary = $("#commentary").val();
        var wasDeclared = $("#wasDeclared").prop('checked');

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
                $("body").pagecontainer("change", "BallByBall.aspx?matchId="+matchId, { transition: "fade" });
            }
            if (data.NextInnings === 'Bowling') {
                $("body").pagecontainer("change", "OppositionInnings.aspx?matchId=" + matchId, { transition: "fade" });
            }
            if (data.NextInnings === 'GameOver') {
                $("body").pagecontainer("change", "GameOver.aspx?matchId=" + matchId, { transition: "fade" });
            }
        }, 'json')
        .fail(function (data) {
            showError(data.responseText);
        });

    });
};

