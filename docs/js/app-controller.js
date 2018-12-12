var AppController = (function () {
    let instance;
 	let gameRound;
 	//TODO Initialize Controllersd
	let startScreenController;
	let gameScreenController;
	let endScreenController;
	let usedClassNames;
	let scores;

    function createNewGameRound() {
		if(gameRound){
			gameRound = new GameRound();	
		}		
	}

	function setWordAsUsed(usedWord) {
        console.log(usedWord)
        usedClassNames.push(usedWord); //push word
        if (usedClassNames.length <= classNames.length) {
            usedClassNames = []; //empty usedClassNames
        }
    }

    function setTimerInterval(timer){
    	gameScreenController.setTimerInterval(timer);
    }

    function createInstance() {
        var object = new Object("I am the instance");
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