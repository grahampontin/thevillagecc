function addPlayersToSelect(data, elementSelector) {
    var select = $(elementSelector);
    select.empty();
    select.append($("<option></option>").attr("selected", "selected"));
    $.each(data,
        function(i, o) {
            select.append($("<option></option>")
                .attr("value", o.playerId)
                .attr("playerid", o.playerId)
                .text(o.shortName));
        }
    );
}
