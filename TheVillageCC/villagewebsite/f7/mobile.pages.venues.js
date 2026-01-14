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
        venueBeingEdited.Description = $("#venue-description-textarea").val();
        venueBeingEdited.Latitude = $("#venue-latitude-input").val();
        venueBeingEdited.Longitude = $("#venue-longitude-input").val();
        var url;
        var method;
        if (venueBeingEdited.Id != undefined) {
            url = "api/refdata/venues/";
            method = "PUT";
        } else {
            url = "api/refdata/venues/";
            method = "POST";
        }
        app.preloader.show();
        $.ajax({
                    url: url,
                    type: method,
                    data: JSON.stringify(venueBeingEdited),
                    contentType: "application/json",
                    dataType: "json",
                    success: function(data) {
                        app.preloader.hide();
                        listVenues();
                    },
                    error: function(data) {
                        app.preloader.hide();
                        showToastCenter(data.responseText);
                    }
                });
    });

    $("#add-venue-button").click(() => {
        venueBeingEdited = {
            Name: "",
            MapUrl : "",
            Description: "",
            Latitude: "",
            Longitude: ""
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
    $.get("/api/refdata/venues/",
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
                            '           <div class="item-after"><span class="material-symbols-outlined md-18 edit-venue" venueId="'+o.Id+'">edit</span> <span class="material-symbols-outlined md-18 ms-2 delete-venue" venueId="'+o.Id+'" style="color:#d9534f">delete</span></div>' +
                            '       </div>' +
                            '   </div>' +
                            '</li>');
                    });
                $(".edit-venue").click(function() {
                    var venueId = $(this).attr("venueId");
                    venueBeingEdited = data.filter(t => t.Id == venueId)[0];
                    $("#venue-name-input").val(venueBeingEdited.Name);
                    $("#venue-description-textarea").val(venueBeingEdited.Description);
                    $("#venue-location-input").val(venueBeingEdited.MapUrl);
                    $("#venue-latitude-input").val(venueBeingEdited.Latitude);
                    $("#venue-longitude-input").val(venueBeingEdited.Longitude);
                    editVenuePopup.open();
                });

                $(".delete-venue").click(function() {
                    var venueId = $(this).attr("venueId");
                    var venue = data.filter(t => t.Id == venueId)[0];
                    if (!confirm('Delete venue "' + venue.Name + '"?')) return;
                    app.preloader.show();
                    $.ajax('/api/refdata/venues/' + venueId, { method: 'DELETE' })
                        .done(function() {
                            app.preloader.hide();
                            listVenues();
                        })
                        .fail(function(data) {
                            app.preloader.hide();
                            showToastCenter(data.responseText);
                        });
                });
            },
            "json")
        .fail(function(data) {
            app.preloader.hide();
            showToastCenter(data.responseText);
        });
};
