class StartScreenController extends ViewController {

    constructor() {
        super();
        this.language = "en";
        this.elements = {};
    }

    //display screen elements
    display() {
        this.clearScreen();
        this.elements.mainEl = document.querySelector("main");
        this.elements.mainEl.appendChild(document.getElementById("start-template").content.cloneNode(true).firstElementChild);
    }

    //start the model, needs to be early, because it needs some time
    setup() {
        this.appController.modelData.start(this.language);
        console.log(this.language);
    }

    //show the game info from the info button
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

    //change the language of the category names to german
    showDE() {
        this.elements.info = document.getElementsByClassName('de__container')[0];
        this.elements.info.classList.add('active');
        document.getElementById("de-button").style.borderColor = "#5271ff";
        document.getElementById("de-button").style.color = "#5271ff";
        document.getElementById("en-button").style.borderColor = "#a6a6a6";
        document.getElementById("en-button").style.color = "#a6a6a6";
        this.elements.info.addEventListener("click", () => {
            this.hideInfo();
        });
        console.log(this.elements);

    }

    //change the language of the category names to english
    showEN() {
        this.elements.info = document.getElementsByClassName('en__container')[0];
        this.elements.info.classList.add('active');
        document.getElementById("en-button").style.borderColor = "#5271ff";
        document.getElementById("en-button").style.color = "#5271ff";
        document.getElementById("de-button").style.borderColor = "#a6a6a6";
        document.getElementById("de-button").style.color = "#a6a6a6";
        this.elements.info.addEventListener("click", () => {
            this.hideInfo();
        });
        console.log(this.elements);

    }

    //add event listeners
    bindUI() {
        var that = this;
        console.log("Bind UI Appcontroller:");
        this.elements.langButtonEN = document.getElementsByClassName('button-en')[0];
        this.elements.langButtonEN.addEventListener("click", () => {
            that.language = "en";
            that.appController.modelData.start(that.language);
            this.showEN();
            console.log("English");
        });
        this.elements.langButtonDE = document.getElementsByClassName('button-de')[0];
        this.elements.langButtonDE.addEventListener("click", () => {
            that.language = "de";
            that.appController.modelData.start(that.language);
            this.showDE();
            console.log("Deutsch");
        });
        this.elements.infoButton = document.getElementsByClassName('button-info')[0];
        this.elements.infoButton.addEventListener("click", () => {
            this.showInfo();
        });

        this.elements.startButton = document.getElementsByClassName("button-start")[0];
        this.elements.startButton.addEventListener("click", () => {
            console.log('startScreenController');
            this.appController.gameScreenController.display();
        });
    }
}

window.addEventListener("load", () => {
    let appController = SingletonAppController.getInstance();
    if (typeof appController.startScreenController == "undefined") {
        appController.startScreenController = new StartScreenController();
    }
    appController.startScreenController.display();
    appController.startScreenController.bindUI();
    appController.startScreenController.setup();
});