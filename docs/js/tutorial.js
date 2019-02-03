class Tutorial {
    constructor(gameRound) {
        this.tutorialSteps = {};
        this.screenElements = {};
        this.currentTutorialStepIndex = 0;
        this.gameRound = gameRound;
    }

    //initialze all steps for the tutorial with text, style and element
    initializeTutorialSteps() {
        this.tutorialSteps = [new TutorialStep("First you will see a word here. You have 5 seconds to memorize it."),
            new TutorialStep("When the overlay disappears, the game starts."),
            new TutorialStep("You can draw here.", this.screenElements.canvasArea),
            new TutorialStep("You can see here, which words the AI thinks you are drawing.", this.screenElements.barsArea),
            new TutorialStep("When the timer reaches the left side, your time is up.", this.screenElements.timerArea),
            new TutorialStep("Use 'clear' to wipe your drawing.", this.screenElements.clearTool),
            new TutorialStep("Use 'undo' to remove your last line.", this.screenElements.undoTool),
            new TutorialStep("Use 'skip' to skip a word.", this.screenElements.skipTool),
            new TutorialStep("Get your word to the top of the list to win.", this.screenElements.barsArea),
            new TutorialStep("Let's go!")
        ];
    }

    //initialize the screen elements which should be emphasized during tutorial
    initializeScreenElements() {
        this.screenElements.overlay = document.getElementById("overlay");
        this.screenElements.skipButton = document.getElementById("skip");
        this.screenElements.nextStepButton = document.getElementById("nextstep");
        this.screenElements.overlayText = document.getElementById("overlay-text");
        this.screenElements.canvasArea = document.getElementById("canvas");
        this.screenElements.barsArea = document.getElementById("bars__area");
        this.screenElements.timerArea = document.getElementById("timer");
        this.screenElements.undoTool = document.getElementById("undo");
        this.screenElements.clearTool = document.getElementById("clear");
        this.screenElements.skipTool = document.getElementById("skip__tool");
    }

    //initialize the screen elements and tutorial steps
    prepare() {
        this.initializeScreenElements();
        this.initializeTutorialSteps();
    }

    //skip the rest of the tutorial
    skip() {
        this.screenElements.skipButton.style.display = "none";
        this.screenElements.nextStepButton.style.display = "none";
        this.screenElements.tutorialDone = true;
        this.removeAllStyleChanges();
        this.gameRound.startGame();
    }

    //normal walkthrough of the tutorial
    walkThrough() {
        this.currentTutorialStepIndex++;
        if (this.currentTutorialStepIndex < this.tutorialSteps.length) {
            this.screenElements.overlay.style.backgroundColor = "rgba(255, 255, 255, 0.0)";
            this.screenElements.overlayText.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
            this.screenElements.overlayText.style.textShadow = "none";
            var currentTutorialStep = this.tutorialSteps[this.currentTutorialStepIndex];
            this.screenElements.overlayText.innerText = currentTutorialStep.tutorialText;
            currentTutorialStep.setStyleChange();
            this.tutorialSteps[this.currentTutorialStepIndex - 1].removeStyleChange();
        } else {
            this.removeAllStyleChanges();
            this.gameRound.startGame();
        }
    }

    //show the tutorial, add eventlisteners for tutorial controls
    show() {
        this.screenElements.overlay.style.display = "block";
        this.screenElements.skipButton.style.display = "block";
        this.screenElements.nextStepButton.style.display = "block";
        this.screenElements.overlayText.style.fontSize = "1.5em";
        this.screenElements.overlayText.innerText = this.tutorialSteps[this.currentTutorialStepIndex].tutorialText;
        var that = this;
        this.screenElements.skipButton.addEventListener("click", function () {
            that.skip();
        })
        this.screenElements.nextStepButton.addEventListener("click", function () {
            that.walkThrough();
        })
    }

    //remove the style changes of all tutorial steps and general tutorial style
    removeAllStyleChanges() {
        this.screenElements.overlayText.style.fontSize = "2em";
        this.screenElements.overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        this.screenElements.overlayText.style.backgroundColor = "rgba(0, 0, 0, 0.0)";
        this.screenElements.overlayText.style.textShadow = "1px 1px 1px black, 1px -1px 1px black, -1px 1px 1px black,-1px -1px 1px black";
        for (var i = 0; i < this.tutorialSteps.length; i++) {
            this.tutorialSteps[i].removeStyleChange();
        }
    }
}

class TutorialStep {
    constructor(tutorialText, htmlArea) {
        this.tutorialText = tutorialText;
        this.htmlArea = htmlArea;
    }

    //activate the emphasis for this tutorial step
    setStyleChange() {
        if (this.htmlArea) {
            this.htmlArea.style.outline = "thick dashed #ff7e00";
        }
    }

    //remove style changes for this tutorial step
    removeStyleChange() {
        if (this.htmlArea) {
            this.htmlArea.style.outline = "none";
        }
    }
}