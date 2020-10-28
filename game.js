var ans;
var score = 0;
var backgroundImages = [];

function genQuestion() {
    n1 = Math.floor(Math.random() * 5);
    document.getElementById('n1').innerHTML = n1;
    n2 = Math.floor(Math.random() * 6);
    document.getElementById('n2').innerHTML = n2;
    ans = n1 + n2;
}

function checkAns() {
    var prediction = processImage();
    if (ans == prediction) {
        score++;
        if (score <= 6) {
            setTimeout(function () {
                backgroundImages.push(`url(images/background${score}.svg)`);
                document.body.style.backgroundImage = backgroundImages;
            }, 500)
        } else {
            alert('Congrats, Your garden has fully grown. Play another round?')
            score = 0;
            backgroundImages = [];
            document.body.style.backgroundImage = backgroundImages;
        }
    }
    else {
        if (score != 0) { score--; }
        alert('Woops! wrong answer :(')
        setTimeout(function () {
            backgroundImages.pop();
            document.body.style.backgroundImage = backgroundImages;
        }, 500)

    }
}