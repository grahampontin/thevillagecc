$$(document).on('page:init', '.page[data-name="debug"]', function (e) {
    if (e.detail.position != "next") {
        return;
    }
    //Bind handlers here
    listMatchesEligibleForReset();
    //once bound...

});

function addMatchRowWithCommand(o, selector, command) {
    $(selector).append('<li><a class="item-link item-content ' + command+'" matchId="' + o.matchId + '"><div class="item-inner"><div class="item-title">' + o.opponent + ' (' + o.overs + ' ovs)</div><div class="item-after"><span class="badge">' + o.batOrBowl + '</span></div></div></a></li>');
}

function executCommandOn(command, message) {
    app.dialog.confirm(message,
        "Are you sure?",
        function () {
            var postData = {'command': command, 'matchId': matchId};
            $.post("/MobileWeb/ballbyball/CommandHandler.ashx",
                JSON.stringify(postData),
                function (data) {
                    $('#in-progress-matches-to-reset ul').empty();
                    $('#in-progress-matches-to-force-end ul').empty();
                    listMatchesEligibleForReset();
                }
            );
        },
        function () {
        });
}

function listMatchesEligibleForReset() {
    app.preloader.show();
    var postData = { 'command': "listMatches" };
    $.post("/MobileWeb/ballbyball/CommandHandler.ashx",
            JSON.stringify(postData),
            function(data) {
                app.preloader.hide();
                //success
                $.each(data,
                    function(i, o) {
                        if (o.batOrBowl === "") {
                            //ignore new matches
                        } else {
                            addMatchRowWithCommand(o, '#in-progress-matches-to-reset ul', 'reset-match');
                            addMatchRowWithCommand(o, '#in-progress-matches-to-force-end ul', 'force-end-match');
                        }
                        
                    });
                $(".reset-match").click(function() {
                    matchId = $(this).attr("matchId");
                    executCommandOn("resetMatch", "Resetting this match will delete all data and cannot be undone...");
                });
                $(".force-end-match").click(function() {
                    matchId = $(this).attr("matchId");
                    executCommandOn("forceEndMatch", "This will close out the match without adding any more balls, even though it's not done...");
                });
            },
            "json")
        .fail(function(data) {
            app.preloader.hide();
            showToastCenter(data.responseText);
        })
        ;
};



