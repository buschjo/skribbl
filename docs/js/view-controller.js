class ViewController {

    constructor() {
        this.appController = SingletonAppController.getInstance();
        this.elements = {};
    }

    clearScreen() {
        const mainElement = document.querySelector("main");
        while (mainElement.lastChild) {
            mainElement.removeChild(mainElement.lastChild);
        }
    }
}
