/* eslint-disable */

const { Image } = require('image-js');
const hog = require('hog-features');
const flowers = require('../../../media/modules/computerVision/imageLibrary/purpleFlowers.jpeg')
  .default;

async function histogramAggregate(img: any): Promise<number[][][]> {
  return Image.load(img).then((image: any) => {
    const options = {
      cellSize: 8,
      blockSize: 2,
      blockStride: 1,
      bins: 9,
    };
    const descriptor = hog.extractHOG(image, options);
    const histogram: number[] = new Array(options.bins).fill(0);

    descriptor.forEach((val: number, idx: number) => {
      histogram[idx % options.bins] += val;
    });

    return histogram;
  });
}

async function histogramBlocks(img: any): Promise<number[][][]> {
  return Image.load(img).then((image: any) => {
    const options = {
      cellSize: 8,
      blockSize: 2,
      blockStride: 1,
      bins: 9,
    };
    const descriptor = hog.extractHOG(image, options);

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

const map = (x: number, min1: number, max1: number, min2: number, max2: number): number => (x - min1) * (max2 - min2) / (max1 - min1) + min2;

async function gradientImages(img: any): Promise<Gradients> {
  return Image.load(img).then((image: any) => {

    const intensities: { x: number[][], y: number[][] } = hog.gradients(image);
    const intensitiesX: number[] = intensities.x.flat();
    const intensitiesY: number[] = intensities.y.flat();
    const intensitiesM = intensitiesX.map((num, idx) => Math.sqrt(Math.pow(num, 2) + Math.pow(intensitiesY[idx], 2)));

    let maxX = 0, maxY = 0, maxM = 0, minX = 0, minY = 0, minM = 0;
    intensitiesX.forEach(x => {if (!isNaN(x)) {maxX = Math.max(maxX, x); minX = Math.min(minX, x);}});
    intensitiesY.forEach(y => {if (!isNaN(y)) {maxY = Math.max(maxY, y); minY = Math.min(minY, y);}});
    intensitiesM.forEach(m => {if (!isNaN(m)) {maxM = Math.max(maxM, m); minM = Math.min(minM, m);}});

    const valToRGB = (val: number): number[] => [val, val, val, 1];

    const imageX: Uint8ClampedArray = new Uint8ClampedArray(intensitiesX.map(x => valToRGB(map(x, minX, maxX, 0, 255))).flat());
    const imageY: Uint8ClampedArray = new Uint8ClampedArray(intensitiesY.map(y => valToRGB(map(y, minY, maxY, 0, 255))).flat());
    const imageM: Uint8ClampedArray = new Uint8ClampedArray(intensitiesM.map(m => valToRGB(map(m, minM, maxM, 0, 255))).flat());

    return {
      x: new ImageData(imageX, image.width, image.height),
      y: new ImageData(imageY, image.width, image.height),
      m: new ImageData(imageM, image.width, image.height),
    }
  });
}

function histogram() {
  histogramAggregate(flowers).then(result => console.log(result));
}

// todo: what are we doing the 'v' image, clarify what g_x and g_y are
// todo: do we want to add interactive feature to show gradient for a clicked block on the image?
export default histogram;