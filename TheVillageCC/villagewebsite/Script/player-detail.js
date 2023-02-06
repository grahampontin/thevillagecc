$(function () {
    var postData = {
        'command': "getPlayerDetail",
        "matchId": $.url().param('playerid')
    }

    $.post("./MobileWeb/BallByBall/CommandHandler.ashx", JSON.stringify(postData), function (data) {
        //success
        playerDetailLoaded(data);
    }, 'json')
        .fail(function (data) {
            showError(data.responseText);
        });

});

function playerDetailLoaded(data) {
    //do stuff
    
}

function showError(text) {
    $("#errorModal .modal-body p").text(text);
    var errorModal = new bootstrap.Modal(document.getElementById('errorModal'), {});
    errorModal.show();
}