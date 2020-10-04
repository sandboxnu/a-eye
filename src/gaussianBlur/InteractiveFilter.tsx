import React, { useLayoutEffect, useRef, useState } from 'react';
import { convolute } from './filter';

// http://dev.theomader.com/gaussian-kernel-calculator/
// https://blog.cloudboost.io/using-html5-canvas-with-react-ff7d93f5dc76

const InteractiveFilter = (props : {kernel? : number[], imgUrl : string}) => {
    const [isFiltered, setIsFiltered] = useState(false);
    const [imgWidth, setImgWidth] = useState<number | undefined>(undefined);
    const [imgHeight, setImgHeight] = useState<number | undefined>(undefined);
    const inputCanvas = useRef<HTMLCanvasElement>(null);
    const outputCanvas = useRef<HTMLCanvasElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    useLayoutEffect(() => {
        const inputElem = inputCanvas.current; // get the DOM element for the canvas
        const outputElem = outputCanvas.current;
        const imgElem = imgRef.current;
        if (!(inputElem && outputElem && imgElem)) return;

        imgElem.onload = () => {
            setImgHeight(imgElem.height);
            setImgWidth(imgElem.width);
            inputElem.getContext('2d')?.drawImage(imgElem, 0, 0);
            outputElem.getContext('2d')?.drawImage(imgElem, 0, 0);
        }
    }, [])

    const applyFilter = () => {
        const inputElem = inputCanvas.current; // get the DOM element for the canvas
        const outputElem = outputCanvas.current;
        if (!(inputElem && outputElem)) return;
        props.kernel && convolute(inputElem, outputElem, true, props.kernel);
        setIsFiltered(true);
    }

    const resetImage = () => {
        const outputElem = outputCanvas.current;
        const imgElem = imgRef.current;
        if (!(outputElem && imgElem)) return;
        const ctxt = outputElem.getContext('2d');
        ctxt?.clearRect(0, 0, ctxt.canvas.width, ctxt.canvas.height);
        ctxt?.drawImage(imgElem, 0, 0);
        setIsFiltered(false);
    }

    return (
        <div>
            <canvas className="hidden" ref={inputCanvas} width={imgWidth} height={imgHeight} />
            <img ref={imgRef} src={props.imgUrl} alt="input" className='hidden' />
            <canvas className="m-auto"
                ref={outputCanvas} width={imgRef.current?.width} height={imgRef.current?.height} />
            <button className="basic-button" disabled={!props.kernel}
                onClick={() => isFiltered ? resetImage() : applyFilter()}> 
                {isFiltered ? "Reset Image" : "Apply Filter"} 
            </button>
        </div>
    )
}

export default InteractiveFilter;