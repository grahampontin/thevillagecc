var editCommitteePopup;
$$(document).on('page:init', '.page[data-name="committee"]', function (e) {
    if (e.detail.position !== "next") {
        return;
    }

    getPlayers(function (data) {
        addPlayersToSelect(data, "#committee-player-select");
    });

    listCommitteeToEdit();

    editCommitteePopup = app.popup.create({
        el: '.edit-committee-popup',
        closeByBackdropClick: false,
        on: {
            opened: function () {
                console.log('Committee Popup opened');
            }
        }
    });

    $("#save-committee-button").click(function () {
        editCommitteePopup.close();
        committeeBeingEdited.PlayerId = app.smartSelect.get("#committee-player-smart-select").getValue();
        var postVal = app.smartSelect.get("#committee-post-smart-select").getValue();
        if (postVal === 'Other') {
            committeeBeingEdited.Post = $("#committee-post-other-input").val();
        } else {
            committeeBeingEdited.Post = postVal;
        }
        committeeBeingEdited.Year = $("#committee-year-input").val();
        if (committeeBeingEdited.Id !== undefined) {
            //update
            $.ajax("/api/refdata/committee/" + committeeBeingEdited.Id, {
                method: "PUT",
                data: JSON.stringify(committeeBeingEdited),
                contentType: "application/json"
            })
                .done(function (data) {
                    app.preloader.hide();
                    listCommitteeToEdit();
                })
                .fail(restRequestFailed());
        } else {
            //create
            $.post("/api/refdata/committee/",
                JSON.stringify(committeeBeingEdited),
                function (data) {
                    app.preloader.hide();
                    listCommitteeToEdit();
                }, "json")
                .fail(restRequestFailed());
        }
        app.preloader.show();
    });


    $("#add-committee-button").click(function () {
        committeeBeingEdited = {};
        app.smartSelect.get("#committee-player-smart-select").setValue("");
        app.smartSelect.get("#committee-post-smart-select").setValue("");
        $("#committee-post-other-input").val("");
        $("#committee-year-input").val(committeeYear);
        editCommitteePopup.open();
    });

    $("#edit-committee-close-button").click(function () {
        editCommitteePopup.close();
    });

    $("#committee-previous-year").click(function () {
        committeeYear = committeeYear - 1;
        listCommitteeToEdit();
    });
    $("#committee-next-year").click(function () {
        committeeYear = committeeYear + 1;
        listCommitteeToEdit();
    });

    $("#committee-post-smart-select").on('change', function () {
        var val = app.smartSelect.get('#committee-post-smart-select').getValue();
        if (val === 'Other') {
            $("#committee-post-other-element").show();
        } else {
            $("#committee-post-other-element").hide();
        }
    });

});

var committeeBeingEdited;
var committeeYear = new Date().getFullYear();

function listCommitteeToEdit() {
    $('#committee-list ul').empty();
    app.preloader.show();
    $.get("/api/refdata/committee/?year=" + committeeYear,
        function (data) {
            app.preloader.hide();
            $('#committee-current-year').text(committeeYear);
            $.each(data,
                function (i, o) {
                    $('#committee-list ul').append('' +
                        '<li>' +
                        '   <div class="item-content">' +
                        '       <div class="item-inner">' +
                        '           <div class="item-title">' + o.Year + ' ' + o.Post + '</div>' +
                        '           <div class="item-after">' +
                        '               <span class="material-symbols-outlined md-18 edit-committee" id="' + o.Id + '">edit</span>' +
                        '               <span class="material-symbols-outlined md-18 ms-2 delete-committee" id="del-' + o.Id + '" style="color:#d9534f">delete</span>' +
                        '           </div>' +
                        '       </div>' +
                        '   </div>' +
                        '</li>');
                });

            $(".edit-committee").click(function () {
                var Id = $(this).attr("Id");
                committeeBeingEdited = data.filter(t => t.Id == Id)[0];
                app.smartSelect.get("#committee-player-smart-select").setValue(committeeBeingEdited.PlayerId);
                //if post is one of the select options, set it, otherwise set Other and fill text
                var postOpt = Array.from(document.getElementById('committee-post-select').options).find(o=>o.value===committeeBeingEdited.Post);
                if (postOpt) {
                    app.smartSelect.get("#committee-post-smart-select").setValue(committeeBeingEdited.Post);
                    $("#committee-post-other-element").hide();
                } else {
                    app.smartSelect.get("#committee-post-smart-select").setValue('Other');
                    $("#committee-post-other-element").show();
                    $("#committee-post-other-input").val(committeeBeingEdited.Post);
                }

                $("#committee-year-input").val(committeeBeingEdited.Year);
                editCommitteePopup.open();
            });

            $(".delete-committee").click(function () {
                var idAttr = $(this).attr("Id");
                // idAttr is in format 'del-<id>'
                var Id = idAttr && idAttr.startsWith('del-') ? idAttr.substring(4) : idAttr;
                if (!confirm('Delete this committee post?')) return;
                app.preloader.show();
                $.ajax('/api/refdata/committee/' + Id, { method: 'DELETE' })
                    .done(function () {
                        app.preloader.hide();
                        listCommitteeToEdit();
                    })
                    .fail(restRequestFailed());
            });
        },
        "json")
        .fail(restRequestFailed());
}
