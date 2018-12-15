class GameRound {
    // appController
    // canvasData
    // modelData
    // targetWord
    // timer = {
    //     width: 100,
    //     totalTime: 20,
    //     startTime: 0
    // }
    constructor() {
        this.appController = AppController.getInstance();
        this.canvasData = new CanvasData("test");
    }
    calculateTimeElapsed() {
        //replace by min and max and threshold 20
        return (Date.now() - timer.startTime) / 1000;
    }
    startTimer() {
        timer.startTime = Date.now();
        appController.setTimerInterval(timer);
    }
    startGame() {
        var randomNumber = getRandomInt(100);
        word = modelData.classNames[randomNumber];
        console.log(skribbl.word);
        startCountdown(skribbl.word);
        setTimeout(function () {
            startTimer();
        }, 5000);
    }

}

