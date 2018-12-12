var GameRound = function () {
	let appController = AppController.getInstance();
	let canvasData;
	let modelData;
	let targetWord = modelData.getNextWord();

    const timer = {
        width: 100,
        totalTime: 20,
        startTime: 0
    }

	function calculateTimeElapsed() {
        //replace by min and max and threshold 20
        return (Date.now() - timer.startTime) / 1000;
    }

    function startTimer() {
        timer.startTime = Date.now();
        appController.setTimerInterval(timer);
    }

    function startGame() {
        var randomNumber = getRandomInt(100);
        word = modelData.classNames[randomNumber];
        console.log(skribbl.word);
        startCountdown(skribbl.word);
        setTimeout(function () {
            startTimer();
        }, 5000);
    }

} ();