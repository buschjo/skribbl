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
        res.innerHTML = " <h1>TIME'S UP!</h1><p>Oh no, I couldn't guess it!</p><p>I was only ...% sure.</p><p>Next word, please!</p>"
            + "<p>Clear-Button used: " + skribbl.canvasData.clearCounter + "</p>"
            + "<p>Finger lifted: " + skribbl.canvasData.fingerLiftedCounter + "</p>"
            + "<p>Undo-Button used: " + skribbl.canvasData.undoCounter + "</p>"
            + skribbl.word; 
        resButton.innerText = 'NEXT';
    }
    function callVictoryScreen(res, resButton) {
        res.innerHTML = "<p>Yeah, I guess it! Good Draw!</p><p>I was " + Math.round(skribbl.probs[0] * 100) + "% sure!</p>"
            + "<p> You needed " + skribbl.timeElapsed.toFixed(2) + " seconds.</p>"
            + "<p>Clear-Button used: " + skribbl.canvasData.clearCounter + "</p>"
            + "<p>Finger lifted: " + skribbl.canvasData.fingerLiftedCounter + "</p>"
            + "<p>Undo-Button used: " + skribbl.canvasData.undoCounter + "</p>"
            + skribbl.word; 
        resButton.innerText = 'NEXT';
    }

    window.addEventListener("load", event => {
        const controller = skribbl.endScreenController = new EndScreenController();
    })

}());