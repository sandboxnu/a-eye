/* eslint-disable */

import {HogConfigType} from "./hogComponents";

const { Image } = require('image-js');
const hog = require('hog-features');
import { buildQueries } from '@testing-library/dom';
import Jimp from 'jimp';

export const denseConfig = {
  cellSize: 8,
  blockSize: 2,
  blockStride: 1,
  bins: 4,
};
export const mediumConfig = {
  cellSize: 16,
  blockSize: 4,
  blockStride: 2,
  bins: 4,
};
export const sparseConfig = {
  cellSize: 32,
  blockSize: 6,
  blockStride: 3,
  bins: 4,
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

export function calculateHistogram(needleHist: number[][][]): number[] {
  let histogram: number[] = [0, 0, 0, 0];
  needleHist.forEach(row => row.forEach(col => col.forEach((needle, idx) => histogram[idx] += needle)));
  return histogram;
}

const roundToMultiple = (x: number, multiple: number): number => (Math.round(x / multiple) * multiple);

// splits the images pixels into blocks of size options.cellSize
export async function calculateSobelHog(img: any, blockSize: number): Promise<BlocksType> {
  return Image.load(img).then((image: any) => {
    image = image.resize({width: Math.max(360, image.width)});
    // resize image so it's a multiple of blockSize
    // image = image.resize({width: roundToMultiple(image.width, blockSize)});
    const pixelsHist: number[][][] = pixelSobelValues(image);

    const numBlockRows = Math.floor(pixelsHist.length / blockSize) + 1;
    const numBlockCols = Math.floor(pixelsHist[0].length / blockSize) + 1;

    // set up histogram array
    const histogram: number[][][] = [];
    for (let blockRow = 0; blockRow < numBlockRows; blockRow++) {
      histogram[blockRow] = [];
      for (let blockCol = 0; blockCol < numBlockCols; blockCol++) {
        histogram[blockRow][blockCol] = [0, 0, 0, 0];
      }
    }

    // iterate through pixels, add needles to appropriate block
    for (let row = 0; row < pixelsHist.length; row++) {
      for (let col = 0; col < pixelsHist[0].length; col++) {
        const blockRow = Math.floor(row / blockSize);
        const blockCol = Math.floor(col / blockSize);
        // values in order of degree: 0, 45, 90, 135
        let needles = pixelsHist[row][col];
        needles.forEach((value, idx) => histogram[blockRow][blockCol][idx] += value);
      }
    }

    const mBlocks: number[][] = histogram.map(row => row.map(col => col.reduce((acc, curr) => acc + curr)));

    return {histogram: histogram, blockMagnitudes: mBlocks};
  });
}

// returns 3d array: 2d array of [row][col] pixels, each pixel has [horiz, diagUp, vert, diagDown] sobel outputs
function pixelSobelValues(image: any): number[][][] {
  // convert image to b&w and split pixels into 2d array
  const bw = image.grey();
  const pixels1d: number[] = Array.from(bw.data);
  const pixels: number[][] = [];
  while (pixels1d.length) pixels.push(pixels1d.splice(0, bw.width));

  let histogram: number[][][] = [];
  // get sobel values at each pixel
  for (let row = 0; row < pixels.length; row++) {
    histogram[row] = [];
    for (let col = 0; col < pixels[0].length; col++) {
      // values in order of degree: 0, 45, 90, 135
      histogram[row][col] = gradientsAt(pixels, row, col);;
    }
  }

  return histogram;
}

// calculates the four sobel outputs (horizontal, diagonal up, vertical, diagonal down) at the given pixel
function gradientsAt(pixels: number[][], row: number, col: number): number[] {
  const notTop = row > 0;
  const notBottom = row < pixels.length - 1;
  const notLeft = col > 0;
  const notRight = col < pixels[0].length - 1;

  let topLeft: number = notTop && notLeft ? pixels[row-1][col-1] : 0;
  let top: number = notTop ? pixels[row-1][col] : 0;
  let topRight: number = notTop && notRight ? pixels[row-1][col+1] : 0;
  let right: number = notRight ? pixels[row][col+1] : 0;
  let bottomRight: number = notBottom && notRight ? pixels[row+1][col+1] : 0;
  let bottom: number = notBottom ? pixels[row+1][col] : 0;
  let bottomLeft: number = notBottom && notLeft ? pixels[row+1][col-1] : 0;
  let left: number = notLeft ? pixels[row][col-1] : 0;

  // calculate sobel values; use dark-to-light for each, but take abs value
  const horiz: number = Math.abs((-1 * topLeft) + (-2 * top) + (-1 * topRight) + bottomLeft + (2 * bottom) + bottomRight);
  const vert: number = Math.abs((-1 * topLeft) + (-2 * left) + (-1 * bottomLeft) + topRight + (2 * right) + bottomRight);
  const diagUp: number = Math.abs((-1 * left) + (-2 * topLeft) + (-1 * top) + bottom + (2 * bottomRight) + right);
  const diagDown: number = Math.abs((-1 * top) + (-2 * topRight) + (-1 * right) + left + (2 * bottomLeft) + bottom);

  // [0, 45, 90, 135]
  return [horiz, diagUp, vert, diagDown];
}