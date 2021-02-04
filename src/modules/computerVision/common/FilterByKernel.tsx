import React from 'react';
import InteractiveFilter from './InteractiveFilter';
import { convolute } from './filter';

// http://dev.theomader.com/gaussian-kernel-calculator/
// https://blog.cloudboost.io/using-html5-canvas-with-react-ff7d93f5dc76

type FilterByKernelType = {
  kernel?: number[];
  imgUrl: string;
};

const FilterByKernel: React.FC<FilterByKernelType> = ({
  kernel = [],
  imgUrl,
}) => (
  <InteractiveFilter
    disabled={!kernel}
    imgUrl={imgUrl}
    filter={(inCanvas, outCanvas) => {
      if (kernel) {
        convolute(inCanvas, outCanvas, true, kernel);
      }
    }}
  />
);

export default FilterByKernel;
