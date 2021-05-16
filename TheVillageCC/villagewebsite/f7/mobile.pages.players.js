var editPlayerPopup;
$$(document).on('page:init', '.page[data-name="players"]', function (e) {
    if (e.detail.position != "next") {
        return;
    }
    //Bind handlers here
    listPlayersToEdit();
    //once bound...

    editPlayerPopup = app.popup.create({
        el: '.edit-player-popup',
        closeByBackdropClick: false,
        on: {
            opened: function() {
                console.log('Players Popup opened');
            }
        }
    });

    $("#save-player-button").click(() => {
        editPlayerPopup.close();
        playerBeingEdited.firstName = $("#player-firstname-input").val();
        playerBeingEdited.surname = $("#player-surname-input").val();
        playerBeingEdited.middleInitials = $("#player-middle-initials-input").val();
        playerBeingEdited.isRightHandBat = $('input[name="player-left-right-hand-radio"]:checked').val();
        playerBeingEdited.clubConnection = { playerId: $("#club-connection-select").find('option:selected').attr("playerId") };
        playerBeingEdited.isActive = $("#player-is-active-checkbox").prop("checked") == true;
        var postData;
        if (playerBeingEdited.playerId != undefined) {
            postData = { 'command': "updatePlayer", "payload": playerBeingEdited };
        } else {
            postData = { 'command': "createPlayer", "payload": playerBeingEdited };
        }
        app.preloader.show();
        $.post("/MobileWeb/ballbyball/CommandHandler.ashx",
                    JSON.stringify(postData),
                    function(data) {
                        app.preloader.hide();
                        listPlayersToEdit();
                    },
                    "json")
                .fail(function(data) {
                    app.preloader.hide();
                    showToastCenter(data.responseText);
                })
            ;
    });

    $("#add-player-button").click(() => {
        playerBeingEdited = {
            isActive: true
    };
        $("#player-firstname-input").val("");
        $("#player-surname-input").val("");
        $("#player-middle-initials-input").val("");
        $('[name="player-left-right-hand-radio"]').removeAttr('checked');
        $("#player-is-active-checkbox").prop('checked', true);
        app.smartSelect.get("#club-connection-smart-select").setValue("");
        editPlayerPopup.open();
    });

    $("#edit-player-close-button").click(() => {
        editPlayerPopup.close();
    });

});
var playerBeingEdited;
function listPlayersToEdit() {
    $('#players ul').empty();
    $("[name='club-connection-select']").empty();
    $("[name='club-connection-select']").append("<option></option>");
    app.preloader.show();
    var postData = { 'command': "listPlayers" };
    $.post("/MobileWeb/ballbyball/CommandHandler.ashx?includeInactive=true",
            JSON.stringify(postData),
            function(data) {
                app.preloader.hide();
                //success
                $.each(data,
                    function(i, p) {
                        var displayName = p.surname + ', ' + p.firstName;
                        if (!p.isActive) {
                            displayName += " [inactive]";
                        }
                        $('#players ul').append('' +
                            '<li>' +
                            '   <div class="item-content">' +
                            '       <div class="item-inner">' +
                            '           <div class="item-title">'+displayName+'</div>' +
                            '           <div class="item-after"><i class="material-icons md-18 edit-player" playerId="'+p.playerId+'">edit</i></div>' +
                            '       </div>' +
                            '   </div>' +
                            '</li>');
                        $("[name='club-connection-select']").append(
                            $("<option></option>")
                            .attr("value", p.playerId)
                            .attr("playerId", p.playerId)
                            .text(displayName));
                    });
                $(".edit-player").click(function() {
                    var playerId = $(this).attr("playerId");
                    playerBeingEdited = data.filter(t => t.playerId == playerId)[0];
                    //TODO: setup editor
                    $("#player-firstname-input").val(playerBeingEdited.firstName);
                    $("#player-surname-input").val(playerBeingEdited.surname);
                    $("#player-middle-initials-input").val(playerBeingEdited.middleInitials);
                    $('[name="player-left-right-hand-radio"]').removeAttr('checked');
                    $("input[name=player-left-right-hand-radio][value=" + playerBeingEdited.isRightHandBat + "]").prop('checked', true);
                    if (playerBeingEdited.clubConnection != undefined) {
                        app.smartSelect.get("#club-connection-smart-select").setValue(playerBeingEdited.clubConnection.playerId);
                    }
                    $("#player-is-active-checkbox").prop('checked', playerBeingEdited.isActive);
                    editPlayerPopup.open();
                });
            },
            "json")
        .fail(function(data) {
            app.preloader.hide();
            showToastCenter(data.responseText);
        });
};



