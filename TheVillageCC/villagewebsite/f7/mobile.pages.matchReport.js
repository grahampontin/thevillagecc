var matchReportData;
$$(document).on('page:init', '.page[data-name="matchReport"]', function(e) {
    //Do stuff
    app.preloader.show();

        var postData = { 'command': "getMatchReport", 'matchId': matchId };
        $.post("/MobileWeb/ballbyball/CommandHandler.ashx",
                JSON.stringify(postData),
                function(data) {
                    //success
                    matchReportData = data;
                    var conditions = data.Conditions;
                    if (conditions != "Not recorded") {
                        $("#match-report-conditions-textarea").val(conditions);
                    }
                    var report = data.Report;
                    if (report != "No report") {
                        app.textEditor.get("#match-report-text-editor").setValue(report);
                    }
                    if (data.Base64EncodedImage != undefined && data.Base64EncodedImage != null && data.Base64EncodedImage != "") {
                        displayMatchReportImage(data.Base64EncodedImage);
                    }
                    app.preloader.hide();
                },
                "json")
            .fail(function(data) {
                app.preloader.hide();
                showToastCenter(data.responseText);
            });

    $("#save-match-report-button").click(() => {
        matchReportData.Conditions = $("#match-report-conditions-textarea").val();
        matchReportData.Report = app.textEditor.get("#match-report-text-editor").getValue();
        matchReportData.Base64EncodedImage = $("#match-report-image").attr('src');
        app.preloader.show();
        var postData = { 'command': "saveMatchReport", 'matchId': matchId, 'payload': matchReportData };
        $.post("/MobileWeb/ballbyball/CommandHandler.ashx",
                JSON.stringify(postData),
                function(data) {
                    //success
                    app.preloader.hide();
                },
                "json")
            .fail(function(data) {
                app.preloader.hide();
                showToastCenter(data.responseText);
            });
    });

    $("#match-report-image-chooser-button").click(() => {
        $("#match-report-file-input").click();

    });

    var reader = new FileReader();
    var canvas = document.getElementById('match-report-canvas');
    var context = canvas.getContext('2d');
    var cropper;

    $("#match-report-image-crop-button").click(() => {
        var croppedImageDataURL = $("#match-report-canvas").cropper('getCroppedCanvas').toDataURL("image/png");
        displayMatchReportImage(croppedImageDataURL);

    });

    $("#match-report-file-input").on("change", e => {
        var fileList = e.target.files;
        var file = null;

        for (let i = 0; i < fileList.length; i++) {
            if (fileList[i].type.match(/^image\//)) {
                file = fileList[i];
                break;
            }
        }


        if (file !== null) {
            

            reader.onload = function (e) {
                $("#match-report-image").hide();
                $("#match-report-image-crop-button").show();
                $("#match-report-image-chooser-button").text("Change it");
                $("#match-report-image-buttons-container").addClass("row");
                var img = new Image();
                img.onload = function() {
                    var height;
                    var width;
                    if (img.width > img.height) {
                        height = 500;
                        width = img.width * (500/img.height);
                    } else {
                        height = img.height * (500/img.width);
                        width = 500;
                    }
                    canvas.width = width;
                    canvas.height = height;
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    context.drawImage(img, 0, 0, width, height);
                    
                    $("#match-report-canvas").cropper('destroy').cropper({
                        aspectRatio: 1 / 1,
                        guides: false,
                        scalable: false,
                        rotatable: false,
                        zoomable: false,
                        minCanvasHeight: height,
                        minContainerHeight: height,
                        crop: function(event) {
                        }
                    });
                };
                img.src = e.target.result;
               
            };

            reader.readAsDataURL(file);
        }

        

    });

});

function displayMatchReportImage(src) {
    $("#match-report-canvas").cropper('destroy');
    $("#match-report-image-chooser-button").text("Change it");
    $("#match-report-canvas").hide();
    $("#match-report-image").attr('src', src);
    $("#match-report-image").show();
    $("#match-report-image-crop-button").hide();
    $("#match-report-image-buttons-container").removeClass("row");
}
