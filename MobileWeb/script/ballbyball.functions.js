function showError(message) {
    $("#errorMessageContent").text(message)
    $("#errorMessage").popup("open");
}


function populateSelectWithAllWaitingBatsmen(batsmanSelect, value, matchState) {
    batsmanSelect.empty();
    batsmanSelect
         .append($("<option></option>")
         .attr("data-placeholder", true)
         .attr("value", value)
         .attr("playerId", -1)
         .text("Select..."));
    $.each(matchState.getWaitingPlayers(), function (index, batsman) {
        batsmanSelect
         .append($("<option></option>")
         .attr("value", value)
         .attr("playerId", batsman.PlayerId)
         .text(batsman.PlayerName));
    });
    batsmanSelect.selectmenu('refresh', true);
}
