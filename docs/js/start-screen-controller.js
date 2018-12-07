( function () {
    const ScreenController = skribbl.ScreenController;

    const StartScreenController = function () {
        ScreenController.call(this);
    }
    StartScreenController.prototype = Object.create(ScreenController.prototype);
    StartScreenController.prototype.constructor = StartScreenController;

    Object.defineProperty(StartScreenController.prototype, "display", {
        value: function () {
            const mainEl = document.querySelector("main");
            mainEl.appendChild(document.getElementById("start-template").content.cloneNode(true).firstElementChild);
        }
    });

    Object.defineProperty(StartScreenController.prototype, "setup", {
        value: function () {
            skribbl.model.start("en");
        }
    })

    function showInfo() {
        let info = document.getElementsByClassName('info__container')[0];
        info.classList.add('active');
    }    
    function hideInfo() {
        let info = document.getElementsByClassName('info__container')[0];
        info.classList.remove('active')
    }

    window.addEventListener("load", event => {
        const controller = new StartScreenController();
        controller.display();
        controller.setup();

        const infoButton = document.getElementsByClassName('button-info')[0];
        infoButton.addEventListener("click", showInfo);
        const infoContainer = document.getElementsByClassName('info__container')[0];
        infoContainer.addEventListener("click", hideInfo);

    })

} ());