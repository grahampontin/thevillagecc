function initPhotoCapture(inputId, uploadUrl) {
    if (window.File && window.FileReader && window.FormData) {
        var inputField = $('#'+inputId);

        inputField.on('change', function (e) {
            var file = e.target.files[0];

            if (file) {
                if (/^image\//i.test(file.type)) {
                    readFile(file, uploadUrl);
                } else {
                    alert('Not a valid image!');
                }
            }
        });
    } else {
        alert("File upload is not supported!");
    }
}


function readFile(file, uploadUrl) {
    var reader = new FileReader();

    reader.onloadend = function () {
        processFile(reader.result, file.type, uploadUrl);
    }

    reader.onerror = function () {
        alert('There was an error reading the file!');
    }

    reader.readAsDataURL(file);
}


function processFile(dataUrl, fileType, uploadUrl) {
    var maxWidth = 800;
    var maxHeight = 800;

    var image = new Image();
    image.src = dataUrl;

    image.onload = function () {
        var width = image.width;
        var height = image.height;
        var shouldResize = (width > maxWidth) || (height > maxHeight);

        if (!shouldResize) {
            sendFile(dataUrl, uploadUrl);
            return;
        }

        var newWidth;
        var newHeight;

        if (width > height) {
            newHeight = height * (maxWidth / width);
            newWidth = maxWidth;
        } else {
            newWidth = width * (maxHeight / height);
            newHeight = maxHeight;
        }

        var canvas = document.createElement('canvas');

        canvas.width = newWidth;
        canvas.height = newHeight;

        var context = canvas.getContext('2d');

        context.drawImage(this, 0, 0, newWidth, newHeight);

        dataUrl = canvas.toDataURL(fileType);

        sendFile(dataUrl, uploadUrl);
    };

    image.onerror = function () {
        alert('There was an error processing your file!');
    };
}

function sendFile(fileData, url) {
    var formData = new FormData();

    formData.append('imageData', fileData);

    $.ajax({
        type: 'POST',
        url: url,
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            if (data.success) {
                alert('Your file was successfully uploaded!');
            } else {
                alert('There was an error uploading your file!');
            }
        },
        error: function (data) {
            alert('There was an error uploading your file!');
        }
    });
}