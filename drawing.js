const BG = '#000000'
const LINE_COLOR = '#FFFFFF'
const LINE_WIDTH = 15;

var currX = 0;
var currY = 0;
var prevX = 0;
var prevY = 0;

var isPaint = false;

var canvas;
var context;

function drawCanvas() {

    canvas = document.getElementById('cnvs');
    context = canvas.getContext('2d');

    context.fillStyle = BG;
    context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight)

    context.strokeStyle = LINE_COLOR;
    context.lineWidth = LINE_WIDTH;
    context.lineJoin = 'round';

    document.addEventListener('mousedown', function (event) {
        isPaint = true;
        currX = event.clientX - canvas.offsetLeft;
        currY = event.clientY - canvas.offsetTop;
    });

    document.addEventListener('mousemove', function (event) {

        if (isPaint) {

            prevX = currX;
            currX = event.clientX - canvas.offsetLeft;
            prevY = currY;
            currY = event.clientY - canvas.offsetTop;

            draw();
        }
    });

    document.addEventListener('mouseup', function (event) {
        isPaint = false;
    });

    canvas.addEventListener('mouseleave', function(event) {
        isPaint = false;
    });

    // Touch Events

    canvas.addEventListener('touchstart', function(event) {
        isPaint = true;
        currX = event.touches[0].clientX - canvas.offsetLeft;
        currY = event.touches[0].clientY - canvas.offsetTop;
    });

    canvas.addEventListener('touchmove', function (event) {

        if (isPaint) {

            prevX = currX;
            currX = event.touches[0].clientX - canvas.offsetLeft;
            prevY = currY;
            currY = event.touches[0].clientY - canvas.offsetTop;

            draw();
        }
    });

    canvas.addEventListener('touchend', function (event) {
        isPaint = false;
    });

    canvas.addEventListener('touchcancel', function(event) {
        isPaint = false;
    });
}

function draw() {
    context.beginPath();
    context.moveTo(prevX, prevY);
    context.lineTo(currX, currY);
    context.closePath();
    context.stroke();
}

function clearCanvas() {
    var currX = 0;
    var currY = 0;
    var prevX = 0;
    var prevY = 0;
    context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight)

}