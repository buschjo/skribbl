(function () {
    skribbl.model = {};
    var model;
    var classNames = skribbl.classNames= [];

    const start = skribbl.model.start = async function start(cur_mode) {
        //language
        mode = cur_mode;
    
        //load the model 
        model = await tf.loadModel('model20k15e/model.json');
    
        //warm up 
        model.predict(tf.zeros([1, 28, 28, 1]));
    
        //allow drawing on the canvas 
        // skribbl.canvasData.allowDrawing();
    
        //load the class names
        await loadDict();
        console.log('model started');
    }

    /*
    preprocess the data
    */
    function preprocess(imgData) {
        return tf.tidy(() => {
            //convert to a tensor 
            let tensor = tf.fromPixels(imgData, numChannels = 1)

            //resize 
            const resized = tf.image.resizeBilinear(tensor, [28, 28]).toFloat()

            //normalize 
            const offset = tf.scalar(255.0);
            const normalized = tf.scalar(1.0).sub(resized.div(offset));

            //We add a dimension to get a batch shape 
            const batched = normalized.expandDims(0)
            return batched
        })
    }

    /*
    find the top 5 predictions
    */
    function findTopValues(inp, count) {
        var outp = [];
        let indices = findIndicesOfMax(inp, count)
        // show 5 greatest scores
        for (var i = 0; i < indices.length; i++)
            outp[i] = inp[indices[i]]
        return outp
    }

    /*
    get indices of the top probs
    */
    function findIndicesOfMax(inp, count) {
        var outp = [];
        for (var i = 0; i < inp.length; i++) {
            outp.push(i); // add index to output array
            if (outp.length > count) {
                outp.sort(function (a, b) {
                    return inp[b] - inp[a];
                }); // descending sort the output array
                outp.pop(); // remove the last index (index of smallest element in output array)
            }
        }
        return outp;
    }

    /*
    get the the class names 
    */
    function getClassNames(indices) {
        var outp = []
        for (var i = 0; i < indices.length; i++)
            outp[i] = classNames[indices[i]]
        return outp
    }

    /*
    load the class names 
    */
    async function loadDict() {
        console.log(mode);
        if (mode == 'de'){
            loc = 'model20k15e/class_names_de.txt';
            console.log("load german");
        }
        else{
            loc = 'model20k15e/class_names.txt';
            console.log("load english");
        }

        await $.ajax({
            url: loc,
            dataType: 'text',
        }).done(success);
    }

    /*
    load the class names
    */
    function success(data) {
        const lst = data.split(/\n/)
        for (var i = 0; i < lst.length - 1; i++) {
            let symbol = lst[i]
            classNames[i] = symbol
        }
    }

    /*
    get the prediction 
    */
    const getFrame = skribbl.model.getFrame = function () {
        //make sure we have at least two recorded coordinates 
        if (skribbl.canvasData.coords.length >= 2) {

            //get the image data from the canvas 
            const imgData = skribbl.canvasData.getImageData()

            //get the prediction 
            const pred = model.predict(preprocess(imgData)).dataSync()
            //find the top 5 predictions 
            const indices = findIndicesOfMax(pred, 5)
            const probs = skribbl.probs = findTopValues(pred, 5)
            const names = skribbl.names = getClassNames(indices)
            //set the table 
            skribbl.drawBars(names, probs);
            console.log(names); 
        }
    }
} ());