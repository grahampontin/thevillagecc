$$(document).on('page:init', '.page[data-name="debug"]', function (e) {
    if (e.detail.position != "next") {
        return;
    }
    //Bind handlers here
    listMatchesEligibleForReset();
    //once bound...

});

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
                            $('#in-progress-matches ul').append('<li><a class="item-link item-content reset-match" matchId="'+o.matchId+'"><div class="item-inner"><div class="item-title">'+o.opponent+' ('+o.overs+' ovs)</div><div class="item-after"><span class="badge bg-color-green">'+o.batOrBowl+'</span></div></div></a></li>');
                        }
                        
                    });
                $(".reset-match").click(function() {
                    matchId = $(this).attr("matchId");
                    app.dialog.confirm("Resetting this match will delete all data and cannot be undone...",
                        "Are you sure?",
                        function() {
                            var postData = { 'command': "resetMatch", 'matchId': matchId };
                            $.post("/MobileWeb/ballbyball/CommandHandler.ashx",
                                JSON.stringify(postData),
                                function(data) {
                                    $('#in-progress-matches ul').empty();
                                    listMatchesEligibleForReset();
                                }
                            );
                        },
                        function() {});
                });
            },
            "json")
        .fail(function(data) {
            app.preloader.hide();
            showToastCenter(data.responseText);
        })
        ;
};



