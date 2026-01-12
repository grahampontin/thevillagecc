$$(document).on('page:init', '.page[data-name="chooseMatch"]', function (e) {
    if (e.detail.position != "next") {
        return;
    }
    //Bind handlers here
    listMatches();
    //once bound...

});

function listMatches() {
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
                            $('#upcoming-matches ul').append('<li><a class="item-link item-content new-match" matchId="'+o.matchId+'"><div class="item-inner"><div class="item-title">'+o.opponent+' ('+o.dateString+')</div><div class="item-after"><span class="badge">New</span></div></div></a></li>');
                        } else {
                            $('#in-progress-matches ul').append('<li><a class="item-link item-content new-match" matchId="'+o.matchId+'"><div class="item-inner"><div class="item-title">'+o.opponent+' ('+o.overs+' ovs)</div><div class="item-after"><span class="badge">'+o.batOrBowl+'</span></div></div></a></li>');
                        }
                        
                    });
                $(".new-match").click(function() {
                    matchId = $(this).attr("matchId");
                    var postData = { 'command': "matchState", 'matchId': matchId };
                    sendBallByBallCommand(postData);
                });
            },
            "json")
        .fail(function(data) {
            app.preloader.hide();
            showToastCenter(data.responseText);
        });
};



