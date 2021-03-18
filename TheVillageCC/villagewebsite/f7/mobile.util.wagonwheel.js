var stumpsX;
var stumpsY;
var drawing;
var mouseX;
var mouseY;
var canvas;
var img = new Image();
var trackBoundary = false;

function initializeWagonWheel(canvasElement, touchEndHandler) {
    canvas = document.getElementById(canvasElement);
    var ctx = canvas.getContext('2d');
    var fontInPx = parseFloat(getComputedStyle(canvas).fontSize);
    
    img.onload = function() {
        if (window.innerHeight > window.innerWidth) {
            canvas.width = window.innerWidth;
            canvas.height = img.naturalHeight * (canvas.width / img.naturalWidth);
        } else {
            canvas.height = window.innerHeight - (fontInPx*10); //minus 10ems
            canvas.width = window.innerWidth;
        }
        var imageWidth = img.naturalWidth*(canvas.height/img.naturalHeight);
        ctx.drawImage(img, canvas.width/2-imageWidth/2, 0, imageWidth, canvas.height);
    };
    img.src = '/img/wagon-wheel-grey.png';
    drawing = false;



    canvas.addEventListener("touchstart", function (e) {
        drawing = true;
        var bounds = canvas.getBoundingClientRect();
        stumpsY = bounds.height*0.425;
        stumpsX = bounds.width/2;
        mouseX = e.touches[0].clientX - bounds.left;
        mouseY = e.touches[0].clientY - bounds.top;
        update();
    }, false);
    canvas.addEventListener("touchend", function (e) {
        drawing = false;
        var angle = getBallAngle();
        var magnitude = trackBoundary ? null : distanceBetweenTwoPoints(stumpsX, stumpsY, mouseX, mouseY) / canvas.width; 
        touchEndHandler(angle, magnitude);
    }, false);
    canvas.addEventListener("touchmove", function (e) {
        var boundingClientRect = canvas.getBoundingClientRect();
        mouseX = e.touches[0].clientX - boundingClientRect.left;
        mouseY = e.touches[0].clientY - boundingClientRect.top;
    }, false);

    function update() {
        if (!drawing) {
            return;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var imageWidth = img.naturalWidth*(canvas.height/img.naturalHeight);
        ctx.drawImage(img, canvas.width/2-imageWidth/2, 0, imageWidth, canvas.height);
        ctx.beginPath();
        ctx.moveTo(stumpsX, stumpsY);
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#2196f3';
        if (!trackBoundary) {
            if (distanceBetweenTwoPoints(stumpsX, canvas.height/2, mouseX, mouseY) > imageWidth/2) {
                var correctedLocation = moveToBoundary(stumpsX, stumpsY);
                ctx.lineTo(correctedLocation.x, correctedLocation.y);
            } else {
                ctx.lineTo(mouseX, mouseY);
            }
        } else {
            ctx.strokeStyle = '#FF0000';
            var newLocation = moveToBoundary(stumpsX, stumpsY);
            ctx.lineTo(newLocation.x, newLocation.y);
        }
        ctx.stroke();
 
        requestAnimationFrame(update);
    }

}

function moveToBoundary(stumpsX, stumpsY) {
    var imageWidth = img.naturalWidth*(canvas.height/img.naturalHeight);
    var squareBoundary = imageWidth / 2;
    var straightBoundary =  canvas.height / 2;
    var angle = getBallAngle();
    var result = {};
    result.x = Math.round(Math.cos(angle - (Math.PI / 2)) * squareBoundary) + stumpsX;
    result.y = Math.round(Math.sin(angle - (Math.PI / 2)) * straightBoundary) + canvas.height/2;
    return result;
}

function closeWagonWheel() {
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var imageWidth = img.naturalWidth*(canvas.height/img.naturalHeight);
    ctx.drawImage(img, canvas.width/2-imageWidth/2, 0, imageWidth, canvas.height);
    
}

function setWagonWheelTrackBoundary(shouldTrack) {
    trackBoundary = shouldTrack;
}

function getBallAngle() {
    var boundingClientRect = canvas.getBoundingClientRect();
    var fixedX = canvas.width / 2 - boundingClientRect.left;
    var fixedY = boundingClientRect.top;
    return angleBetweenTwoPointsWithFixedPoint(mouseX, mouseY, fixedX, fixedY, stumpsX, stumpsY);
}

function getScoringArea(angleInRadians) {
    if (angleInRadians == undefined) {
        return "Somewhere";
    }
    if (angleInRadians < (Math.PI * 0.25)) {
        return "Fine Leg";
    }
    if (angleInRadians < (Math.PI * 0.325)) {
        return "Backwards Square Leg";
    }
    if (angleInRadians < (Math.PI * 0.5)) {
        return "Square Leg";
    }
    if (angleInRadians < (Math.PI * 0.75)) {
        return "Mid-wicket";
    }
    if (angleInRadians < (Math.PI)) {
        return "Mid-on";
    }
    if (angleInRadians < (Math.PI * 1.25)) {
        return "Mid-off";
    }
    if (angleInRadians < (Math.PI * 1.5)) {
        return "Cover";
    }
    if (angleInRadians < (Math.PI * 1.75)) {
        return "Point";
    }
    return "Third Man";
}