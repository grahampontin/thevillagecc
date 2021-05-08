var editVenuePopup;
$$(document).on('page:init', '.page[data-name="venues"]', function (e) {
    if (e.detail.position != "next") {
        return;
    }
    //Bind handlers here
    listVenues();
    //once bound...

    editVenuePopup = app.popup.create({
        el: '.edit-venue-popup',
        closeByBackdropClick: false,
        on: {
            opened: function() {
                console.log('Venues Popup opened');
            }
        }
    });

    $("#save-venue-button").click(() => {
        editVenuePopup.close();
        venueBeingEdited.Name = $("#venue-name-input").val();
        venueBeingEdited.MapUrl = $("#venue-location-input").val();
        var postData;
        if (venueBeingEdited.Id != undefined) {
            postData = { 'command': "updateVenue", "payload": venueBeingEdited };
        } else {
            postData = { 'command': "createVenue", "payload": venueBeingEdited };
        }
        app.preloader.show();
        $.post("/MobileWeb/ballbyball/CommandHandler.ashx",
                    JSON.stringify(postData),
                    function(data) {
                        app.preloader.hide();
                        listVenues();
                    },
                    "json")
                .fail(function(data) {
                    app.preloader.hide();
                    showToastCenter(data.responseText);
                })
            ;
    });

    $("#add-venue-button").click(() => {
        venueBeingEdited = {
            Name: "",
            MapUrl : ""
        };
        editVenuePopup.open();
        $("#venue-name-input").val("");
    });

    $("#edit-venue-close-button").click(() => {
        editVenuePopup.close();
        $("#venue-name-input").val("");
    });
});
var venueBeingEdited;
function listVenues() {
    $('#venues ul').empty();
    app.preloader.show();
    var postData = { 'command': "listVenues" };
    $.post("/MobileWeb/ballbyball/CommandHandler.ashx",
            JSON.stringify(postData),
            function(data) {
                app.preloader.hide();
                //success
                $.each(data,
                    function(i, o) {
                        $('#venues ul').append('' +
                            '<li>' +
                            '   <div class="item-content">' +
                            '       <div class="item-inner">' +
                            '           <div class="item-title">'+o.Name+'</div>' +
                            '           <div class="item-after"><i class="material-icons md-18 edit-venue" venueId="'+o.Id+'">edit</i></div>' +
                            '       </div>' +
                            '   </div>' +
                            '</li>');
                    });
                $(".edit-venue").click(function() {
                    var venueId = $(this).attr("venueId");
                    venueBeingEdited = data.filter(t => t.Id == venueId)[0];
                    $("#venue-name-input").val(venueBeingEdited.Name);
                    $("#venue-location-input").val(venueBeingEdited.MapUrl);
                    editVenuePopup.open();
                });
            },
            "json")
        .fail(function(data) {
            app.preloader.hide();
            showToastCenter(data.responseText);
        });
};



