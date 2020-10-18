import React from 'react';
import InteractiveFilter from './InteractiveFilter';
import { convolute } from './filter';
import { getPixels, createImageData } from './filter';
import { isWidthDown } from '@material-ui/core';

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
                // let r1 = result1.slice(0)
                console.log(result1)
                
                
                
                props.kernel2 && convolute(inCanvas, outCanvas, false, props.kernel2)
                let check2 = getPixels(outCanvas)
                
                if (!check2) { 
                    return ;
                }
                let result2 = Uint8ClampedArray.from(check2.data)
                // let r2 = result2.slice(0)
                
                // if(JSON.stringify(a)==JSON.stringify(b)) {
                //     console.log
                // }
                console.log(result2)

                let width = check.width
                let height = check.height
                console.log(width, height)
                
                // let diff_im = createImageData(outCanvas)
                // let diff = diff_im?.data

                let diff = result1.map((pix, i)=> ((i+1)%4== 0 ? pix : Math.abs(pix - result2[i])));
                console.log(diff)

                let output = new ImageData(diff, width, height)
                console.log(output.data)


                let pix_diff = pixelmatch(result1, result2, diff, width, height, {threshold: 0.0001, aaColor:[33,33,33],diffColor:[0,0,0]});
                console.log(diff)

                // if (diff_im) {
                outCanvas.getContext('2d')?.putImageData(output, 0, 0);
                // } 

            }}
        />
    )
}

export default FilterByKernel;