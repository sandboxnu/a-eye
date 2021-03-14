/* eslint-disable */

const { Image } = require('image-js');
const hog = require('hog-features');
const flowers = require('../../../media/modules/computerVision/imageLibrary/purpleFlowers.jpeg')
  .default;

async function histogramOfGradients(img: any): Promise<number[][][]> {
  return Image.load(img).then((image: any) => {
    const options = {
      cellSize: 8,
      blockSize: 2,
      blockStride: 1,
      bins: 9,
    };
    const descriptor = hog.extractHOG(image, options);
    console.log(hog.gradients(image));
    const blockWidth = Math.floor((image.width / options.cellSize - options.blockSize) / options.blockStride) + 1;
    const blockHeight = Math.floor((image.height / options.cellSize - options.blockSize) / options.blockStride) + 1;

    const blockHistograms: number[][][] = [];
    for (let blockRow = 0; blockRow < blockWidth; blockRow += 1) {
      const row: number[][] = [];
      for (let blockCol = 0; blockCol < blockHeight; blockCol += 1) {
        const index = blockRow * blockWidth + blockCol;
        row.push(
          descriptor.slice(
            index * options.bins,
            index * options.bins + options.bins,
          ),
        );
      }
      blockHistograms.push(row);
    }
    return blockHistograms;
  });
}

type Gradients = {
  x: ImageData;
  y: ImageData;
  m: ImageData;
};

async function gradientImages(img: any): Promise<Gradients> {
  return Image.load(img).then((image: any) => {
    console.log(image);
    const intensities: { x: number[][], y: number[][] } = hog.gradients(image);
    const intensitiesX: number[] = intensities.x.flat();
    const intensitiesY: number[] = intensities.y.flat();

    let maxX = 0.0;
    intensitiesX.forEach(x => {
      console.log(typeof x);
      maxX = Math.max(maxX, x)});
    console.log(maxX);
    return {
      x: '',
      y: '',
      m: '',
    }
  });
}


function histogram() {
  gradientImages(flowers).then(result => console.log(result));
}

export default histogram;
