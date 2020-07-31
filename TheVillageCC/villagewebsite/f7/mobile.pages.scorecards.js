var scoreCardsSeason = new Date().getFullYear();
$$(document).on('page:init', '.page[data-name="scorecards"]', function (e) {
    if (e.detail.position != "next") {
        return;
    }
    $("#scorecards-previous-season").click(function() {
        scoreCardsSeason = scoreCardsSeason - 1;;
        listScorecards();
    });
    $("#scorecards-next-season").click(function() {
        scoreCardsSeason = scoreCardsSeason + 1;
        listScorecards();
    });
    //Bind handlers here
    listScorecards();
    //once bound...

});

function listScorecards() {
    $('#matches ul').empty();
    $("#scorecards-current-season").text(scoreCardsSeason);
    app.preloader.show();
    var postData = { 'command': "matchesBySeason", 'payload': scoreCardsSeason };
    $.post("/MobileWeb/ballbyball/CommandHandler.ashx",
            JSON.stringify(postData),
            function(data) {
                app.preloader.hide();
                //success
                $.each(data,
                    function(i, o) {
                        $('#matches ul').append('<li><a class="item-link item-content edit-scorecard" matchId="'+o.matchId+'"><div class="item-inner"><div class="item-title">'+o.opponent+' ('+o.dateString+')</div></div></a></li>');
                    });
                $(".edit-scorecard").click(function() {
                    matchId = $(this).attr("matchId");
                    app.views.current.router.navigate("/editScorecard/");
                });
            },
            "json")
        .fail(function(data) {
            app.preloader.hide();
            showToastCenter(data.responseText);
        })
        ;
};



