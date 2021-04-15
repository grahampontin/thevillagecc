$$(document).on('popup:opened', '.popup[data-name="editBall"]', function (e) {
    //Bind handlers
    if (ballNumber == undefined) {
        showError("Whoops, which ball are you trying to edit?");
        return;
    }

    renderBall();
    $("#save-ball-edit-button").click(() => {
        
    });

});

function renderBall() {
    var ballToEdit = matchState.Over.balls[ballNumber];
    $("#edit-ball-score").val(ballToEdit.amount);
    $.each(matchState.Bowlers,
        function(i, bowler) {
            var option = $("<option></option>")
                .attr("value", bowler)
                .text(bowler);
            if (bowler == ballToEdit.bowler) {
                option.attr("selected", "selected");
            }
            $("#bowler-for-ball-select").append(option);
        });
    var bowlerSmartSelect = app.smartSelect.create({
        el: "#bowler-for-ball-smart-select",
        openIn: "sheet",
        routableModals: false
    });
    bowlerSmartSelect.setValue(ballToEdit.bowler);
    var playersDismissedInThisOver = matchState.Over.balls.map(x => x.wicket).filter(w => w != null).map(w => w.player);
    $.each(matchState.Players,
        function(i, o) {
            if (o.State == "Batting" || playersDismissedInThisOver.includes(o.PlayerId)) {
                var option = $("<option></option>")
                    .attr("value", o.PlayerId)
                    .attr("playerid", o.PlayerId)
                    .text(o.PlayerName);
                $("#batsman-for-ball-select").append(option.clone());
                $("#edit-ball-out-bastman-select").append(option);

            }
        }
    );
    var batsmanSmartSelect = app.smartSelect.create({
        el: "#batsman-for-ball-smart-select",
        openIn: "sheet",
        routableModals: false
    });
    batsmanSmartSelect.setValue(ballToEdit.batsman);
    var typeSmartSelect = app.smartSelect.create({
        el: "#edit-ball-type-smart-select",
        openIn: "sheet",
        routableModals: false
    });
    typeSmartSelect.setValue(ballToEdit.thing);

    $("#edit-ball-was-wicket").prop( "checked", ballToEdit.wicket != null);

    if (ballToEdit.wicket != null) {
        
        $("#edit-ball-wicket-details").show();
        var outBatsmanSmartSelect = app.smartSelect.create({
            el: "#edit-ball-out-bastman-smart-select",
            openIn: "sheet",
            routableModals: false
        });
        outBatsmanSmartSelect.setValue(ballToEdit.wicket.player);
        var dismissalTypeSmartSelect = app.smartSelect.create({
            el: "#edit-ball-dismissal-type-smart-select",
            openIn: "sheet",
            routableModals: false
        });
        dismissalTypeSmartSelect.setValue(ballToEdit.wicket.modeOfDismissal);
        if (ballToEdit.wicket.fielder != null) {
            $("#edit-ball-fielder-input").val(ballToEdit.wicket.fielder);
        }
        $("#edit-ball-wicket-commentary-textarea").val(ballToEdit.wicket.description);


    } else {
        $("#edit-ball-wicket-details").hide();
    }

    $("#edit-ball-was-wicket").on("change",
        function() {
            if ($(this).prop("checked")) {
                $("#edit-ball-wicket-details").show();
            } else {
                $("#edit-ball-wicket-details").hide();
            }
        });


}


