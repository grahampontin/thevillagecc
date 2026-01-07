var editAwardPopup;
$$(document).on('page:init', '.page[data-name="awards"]', function (e) {
    if (e.detail.position !== "next") {
        return;
    }
    
    getPlayers(function (data) {
        addPlayersToSelect(data,"#player-select");
    })
    
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
            $.ajax("/awards/", {
                method: "PUT",
                data: JSON.stringify(awardBeingEdited),
                contentType: "application/json"
            })
                .done(restRequestSucceeded())
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
        awardBeingEdited.Year = awardsSeason;
        $("#award-date-input").val(awardsSeason);
        app.smartSelect.get("#award-type-smart-select").setValue("");
        $("#award-data-input").val("");
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


function restRequestSucceeded() {
    return function (data) {
        app.preloader.hide();
        listAwardsToEdit();
    };
}

function listAwardsToEdit() {
    $('#awards ul').empty();
    app.preloader.show();
    $.get("/awards/?season=" + awardsSeason,
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
                        '           <div class="item-title">' + o.Year + ' ' + o.Award + '</div>' +
                        '           <div class="item-after"><span class="material-symbols-outlined md-18 edit-award" id="' + o.Id + '">edit</span> <span class="material-symbols-outlined md-18 ms-2 delete-award" id="del-' + o.Id + '" style="color:#d9534f">delete</span></div>' +
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

            $(".delete-award").click(function () {
                var idAttr = $(this).attr("Id");
                var Id = idAttr && idAttr.startsWith('del-') ? idAttr.substring(4) : idAttr;
                if (!confirm('Delete this award?')) return;
                app.preloader.show();
                $.ajax('/awards/' + Id, { method: 'DELETE' })
                    .done(function () {
                        app.preloader.hide();
                        listAwardsToEdit();
                    })
                    .fail(restRequestFailed());
            });
        },
        "json")
        .fail(restRequestFailed());
};

function toString(jsDate) {
    var month = jsDate.getMonth() + 1;
    return jsDate.getDate() + "/" + month + "/" + jsDate.getFullYear();
}