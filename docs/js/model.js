class ModelData {

    constructor() {
        this.model = undefined;
        this.classnames = undefined;
        this.names = undefined;
        this.probs = undefined;
        console.log("Model starting Initialization");
    }

    async start(cur_mode) {
        //language
        console.log("from Model: current Mode : " + cur_mode)
        this.mode = cur_mode;

        //load the model
        this.model = await tf.loadModel('model20k15e/model.json');

        //warm up
        this.model.predict(tf.zeros([1, 28, 28, 1]));

        //allow drawing on the canvas
        // skribbl.canvasData.allowDrawing();

        await this.loadDict();
        console.log('model ready');
    }

    //load german and english category names
    async loadDict() {
        console.log(this.mode);
        if (this.mode == 'de') {
            var loc = 'model20k15e/class_names_de.txt';
            console.log("load german");
        } else {
            var loc = 'model20k15e/class_names.txt';
            console.log("load english");
        }

        await $.ajax({
            url: loc,
            dataType: 'text',
        }).done(this.success);
    }

    //split the data names in to an array
    success(data) {
        SingletonAppController.getInstance().modelData.classnames = data.split(/\n/);
    }

    /*
    preprocess image data
    */
    preprocess(imgData) {
        return tf.tidy(() => {
            //convert to a tensor
            var numChannels = 1;
            let tensor = tf.fromPixels(imgData, numChannels)

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

    //get the Frame from the canvas
    getFrame() {
        var appController = SingletonAppController.getInstance();
        if (appController.gameRound.canvasData.coords.length >= 2) {
            //get the image data from the canvas
            const imgData = appController.gameRound.canvasData.getImageData()
            //get the prediction
            const pred = this.model.predict(this.preprocess(imgData)).dataSync()
            //find the top 5 predictions
            const indices = this.findIndicesOfMax(pred, 5)
            //instead of skribbl.probs and skribbl.names --> model.probs and model.names
            this.probs = this.findTopValues(pred, 5)
            this.names = this.getClassnames(indices)
            //set the table
            appController.gameScreenController.drawBars(this.names, this.probs);
            console.log(this.names);

            //show image to end screen
            endscreenimage = imgData;
        }
    }

    //find the maximums of the prediction probabilities from the neural network model
    findIndicesOfMax(inp, count) {
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

    //find the correct categorie names for the top prediction probabilities
    findTopValues(inp, count) {
        var outp = [];
        let indices = this.findIndicesOfMax(inp, count)
        // show 5 greatest scores
        for (var i = 0; i < indices.length; i++)
            outp[i] = inp[indices[i]]
        return outp
    }

    getClassnames(indices) {
        var outp = []
        for (var i = 0; i < indices.length; i++)
            outp[i] = this.classnames[indices[i]]
        return outp
    }
}