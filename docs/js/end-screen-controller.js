class EndScreenController extends ViewController {

    constructor() {
        super();
        this.elements = {};
    }

    //display page elements and add Eventlisteners
    display() {
        this.clearScreen();
        this.elements.mainEl = document.querySelector("main");
        this.elements.mainEl.appendChild(document.getElementById("end-template").content.cloneNode(true).firstElementChild);
        this.elements.res = document.getElementById('result');
        this.elements.resButton = document.getElementById('res-button');
        this.elements.backToStart = document.getElementById("backToStart");
        if (this.appController.scores.win) {
            this.callVictoryScreen(this.elements.res, this.elements.resButton);
        } else {
            this.callDefeatScreen(this.elements.res, this.elements.resButton);
        }
        this.appController.gameRound.canvasData.resetAllCounters();
        var that = this;
        this.elements.resButton.addEventListener("click", () => {
            that.appController.gameScreenController.display();
            that.appController.gameScreenController.setup();
        });

        this.elements.backToStart.addEventListener("click", () => {
            console.log(that.appController);

            that.appController.startScreenController.display();
            that.appController.startScreenController.bindUI();
            that.appController.startScreenController.setup();
        });
    }

    //show defeat screen with defeat specific information
    callDefeatScreen(res, resButton) {
        if (typeof this.appController.modelData.probs === "undefined") {
            console.log("nothing was drawn");
        } else {
            res.innerHTML = "<h1>TIME'S UP!</h1>" +
                '<img src="assets/defeat_logo.png" alt="defeat logo">' +
                "<div><p>Oh no, I couldn't guess it! " + 'I was <span class="bold">' + Math.round(this.appController.modelData.probs[0] * 100) + '%</span> sure that the word was <span class="bold">' + this.appController.modelData.names[0] + '</span></p></div>';
            //"<p>Clear-Button used: " + this.appController.gameRound.canvasData.clearCounter + "</p>" +
            //"<p>Undo-Button used: " + this.appController.gameRound.canvasData.undoCounter + "</p>" +
            //"<p>Finger lifted: " + this.appController.gameRound.canvasData.fingerLiftedCounter + "</p>";


            //"<p>" + this.appController.gameRound.word + "</p>";

            resButton.innerText = 'NEXT';

            const canvas = document.getElementById('endcanvas');
            canvas.width = this.appController.endscreenimage.width;
            canvas.height = this.appController.endscreenimage.height;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.clientWidth, canvas.height);
            ctx.putImageData(this.appController.endscreenimage, 0, 0);
        }
    }

    //show victory screen with victory specific information
    callVictoryScreen(res, resButton) {
        res.innerHTML = "<h1>YOU WON!</h1>" +
            '<img src="assets/win_logo.png" alt="victory logo">' +
            '<div><p>Yeah, I guessed it! Good Draw! I was <span id="word-score">' + Math.round(this.appController.modelData.probs[0] * 100) + '%</span> sure and it was on the first place!</p>' +
            '<p>You needed <span class="bold">' + this.appController.scores.timeElapsed.toFixed(2) + ' seconds</span>.</p></div>';
            // "<p>Clear-Button used: " + this.appController.scores.stats.clear + "</p>" +
            //"<p>Undo-Button used: " + this.appController.scores.stats.undo + "</p>" +
            //"<p>Finger lifted: " + this.appController.scores.stats.fingerLifted + "</p>";
        //"<p>" + this.appController.gameRound.word + "</p>";

        resButton.innerText = 'NEXT';

        const canvas = document.getElementById('endcanvas');
        canvas.width = this.appController.endscreenimage.width;
        canvas.height = this.appController.endscreenimage.height;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.clientWidth, canvas.height);
        ctx.putImageData(this.appController.endscreenimage, 0, 0);
    }
}

window.addEventListener("load", event => {
    let appController = SingletonAppController.getInstance();
    if (typeof appController.endScreenController == "undefined") {
        appController.endScreenController = new EndScreenController();
    }
});