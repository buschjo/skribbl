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
                "<p>Oh no, I couldn't guess it!</p><p>I was " + Math.round(this.appController.modelData.probs[0] * 100) + '% sure that the word was " ' + this.appController.modelData.names[0] + '" Sorry.</p><p>Next word, please!</p>' +
                "<p>Clear-Button used: " + this.appController.gameRound.canvasData.clearCounter + "</p>" +
                "<p>Undo-Button used: " + this.appController.gameRound.canvasData.undoCounter + "</p>" +
                "<p>Finger lifted: " + this.appController.gameRound.canvasData.fingerLiftedCounter + "</p>" +
                "<p>" + this.appController.gameRound.word + "</p>";

            resButton.innerText = 'NEXT';

            const canvas = document.getElementById('endcanvas');
            canvas.width = endscreenimage.width;
            canvas.height = endscreenimage.height;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.clientWidth, canvas.height);
            ctx.putImageData(endscreenimage, 0, 0);
        }
    }

    //show victory screen with victory specific information
    callVictoryScreen(res, resButton) {
        res.innerHTML = '<img src="assets/win_logo.png" alt="victory logo">' +
            '<p>Yeah, I guessed it! Good Draw! </p><p> I was <span id="word-score">' + Math.round(this.appController.modelData.probs[0] * 100) + '%</span> sure and it was on the first place!</p>' +
            "<p>You needed " + this.appController.scores.timeElapsed.toFixed(2) + " seconds.</p>" +
            "<p>Clear-Button used: " + this.appController.gameRound.canvasData.clearCounter + "</p>" +
            "<p>Undo-Button used: " + this.appController.gameRound.canvasData.undoCounter + "</p>" +
            "<p>Finger lifted: " + this.appController.gameRound.canvasData.fingerLiftedCounter + "</p>" +
            "<p>" + this.appController.gameRound.word + "</p>";

        resButton.innerText = 'NEXT';

        const canvas = document.getElementById('endcanvas');
        canvas.width = endscreenimage.width;
        canvas.height = endscreenimage.height;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.clientWidth, canvas.height);
        ctx.putImageData(endscreenimage, 0, 0);
    }
}

window.addEventListener("load", event => {
    let appController = SingletonAppController.getInstance();
    if (typeof appController.endScreenController == "undefined") {
        appController.endScreenController = new EndScreenController();
    }
});