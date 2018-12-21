class Tutorial{
    constructor(){
        this.tutorailSteps={};
        this.screenElements={};
        this.currentTutorialStepIndex = 0;
    }

    initializeTutorialSteps(){
        this.tutorailSteps = [new TutorialStep("First you will see a word here."),
        new TutorialStep("You have 3 seconds to memorize the word."),
        new TutorialStep("You can draw here.", this.screenElements.canvasArea,"thick solid #ff5757"),
        new TutorialStep("You can see here, which words the AI thinks you are drawing.", this.screenElements.barsArea,"thick solid #ff5757"),
        new TutorialStep("When the timer reaches the left side, your time is up.", this.screenElements.timerArea,"thick solid #ff5757"),
        new TutorialStep("Use 'clear' to wipe your drawing.", this.screenElements.undoTool,"thick solid #ff5757"),
        new TutorialStep("Use 'undo' to remove your last line.", this.screenElements.clearTool,"thick solid #ff5757"),
        new TutorialStep("Use 'skip' to skip a word.", this.screenElements.skipTool,"thick solid #ff5757"),
        new TutorialStep("Get your word to the top of the list to win.", this.screenElements.barsArea,"thick solid #ff5757"),
        new TutorialStep("Let's go!")];
    }


    initializeScreenElements(){
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

    prepare(){
        this.initializeScreenElements();
        this.initializeTutorialSteps();
    }

    skip(){
        this.screenElements.skipButton.style.display = "none";
        this.screenElements.nextStepButton.style.display = "none";
        this.screenElements.tutorialDone = true;
        this.removeAllStyleChanges();
    }

    walkThrough(){
        this.currentTutorialStepIndex++;
        if (this.currentTutorialStepIndex < this.tutorailSteps.length) {
            currentTutorialStep = this.tutorailSteps[this.currentTutorialStepIndex];
            this.screenElements.overlayText.innerText = currentTutorialStep.tutorialText;
            currentTutorialStep.setStyleChange();
            this.tutorialSteps[this.currentTutorialStepIndex-1].removeStyleChange();
        }else{
            this.removeAllStyleChanges();
        }
    }

    //TODO This is faulty
    //in event listeners "this" is the button
    //I don't know how to get the skip function in there
    show() {
        //is it enough to say overlay.display = none?
        this.screenElements.overlay.style.display = "block";
        this.screenElements.skipButton.style.display = "block";
        this.screenElements.nextStepButton.style.display = "block";
        this.screenElements.overlayText.innerText = this.tutorailSteps[this.currentTutorialStepIndex].tutorialText;
        this.screenElements.skipButton.addEventListener("click", function (){
            this.skip();
        })
        this.screenElements.nextStepButton.addEventListener("click", function (){
            this.walkThrough();
        })
    }

    removeAllStyleChanges(){
        for (var i = 0; i < this.tutorailSteps.length; i++) {
            this.tutorailSteps[i].removeStyleChange();
        }
    }
}

class TutorialStep{
    constructor(tutorialText, htmlArea, highlightStyle){
        this.tutorialText = tutorialText;
        this.htmlArea = htmlArea;
        this.highlightStyle = highlightStyle;
    }

    setStyleChange(){
        this.htmlArea.style.border = currentTutorialStep.highlightStyle;
    }

    removeStyleChange(){
        if(typeof this.htmlArea != "undefined"){this.htmlArea.style.border = "none";}
    }
}