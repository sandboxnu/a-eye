/* eslint-disable */

var Chart = require('chart.js');
import React, {useLayoutEffect, useRef, useState} from 'react';
import {ALL_IMGS} from '../imageSelector/ImageSelector';
import {histogramAggregate, histogramBlocks, gradientImages, GradientsType, BlocksType, map} from './histOfGrad';

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
    const canvasNdlPlt = useRef<HTMLCanvasElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const [imgWidth, setImgWidth] = useState<number>();
    const [imgHeight, setImgHeight] = useState<number>();

    useLayoutEffect(() => {
        const canvasXElem = canvasX.current;
        const canvasYElem = canvasY.current;
        const canvasVElem = canvasV.current;
        const canvasHistElem = canvasHist.current;
        const canvasNdlPltElem = canvasNdlPlt.current;
        const imgElem = imgRef.current;
        if (!(canvasXElem && canvasYElem && canvasVElem && imgElem && canvasHistElem && canvasNdlPltElem)) return;

        imgElem.onload = () => {
            setImgHeight(imgElem.height);
            setImgWidth(imgElem.width);
            canvasXElem.getContext('2d')?.fillRect(0, 0, canvasXElem.width, canvasXElem.height);
            canvasYElem.getContext('2d')?.fillRect(0, 0, canvasXElem.width, canvasXElem.height);
            canvasVElem.getContext('2d')?.fillRect(0, 0, canvasXElem.width, canvasXElem.height);
            canvasNdlPltElem.getContext('2d')?.fillRect(0, 0, canvasNdlPltElem.width, canvasNdlPltElem.height);
        };
    })

    const applyImage = (imgUrl: any) => {
        gradientImages(imgUrl).then((gradients: GradientsType) => {
            // @ts-ignore
            displayGradients(canvasX.current, canvasY.current, canvasV.current, gradients);
        });

        histogramAggregate(imgUrl).then((histogram: number[]) => {
            // @ts-ignore
            displayHistogram(canvasHist.current, histogram);
        });

        histogramBlocks(imgUrl).then((blocks: BlocksType) => {
            // @ts-ignore
            displayNeedlePlot(canvasNdlPlt.current, blocks);
        });
    }

    const displayGradients = (cnvX: HTMLCanvasElement, cnvY: HTMLCanvasElement, cnvV: HTMLCanvasElement, gradients: GradientsType): void => {
        cnvX.getContext('2d')?.putImageData(gradients.x, 0, 0);
        cnvY.getContext('2d')?.putImageData(gradients.y, 0, 0);
        cnvV.getContext('2d')?.putImageData(gradients.v, 0, 0);
    }

    const displayNeedlePlot = (canvasNdlPlt: HTMLCanvasElement, blocks: BlocksType): void => {
        const histograms: number[][][] = blocks.histogram;
        const magnitudes: number[][] = blocks.blockMagnitudes;
        console.log(magnitudes);
        let maxV = 0, minV = 10, maxH = 0, minH = 10;
        magnitudes.flat().forEach(v => {if (!isNaN(v)) {maxV = Math.max(maxV, v); minV = Math.min(minV, v);}});
        histograms.flat().flat().forEach(h => {if (!isNaN(h)) {maxH = Math.max(maxH, h); minH = Math.min(minH, h);}});
        console.log(minV, maxV);
        console.log(minH, maxH);

        for (let row = 0; row < histograms.length; row++) {
            for (let col = 0; col < histograms[0].length; col++) {
                const histogram: number[] = histograms[row][col];
                const opacity: number = map(magnitudes[row][col], minV, maxV, 0, 255);
                //console.log(`(${row}, ${col}): ${opacity}`);
                for (let idx = 0; idx < histogram.length; idx++) {
                    const lengthPct: number = map(histogram[idx], minH, maxH, 0, 1);
                    drawNeedle(canvasNdlPlt, row, col, canvasNdlPlt.width / histograms.length, idx * 20, lengthPct, opacity);
                }

            }
        }

    }

    const drawNeedle = (cnv: HTMLCanvasElement, blockRow: number, blockCol: number, blockSize: number, angleDeg: number, lengthPct: number, opacity: number): void => {
        const length: number = lengthPct * blockSize;
        console.log(lengthPct, length / blockSize);
        const pt1 = {x: blockSize / 2 + (length / 2) * Math.cos(angleDeg * (Math.PI / 180)), y: blockSize / 2 + ( length / 2) * -1 * Math.sin(angleDeg * (Math.PI / 180))};
        const pt2 = {x: blockSize / 2 + (length / 2) * -1 * Math.cos(angleDeg * (Math.PI / 180)), y: blockSize / 2 + ( length / 2) * Math.sin(angleDeg * (Math.PI / 180))};
        const blockPos = {x: blockRow * blockSize, y: blockCol * blockSize};
        const context = cnv.getContext('2d');
        if (!context || !(context instanceof CanvasRenderingContext2D)) throw new Error('Failed to get 2D context');
        const ctx: CanvasRenderingContext2D = context;

        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.beginPath();
        ctx.moveTo(blockPos.x + pt1.x, blockPos.y + pt1.y);
        ctx.lineTo(blockPos.x + pt2.x, blockPos.y + pt2.y);
        ctx.stroke();
    }


    const displayHistogram = (cnvHist: HTMLCanvasElement, histogram: number[]): void => {
        const bins = histogram.length;
        const labels: string[] = [];
        for (let i = 0; i <= histogram.length; i++) labels.push(((180 / bins) * i).toString())
        console.log(labels);
        const chart =  new Chart(cnvHist?.getContext('2d'), {
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
            <p className={labelColor}>Needle Plot</p>
            <canvas
                className="crisp-pixels mx-auto max-w-screen-md"
                ref={canvasNdlPlt}
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

