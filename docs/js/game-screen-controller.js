(function () {
    const ScreenController = skribbl.ScreenController;


    const GameScreenController = function () {
        ScreenController.call(this);
    }
    GameScreenController.prototype = Object.create(ScreenController.prototype);
    GameScreenController.prototype.constructor = GameScreenController;


  
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
            tutorial.tutorailSteps = [new tutorialStep("First you will see a word here."),
                                 new tutorialStep("You have 3 seconds to memorize the word."),
                                 new tutorialStep("You can draw here.", elements.canvasArea,"thick solid #ff5757"),
                                 new tutorialStep("You can see here, which words the AI thinks you are drawing.", elements.barsArea,"thick solid #ff5757"),
                                 new tutorialStep("When the timer reaches the left side, your time is up.", elements.timerArea,"thick solid #ff5757"),
                                 new tutorialStep("Use 'clear' to wipe your drawing.", elements.undoTool,"thick solid #ff5757"),
                                 new tutorialStep("Use 'undo' to remove your last line.", elements.clearTool,"thick solid #ff5757"),
                                 new tutorialStep("Use 'skip' to skip a word.", elements.skipTool,"thick solid #ff5757"),
                                 new tutorialStep("Get your word to the top of the list to win.", elements.barsArea,"thick solid #ff5757"),
                                 new tutorialStep("Let's go!")];
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
            prob.style.width = mr + '%';
            prob.innerHTML = '&nbsp;' + (Math.round(skribbl.probs[i] * 100) < 10 ? '0' : "") + Math.round(skribbl.probs[i] * 100) + '%' + '&nbsp;' + top5[i];
            if (top5[i] == skribbl.word) {
                prob.style.backgroundColor = "#ff5757";
                //prob.style.font = "bold 18px arial, serif";
                prob.style.textShadow = "0 0 5px yellow";
            } else {
                prob.style.backgroundColor = "#1c1c1c";
                prob.style.font = "";
                prob.style.textShadow = "";
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
            skribbl.timeElapsed = calculateTimeElapsed();
            skribbl.win = true;
            endGame();
        } else {
            skribbl.win = false;
        }
        console.log("win: " + skribbl.win);
    }
    function tutorialStep(tutorialText, htmlArea, highlightStyle) {
        this.tutorialText = tutorialText;
        this.htmlArea = htmlArea;
        this.highlightStyle = highlightStyle;
    }
    function showTutorial() {
        elements.overlay.style.display = "block";
        elements.skipButton.style.display = "block";
        elements.nextStepButton.style.display = "block";
        elements.overlayText.innerText = tutorial.tutorailSteps[tutorial.currentTutorialStepIndex].tutorialText;
        elements.skipButton.addEventListener("click", function () {
            skipTutorial();
        });
        elements.nextStepButton.addEventListener("click", function (){
            walkThroughTutorial();
        })
    }
    function walkThroughTutorial() {
        tutorial.currentTutorialStepIndex++;
        if (tutorial.currentTutorialStepIndex < tutorial.tutorailSteps.length) {
            currentTutorialStep = tutorial.tutorailSteps[tutorial.currentTutorialStepIndex];
            elements.overlayText.innerText = currentTutorialStep.tutorialText;
            currentTutorialStep.htmlArea.style.border = currentTutorialStep.highlightStyle;
            removeTutorialStyleChange(tutorial.tutorailSteps[tutorial.currentTutorialStepIndex-1]);
        }else{
            removeAllTutorialStyleChanges();
            startGame();
        }
    }
    function removeAllTutorialStyleChanges(){
        for (var i = 0; i < tutorial.tutorailSteps.length; i++) {
            removeTutorialStyleChange(tutorial.tutorailSteps[i]);
        }
    }
    function removeTutorialStyleChange(tutorialStyleStep){
        if(typeof tutorialStyleStep.htmlArea != "undefined"){tutorialStyleStep.htmlArea.style.border = "none";}
    }
    function skipTutorial() {
        elements.skipButton.style.display = "none";
        elements.nextStepButton.style.display = "none";
        elements.tutorialDone = true;
        removeAllTutorialStyleChanges();
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
        return (Date.now() - timer.startTime) / 1000;
    }

    function getRandomInt(max) {
        /*
        if (skribbl.counterOfRandomNumbers == 0 || skribbl.counterOfRandomNumbers <= max) {

        skribbl.listOfNumbers =  new Array(max - 0 + 1). 
        console.log(skribbl.listOfNumbers);
        skribbl.listOfRandomNumbers = shuffle(skribbl.listOfNumbers);
        console.logs(skribbl.listOFfRandomNumbers);
        }
        randNumb = skribbl.listOfRandomNumbers[skribbl.counterOfRandomNumbers];
        console.log(skribbl.randNumb);
        skribbl.counterOfRandomNumbers++;
        console.log(skribbl.counterOfRandomNumbers);
        return randNumb;
        */
        return Math.floor(Math.random() * Math.floor(max));
    }

   
    /*
    function shuffle(list) {
        for(var j, x, i = list.length; i; j = parseInt(Math.random() * i), x = list[--i], list[i] = list[j], list[j] = x);
        return list;
    };
   */
   
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
