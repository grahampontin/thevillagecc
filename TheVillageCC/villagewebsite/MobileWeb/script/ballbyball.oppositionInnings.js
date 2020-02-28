
function bindOppositionInningsPageHandlers() {
    if (innings == undefined) {
        innings = "Bowling";
    }
    $("#submitButton").click(function() {
        var score =     parseInt($("#oppositionScoreInput").val());
        var overs =     parseInt($("#oppositionOversInput").val());
        var wickets =   parseInt($("#oppositionWicketsInput").val());
        var commentary = $("#commentary").val();

        if (isNaN(overs) || overs <= 0) {
            showError("You should have more than zero overs");
            return;
        }
        if (isNaN(score)) {
            showError("The score should be a number of some sort, e.g. 0, 10 or something.");
            return;
        }
        if (score < 0) {
            showError("The score cannot be negative, noone is that bad");
            return;
        }
        if (isNaN(wickets)) {
            wickets = 0;
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
                showInfo("Saved: Opposition are " + score + " for " + wickets + " after " + overs + " overs");
            }, 'json')
        .fail(function (data) {
            showError(data.responseText);
        });

    });

    $("#endOfOppositionInningsButton").click(function() {
        showConfirmationDialog();
    });

    $("#endOfOppositionInningsConfirmButton").click(function () {
        $("body").pagecontainer("change", "EndOfInnings.aspx", { transition: "slide" });
    });

    $("#endOfOppositionInningsGoBack").click(function () {
        $("#oppositionInningsConfirmationDialog").popup('close');
    });

    function showConfirmationDialog() {
        $("#oppositionInningsConfirmationDialog").popup('open');
    }
};

