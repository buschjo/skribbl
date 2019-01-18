var model;
var canvas;
var classNames = [];
var coords = [];
var mousePressed = false;
var mode;
var timer;
var eval;
var word;
var time;
var startingTimeForVictoryScreen;

/*
Screens
*/
var startScreen = document.getElementById("start");
var gameScreen = document.getElementById("game");
var endScreen = document.getElementById("end");

//Function call after startbutton click
$('.start-game').on('click', tutorial);

/*
Game Function
*/
function startGame() {
    erase();
    resetTimer(timer);
    clearInterval(eval);
    word = classNames[getRandomInt(100)];
    console.log(classNames.length);
    console.log(word);
    gameScreen.scrollIntoView();
    countdown(word);
    setTimeout(function () {
        startTimer();
        evaluate(word);
    }, 5000)
}

/*
Stop Game
*/
function stopGame() {
    endScreen.scrollIntoView();
    resetTimer(timer);
    clearInterval(eval);

}

/*
Show Tutorial
*/
function tutorial() {
    gameScreen.scrollIntoView();
    document.getElementById("overlay").style.display = "block";
    document.getElementById("skip").style.display = "block";
    document.getElementById("nextstep").style.display = "block";
    document.getElementById("overlay-text").innerText = "Tutorial: Draw the word! Get it to the top before the times runs out!";
}

/*
Skip Tutorial
*/
function skipTutorial() {
    document.getElementById("skip").style.display = "none";
    document.getElementById("nextstep").style.display = "none";
    startGame();
}

/*
Evaluate word, Victory/DefeatScreen, Calculated time
*/
function evaluate(word) {
    eval = setInterval(function () {
        var firstWord = document.getElementById('prob1').innerText;
        console.log(firstWord);
        var res = document.getElementById('result');
        var resButton = document.getElementById('res-button');

        if (word == firstWord) {
            var percent = document.getElementById('prob1').style.width;
            var timeElapsed = calculateTimeElapsed() / 1000;
            res.innerHTML = "<h1>You won!</h1><p>The AI is</p><p>" + percent + "</p><p>sure.</p><p> You needed </p>" + timeElapsed + "<p> seconds.</p>"
            "<p>Times Cleared: " + eraseCounter + " </p>" +
                "<p>Times Undo: " + undoCounter + "</p>" +
                "<p>Finger lifted: " + fingerUpCounter + " times</p>";
            resButton.innerText = 'NEXT';

            stopGame();
        } else {
            res.innerHTML = "<h1>You lost!</h1><p>You were a little to slow.</p> " +
                "<p>Times Cleared: " + eraseCounter + " </p>" +
                "<p>Times Undo: " + undoCounter + "</p>" +
                "<p>Finger lifted: " + fingerUpCounter + " times</p>";
            resButton.innerText = 'TRY AGAIN';

        }

    }, 1000);

    reset_FingerUP_Undo_Erase_Counters();

    function calculateTimeElapsed() {
        var endTimeforVictoryScreen = Date.now();
        return endTimeforVictoryScreen - startingTimeForVictoryScreen;
    }


}

/*
Countdown word,3,2,1
*/
var countdownTotal = 4;
var countdownNumber = countdownTotal;
var overlayElement = document.getElementById("overlay");
var overlayTextElementWord = document.getElementById("overlay-text");
var overlayTextElementCountdown = document.getElementById("overlay-number");

function countdown(word) {
    countdownNumber = countdownTotal;
    overlayElement.style.display = "block";
    var count = setInterval(function () {
        overlayTextElementWord.textContent = word;
        if (countdownNumber <= 4 && countdownNumber > 1) {
            overlayTextElementCountdown.textContent = countdownNumber - 1;
        }
        if (countdownNumber == 1) {
            overlayTextElementCountdown.textContent = "Draw!";
        }
        if (countdownNumber <= 0) {
            clearInterval(count);
            overlayTextElementCountdown.textContent = "";
            overlay.style.display = "none";
            countdownNumber = countdownTotal;
        }
        countdownNumber--;

    }, 1000);
}

/*
Start Timer
*/
var getTimerElement = document.getElementById("timer");
var timerWidth = 100;
var totalTime = 20;
var timeLeft = totalTime;

function startTimer() {
    startingTimeForVictoryScreen = Date.now();
    timer = setInterval(function () {
        timeLeft = timeLeft - 0.1;
        timeLeft = timeLeft.toFixed(2);
        timerWidth = timeLeft * (100 / totalTime);
        getTimerElement.style.width = timerWidth + '%';

        // document.getElementById("timerNumber").textContent = timeLeft;
        makeColorTransitionforTimer();

        if (timeLeft <= 0) {
            stopGame();
        }
    }, 100);
}

function makeColorTransitionforTimer() {
    if (timerWidth <= 85 && timerWidth > 60) {
        getTimerElement.style.animation = "transition1 5s linear";
    }
    if (timerWidth <= 60 && timerWidth > 20) {
        getTimerElement.style.backgroundColor = "#ffde59";
    }
    if (timerWidth <= 20) {
        getTimerElement.style.animation = "transition2 4s linear";
    }
}

/*
Reset Timer
*/
function resetTimer(timer) {
    clearInterval(timer);
    timerWidth = 100;
    timeLeft = totalTime;
    getTimerElement.style.width = timerWidth + '%';
    // document.getElementById("timerNumber").textContent = timeLeft;
    getTimerElement.style.backgroundColor = "#7ed957";
}


/*
prepare the drawing canvas 
*/

var fingerUpCounter = 0;
$(function () {
    canvas = window._canvas = new fabric.Canvas('canvas');
    canvas.backgroundColor = '#ffffff';
    canvas.isDrawingMode = 0;
    canvas.freeDrawingBrush.color = "black";
    canvas.freeDrawingBrush.width = 10;
    canvas.renderAll();

    //setup listeners 
    canvas.on('mouse:up', function (e) {
        getFrame();
        mousePressed = false
        fingerUpCounter++;
    });
    canvas.on('mouse:down', function (e) {
        mousePressed = true
    });
    canvas.on('mouse:move', function (e) {
        recordCoor(e);
    });
})

/*
set the table of the predictions 
*/
function setTable(top5, probs) {
    //loop over the predictions 
    for (var i = 0; i < top5.length; i++) {
        let sym = document.getElementById('sym' + (i + 1));
        let prob = document.getElementById('prob' + (i + 1));
        let temp = probs[i];
        let mr = Math.round(temp * 100);
        prob.style.width = mr + '%';
        prob.innerHTML = top5[i];
        if (top5[i] == word) {
            prob.style.backgroundColor = "#5271ff";
        } else {
            prob.style.backgroundColor = "#545454";
        }
    }

}

/*
record the current drawing coordinates
*/
function recordCoor(event) {
    var pointer = canvas.getPointer(event.e);
    var posX = pointer.x;
    var posY = pointer.y;

    if (posX >= 0 && posY >= 0 && mousePressed) {
        coords.push(pointer)

    }


}

/*
get the best bounding box by trimming around the drawing
*/
function getMinBox() {
    //get coordinates 
    var coorX = coords.map(function (p) {
        return p.x
    });
    var coorY = coords.map(function (p) {
        return p.y
    });

    //find top left and bottom right corners 
    var min_coords = {
        x: Math.min.apply(null, coorX),
        y: Math.min.apply(null, coorY)
    }
    var max_coords = {
        x: Math.max.apply(null, coorX),
        y: Math.max.apply(null, coorY)
    }

    //return as strucut 
    return {
        min: min_coords,
        max: max_coords
    }
}

/*
get the current image data 
*/
function getImageData() {
    //get the minimum bounding box around the drawing 
    const mbb = getMinBox()

    //get image data according to dpi 
    const dpi = window.devicePixelRatio
    const imgData = canvas.contextContainer.getImageData(mbb.min.x * dpi, mbb.min.y * dpi,
        (mbb.max.x - mbb.min.x) * dpi, (mbb.max.y - mbb.min.y) * dpi);
    return imgData
}

/*
get the prediction 
*/
function getFrame() {
    //make sure we have at least two recorded coordinates 
    if (coords.length >= 2) {

        //get the image data from the canvas 
        const imgData = getImageData()

        //get the prediction 
        const pred = model.predict(preprocess(imgData)).dataSync()
        //find the top 5 predictions 
        const indices = findIndicesOfMax(pred, 5)
        const probs = findTopValues(pred, 5)
        const names = getClassNames(indices)

        //set the table 
        setTable(names, probs)
    }

}

/*
get the the class names 
*/
function getClassNames(indices) {
    var outp = []
    for (var i = 0; i < indices.length; i++)
        outp[i] = classNames[indices[i]]
    return outp
}

/*
load the class names 
*/
async function loadDict() {
    loc = 'modelNew10k/class_names.txt'

    await $.ajax({
        url: loc,
        dataType: 'text',
    }).done(success);
}

/*
load the class names
*/
function success(data) {
    const lst = data.split(/\n/)
    for (var i = 0; i < lst.length - 1; i++) {
        let symbol = lst[i]
        classNames[i] = symbol
    }
}

/*
get indices of the top probs
*/
function findIndicesOfMax(inp, count) {
    var outp = [];
    for (var i = 0; i < inp.length; i++) {
        outp.push(i); // add index to output array
        if (outp.length > count) {
            outp.sort(function (a, b) {
                return inp[b] - inp[a];
            }); // descending sort the output array
            outp.pop(); // remove the last index (index of smallest element in output array)
        }
    }
    return outp;
}

/*
find the top 5 predictions
*/
function findTopValues(inp, count) {
    var outp = [];
    let indices = findIndicesOfMax(inp, count)
    // show 5 greatest scores
    for (var i = 0; i < indices.length; i++)
        outp[i] = inp[indices[i]]
    return outp
}

/*
preprocess the data
*/
function preprocess(imgData) {
    return tf.tidy(() => {
        //convert to a tensor 
        let tensor = tf.fromPixels(imgData, numChannels = 1)

        //resize 
        const resized = tf.image.resizeBilinear(tensor, [28, 28]).toFloat()

        //normalize 
        const offset = tf.scalar(255.0);
        const normalized = tf.scalar(1.0).sub(resized.div(offset));

        //We add a dimension to get a batch shape 
        const batched = normalized.expandDims(0)
        return batched
    })
}

/*
load the model
*/
async function start(cur_mode) {
    //arabic or english
    mode = cur_mode;

    //load the model 
    model = await tf.loadModel('modelNew10k/model.json');

    //warm up 
    model.predict(tf.zeros([1, 28, 28, 1]));

    //allow drawing on the canvas 
    allowDrawing();

    //load the class names
    await loadDict();
    console.log('started');

}

// allow drawing
function allowDrawing() {
    canvas.isDrawingMode = 1;
    $('button').prop('disabled', false);
    // var slider = document.getElementById('myRange');
    // slider.oninput = function() {
    //     canvas.freeDrawingBrush.width = this.value;
    // };
}

// clear the canvas
var eraseCounter = 0;

function erase() {
    eraseCounter++;
    canvas.clear();
    canvas.backgroundColor = '#ffffff';
    var bars = document.getElementsByClassName("bar__full");
    for (let bar of bars) {
        bar.innerHTML = " ";
        bar.style.width = "0%";

    }
}
//undobutton 
var h = [];
var undoCounter;

function undo() {
    undoCounter++;
    if (canvas._objects.length > 1) {

        h.push(canvas._objects.pop());
        h.forEach(i => {
            console.log(i);
            console.log(h.length);

        });
        canvas.renderAll();
        getFrame();

    } else if (canvas._objects.length == 1) {
        h.push(canvas._objects.pop());
        erase();

    }
}

function reset_FingerUP_Undo_Erase_Counters() {
    undoCounter = 0;
    eraseCounter = 0;
    fingerUpCounter = 0;
}
/*
Info-Button
*/
let info = document.getElementsByClassName('info__container')[0];

function showInfo() {
    info.classList.add('active');
}

function hideInfo() {
    info.classList.remove('active')
}

/*
Function for random word
*/
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}