﻿var editMatchPopup;
var editMatchCalendar;
$$(document).on('page:init', '.page[data-name="matches"]', function (e) {
    if (e.detail.position != "next") {
        return;
    }
    populateTeamsAndVenues();
    //Bind handlers here
    listMatchesToEdit();
    //once bound...

    editMatchPopup = app.popup.create({
        el: '.edit-match-popup',
        closeByBackdropClick: false,
        on: {
            opened: function() {
                console.log('Matches Popup opened');
            }
        }
    });

    $("#save-match-button").click(() => {
        editMatchPopup.close();
        //TODO:
        matchBeingEdited.Opposition.Id = app.smartSelect.get("#opposition-smart-select").getValue();
        matchBeingEdited.Venue.Id = app.smartSelect.get("#venue-smart-select").getValue();
        matchBeingEdited.Type = app.smartSelect.get("#match-type-smart-select").getValue();
        matchBeingEdited.Date = toString(editMatchCalendar.getValue()[0]);
        
        app.preloader.show();
        var httpMethod = matchBeingEdited.Id != undefined ? "PUT" : "POST";
        $.ajax({
            url: "/api/refdata/matches",
            type: httpMethod,
            data: JSON.stringify(matchBeingEdited),
            contentType: "application/json",
            dataType: "json",
            success: function(data) {
                app.preloader.hide();
                listMatchesToEdit();
            },
            error: function(data) {
                app.preloader.hide();
                showToastCenter(data.responseText);
            }
        });
    });

    $("#add-match-button").click(() => {
        matchBeingEdited = {
            Opposition: {},
            Venue: {}
        };
        app.smartSelect.get("#opposition-smart-select").setValue("");
        app.smartSelect.get("#venue-smart-select").setValue("");
        app.smartSelect.get("#match-type-smart-select").setValue("Friendly");
        editMatchCalendar.setValue([new Date()]);
        editMatchPopup.open();
        
    });

    $("#edit-match-close-button").click(() => {
        editMatchPopup.close();
        $("#match-name-input").val("");
    });

    $("#matches-previous-season").click(function() {
        matchesSeason = matchesSeason - 1;;
        listMatchesToEdit();
    });
    $("#matches-next-season").click(function() {
        matchesSeason = matchesSeason + 1;
        listMatchesToEdit();
    });

    editMatchCalendar = app.calendar.create({
        inputEl: '#match-date-input',
        dateFormat: { weekday: 'long', month: 'long', day: '2-digit', year: 'numeric' }
    });

});
var matchBeingEdited;
var matchesSeason = new Date().getFullYear(); 
function listMatchesToEdit() {
    $('#matches ul').empty();
    app.preloader.show();
    $.get("/api/refdata/matches?season=" + matchesSeason,
            function(data) {
                app.preloader.hide();
                //success
                $('#matches-current-season').text(matchesSeason);
                $.each(data,
                    function(i, o) {
                        $('#matches ul').append('' +
                            '<li>' +
                            '   <div class="item-content">' +
                            '       <div class="item-inner">' +
                            '           <div class="item-title">'+o.Opposition.Name+' ('+o.Date+')</div>' +
                            '           <div class="item-after"><span class="material-symbols-outlined md-18 edit-match" matchId="'+o.Id+'">edit</span></div>' +
                            '       </div>' +
                            '   </div>' +
                            '</li>');
                    });
                $(".edit-match").click(function() {
                    var matchId = $(this).attr("matchId");
                    matchBeingEdited = data.filter(t => t.Id == matchId)[0];
                    app.smartSelect.get("#opposition-smart-select").setValue(matchBeingEdited.Opposition.Id);
                    app.smartSelect.get("#venue-smart-select").setValue(matchBeingEdited.Venue.Id);
                    app.smartSelect.get("#match-type-smart-select").setValue(matchBeingEdited.Type);
                    editMatchCalendar.setValue([toDate(matchBeingEdited.Date)]);
                    editMatchPopup.open();
                });
            },
            "json")
        .fail(function(data) {
            app.preloader.hide();
            showToastCenter(data.responseText);
        });
};

function toString(jsDate) {
    var month = jsDate.getMonth() + 1;
    return jsDate.getDate() + "/" + month + "/" + jsDate.getFullYear();
}

function toDate(ddMMYYYY) {
    var bits = ddMMYYYY.split("/");
    return new Date(bits[2], bits[1]-1, bits[0]);
}

function populateTeamsAndVenues() {
    app.preloader.show();
    $.get("/venues/",
            function(venues) {
                //success
                //add venues to smart select
                addVenuesToSmartSelect(venues);
                $.get("/api/refdata/teams",
                        function(teams) {
                            //success
                            //add teams to smart select
                            addTeamsToSmartSelect(teams);
                        },
                        "json")
                    .fail(function(data) {
                        app.preloader.hide();
                        showToastCenter(data.responseText);
                    });
            },
            "json")
        .fail(function(data) {
            app.preloader.hide();
            showToastCenter(data.responseText);
        });
}

function addVenuesToSmartSelect(venues) {
    var select = $('#venue-select');
    select.empty();
    select.append($("<option></option>").attr("selected", "selected"));
    $.each(venues,
        function(i, o) {
            select.append($("<option></option>")
                .attr("value", o.Id)
                .attr("venueId", o.Id)
                .text(o.Name));
        }
    );
}

function addTeamsToSmartSelect(teams) {
    var select = $('#opposition-select');
    select.empty();
    select.append($("<option></option>").attr("selected", "selected"));
    $.each(teams,
        function(i, o) {
            select.append($("<option></option>")
                .attr("value", o.Id)
                .attr("teamId", o.Id)
                .text(o.Name));
        }
    );
}



