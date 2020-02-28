function showError(message) {
    $.mobile.activePage.find("#errorMessageContent").text(message);
    $.mobile.activePage.find('#errorMessage').popup("open");
}

function hideWarning() {
    $.mobile.activePage.find("#warningMessage").hide();
}

function hideInfo() {
    $.mobile.activePage.find("#infoMessage").hide();
}

function showWarning(message) {
    var warningDiv = $.mobile.activePage.find("#warningMessage");
    if (warningDiv.length === 0) {
        createWarningDiv();
    }
    warningDiv = $.mobile.activePage.find("#warningMessage");
    warningDiv.text(message);
    warningDiv.show();
}

function showInfo(message) {
    var warningDiv = $.mobile.activePage.find("#infoMessage");
    if (warningDiv.length === 0) {
        createInfoDiv();
    }
    warningDiv = $.mobile.activePage.find("#infoMessage");
    warningDiv.text(message);
    warningDiv.show();
}

function createWarningDiv() {
    $.mobile.activePage.find(".ui-content").first().prepend("<div id='warningMessage' class='warning-message ui-corner-all'></div>");
}
function createInfoDiv() {
    $.mobile.activePage.find(".ui-content").first().prepend("<div id='infoMessage' class='info-message ui-corner-all'></div>");
}


function populateSelectWithAllWaitingBatsmen(batsmanSelect, value, matchState) {
    batsmanSelect.empty();
    batsmanSelect.append($("<option></option>"));
    $.each(matchState.getWaitingPlayers(), function (index, batsman) {
        batsmanSelect
         .append($("<option></option>")
         .attr("value", value)
         .attr("playerId", batsman.PlayerId)
         .text(batsman.PlayerName));
    });
}
