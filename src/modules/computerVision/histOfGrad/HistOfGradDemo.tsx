/* eslint-disable */

var Chart = require('chart.js');
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
    const canvasV = useRef<HTMLCanvasElement>(null);
    const canvasHist = useRef<HTMLCanvasElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const [imgWidth, setImgWidth] = useState<number>();
    const [imgHeight, setImgHeight] = useState<number>();

    useLayoutEffect(() => {
        const canvasXElem = canvasX.current;
        const canvasYElem = canvasY.current;
        const canvasVElem = canvasV.current;
        const canvasHistElem = canvasHist.current;
        const imgElem = imgRef.current;
        if (!(canvasXElem && canvasYElem && canvasVElem && imgElem && canvasHistElem)) return;

        imgElem.onload = () => {
            setImgHeight(imgElem.height);
            setImgWidth(imgElem.width);
            canvasXElem.getContext('2d')?.fillRect(0, 0, canvasXElem.width, canvasXElem.height);
            canvasYElem.getContext('2d')?.fillRect(0, 0, canvasXElem.width, canvasXElem.height);
            canvasVElem.getContext('2d')?.fillRect(0, 0, canvasXElem.width, canvasXElem.height);
        };
    })

    const applyImage = (imgUrl: any) => {
        const canvasXElem = canvasX.current;
        const canvasYElem = canvasY.current;
        const canvasVElem = canvasV.current;

        histogramBlocks(imgUrl);

        gradientImages(imgUrl).then((gradients: GradientsType) => {
            // @ts-ignore
            displayGradients(canvasXElem, canvasYElem, canvasVElem, gradients);
        })

        const canvasHistElem = canvasHist.current;
        histogramAggregate(imgUrl).then((histogram: number[]) => {
            console.log(histogram);

            const bins = histogram.length;
            const labels: string[] = [];
            for (let i = 0; i <= histogram.length; i++) labels.push(((180 / bins) * i).toString())
            console.log(labels);
            const chart =  new Chart(canvasHistElem?.getContext('2d'), {
                type: 'bar',
                data: {
                  labels,
                  datasets: [{
                    label: 'Aggregated Histogram',
                    data: histogram,
                    backgroundColor: 'green',
                  }]
                },
                options: {
                    responsive: true,
                  scales: {
                    xAxes: [{
                      display: false,
                      barPercentage: 1.0,
                      ticks: {
                        max: 10,
                      }
                    }, {
                      display: true,
                      ticks: {
                        autoSkip: false,
                        max: 10,
                      }
                    }],
                    yAxes: [{
                      ticks: {
                        beginAtZero: true
                      }
                    }]
                  }
                }
              }); 
        })
    }

    const displayGradients = (cnvX: HTMLCanvasElement, cnvY: HTMLCanvasElement, cnvV: HTMLCanvasElement, gradients: GradientsType): void => {
        cnvX.getContext('2d')?.putImageData(gradients.x, 0, 0);
        cnvY.getContext('2d')?.putImageData(gradients.y, 0, 0);
        cnvV.getContext('2d')?.putImageData(gradients.v, 0, 0);
    }

    return (
        <div>
            <img ref={imgRef} src={imgUrl} alt="input" className="mx-auto" />
            <button onClick={() => applyImage(imgUrl)} className={`btn ${labelColor}`}>Apply Gradients</button>
            <br/>
            <p className={labelColor}>Horizontal Sobel</p>
            <canvas
                className="crisp-pixels mx-auto"
                ref={canvasX}
                width={imgWidth}
                height={imgHeight}
            />
            <p className={labelColor}>Vertical Sobel</p>
            <canvas
                className="crisp-pixels mx-auto"
                ref={canvasY}
                width={imgWidth}
                height={imgHeight}
            />
            <p className={labelColor}>Combined Sobel</p>
            <canvas
                className="crisp-pixels mx-auto"
                ref={canvasV}
                width={imgWidth}
                height={imgHeight}
            />
            <p className={labelColor}>Aggregated Histogram</p>
            <canvas
                className="crisp-pixels mx-auto max-w-screen-md"
                ref={canvasHist}
                width={imgWidth}
                height={imgHeight}
            />
        </div>
    );
}

export default HistOfGradDemo;

