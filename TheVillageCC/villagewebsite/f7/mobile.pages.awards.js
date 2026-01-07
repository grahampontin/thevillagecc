var editAwardPopup;
$$(document).on('page:init', '.page[data-name="awards"]', function (e) {
    if (e.detail.position !== "next") {
        return;
    }
    //Bind handlers here
    listAwardsToEdit();
    //once bound...

    editAwardPopup = app.popup.create({
        el: '.edit-award-popup',
        closeByBackdropClick: false,
        on: {
            opened: function () {
                console.log('Award Popup opened');
            }
        }
    });

    

    $("#save-award-button").click(() => {
        editAwardPopup.close();
        //TODO:
        awardBeingEdited.PlayerId = app.smartSelect.get("#player-smart-select").getValue();
        awardBeingEdited.Award = app.smartSelect.get("#award-type-smart-select").getValue();
        awardBeingEdited.Year = $("#award-date-input").val();
        awardBeingEdited.Data = $("#award-data-input").val();
        if (awardBeingEdited.Id !== undefined) {
            //update award
            $.put("/awards/",
                JSON.stringify(awardBeingEdited),
                restRequestSucceeded(), "json")
                .fail(restRequestFailed())

        } else {
            //create award
            $.post("/awards/",
                JSON.stringify(awardBeingEdited),
                restRequestSucceeded(), "json")
                .fail(restRequestFailed())

        }
        app.preloader.show();
    });

    $("#add-award-button").click(() => {
        awardBeingEdited = {};
        app.smartSelect.get("#player-smart-select").setValue("");
        editAwardPopup.open();

    });

    $("#edit-award-close-button").click(() => {
        editAwardPopup.close();
        $("#award-name-input").val("");
    });

    $("#awards-previous-season").click(function () {
        awardsSeason = awardsSeason - 1;
        ;
        listAwardsToEdit();
    });
    $("#awards-next-season").click(function () {
        awardsSeason = awardsSeason + 1;
        listAwardsToEdit();
    });

});
var awardBeingEdited;
var awardsSeason = new Date().getFullYear();

function restRequestFailed() {
    return function (data) {
        app.preloader.hide();
        showToastCenter(data.responseText);
    };
}

function restRequestSucceeded() {
    return function (data) {
        app.preloader.hide();
        listAwardsToEdit();
    };
}

function listAwardsToEdit() {
    $('#awards ul').empty();
    app.preloader.show();
    $.get("/awards/",
        function (data) {
            app.preloader.hide();
            //success
            $('#awards-current-season').text(awardsSeason);
            $.each(data,
                function (i, o) {
                    $('#awards ul').append('' +
                        '<li>' +
                        '   <div class="item-content">' +
                        '       <div class="item-inner">' +
                        '           <div class="item-title">' + o.Award + ' (' + o.Year + ')</div>' +
                        '           <div class="item-after"><i class="material-icons md-18 edit-award" id="' + o.Id + '">edit</i></div>' +
                        '       </div>' +
                        '   </div>' +
                        '</li>');
                });
            $(".edit-award").click(function () {
                var Id = $(this).attr("Id");
                awardBeingEdited = data.filter(t => t.Id == Id)[0];
                app.smartSelect.get("#player-smart-select").setValue(awardBeingEdited.PlayerId);
                app.smartSelect.get("#award-type-smart-select").setValue(awardBeingEdited.Award);
                $("#award-date-input").val(awardBeingEdited.Year);
                $("#award-data-input").val(awardBeingEdited.Data);
                editAwardPopup.open();
            });
        },
        "json")
        .fail(restRequestFailed());
};

function toString(jsDate) {
    var month = jsDate.getMonth() + 1;
    return jsDate.getDate() + "/" + month + "/" + jsDate.getFullYear();
}