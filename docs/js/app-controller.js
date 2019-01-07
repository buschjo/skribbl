class AppController  {

	constructor() {
        this.gameRound = undefined;
        this.modelData = new ModelData();
        this.modelData.start('en');
        //TODO Initialize Controllers
		this.startScreenController= undefined;
		this.gameScreenController= undefined;
		this.endScreenController= undefined;
		this.usedClassNames= undefined;
		this.scores= undefined;
		this.tutorial = undefined;
        this.tutorialDone = false;
	}

	createNewGameRound() {
		// if (typeof this.gameRound == 'undefined'){
			this.gameRound = new GameRound(this.modelData);
            this.tutorial = new Tutorial(this.gameRound);
		// }
	}

    startGame(){
        this.createNewGameRound();
        this.scores = undefined;
        if (!this.tutorialDone) {
            this.showTutorial();
            this.tutorialDone = true;
        }else{
            this.gameRound.startGame();
        }
    }

    evaluate(word) {
        this.gameRound.evaluate(word);
    }

    endGame(){
        this.gameRound.endGame();
        // this.endScreenController.display();
    }

    startCountdown(word){
        this.gameScreenController.startCountdown(word);
    }

	setWordAsUsed(usedWord) {
        console.log(usedWord)
        this.usedClassNames.push(usedWord); //push word
        if (this.usedClassNames.length <= classNames.length) {
            this.usedClassNames = []; //empty usedClassNames
        }
    }

    setTimerInterval(timer){
    	this.gameScreenController.setTimerInterval(timer);
    }

    clearTimerInterval(){
        this.gameScreenController.clearTimerInterval();
    }

    showTutorial(){
        console.log("showing tutorial");
    	this.tutorial.prepare();
    	this.tutorial.show();
    }
}

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