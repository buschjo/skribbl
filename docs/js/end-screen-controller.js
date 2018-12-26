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
            callVictoryScreen(res, resButton);
        } else {
            callDefeatScreen(res, resButton);
        }
        this.appController.canvasData.resetAllCounters();
        this.elements.resButton.addEventListener("click", () => {
            this.appController.gameScreenController.display();
            this.appController.gameScreenController.setup();
        });
    }

    callDefeatScreen(res, resButton) {
        res.innerHTML = "<h1>You lost!</h1><p>You were a little to slow.</p>"
            + "<p>Clear-Button used :" + this.appController.canvasData.clearCounter + " </p>"
            + "<p>Finger lifted : " + this.appController.canvasData.fingerLiftedCounter + "</p>"
            + "<p>Undo-Button used : " + this.appController.canvasData.undoCounter + "</p>"

        resButton.innerText = 'TRY AGAIN';
    }

    callVictoryScreen(res, resButton) {
        res.innerHTML = "<h1>You won!</h1><p>The AI is</p><p>" + Math.round(skribbl.probs[0] * 100) + "%</p><p>sure."
            + "<p> You needed " + this.appController.timeElapsed.toFixed(2) + " seconds.</p>"
            + "<p>Clear-Button used :" + this.appController.canvasData.clearCounter + " </p>"
            + "<p>Finger lifted : " + this.appController.canvasData.fingerLiftedCounter + "</p>"
            + "<p>Undo-Button used :" + this.appController.canvasData.undoCounter + "</p>";
        resButton.innerText = 'NEXT';
    }
}


window.addEventListener("load", event => {
    let appController = SingletonAppController.getInstance();
    if (typeof appController.endScreenController == "undefined") {
        let esc = new EndScreenController();
        appController.endScreenController = esc;
    }
});

