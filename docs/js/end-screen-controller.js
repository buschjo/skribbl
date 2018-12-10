(function () {
    const ScreenController = skribbl.ScreenController;

    const EndScreenController = function () {
        ScreenController.call(this);
    }
    EndScreenController.prototype = Object.create(ScreenController.prototype);
    EndScreenController.prototype.constructor = EndScreenController;

    Object.defineProperty(EndScreenController.prototype, "display", {
        value: function () {
            skribbl.clearScreen();
            const mainEl = document.querySelector("main");
            mainEl.appendChild(document.getElementById("end-template").content.cloneNode(true).firstElementChild);
            var res = document.getElementById('result');
            var resButton = document.getElementById('res-button');
            if (skribbl.win) {
                callVictoryScreen(res, resButton);
            } else {
                callDefeatScreen(res, resButton);
            }
            skribbl.canvasData.resetAllCounters();
            resButton.addEventListener("click", function () {
                skribbl.gameScreenController.display();
                skribbl.gameScreenController.setup();
            })
        }
    });

    function callDefeatScreen(res, resButton) {
        res.innerHTML = "<h1>You lost!</h1><p>You were a little to slow.</p>"
            + "<p>Clear-Button used :" + skribbl.canvasData.clearCounter + " </p>"
            + "<p>Finger lifted : " + skribbl.canvasData.fingerLiftedCounter + "</p>"
            + "<p>Undo-Button used : " + skribbl.canvasData.undoCounter + "</p>"

        resButton.innerText = 'TRY AGAIN';
    }
    function callVictoryScreen(res, resButton) {
        res.innerHTML = "<h1>You won!</h1><p>The AI is</p><p>" + Math.round(skribbl.probs[0] * 100) + "%</p><p>sure."
            + "<p> You needed " + skribbl.timeElapsed.toFixed(2) + " seconds.</p>"
            + "<p>Clear-Button used :" + skribbl.canvasData.clearCounter + " </p>"
            + "<p>Finger lifted : " + skribbl.canvasData.fingerLiftedCounter + "</p>"
            + "<p>Undo-Button used :" + skribbl.canvasData.undoCounter + "</p>";
        resButton.innerText = 'NEXT';
    }

    window.addEventListener("load", event => {
        const controller = skribbl.endScreenController = new EndScreenController();
    })

}());