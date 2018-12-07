// public stuff
this.skribbl = this.skribbl || {};

(function () {
    // abstract controller
    const ScreenController = skribbl.ScreenController = function () {}

    // display screen
    Object.defineProperty(ScreenController.prototype, "display", {
        writable: true,
        value: function () {
            throw new Error("must be overriden");
        }
    });

    // clear screen
	const clearScreen = skribbl.clearScreen = function (event) {
		const mainElement = document.querySelector("main");
		while (mainElement.lastChild) {
			mainElement.removeChild(mainElement.lastChild);
		}
    };

    // window.addEventListener("load", event => {
    //     for (const clearScreen of document.getElementsByClassName("js-clear-screen")) {
    //         clearScreen.addEventListener("click", clearScreen);
    //     }
    // });
} ());