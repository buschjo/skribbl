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
        appController.modelData.start("en");
    }

    showInfo() {
        this.elements.info = document.getElementsByClassName('info__container')[0];
        this.elements.info.classList.add('active');
        this.elements.info.addEventListener("click", () => {
            this.hideInfo();
        });
    }    
    hideInfo() {
        this.elements.info.classList.remove('active')
    }

    bindUI() {
        this.elements.infoButton = document.getElementsByClassName('button-info')[0];
        this.elements.infoButton.addEventListener("click", () => {
            this.showInfo();
        });

    }


}

window.addEventListener("load", () => {
    let ssc = new StartScreenController();
    ssc.display();
    ssc.bindUI();
});