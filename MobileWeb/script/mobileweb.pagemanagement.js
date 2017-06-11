$(document).ready(function () {
    $('body').on('pagecontainerchange', function (event, ui) {
        if (ui.options.fromHashChange) {
            return;
        }
        var toPage = URI(ui.absUrl).filename();
        switch (toPage) {
            case 'BallByBall.aspx':
                initialiseBallByBallCore();
                break;
            case 'SelectTeam.aspx':
                initialiseSelectTeam();
                break;
            case 'MatchConditions.aspx':
                initialiseMatchConditions();
                break;
            case 'Wicket.aspx':
                initialiseWicketPage();
                break;
            case "EndOfOver.aspx":
                initialiseEndOfOver();
                break;
            case "OppositionInnings.aspx":
                initialiseOppositionInnings();
                break;
            case "EndOfInnings.aspx":
                initialiseEndOfInnings();
                break;
            case "HelpMenu.aspx":
                initialiseHelp();
                break;
        }
    });
});