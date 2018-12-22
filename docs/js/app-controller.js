class AppController  {

	constructor() {
		console.log("AppController created");
        this.gameRound = undefined;
        this.modelData = new ModelData();
        this.modelData.start('en');
        //TODO Initialize Controllers
		this.startScreenController= undefined;
		this.gameScreenController= undefined;
		this.endScreenController= undefined;
		this.usedClassNames= undefined;
		this.scores= undefined;
		this.tutorial = new Tutorial();
        this.tutorialDone = false;
	}

	createNewGameRound() {
		if (typeof this.gameRound == 'undefined'){
			this.gameRound = new GameRound();	
		}
	}

    startGame(){
        this.createNewGameRound();
        if (this.tutorialDone) {
            this.gameRound.startGame();
        } else {
            this.showTutorial();
        }
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

    showTutorial(){
    	this.tutorial.prepare();
    	this.tutorial.show();
    	this.gameRound.startGame();
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
                // Object.freeze(instance);
            }
            return instance;
        }
    };
})();