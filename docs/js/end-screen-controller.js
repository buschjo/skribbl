class EndScreenController extends ViewController {

    constructor() {
        super();
        this.elements = {};
    }

    display() {
        this.clearScreen();
        this.elements.mainEl = document.querySelector("main");
        this.elements.mainEl.appendChild(document.getElementById("end-template").content.cloneNode(true).firstElementChild);
        this.elements.res = document.getElementById('result');
        this.elements.resButton = document.getElementById('res-button');
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
    }

    callDefeatScreen(res, resButton) {
        res.innerHTML = " <h1>TIME'S UP!</h1><p>Oh no, I couldn't guess it!</p><p>I was " + Math.round(this.appController.modelData.probs[0] * 100) + "% sure and it wasn't in first place.</p><p>Next word, please!</p>" +
            "<p>Clear-Button used: " + this.appController.gameRound.canvasData.clearCounter + "</p>" +
            "<p>Finger lifted: " + this.appController.gameRound.canvasData.fingerLiftedCounter + "</p>" +
            "<p>Undo-Button used: " + this.appController.gameRound.canvasData.undoCounter + "</p>" +
            "<p>Your word was '" + this.appController.gameRound.word + "' .</p>";

        resButton.innerText = 'NEXT';
    }

    callVictoryScreen(res, resButton) {
        res.innerHTML = "<p>Yeah, I guessed it! Good Draw!</p><p>I was " + Math.round(this.appController.modelData.probs[0] * 100) + "%</p><p>sure and it was on the first place!" +
            "<p> You needed " + this.appController.scores.timeElapsed.toFixed(2) + " seconds.</p>" +
            "<p>Clear-Button used: " + this.appController.gameRound.canvasData.clearCounter + "</p>" +
            "<p>Finger lifted: " + this.appController.gameRound.canvasData.fingerLiftedCounter + "</p>" +
            "<p>Undo-Button used: " + this.appController.gameRound.canvasData.undoCounter + "</p>" +
            "<p>Your word was '" + this.appController.gameRound.word + "' .</p>";

        resButton.innerText = 'NEXT';
    }
}


window.addEventListener("load", event => {
    let appController = SingletonAppController.getInstance();
    if (typeof appController.endScreenController == "undefined") {
        appController.endScreenController = new EndScreenController();
    }
});