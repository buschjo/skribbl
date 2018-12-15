class CanvasData {

    constructor() {
        this.coords = [];
        this.canvas = window._canvas = new fabric.Canvas('canvas');
        this.mousePressed = false;
        this.fingerLiftedCounter = 0;
        this.undoCounter = 0;
        this.clearCounter = 0;
        this.h = [];
        // this.frame // from viewController
    }

    setup() {
        canvas.backgroundColor = '#ffffff';
        canvas.isDrawingMode = 1;
        canvas.freeDrawingBrush.color = "black";
        canvas.freeDrawingBrush.width = 10;
        canvas.renderAll();
        responsive();
        
        //setup listeners 
        canvas.on('mouse:up', function (e) {
            fingerLiftedCounter++;
            // move to viewcontroller
            // skribbl.model.getFrame(); 
            // skribbl.evaluate(skribbl.word); 
            mousePressed = false
        });
        canvas.on('mouse:down', function (e) {
            mousePressed = true
        });
        canvas.on('mouse:move', function (e) {
            recordCoor(e)
        });

        window.addEventListener("resize", responsive);
    }

    /*
    record the current drawing coordinates
    */
    recordCoor(event) {
        var pointer = canvas.getPointer(event.e);
        var posX = pointer.x;
        var posY = pointer.y;

        if (posX >= 0 && posY >= 0 && mousePressed) {
            coords.push(pointer)
        }
    }

    /*
    get the best bounding box by trimming around the drawing
    */
    getMinBox() {
        //get coordinates 
        var coorX = coords.map(function (p) {
            return p.x
        });
        var coorY = coords.map(function (p) {
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

        //return as strucut 
        return {
            min: min_coords,
            max: max_coords
        }
    }

    /*
    get the current image data 
    */
    //can we access getImageData without storing it specifically in skribbl.canvasData (defineProperty??)
    getImageData() {
        //get the minimum bounding box around the drawing 
        const mbb = getMinBox()

        //get image data according to dpi 
        const dpi = window.devicePixelRatio
        const imgData = canvas.contextContainer.getImageData(mbb.min.x * dpi, mbb.min.y * dpi,
            (mbb.max.x - mbb.min.x) * dpi, (mbb.max.y - mbb.min.y) * dpi);
        return imgData
    }

    // allow drawing
    allowDrawing() {
        canvas.isDrawingMode = 1;
        // $('button').prop('disabled', false);
    }

    erase() {
        clearCounter++;
        canvas.clear();
        canvas.backgroundColor = '#ffffff';
        coords = [];
    }


    // todo can h have a better name and be up with the other fields?
    // var h = []; moved to constructor
    undo() {
        undoCounter++;

        if (canvas._objects.length > 1) {
            h.push(canvas._objects.pop());
            h.forEach(i => {
                console.log(i);
            });
            canvas.renderAll();
            skribbl.model.getFrame(); //todo
        }
        else if (canvas._objects.length == 1) {
            erase();
            var bars = document.getElementsByClassName("bar__full");
            for (let bar of bars) {
                bar.innerHTML = " ";
                bar.style.width = "0%";
            }
        }
    }

    resetAllCounters() {
        clearCounter = 0;
        fingerLiftedCounter = 0;
        undoCounter = 0;
    }

    responsive() {
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
