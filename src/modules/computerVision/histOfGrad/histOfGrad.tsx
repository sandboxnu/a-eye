/* eslint-disable */

const { Image } = require('image-js');
const hog = require('hog-features');
const flowers = require('../../../media/modules/computerVision/imageLibrary/purpleFlowers.jpeg')
  .default;

export async function histogramAggregate(img: any): Promise<number[]> {
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

export type BlocksType = {
  histogram: number[][][];
  blockMagnitudes: number[][];
};

export async function histogramBlocks(img: any): Promise<BlocksType> {
  return Image.load(img).then((image: any) => {
    const normal = {
      cellSize: 8,
      blockSize: 2,
      blockStride: 1,
      bins: 9,
    };
    const mediumSparse = {
      cellSize: 12,
      blockSize: 4,
      blockStride: 2,
      bins: 9,
    };
    const sparseBlocks = {
      cellSize: 16,
      blockSize: 4,
      blockStride: 2,
      bins: 9,
    };
    const options = mediumSparse;
    const descriptor = hog.extractHOG(image, options);

    const intensities: { x: number[][], y: number[][] } = hog.gradients(image);
    const intensitiesX: number[] = intensities.x.flat();
    const intensitiesY: number[] = intensities.y.flat();
    const intensitiesV: number[] = intensitiesX.map((num, idx) => Math.sqrt(Math.pow(num, 2) + Math.pow(intensitiesY[idx], 2)));

    const blockWidth = Math.floor((image.width / options.cellSize - options.blockSize) / options.blockStride) + 1;
    const blockHeight = Math.floor((image.height / options.cellSize - options.blockSize) / options.blockStride) + 1;
    const blockPixels = options.cellSize * options.blockSize;

    const blockHistograms: number[][][] = [];
    for (let blockRow = 0; blockRow < blockWidth; blockRow += 1) {
      const row: number[][] = [];
      const mRow: number[] = [];
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

    // reshape intensitiesV to be [image width, image height]
    const intensitiesV2D: number[][] = [];
    for (let i = 0; i < image.width; i += 1) {
      const row: number[] = [];
      for (let j = 0; j < image.height; j += 1) {
        const index = i * image.width + j;
        row.push(intensitiesV[index]);
      }
      intensitiesV2D.push(row);
    }

    // for each block, calculate average of all pixels within block
    const mBlocks: number[][] = [];
    for (let blockRow = 0; blockRow < blockWidth; blockRow += 1) {
      const mRow: number[] = [];
      for (let blockCol = 0; blockCol < blockHeight; blockCol += 1) {
        const index = blockRow * blockWidth + blockCol;
        mRow.push(averageBlock(intensitiesV2D, blockRow, blockCol, blockPixels));
      }
      mBlocks.push(mRow);
    }

    return {histogram: blockHistograms, blockMagnitudes: mBlocks};
  });
}

function averageBlock(arr: number[][], row: number, col: number, length: number): number {
  let sum = 0;
  for (let i = 0; i < length; i++) {
    for (let j = 0; j < length; j++) {
      sum += arr[row+i][col+j];
    }
  }
  return sum / (length * length);
}

export type GradientsType = {
  x: ImageData;
  y: ImageData;
  a: number[][];
  v: ImageData;
};

export const map = (x: number, min1: number, max1: number, min2: number, max2: number): number => (x - min1) * (max2 - min2) / (max1 - min1) + min2;

export async function gradientImages(img: any): Promise<GradientsType> {
  return Image.load(img).then((image: any) => {
    const intensities: { x: number[][], y: number[][] } = hog.gradients(image);
    const intensitiesX: number[] = intensities.x.flat();
    const intensitiesY: number[] = intensities.y.flat();
    const intensitiesV: number[] = intensitiesX.map((num, idx) => Math.sqrt(Math.pow(num, 2) + Math.pow(intensitiesY[idx], 2)));
    const intensitiesA: number[] = intensitiesX.map((x, idx) => ((Math.atan(intensitiesY[idx] / x) * (180.0 / Math.PI)) + 180) % 180);

    let maxX = 0, maxY = 0, maxV = 0, minX = 0, minY = 0, minV = 0;
    intensitiesX.forEach(x => {if (!isNaN(x)) {maxX = Math.max(maxX, x); minX = Math.min(minX, x);}});
    intensitiesY.forEach(y => {if (!isNaN(y)) {maxY = Math.max(maxY, y); minY = Math.min(minY, y);}});
    intensitiesV.forEach(v => {if (!isNaN(v)) {maxV = Math.max(maxV, v); minV = Math.min(minV, v);}});

    const valToRGB = (val: number): number[] => [val, val, val, 255];

    const imageX: Uint8ClampedArray = new Uint8ClampedArray(intensitiesX.map(x => valToRGB(map(x, minX, maxX, 0, 255))).flat());
    const imageY: Uint8ClampedArray = new Uint8ClampedArray(intensitiesY.map(y => valToRGB(map(y, minY, maxY, 0, 255))).flat());
    const imageV: Uint8ClampedArray = new Uint8ClampedArray(intensitiesV.map(v => valToRGB(map(v, minV, maxV, 0, 255))).flat());

    const alphas: number[][] = [];
    for (let row = 0; row < image.height; row++) {
      alphas.push(intensitiesA.slice(row * image.height, row * image.height + image.width));
    }

    return {
      x: new ImageData(imageX, image.width, image.height),
      y: new ImageData(imageY, image.width, image.height),
      a: alphas,
      v: new ImageData(imageV, image.width, image.height),
    }
  });
}


// todo: what are we doing the 'v' image, clarify what g_x and g_y are
// todo: do we want to add interactive feature to show gradient for a clicked block on the imag
