/* eslint-disable */

import React, {useLayoutEffect, useRef, useState} from 'react';
import {ALL_IMGS} from '../imageSelector/ImageSelector';
import {histogramAggregate, histogramBlocks, gradientImages, GradientsType} from './histOfGrad';

type HistOfGradDemoType = {
    labelColor: string;
    imgUrl: string;
}

const HistOfGradDemo: React.FC<HistOfGradDemoType> = ({
  labelColor,
    imgUrl,
}) => {
    const canvasX = useRef<HTMLCanvasElement>(null);
    const canvasY = useRef<HTMLCanvasElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const [imgWidth, setImgWidth] = useState<number>();
    const [imgHeight, setImgHeight] = useState<number>();

    useLayoutEffect(() => {
        const canvasXElem = canvasX.current;
        const canvasYElem = canvasY.current;
        const imgElem = imgRef.current;
        if (!(canvasXElem && canvasYElem && imgElem)) return;

        imgElem.onload = () => {
            setImgHeight(imgElem.height);
            setImgWidth(imgElem.width);
        };
    })

    const applyImage = (imgUrl: any) => {
        const canvasXElem = canvasX.current;
        const canvasYElem = canvasY.current;
        gradientImages(imgUrl).then((gradients: GradientsType) => {
            // @ts-ignore
            displayGradients(canvasXElem, canvasYElem, gradients);
        })
    }

    const displayGradients = (cnvX: HTMLCanvasElement, cnvY: HTMLCanvasElement, gradients: GradientsType): void => {
        cnvX.getContext('2d')?.putImageData(gradients.x, 0, 0);
        cnvY.getContext('2d')?.putImageData(gradients.y, 0, 0);
    }

    return (
        <div>
            <img ref={imgRef} src={imgUrl} alt="input" className="mx-auto" />
            <button onClick={() => applyImage(imgUrl)}>Apply Gradients</button>
            <canvas
                className="crisp-pixels mx-auto"
                ref={canvasX}
                width={imgWidth}
                height={imgHeight}
            />
            <canvas
                className="crisp-pixels mx-auto"
                ref={canvasY}
                width={imgWidth}
                height={imgHeight}
            />
        </div>
    );
}

export default HistOfGradDemo;

