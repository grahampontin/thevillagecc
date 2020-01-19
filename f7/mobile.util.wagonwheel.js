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
    
    img.onload = function() {
        canvas.width = window.innerWidth;
        canvas.height = img.naturalHeight * (canvas.width / img.naturalWidth);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
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
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.moveTo(stumpsX, stumpsY);
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#2196f3';
        if (!trackBoundary) {
            ctx.lineTo(mouseX, mouseY);
        } else {
            var newLocation = moveToBoundary(mouseX, mouseY);
            ctx.lineTo(newLocation.x, newLocation.y);
        }
        ctx.stroke();
 
        requestAnimationFrame(update);
    }

}

function moveToBoundary() {
    var squareBoundary = canvas.width / 2;
    var angle = getBallAngle();
    var result = {};
    result.x = Math.round(Math.cos(angle - (Math.PI / 2)) * squareBoundary + mouseX);
    result.y = Math.round(Math.sin(angle - (Math.PI / 2)) * squareBoundary + mouseY);
    return result;
}

function closeWagonWheel() {
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
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