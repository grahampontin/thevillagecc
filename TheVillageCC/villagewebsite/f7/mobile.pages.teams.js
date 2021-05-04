var editTeamPopup;
$$(document).on('page:init', '.page[data-name="teams"]', function (e) {
    if (e.detail.position != "next") {
        return;
    }
    //Bind handlers here
    listTeams();
    //once bound...

    editTeamPopup = app.popup.create({
        el: '.edit-team-popup',
        closeByBackdropClick: false,
        on: {
            opened: function() {
                console.log('Teams Popup opened');
            }
        }
    });

    $("#save-team-button").click(() => {
        editTeamPopup.close();
        teamBeingEdited.Name = $("#team-name-input").val();
        var postData;
        if (teamBeingEdited.Id != undefined) {
            postData = { 'command': "updateTeam", "payload": teamBeingEdited };
        } else {
            postData = { 'command': "createTeam", "payload": teamBeingEdited };
        }
        app.preloader.show();
        $.post("/MobileWeb/ballbyball/CommandHandler.ashx",
                    JSON.stringify(postData),
                    function(data) {
                        app.preloader.hide();
                        listTeams();
                    },
                    "json")
                .fail(function(data) {
                    app.preloader.hide();
                    showToastCenter(data.responseText);
                })
            ;
    });

    $("#add-team-button").click(() => {
        teamBeingEdited = {
            Name: ""
        };
        editTeamPopup.open();
        $("#team-name-input").val("");
    });

    $("#edit-team-close-button").click(() => {
        editTeamPopup.close();
        $("#team-name-input").val("");
    });
});
var teamBeingEdited;
function listTeams() {
    $('#teams ul').empty();
    app.preloader.show();
    var postData = { 'command': "listTeams" };
    $.post("/MobileWeb/ballbyball/CommandHandler.ashx",
            JSON.stringify(postData),
            function(data) {
                app.preloader.hide();
                //success
                $.each(data,
                    function(i, o) {
                        $('#teams ul').append('' +
                            '<li>' +
                            '   <div class="item-content">' +
                            '       <div class="item-inner">' +
                            '           <div class="item-title">'+o.Name+'</div>' +
                            '           <div class="item-after"><i class="material-icons md-18 edit-team" teamId="'+o.Id+'">edit</i></div>' +
                            '       </div>' +
                            '   </div>' +
                            '</li>');
                    });
                $(".edit-team").click(function() {
                    var teamId = $(this).attr("teamId");
                    teamBeingEdited = data.filter(t => t.Id == teamId)[0];
                    $("#team-name-input").val(teamBeingEdited.Name);
                    editTeamPopup.open();
                });
            },
            "json")
        .fail(function(data) {
            app.preloader.hide();
            showToastCenter(data.responseText);
        });
};



