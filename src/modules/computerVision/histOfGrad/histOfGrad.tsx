/* eslint-disable */

const { Image } = require('image-js');
const hog = require('hog-features');

export const denseConfig = {
  cellSize: 8,
  blockSize: 2,
  blockStride: 1,
  bins: 18,
};
export const mediumConfig = {
  cellSize: 12,
  blockSize: 4,
  blockStride: 2,
  bins: 18,
};
export const sparseConfig = {
  cellSize: 16,
  blockSize: 6,
  blockStride: 3,
  bins: 18,
};

export type HogOptionsType = {
  cellSize: number;
  blockSize: number;
  blockStride: number;
  bins: number;
}

// backend functions

export const map = (x: number, min1: number, max1: number, min2: number, max2: number): number => (x - min1) * (max2 - min2) / (max1 - min1) + min2;

export async function histogramAggregate(img: any, options: HogOptionsType): Promise<number[]> {
  return Image.load(img).then((image: any) => {
    image = image.resize({width: 350});

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

export async function histogramBlocks(img: any, options: HogOptionsType): Promise<BlocksType> {
  return Image.load(img).then((image: any) => {
    image = image.resize({width: 350});

    const blockHistograms: number[][][] = hog.extractHistograms(image, options);
    const mBlocks: number[][] = blockHistograms.map(row => row.map(col => col.reduce((acc, curr) => acc + curr)));

    return {histogram: blockHistograms, blockMagnitudes: mBlocks};
  });
}

export type GradientsType = {
  x: ImageData;
  y: ImageData;
  a: number[][];
  v: ImageData;
};

export async function gradientImages(img: any): Promise<GradientsType> {
  return Image.load(img).then((image: any) => {
    image = image.resize({width: 350});

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