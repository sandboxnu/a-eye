import React, { useLayoutEffect, useRef } from 'react';
import { filterImage, convolute } from './filter';
import politeCat from './politeCat.png';

// http://dev.theomader.com/gaussian-kernel-calculator/
// https://blog.cloudboost.io/using-html5-canvas-with-react-ff7d93f5dc76

const GaussianBlurDemo = () => {
    const inputCanvas = useRef<HTMLCanvasElement>(null);
    const outputCanvas = useRef<HTMLCanvasElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    useLayoutEffect(() => {
        const inputElem = inputCanvas.current; // get the DOM element for the canvas
        const outputElem = outputCanvas.current;
        const imgElem = imgRef.current;
        if (!(inputElem && outputElem && imgElem)) return;

        imgElem.onload = () => {
            inputElem.getContext('2d')?.drawImage(imgElem, 0, 0);
            filterImage(convolute, inputElem, outputElem, imgElem,
                [.07, .1, .07,
                .1, .2, .1,
                .07, .1, .07]);
        }
    }, [])

    // hardcoded width and height for canvas
    return (
        <div>
            <canvas ref={inputCanvas} width={640} height={640} />
            <canvas ref={outputCanvas} width={640} height={640} />
            <img ref={imgRef} src={politeCat} alt="input" className='hidden' />
        </div>
    )
}

export default GaussianBlurDemo;