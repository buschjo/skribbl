class StartScreenController extends ViewController {

    constructor() {
        super();
        this.language = "en";
        this.elements = {};
    }

    display() {
        this.elements.mainEl = document.querySelector("main");
        this.elements.mainEl.appendChild(document.getElementById("start-template").content.cloneNode(true).firstElementChild);
    }

    //rename startModel?
    setup() {
      //this has to go somewhere else
      skribbl.model.start(language);
      console.log(this.language);
    }

    setEnglish() {  //this has to go somewhere else
        this.language = "en";
        skribbl.model.start(this.language);
        console.log("English");
    }

    setDeutsch() {  //this has to go somewhere else
        this.language = "de";
        skribbl.model.start(this.language);
        console.log("Deutsch");
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
        var that = this;
        this.elements.langButtonEN = document.getElementsByClassName('button-en')[0];
        this.elements.langButtonEN.addEventListener("click", that.setEnglish);
        this.elements.langButtonDE = document.getElementsByClassName('button-de')[0];
        this.elements.langButtonDE.addEventListener("click", that.setDeutsch);
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
