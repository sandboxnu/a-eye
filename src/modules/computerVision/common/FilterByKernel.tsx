import React from 'react';
import InteractiveFilter from './InteractiveFilter';
import { convolute } from './filter';

// http://dev.theomader.com/gaussian-kernel-calculator/
// https://blog.cloudboost.io/using-html5-canvas-with-react-ff7d93f5dc76

const FilterByKernel = (props: { kernel?: number[]; imgUrl: string }) => (
  <InteractiveFilter
    disabled={!props.kernel}
    imgUrl={props.imgUrl}
    filter={(inCanvas, outCanvas) => {
      props.kernel && convolute(inCanvas, outCanvas, true, props.kernel);
    }}
  />
);

export default FilterByKernel;
