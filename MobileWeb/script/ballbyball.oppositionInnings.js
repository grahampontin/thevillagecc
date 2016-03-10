
function initialiseOppositionInnings() {
    var matchId = $.url().param('matchId');
        
    $("#submitButton").click(function() {
        var score =     parseInt($("#oppositionScoreInput").val());
        var overs =     parseInt($("#oppositionOversInput").val());
        var wickets =   parseInt($("#oppositionWicketsInput").val());
        var commentary = $("#commentary").val();

        if (overs <= 0) {
            showError("You should have more than zero overs");
            return;
        }
        if (score < 0) {
            showError("The score cannot bw negative, noone is that bad");
            return;
        }
        if (wickets < 0) {
            showError("You can't have negative wickets, that's just not right.");
            return;
        }
        if (wickets > 10) {
            showError("More than ten wickets down probably means it's the end of the innnings don't you think?");
            return;
        }

        var postData = {
            'command': "updateOppositionScore",
            'matchId': matchId,
            'payload': {
                Over: overs,
                Wickets: wickets,
                Score: score,
                Commentary: commentary,
            }
        };

        $.post('./CommandHandler.ashx', JSON.stringify(postData), function () {
            //success
                $("#oppositionScoreInput").val("");
                $("#oppositionOversInput").val("");
                $("#oppositionWicketsInput").val("");
                $("#commentary").val("");
        }, 'json')
        .fail(function (data) {
            showError(data.responseText);
        });

    });

    $("#endOfInningsButton").click(function() {
        showConfirmationDialog();
    });

    $("#endOfInningsConfirmButton").click(function () {
        $("body").pagecontainer("change", "EndOfInnings.aspx?innings=Bowling&matchId=" + matchId, { transition: "slide" });
    });

    $("#endOfInningsGoBack").click(function () {
        $("#confirmationDialog").popup('close');
    });

    function showConfirmationDialog() {
        $("#confirmationDialog").popup('open');
    }
};

