﻿$(document).ready(function () {
    $('body').on('pagecontainerchange', function (event, ui) {
        var toPage = URI(ui.absUrl).filename();
        switch (toPage) {
            case 'BallByBall.aspx':
                initialiseBallByBallCore();
                break;
            case 'SelectTeam.aspx':
                initialiseSelectTeam();
                break;
            case 'Wicket.aspx':
                initialiseWicketPage();
                break;
            case "EndOfOver.aspx":
                initialiseEndOfOver();
                break;
        }
    });
});
