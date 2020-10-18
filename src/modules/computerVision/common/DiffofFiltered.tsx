import React from 'react';
import InteractiveFilter from './InteractiveFilter';
import { convolute } from './filter';
import { getPixels, createImageData } from './filter';

const pixelmatch = require('pixelmatch');

// http://dev.theomader.com/gaussian-kernel-calculator/
// https://blog.cloudboost.io/using-html5-canvas-with-react-ff7d93f5dc76

const FilterByKernel = (props: { kernel?: number[], kernel2?:number[], imgUrl: string }) => {

    return (
        <InteractiveFilter
            disabled={!props.kernel}
            imgUrl={props.imgUrl}
            filter={(inCanvas, outCanvas) => {
                
                
                props.kernel && convolute(inCanvas, outCanvas, false, props.kernel)
                let check = getPixels(outCanvas)
                if (!check) { 
                    return ;
                }
                let result1 = Uint8ClampedArray.from(check.data)
                
                
                props.kernel2 && convolute(inCanvas, outCanvas, false, props.kernel2)
                let check2 = getPixels(outCanvas)
                
                if (!check2) { 
                    return ;
                }
                let result2 = Uint8ClampedArray.from(check2.data)

                let width = check.width
                let height = check.height
                
                let diff = result1.map((pix, i)=> ((i+1)%4== 0 ? 255 : 255 - Math.abs(pix - result2[i])));
                

                let output = new ImageData(diff, width, height)
                
                outCanvas.getContext('2d')?.putImageData(output, 0, 0);


            }}
        />
    )
}

export default FilterByKernel;