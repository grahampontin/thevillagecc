$('#live-scoring-link').click(function() {
    app.views.current.router.navigate("/chooseMatch/");
});

$('#debug-link').click(function() {
    app.views.current.router.navigate("/debug/");
});

