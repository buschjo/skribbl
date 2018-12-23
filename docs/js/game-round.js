class GameRound {

    constructor(modelData) {
        this.appController = SingletonAppController.getInstance();
        this.canvasData = new CanvasData();
        this.modelData = modelData;
        // this.targetWord = modelData.getTargetWord();
        this.timer = {
            width: 100,
            totalTime: 20,
            startTime: 0
        }
        this.word = undefined;
    }
    
    calculateTimeElapsed() {
        //replace by min and max and threshold 20
        return (Date.now() - this.timer.startTime) / 1000;
    }

    startTimer() {
        this.timer.startTime = Date.now();
        this.appController.setTimerInterval(this.timer);
    }

    startGame() {
        var randomNumber = this.getRandomInt(100);
        this.word = this.modelData.classnames[randomNumber];
        console.log(this.word);
        this.appController.startCountdown(this.word);
        var that = this;
        setTimeout(function () {
            that.startTimer();
        }, 5000);
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
    //Move to Appcontroller because auf timerInterval?
	endGame() {
        //send scores to appcontroller
        clearInterval(elements.timerInterval);
    }
}
