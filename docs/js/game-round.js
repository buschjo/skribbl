class GameRound {

    constructor() {
        this.appController = SingletonAppController.getInstance();
        this.canvasData = new CanvasData();
        // this.modelData = new ModelData();
        // this.targetWord = modelData.getTargetWord();
        this.timer = {
            width: 100,
            totalTime: 20,
            startTime: 0
        }
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
        word = modelData.classNames[randomNumber];
        console.log(skribbl.word);
        startCountdown(skribbl.word);
        setTimeout(function () {
            startTimer();
        }, 5000);
    }
    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
	endGame() {
        this.appController.endScreenController.display();
        clearInterval(elements.timerInterval);
    }
}
