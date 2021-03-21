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
        };
    })

    const applyImage = (imgUrl: any) => {
        const canvasXElem = canvasX.current;
        const canvasYElem = canvasY.current;
        const canvasVElem = canvasV.current;

        gradientImages(imgUrl).then((gradients: GradientsType) => {
            // @ts-ignore
            displayGradients(canvasXElem, canvasYElem, canvasVElem, gradients);
        })

        const canvasHistElem = canvasHist.current;
        histogramAggregate(imgUrl).then((histogram: number[]) => {
            console.log(histogram)

            const bins = histogram.length;
            const labels: number[] = [];
            function binDirection(element: number, index: number, array: number[]) {
                labels.push((180 / bins) * index);
            }
            histogram.forEach(binDirection);
            labels.push(180)
            console.log(labels);
            const chart =  new Chart(canvasHistElem?.getContext('2d'), {
                type: 'bar',
                data: {
                  labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                  datasets: [{
                    label: 'Aggregated Histogram',
                    data: histogram,
                    backgroundColor: 'green',
                  }]
                },
                options: {
                  scales: {
                    xAxes: [{
                      display: false,
                      barPercentage: 1.3,
                      ticks: {
                        max: 8,
                      }
                    }, {
                      display: true,
                      ticks: {
                        autoSkip: false,
                        max: 9,
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
            <canvas
                className="crisp-pixels mx-auto"
                ref={canvasV}
                width={imgWidth}
                height={imgHeight}
            />
            <canvas
                className="crisp-pixels mx-auto"
                ref={canvasHist}
                width={imgWidth}
                height={imgHeight}
            />
        </div>
    );
}

export default HistOfGradDemo;

