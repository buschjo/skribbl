class AppController {


    constructor() {
        this.gameRound = undefined;
        this.modelData = new ModelData();
        this.modelData.start('en');
        this.startScreenController = undefined;
        this.gameScreenController = undefined;
        this.endScreenController = undefined;
        this.usedClassNames = [];
        this.scores = undefined;
        this.tutorial = undefined;
        this.tutorialDone = false;
    }

    createNewGameRound() {
        this.gameRound = new GameRound(this.modelData);
        this.tutorial = new Tutorial(this.gameRound);
    }

    //start game and check whether the tutorial was already played
    startGame() {
        this.createNewGameRound();
        this.scores = undefined;
        if (!this.tutorialDone) {
            this.showTutorial();
            this.tutorialDone = true;
        } else {
            this.gameRound.startGame();
        }
    }

    //check with gameRound if word is already on top of the predictions
    evaluate(word) {
        this.gameRound.evaluate(word);
    }

    endGame() {
        this.gameRound.endGame();
    }

    startCountdown(word) {
        this.gameScreenController.startCountdown(word);
    }

    //add words that have been used to array, so they can be skipped in upcoming rounds
    setWordAsUsed(usedWord) {
        console.log(usedWord)
        this.usedClassNames.push(usedWord); //push word
        if (this.usedClassNames.length <= this.modelData.classnames.length) {
            this.usedClassNames = []; //empty usedClassNames
        }
    }

    setTimerInterval(timer) {
        this.gameScreenController.setTimerInterval(timer);
    }

    clearTimerInterval() {
        this.gameScreenController.clearTimerInterval();
    }

    showTutorial() {
        this.tutorial.prepare();
        this.tutorial.show();
    }
}

var endscreenimage = undefined;

var SingletonAppController = (function () {
    let instance;

    function createInstance() {
        var object = new AppController("I am the instance");
        return object;
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();