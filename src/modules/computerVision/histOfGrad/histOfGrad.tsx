const opencv = require('./opencv');


function histogram() {
    let img = opencv.imread('../../media/modules/computerVision/imageLibrary/bwMan.jpg');
    let gx = opencv.Mat();
    let gy = opencv.Mat();

    gx = opencv.Sobel(img, gx, opencv.CV_8U, 1, 0, 1);
    console.log(gx);
}

export default histogram;