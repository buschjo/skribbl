(function () {
    skribbl.canvasData = {};
    var coords = skribbl.canvasData.coords = [];
    var canvas;
    var mousePressed = false;
    var fingerLiftedCounter = skribbl.canvasData.fingerLiftedCounter = 0
    var undoCounter = skribbl.canvasData.undoCounter = 0
    var clearCounter = skribbl.canvasData.clearCounter = 0

    const setup = skribbl.canvasData.setup = function () {
        canvas = window._canvas = new fabric.Canvas('canvas');

        canvas.backgroundColor = '#ffffff';
        canvas.isDrawingMode = 1;
        canvas.freeDrawingBrush.color = "black";
        canvas.freeDrawingBrush.width = 10;
        canvas.renderAll();
        responsive();
        //setup listeners 

        canvas.on('mouse:up', function (e) {
            skribbl.canvasData.fingerLiftedCounter++;
            skribbl.model.getFrame();
            skribbl.evaluate(skribbl.word);
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
    function recordCoor(event) {
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
    function getMinBox() {
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

        //get the longest side of box
        var length = Math.max((max_coords.x - min_coords.x), (max_coords.y - min_coords.y))

        //get the center
        var min_coords_square = {
            x : min_coords.x + ((max_coords.x - min_coords.x) / 2.0) - (length/2.0) -5,
            y : min_coords.y + ((max_coords.y - min_coords.y) / 2.0) - (length/2.0) -5
        }

        var max_coords_square = {
            x : min_coords.x + ((max_coords.x - min_coords.x) / 2.0) + (length/2.0) +5,
            y : min_coords.y + ((max_coords.y - min_coords.y) / 2.0) + (length/2.0) +5
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
    const getImageData = skribbl.canvasData.getImageData = function () {
        //get the minimum bounding box around the drawing 
        const mbb = getMinBox()

        //get image data according to dpi 
        const dpi = window.devicePixelRatio
        const imgData = canvas.contextContainer.getImageData(mbb.min.x * dpi, mbb.min.y * dpi,
            (mbb.max.x - mbb.min.x) * dpi, (mbb.max.y - mbb.min.y) * dpi);
        return imgData
    }

    // allow drawing
    const allowDrawing = skribbl.canvasData.allowDrawing = function () {
        canvas.isDrawingMode = 1;
        // $('button').prop('disabled', false);
    }

    const erase = skribbl.canvasData.erase = function () {
        skribbl.canvasData.clearCounter++;
        canvas.clear();
        canvas.backgroundColor = '#ffffff';
        coords = [];
    }

    // todo
    var h = [];
    const undo = skribbl.canvasData.undo = function () {
        skribbl.canvasData.undoCounter++;

        if (canvas._objects.length > 1) {
            h.push(canvas._objects.pop());
            h.forEach(i => {
                console.log(i);
            });
            canvas.renderAll();
            skribbl.model.getFrame();
        }
        else if (canvas._objects.length == 1) {
            skribbl.canvasData.erase();
            var bars = document.getElementsByClassName("bar__full");
            for (let bar of bars) {
                bar.innerHTML = " ";
                bar.style.width = "0%";
            }
        }
    }

    const resetAllCounters = skribbl.canvasData.resetAllCounters = function () {
        skribbl.canvasData.clearCounter = 0;
        skribbl.canvasData.fingerLiftedCounter = 0;
        skribbl.canvasData.undoCounter = 0;
    }
    const responsive = skribbl.canvasData.responsive = function () {
        let container = document.getElementsByClassName("canvas__container")[0];
        // let width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        // let height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
        let width = container.offsetWidth;
        let height = container.offsetHeight;
        let widthn = width;
        let heightn = height;
        canvas.setDimensions({
            width: widthn,
            height: heightn
        });
    }


}());