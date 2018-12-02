( function () {
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
                res.innerHTML = "<h1>You won!</h1><p>The AI is</p><p>" + skribbl.probs[0] + "</p><p>sure.</p>";
                resButton.innerText = 'Next';
            } else {
                res.innerHTML = "<h1>You lost!</h1><p>You were a little to slow.</p>";
                resButton.innerText = 'Try again';
            }

            resButton.addEventListener("click", function() {
                skribbl.gameScreenController.display();
                skribbl.gameScreenController.setup();
            })
        }
    });

    window.addEventListener("load", event => {
        const controller = skribbl.endScreenController = new EndScreenController();
        // event handling to display end screen
    })

} ());