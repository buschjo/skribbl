(function () {
    skribbl.canvasData = {};
    var coords = skribbl.canvasData.coords = [];
    var canvas;
    var mousePressed = false;

    const setup = skribbl.canvasData.setup = function () {
        canvas = window._canvas = new fabric.Canvas('canvas');
        canvas.backgroundColor = '#ffffff';
        canvas.isDrawingMode = 1;
        canvas.freeDrawingBrush.color = "black";
        canvas.freeDrawingBrush.width = 10;
        canvas.renderAll();
        //setup listeners 
        canvas.on('mouse:up', function (e) {
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
        // canvas.addEventListener("mouseup", event => {
        //     getFrame();
        //     mousePressed = false;
        // });
        // canvas.addEventListener("mousedown", event => {
        //     mousePressed = true;
        // });
        // canvas.addEventListener("mousemove", event => {
        //     recordCoor(event);
        // });

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

        //return as strucut 
        return {
            min: min_coords,
            max: max_coords
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
        canvas.clear();
        canvas.backgroundColor = '#ffffff';
        coords = [];
    }
} ());