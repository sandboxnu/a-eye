/* eslint-disable*/
import React from 'react';
import InteractiveFilter from './InteractiveFilter';
import { convolute, getPixels } from './filter';

// http://dev.theomader.com/gaussian-kernel-calculator/
// https://blog.cloudboost.io/using-html5-canvas-with-react-ff7d93f5dc76

type DiffByKernelType = {
  kernel?: number[];
  kernel2?: number[];
  imgUrl: string;
};

const FilterByDiffKernel: React.FC<DiffByKernelType> = ({
  kernel,
  kernel2,
  imgUrl,
}) => (
  <InteractiveFilter
    disabled={!kernel}
    imgUrl={imgUrl}
    filter={(inCanvas, outCanvas) => {
      if (kernel) {
        convolute(inCanvas, outCanvas, false, kernel);
      }
      const check = getPixels(outCanvas);
      if (!check) {
        return;
      }
      const result1 = Uint8ClampedArray.from(check.data);

      if (kernel2) {
        convolute(inCanvas, outCanvas, false, kernel2);
      }
      const check2 = getPixels(outCanvas);

      if (!check2) {
        return;
      }
      const result2 = Uint8ClampedArray.from(check2.data);

      const { width } = check;
      const { height } = check;

      const diff = result1.map((pix, i) =>
        (i + 1) % 4 === 0 ? 255 : 255 - Math.abs(pix - result2[i]),
      );

      const output = new ImageData(diff, width, height);

      outCanvas.getContext('2d')?.putImageData(output, 0, 0);
    }}
  />
);

export default FilterByDiffKernel;
