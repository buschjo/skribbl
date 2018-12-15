class AppController  {

	constructor() {
		console.log("AppController created");
		this.gameRound = undefined;
			//TODO Initialize Controllers
		this.startScreenController= undefined;
		this.gameScreenController= undefined;
		this.endScreenController= undefined;
		this.usedClassNames= undefined;
		this.scores= undefined;
		this.tutorial = new Tutorial();
	}

	createNewGameRound() {
		if (typeof this.gameRound == 'undefined'){
			this.gameRound = new GameRound();	
		}
	}

	setWordAsUsed(usedWord) {
        console.log(usedWord)
        usedClassNames.push(usedWord); //push word
        if (usedClassNames.length <= classNames.length) {
            usedClassNames = []; //empty usedClassNames
        }
    }

    setTimerInterval(timer){
    	gameScreenController.setTimerInterval(timer);
    }

    skipTutorial() {
    	this.tutorial.skip();
        this.gameRound.startGame();
    }

    showTutorial(){
    	this.createNewGameRound();
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