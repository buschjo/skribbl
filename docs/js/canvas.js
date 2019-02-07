//Basiert auf Tutorial und Code von Zaid Alyafeai
//https://medium.com/tensorflow/train-on-google-colab-and-run-on-the-browser-a-case-study-8a45f9b1474e
class CanvasData {

    constructor() {
        this.coords = [];
        this.canvas = window._canvas = new fabric.Canvas('canvas');
        this.mousePressed = undefined;
        this.fingerLiftedCounter = 0;
        this.undoCounter = 0;
        this.clearCounter = 0;
        this.lastLines = [];
        this.setup();
    }

    /*
    prepare eventListeners and canvas
    */
    setup() {
        console.log('setup canvas');
        this.canvas.backgroundColor = '#ffffff';
        this.canvas.isDrawingMode = 1;
        this.canvas.freeDrawingBrush.color = "black";
        this.canvas.freeDrawingBrush.width = 10;
        this.canvas.renderAll();
        this.responsive(this.canvas);

        //setup listeners 
        var that = this;
        this.canvas.on('mouse:up', function (e) {
            that.fingerLiftedCounter++;
            console.log("fingerLiftedCounter: " + that.fingerLiftedCounter);
            
            // move to viewcontroller
            var appController = SingletonAppController.getInstance();
            appController.modelData.getFrame();
            appController.evaluate(appController.gameRound.word);
            that.mousePressed = false
        });
        this.canvas.on('mouse:down', function (e) {
            that.mousePressed = true
        });
        this.canvas.on('mouse:move', function (e) {
            that.recordCoor(e);
        });

        window.addEventListener("resize", () => {
            that.responsive(that.canvas);
        });
    }

    /*
    record the current drawing coordinates
    */
    recordCoor(event) {
        var pointer = this.canvas.getPointer(event.e);
        var posX = pointer.x;
        var posY = pointer.y;
        if (posX >= 0 && posY >= 0 && this.mousePressed) {
            this.coords.push(pointer)
        }
    }

    /*
    get the best bounding box by trimming around the drawing
    */
    getMinBox() {
        //get coordinates 
        var coorX = this.coords.map(function (p) {
            return p.x
        });
        var coorY = this.coords.map(function (p) {
            return p.y
        });
        //find top left and bottom right corners 
        var min_coords = {
            x: Math.min.apply(null, coorX),
            y: Math.min.apply(null, coorY)
        }
        var max_coords = {
            x: Math.max.apply(null, coorX),
            y: Math.max.apply(null, coorY)
        }

        //get the longest side of box
        var length = Math.max((max_coords.x - min_coords.x), (max_coords.y - min_coords.y))

        //get the center
        var min_coords_square = {
            x: min_coords.x + ((max_coords.x - min_coords.x) / 2.0) - (length / 2.0) - 5,
            y: min_coords.y + ((max_coords.y - min_coords.y) / 2.0) - (length / 2.0) - 5
        }

        var max_coords_square = {
            x: min_coords.x + ((max_coords.x - min_coords.x) / 2.0) + (length / 2.0) + 5,
            y: min_coords.y + ((max_coords.y - min_coords.y) / 2.0) + (length / 2.0) + 5
        }

        //return as struct 
        return {
            min: min_coords_square,
            max: max_coords_square
        }
    }

    /*
    get the current image data 
    */
    getImageData() {
        //get the minimum bounding box around the drawing 
        const mbb = this.getMinBox()

        //get image data according to dpi 
        const dpi = window.devicePixelRatio
        const imgData = this.canvas.contextContainer.getImageData(mbb.min.x * dpi, mbb.min.y * dpi,
            (mbb.max.x - mbb.min.x) * dpi, (mbb.max.y - mbb.min.y) * dpi);
        return imgData
    }

    // set drawing mode
    allowDrawing() {
        this.canvas.isDrawingMode = 1;
    }

    //clear the canvas
    erase() {
        this.clearCounter++;
        console.log("clearCounter: " + this.clearCounter);
        
        this.canvas.clear();
        this.canvas.backgroundColor = '#ffffff';
        this.coords = [];
    }

    //remove the line that was painted last
    undo() {
        this.undoCounter++;
        console.log("undoCounter: " + this.undoCounter);
        

        if (this.canvas._objects.length > 1) {
            this.lastLines.push(this.canvas._objects.pop());
            this.lastLines.forEach(i => {
                console.log(i);
            });
            this.canvas.renderAll();
            var appController = SingletonAppController.getInstance();
            appController.modelData.getFrame(); //todo
        } else if (this.canvas._objects.length == 1) {
            this.erase();
            this.clearCounter--
            var bars = document.getElementsByClassName("bar__full");
            for (let bar of bars) {
                bar.innerHTML = " ";
                bar.style.width = "0%";
            }
        }
    }

    resetAllCounters() {
        this.clearCounter = 0;
        this.fingerLiftedCounter = 0;
        this.undoCounter = 0;
    }

    //adapt canvas width and height to the available space
    responsive(canvas) {
        let container = document.getElementsByClassName("canvas__container")[0];
        let width = container.offsetWidth;
        let height = container.offsetHeight;
        let widthn = width;
        let heightn = height;
        canvas.setDimensions({
            width: widthn,
            height: heightn
        });
    }

}