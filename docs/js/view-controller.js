class ViewController {

    constructor() {
        this.appController = SAppController.getInstance();
        this.elements = {};
    }

    clearScreen() {
        const mainElement = document.querySelector("main");
		while (mainElement.lastChild) {
			mainElement.removeChild(mainElement.lastChild);
		}
    }
}




// window.addEventListener("load", event => {
//     for (const clearScreen of document.getElementsByClassName("js-clear-screen")) {
//         clearScreen.addEventListener("click", clearScreen);
//     }
// });
