var playersCache = null;

function getPlayers(callback) {
    if (playersCache !== null) {
        callback(playersCache);
        return;
    }
    $.get('/api/refdata/players/', function (data) {
            playersCache = data;
            callback(playersCache);
        },
        "json")
        .fail(restRequestFailed());
}

function restRequestFailed() {
    return function (data) {
        app.preloader.hide();
        showToastCenter(data.responseText);
    };
}
