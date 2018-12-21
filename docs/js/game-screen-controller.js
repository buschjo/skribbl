class GameScreenController extends ViewController {
    constructor() {
        super();
        this.elements = {};
        this.countdown = {
            total: 5,
            number: 5
        };
        this.timer = {
           width: 100,
           totalTime: 20,
           startTime: 0
        }
    }

    display(){
        const mainEl = document.querySelector("main");
        mainEl.appendChild(document.getElementById("game-template").content.cloneNode(true).firstElementChild);

        this.elements.overlay = document.getElementById("overlay");
        this.elements.skipButton = document.getElementById("skip");
        this.elements.nextStepButton = document.getElementById("nextstep");
        this.elements.overlayText = document.getElementById("overlay-text");
        this.elements.timer = document.getElementById("timer");
        this.elements.clearButton = document.getElementById("clear");
        this.elements.undoButton = document.getElementById("undo");
        this.elements.countdownNumber = document.getElementById("overlay-number");
        
        // skribbl.canvasData.responsive();
        this.elements.clearButton.addEventListener("click", clear);
        this.elements.undoButton.addEventListener("click", undo);

        this.appController.startGame();
    }

    setup(){
        this.appController.gameRound.canvasData.setup();
    }

    startCountdown(word) {
        //same as line 140
        this.this.elements.skipButton.style.display = "none";
        this.this.elements.nextStepButton.style.display = "none";
        this.this.elements.overlay.style.display = "block";
        this.this.elements.overlayText.innerText = word;
        var count = setInterval(function () {
            //todo refactor
            this.countdown.number--;
            if (this.countdown.number <= 4 && this.countdown.number > 1) {
                this.elements.countdownNumber.textContent = this.countdown.number - 1;
            }
            if (this.countdown.number == 1) {
                this.elements.countdownNumber.textContent = "Draw!";
            }
            if (this.countdown.number <= 0) {
                clearInterval(count);
                this.elements.overlay.style.display = "none";
                this.countdown.number = countdown.total;
            }
        }, 1000);
    }

    setTimerInterval(timer){
        let timerWidth = timer.width;
        let totalTime = timeLeft = timer.totalTime;
        this.elements.timerInterval = setInterval(function () {
            timeLeft = timeLeft - 0.1;
            timeLeft = timeLeft.toFixed(2);
            timerWidth = timeLeft * (100 / totalTime);
            this.elements.timer.style.width = timerWidth + '%';
            // document.getElementById("timerNumber").textContent = timeLeft;
            //Nastja will evtl. was ausprobieren
            if (timerWidth <= 85 && timerWidth > 60) {
                this.elements.timer.style.animation = "transition1 5s linear";
            }
            if (timerWidth <= 60 && timerWidth > 20) {
                this.elements.timer.style.backgroundColor = "#ffde59";
            }
            if (timerWidth <= 20) {
                this.elements.timer.style.animation = "transition2 4s linear";
            }
            if (timeLeft <= 0) {
                this.appController.endGame();
            }
        }, 100);
    }

    undo() {
        this.appController.gameRound.canvasData.undo();
    }

    clear() {
        this.appController.gameRound.canvasData.erase();
        var bars = document.getElementsByClassName("bar__full");
        for (let bar of bars) {
            bar.innerHTML = " ";
            bar.style.width = "0%";
        }
    }

    drawBars(top5, probs) {
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

    //can we put this whole thing only in skribble not in game-screen-controller?
    evaluate(word) {
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
}

window.addEventListener("load", () => {

    let appController = SingletonAppController.getInstance();
    if (typeof appController.gameScreenController == "undefined") {
        appController.gameScreenController = new GameScreenController();
        console.log("GameScreenController created");
    }

    for (const startGameButton of document.getElementsByClassName("start-game")) {
        startGameButton.addEventListener("click", () => {
            controller.display();
            controller.setup();
        });
    }
});