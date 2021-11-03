/* eslint-disable */
import React from 'react';
import InteractiveFilter from './InteractiveFilter';
import { convolute } from './filter';
import { getPixels } from './filter';

// http://dev.theomader.com/gaussian-kernel-calculator/
// https://blog.cloudboost.io/using-html5-canvas-with-react-ff7d93f5dc76

const FilterByDiffKernel = (props: { kernel?: number[], kernel2?:number[], imgUrl: string }) => {
    return (
        <InteractiveFilter
            disabled={!props.kernel}
            imgUrl={props.imgUrl}
            filter={(inCanvas, outCanvas) => {
                props.kernel && convolute(inCanvas, outCanvas, false, props.kernel);
                const check = getPixels(outCanvas);
                if (!check) return;

                const result1 = Uint8ClampedArray.from(check.data);
                props.kernel2 && convolute(inCanvas, outCanvas, false, props.kernel2);

                const check2 = getPixels(outCanvas);
                if (!check2) return;

                const result2 = Uint8ClampedArray.from(check2.data);
                const width = check.width;
                const height = check.height;

                const diff = result1.map((pix, i)=> ((i+1)%4 === 0 ? 255 : 255 - Math.abs(pix - result2[i])));
                const output = new ImageData(diff, width, height);
                outCanvas.getContext('2d')?.putImageData(output, 0, 0);
            }}
        />
    )
}

export default FilterByDiffKernel;