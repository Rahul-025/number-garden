var model;

async function loadModel() {
    model = await tf.loadGraphModel('TFJS/model.json');
}

function processImage() {
    // Loaading the image(canvas).
    let img = cv.imread(canvas);
    // Convert to Greyscale
    cv.cvtColor(img, img, cv.COLOR_RGBA2GRAY, 0);
    // Adding threshold for all the pixels.
    cv.threshold(img, img, 175, 255, cv.THRESH_BINARY);

    // Finding the contours of the digit in image.
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(img, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    // Drawing the bounding rectangle.
    let cnt = contours.get(0);
    let rect = cv.boundingRect(cnt);
    img = img.roi(rect);

    // Resizing the image.
    imgHeight = img.rows;
    imgWidht = img.cols;

    if (imgHeight > imgWidht) {
        imgHeight = 20;
        scale = img.rows / imgHeight;
        imgWidht = Math.round(img.cols / scale);
    } else {
        imgWidht = 20;
        scale = img.cols / imgWidht;
        imgHeight = Math.round(img.rows / scale);
    }

    let newSize = new cv.Size(imgWidht, imgHeight);
    cv.resize(img, img, newSize, 0, 0, cv.INTER_AREA);

    // Add Padding
    const TOP = Math.ceil(4 + (20 - imgHeight) / 2);
    const BOTTOM = Math.floor(4 + (20 - imgHeight) / 2);
    const LEFT = Math.floor(4 + (20 - imgWidht) / 2);
    const RIGHT = Math.ceil(4 + (20 - imgWidht) / 2);

    const BLACK = new cv.Scalar(0, 0, 0, 0);
    cv.copyMakeBorder(img, img, TOP, BOTTOM, LEFT, RIGHT, cv.BORDER_CONSTANT, BLACK);

    //Calc. Center of Mass
    cv.findContours(img, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    cnt = contours.get(0);
    const Moments = cv.moments(cnt, false);
    const cx = Moments.m10 / Moments.m00;
    const cy = Moments.m01 / Moments.m00;

    let shiftX = Math.round(img.cols / 2.0 - cx);
    let shiftY = Math.round(img.rows / 2.0 - cy);

    // Shift image
    let Mat = cv.matFromArray(2, 3, cv.CV_64FC1, [1, 0, shiftX, 0, 1, shiftY]);
    newSize = new cv.Size(img.cols, img.rows);
    cv.warpAffine(img, img, Mat, newSize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, BLACK);

    // Normalize the data
    let pixelValues = Float32Array.from(img.data);

    pixelValues = pixelValues.map(function (num) {
        return num / 255.0;
    });

    // Make Prediction
    const X = tf.tensor([pixelValues]);
    const result = model.predict(X);
    result.print();
    const output = result.dataSync()[0];
    // console.log(tf.memory());

    // Cleanup
    img.delete();
    contours.delete();
    cnt.delete();
    hierarchy.delete();
    Mat.delete()
    X.dispose();
    result.dispose();

    return output

}