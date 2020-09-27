import React, { useLayoutEffect, useRef } from 'react';
import { convolute } from './filter';
import politeCat from './politeCat.png';
import bebby from './bebby.png';
import jellyfish from './jellyfish.png';

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
            outputElem.getContext('2d')?.drawImage(imgElem, 0, 0);
        }
    }, [])

    const applyFilter = () => {
        const inputElem = inputCanvas.current; // get the DOM element for the canvas
        const outputElem = outputCanvas.current;
        if (!(inputElem && outputElem)) return;
        convolute(inputElem, outputElem, true, 
            [
                0.036894,	0.039167,	0.039956,	0.039167,	0.036894,
                0.039167,	0.041581,	0.042418,	0.041581,	0.039167,
                0.039956,	0.042418,	0.043272,	0.042418,	0.039956,
                0.039167,	0.041581,	0.042418,	0.041581,	0.039167,
                0.036894,	0.039167,	0.039956,	0.039167,	0.036894]);
    }

    // hardcoded width and height for canvas
    return (
        <div className="inline">
            <canvas className="inline" ref={inputCanvas} width={640} height={640} />
            <button onClick={applyFilter}> Apply Filter </button>
            <canvas className="inline" ref={outputCanvas} width={640} height={640} />
            <img ref={imgRef} src={jellyfish} alt="input" className='hidden' />
        </div>
    )
}

export default GaussianBlurDemo;