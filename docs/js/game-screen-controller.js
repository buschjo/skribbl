( function () {
    const ScreenController = skribbl.ScreenController;
    

    const GameScreenController = function () {
        ScreenController.call(this);
    }
    GameScreenController.prototype = Object.create(ScreenController.prototype);
    GameScreenController.prototype.constructor = GameScreenController;

    var usedClassNames = skribbl.usedClassNames= []; //Words which are already won
    
    const elements = {
        tutorialDone: false
    }
    const countdown = {
        total: 5,
        number: 5
    }
    const timer = {
        width: 100,
        totalTime: 20,
        startTime: 0
    }
    

    Object.defineProperty(GameScreenController.prototype, "display", {
        value: function () {
            skribbl.clearScreen();
            const mainEl = document.querySelector("main");
            mainEl.appendChild(document.getElementById("game-template").content.cloneNode(true).firstElementChild);

            elements.overlay = document.getElementById("overlay");
            elements.skipButton = document.getElementById("skip");
            elements.nextStepButton = document.getElementById("nextstep");
            elements.overlayText = document.getElementById("overlay-text");
            elements.timer = document.getElementById("timer");
            elements.clearButton = document.getElementById("clear");   
            elements.undoButton = document.getElementById("undo");
            elements.countdownNumber = document.getElementById("overlay-number");          
            
            elements.clearButton.addEventListener("click", clear);
            elements.undoButton.addEventListener("click", function () {
                skribbl.canvasData.undo();
            });
            if (elements.tutorialDone) {
                startGame();
            } else {
                showTutorial();
            }
        }
    });

    Object.defineProperty(GameScreenController.prototype, "setup", {
        value: function () {
            skribbl.canvasData.setup();
        }
    });

    function clear() {        
        skribbl.canvasData.erase();
        var bars = document.getElementsByClassName("bar__full");
        for (let bar of bars) {
            bar.innerHTML = " ";
            bar.style.width = "0%";
        }
    }

    const drawBars = skribbl.drawBars = function (top5, probs) {
        //loop over the predictions 
        for (var i = 0; i < top5.length; i++) {
            let sym = document.getElementById('sym' + (i + 1));
            let prob = document.getElementById('prob' + (i + 1));
            let temp = probs[i];
            let mr = Math.round(temp * 100);
            prob.style.width = mr + '%';
            prob.innerHTML = top5[i];
            if (top5[i] == skribbl.word) {
                prob.style.backgroundColor = "#5271ff";
            } else {
                prob.style.backgroundColor = "#545454";
            }
        }
    }

    function startGame() {
        var randomNumber = getRandomInt(100);
        
        skribbl.word = skribbl.classNames[randomNumber];
        console.log(skribbl.word);
        startCountdown(skribbl.word);
        setTimeout(function () {
            startTimer();
        }, 5000);
        
    }

    function endGame() {
        skribbl.endScreenController.display();
        clearInterval(elements.timerInterval);
    }

    const evaluate = skribbl.evaluate = function (word) {
        if (skribbl.names[0] == word) {
            skribbl.timeElapsed = calculateTimeElapsed() / 1000;
            //setWordAsUsed(word);
            skribbl.win = true;
            endGame();
        } else {
            skribbl.win = false;
        }
        console.log("win: " + skribbl.win);
    }

    function showTutorial(){
        elements.overlay.style.display = "block";
        elements.skipButton.style.display = "block";
        elements.nextStepButton.style.display = "block";
        elements.overlayText.innerText = "Tutorial: Draw the word! Get it to the top before the times runs out!";
        elements.skipButton.addEventListener("click", function() {
            skipTutorial();
        });
    }
    
    function skipTutorial(){
        elements.skipButton.style.display = "none";
        elements.nextStepButton.style.display = "none";
        elements.tutorialDone = true;
        startGame();
    }

    function startCountdown(word) {
        elements.skipButton.style.display = "none";
        elements.nextStepButton.style.display = "none";
        elements.overlay.style.display = "block";
        elements.overlayText.innerText = word;
        var count = setInterval(function () {
            //todo refactor
            countdown.number--;
            if (countdown.number <= 4 && countdown.number > 1) {
                elements.countdownNumber.textContent = countdown.number - 1;
            }
            if (countdown.number == 1) {
                elements.countdownNumber.textContent = "Draw!";
            }
            if (countdown.number <= 0) {
                clearInterval(count);
                elements.overlay.style.display = "none";
                countdown.number = countdown.total;
            }
        }, 1000);
    }

    function startTimer() {   
        timer.startTime = Date.now();     
        let timerWidth = timer.width;
        let totalTime = timeLeft = timer.totalTime;
        elements.timerInterval = setInterval(function () {
            timeLeft = timeLeft - 0.1;
            timeLeft = timeLeft.toFixed(2);
            timerWidth = timeLeft * (100 / totalTime);
    
            elements.timer.style.width = timerWidth + '%';
            // document.getElementById("timerNumber").textContent = timeLeft;
            if (timerWidth <= 85 && timerWidth > 60) {
                elements.timer.style.animation = "transition1 5s linear";
            }
            if (timerWidth <= 60 && timerWidth > 20) {
                elements.timer.style.backgroundColor = "#ffde59";
            }
            if (timerWidth <= 20) {
                elements.timer.style.animation = "transition2 4s linear";
            }
            if (timeLeft <= 0) {
                endGame();
            }
        }, 100);
    }

    function calculateTimeElapsed() {
        return Date.now() - timer.startTime;
    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
    
    /*
    Set the word as already used
    */
    //TO DO: Unterscheidung von ClassNames für Prediction (aus ClassNames darfs nicht wegenommen werden) und UsedWords
    function setWordAsUsed(usedWord) {
        console.log(usedWord)
        usedClassNames.push(usedWord); //push word
        if(usedClassNames.length  <= classNames.length)
        {
            usedClassNames = []; //empty usedClassNames
        }
    }

    window.addEventListener("load", event => {
        const controller = skribbl.gameScreenController = new GameScreenController();
        for (const startGameButton of document.getElementsByClassName("start-game")) {
            startGameButton.addEventListener("click", () => {
                controller.display();
                controller.setup();
            });
        }        
    });

} ());