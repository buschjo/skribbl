(function () {
    const ScreenController = skribbl.ScreenController;


    const GameScreenController = function () {
        ScreenController.call(this);
    }
    GameScreenController.prototype = Object.create(ScreenController.prototype);
    GameScreenController.prototype.constructor = GameScreenController;

    var usedClassNames = skribbl.usedClassNames = []; //Words which are already won

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
    const tutorial = {}


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
            elements.canvasArea = document.getElementById("canvas");
            elements.barsArea = document.getElementById("bars__area");
            elements.timerArea = document.getElementById("timer");
            elements.undoTool = document.getElementById("undo");
            elements.clearTool = document.getElementById("clear");
            elements.skipTool = document.getElementById("skip__tool");
            // skribbl.canvasData.responsive();
            elements.clearButton.addEventListener("click", clear);
            elements.undoButton.addEventListener("click", undo);

            tutorial.currentTutorialStepIndex = 0;
            // tutorial.tutorailSteps = [new tutorialStep("First you will see a word here."),
            //                      new tutorialStep("You have 3 seconds to memorize the word."),
            //                      new tutorialStep("You can draw here.", elements.canvasArea,"thick solid #ff5757"),
            //                      new tutorialStep("You can see here, which words the AI thinks you are drawing.", elements.barsArea,"thick solid #ff5757"),
            //                      new tutorialStep("When the timer reaches the left side, your time is up.", elements.timerArea,"thick solid #ff5757"),
            //                      new tutorialStep("Use 'clear' to wipe your drawing.", elements.undoTool,"thick solid #ff5757"),
            //                      new tutorialStep("Use 'undo' to remove your last line.", elements.clearTool,"thick solid #ff5757"),
            //                      new tutorialStep("Use 'skip' to skip a word.", elements.skipTool,"thick solid #ff5757"),
            //                      new tutorialStep("Get your word to the top of the list to win.", elements.barsArea,"thick solid #ff5757"),
            //                      new tutorialStep("Let's go!")];
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

    //refactored function
    function setTimerInterval(timer){
        let timerWidth = timer.width;
        let totalTime = timeLeft = timer.totalTime;
        elements.timerInterval = setInterval(function () {
            timeLeft = timeLeft - 0.1;
            timeLeft = timeLeft.toFixed(2);
            timerWidth = timeLeft * (100 / totalTime);
            elements.timer.style.width = timerWidth + '%';
            // document.getElementById("timerNumber").textContent = timeLeft;
            //Nastja will evtl. was ausprobieren
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

    function undo() {
        skribbl.canvasData.undo();
    }
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
            //Extract Method
            prob.style.width = mr + '%';
            prob.innerHTML = top5[i];
            //CSS auslagern in classes
            if (top5[i] == skribbl.word) {
                prob.style.backgroundColor = "#5271ff";
                prob.style.font = "bold 18px arial, serif";
                prob.style.textShadow = "0 0 5px yellow";
            } else {
                prob.style.backgroundColor = "#545454";
                prob.style.font = "";
                prob.style.textShadow = "";
            }
        }
    }
    //Umgezogen
    function startGame() {
        var randomNumber = getRandomInt(100);
        skribbl.word = skribbl.classNames[randomNumber];
        console.log(skribbl.word);
        startCountdown(skribbl.word);
        setTimeout(function () {
            startTimer();
        }, 5000);
    }
    //Umgezogen
    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }   
    //Umgezogen 
    function endGame() {
        skribbl.endScreenController.display();
        clearInterval(elements.timerInterval);
    }
    //can we put this whole thing only in skribble not in game-screen-controller?
    const evaluate = skribbl.evaluate = function (word) {
        if (skribbl.names[0] == word) {
            skribbl.timeElapsed = calculateTimeElapsed();
            //setWordAsUsed(word);
            skribbl.win = true;
            endGame();
        } else {
            skribbl.win = false;
        }
        console.log("win: " + skribbl.win);
    }
    //UMGEZOGEN
    function calculateTimeElapsed() {
        //replace by min and max and threshold 20
        return (Date.now() - timer.startTime) / 1000;
    }
        /*UMGEZOGEN in app-controller
    Set the word as already used
    */
    //TO DO: Unterscheidung von ClassNames für Prediction (aus ClassNames darfs nicht wegenommen werden) und UsedWords
    function setWordAsUsed(usedWord) {
        console.log(usedWord)
        usedClassNames.push(usedWord); //push word
        if (usedClassNames.length <= classNames.length) {
            usedClassNames = []; //empty usedClassNames
        }
    }
    // function tutorialStep(tutorialText, htmlArea, highlightStyle) {
    //     this.tutorialText = tutorialText;
    //     this.htmlArea = htmlArea;
    //     this.highlightStyle = highlightStyle;
    // }
    function showTutorial() {
        appController = SingletonAppController.getInstance();
        appController.showTutorial();
        //is it enough to say overlay.display = none?
        // elements.overlay.style.display = "block";
        // elements.skipButton.style.display = "block";
        // elements.nextStepButton.style.display = "block";
        // elements.overlayText.innerText = tutorial.tutorailSteps[tutorial.currentTutorialStepIndex].tutorialText;
        // elements.skipButton.addEventListener("click", function () {
        //     skipTutorial();
        // });
        // elements.nextStepButton.addEventListener("click", function (){
        //     walkThroughTutorial();
        // })
    }
    // function walkThroughTutorial() {
    //     tutorial.currentTutorialStepIndex++;
    //     if (tutorial.currentTutorialStepIndex < tutorial.tutorailSteps.length) {
    //         currentTutorialStep = tutorial.tutorailSteps[tutorial.currentTutorialStepIndex];
    //         elements.overlayText.innerText = currentTutorialStep.tutorialText;
    //         currentTutorialStep.htmlArea.style.border = currentTutorialStep.highlightStyle;
    //         removeTutorialStyleChange(tutorial.tutorailSteps[tutorial.currentTutorialStepIndex-1]);
    //     }else{
    //         removeAllTutorialStyleChanges();
    //         startGame();
    //     }
    // }
    // function removeAllTutorialStyleChanges(){
    //     for (var i = 0; i < tutorial.tutorailSteps.length; i++) {
    //         removeTutorialStyleChange(tutorial.tutorailSteps[i]);
    //     }
    // }
    // function removeTutorialStyleChange(tutorialStyleStep){
    //     if(typeof tutorialStyleStep.htmlArea != "undefined"){tutorialStyleStep.htmlArea.style.border = "none";}
    // }
    // function skipTutorial() {
    //     elements.skipButton.style.display = "none";
    //     elements.nextStepButton.style.display = "none";
    //     elements.tutorialDone = true;
    //     removeAllTutorialStyleChanges();
    //     startGame();
    // }
    //can these two methods be more similar1?? O.O
    function startCountdown(word) {
        //same as line 140
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
    //UMGEZOGEN
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
            //Nastja will evtl. was ausprobieren
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
    //Can we put this into the start screen controller?
    window.addEventListener("load", event => {
        const controller = skribbl.gameScreenController = new GameScreenController();
        for (const startGameButton of document.getElementsByClassName("start-game")) {
            startGameButton.addEventListener("click", () => {
                controller.display();
                controller.setup();
            });
        }
    });
}());
