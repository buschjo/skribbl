class StartScreenController extends ViewController {

    constructor() {
        super();
        this.elements = {};
    }

    display() {
        this.elements.mainEl = document.querySelector("main");
        this.elements.mainEl.appendChild(document.getElementById("start-template").content.cloneNode(true).firstElementChild);
    }

    //rename startModel?
    setup() {
        // this.appController.modelData.start("en");
        console.log("Start model");

    }

    showInfo() {
        this.elements.info = document.getElementsByClassName('info__container')[0];
        this.elements.info.classList.add('active');
        this.elements.info.addEventListener("click", () => {
            this.hideInfo();
        });
        console.log(this.elements);

    }
    hideInfo() {
        this.elements.info.classList.remove('active')
    }

    bindUI() {
        this.elements.infoButton = document.getElementsByClassName('button-info')[0];
        this.elements.infoButton.addEventListener("click", () => {
            this.showInfo();
        });

        this.elements.startButton = document.getElementsByClassName("button-start")[0];
        this.elements.startButton.addEventListener("click", () => {
            // this.appController.gameScreenController.display();
            console.log("I should start the game");

        });
    }


}

window.addEventListener("load", () => {
    let ssc = new StartScreenController();
    ssc.appController.startScreenController = ssc;
    ssc.display();
    ssc.bindUI();
    ssc.setup();
});
