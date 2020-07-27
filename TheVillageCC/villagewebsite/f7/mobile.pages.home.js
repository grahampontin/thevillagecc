$$(document).on('page:init', '.page[data-name="home"]', function(e) {
    bindHomePageLinks();
});

bindHomePageLinks();

function bindHomePageLinks() {
    $('#live-scoring-link').click(function() {
        app.views.current.router.navigate("/chooseMatch/");
    });

    $('#debug-link').click(function() {
        app.views.current.router.navigate("/debug/");
    });

    $('#scorecards-link').click(function() {
        app.views.current.router.navigate("/scorecards/");
    });
};

