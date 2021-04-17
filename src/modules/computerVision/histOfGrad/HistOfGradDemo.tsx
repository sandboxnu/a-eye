/* eslint-disable */

var Chart = require('chart.js');
import React, {useLayoutEffect, useRef, useState} from 'react';
import {histogramAggregate, histogramBlocks, gradientImages, GradientsType, BlocksType, map, denseConfig, mediumConfig, sparseConfig, hogConfig} from './histOfGrad';
import sobelFilter from '../../../media/modules/computerVision/sobelFilters.png';
import needleImg from '../../../media/modules/computerVision/needleExample.png';

type HistOfGradDemoType = {
    labelColor: string;
    imgUrl: string;
}

type hogConfigType = 'dense' | 'medium' | 'sparse';
type orientationConfigType = 'all' | 'horizontal' | 'vertical' | 'diagonal45' | 'diagonal135';

type HogTabType = {
  labelColor: string;
  width: number;
  height: number;
  gradients: GradientsType;
  blocks: BlocksType;
  histogram: number[];
  setHogConfig: (type: hogConfigType) => void;
  hogConfig: hogConfigType;
}

const SobelTab: React.FC<HogTabType> = ({
  labelColor,
  width,
  height,
  gradients,
}) => {
  const canvasX = useRef<HTMLCanvasElement>(null);
  const canvasY = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const canvasXElem = canvasX.current;
    const canvasYElem = canvasY.current;
    if (!(canvasXElem && canvasYElem)) return;

    // @ts-ignore
    displayGradients(canvasX.current, canvasY.current, null, gradients);
  })
  
  return (
    <div className="flex justify-evenly">
        <div className="my-auto mx-3">
            <p className={labelColor}>Horizontal Sobel</p>
            <canvas
                className="crisp-pixels mx-auto"
                ref={canvasX}
                width={width}
                height={height}
            />
        </div>
        <div className="my-auto mx-3">
            <img src={sobelFilter} alt="img" />
        </div>
        <div className="my-auto mx-3">
            <p className={labelColor}>Vertical Sobel</p>
            <canvas
                className="crisp-pixels mx-auto"
                ref={canvasY}
                width={width}
                height={height}
            />
        </div>
    </div>
  )
}

const CombinedSobelTab: React.FC<HogTabType> = ({
    labelColor,
    width,
    height,
    gradients,
    blocks,
    setHogConfig,
    hogConfig,
}) => {
  const canvasX = useRef<HTMLCanvasElement>(null);
  const canvasY = useRef<HTMLCanvasElement>(null);
  const canvasNdlPlt = useRef<HTMLCanvasElement>(null);
  const [orientation, setOrientation] = useState<orientationConfigType>('all');

  useLayoutEffect(() => {
    const canvasXElem = canvasX.current;
    const canvasYElem = canvasY.current;
    const canvasNdlPltElem = canvasNdlPlt.current;
    if (!(canvasXElem && canvasYElem && canvasNdlPltElem)) return;

    // @ts-ignore
    displayNeedlePlot(canvasNdlPlt.current, blocks, orientation);
    // @ts-ignore
    displayGradients(canvasX.current, canvasY.current, null, gradients);
  })
  
  return (
    <div className="flex justify-evenly">
      <div className="my-auto mx-3">
        <p className={labelColor}>Horizontal Sobel</p>
        <canvas
            className="crisp-pixels mx-auto"
            ref={canvasX}
            width={width}
            height={height}
        />
        <p className={labelColor}>Vertical Sobel</p>
        <canvas
            className="crisp-pixels mx-auto"
            ref={canvasY}
            width={width}
            height={height}
        />
      </div>
      <div className="my-auto mx-3">
        <p className={labelColor}>Needle Plot</p>
          <div className="axis-selector inline">
              <button className={hogConfig === 'dense' ? 'selected' : ''} onClick={() => setHogConfig('dense')}>Dense</button>
              <button className={hogConfig === 'medium' ? 'selected' : ''} onClick={() => setHogConfig('medium')}>Medium</button>
              <button className={hogConfig === 'sparse' ? 'selected' : ''} onClick={() => setHogConfig('sparse')}>Sparse</button>
          </div>
        <canvas
            className="crisp-pixels mx-auto"
            ref={canvasNdlPlt}
            width={width * 1.5}
            height={height * 1.5}
        />
        <div className="axis-selector inline">
            <button className={orientation === 'all' ? 'selected' : ''} onClick={() => setOrientation('all')}>All Orientations</button>
            <button className={orientation === 'horizontal' ? 'selected' : ''} onClick={() => setOrientation('horizontal')}>Horizontal</button>
            <button className={orientation === 'vertical' ? 'selected' : ''} onClick={() => setOrientation('vertical')}>Vertical</button>
            <button className={orientation === 'diagonal45' ? 'selected' : ''} onClick={() => setOrientation('diagonal45')}>Diagonal 45</button>
            <button className={orientation === 'diagonal135' ? 'selected' : ''} onClick={() => setOrientation('diagonal135')}>Diagonal 135</button>
        </div>

      </div>
    </div>
  )
}

const SobelNeedleTab: React.FC<HogTabType> = ({
  labelColor,
  width,
  height,
  gradients,
  blocks,
  setHogConfig,
  hogConfig,
}) => {
    const canvasV = useRef<HTMLCanvasElement>(null);
    const canvasNdlPlt = useRef<HTMLCanvasElement>(null);
    const [orientation, setOrientation] = useState<orientationConfigType>('all');

    useLayoutEffect(() => {
        const canvasVElem = canvasV.current;
        const canvasNdlPltElem = canvasNdlPlt.current;
        if (!(canvasVElem && canvasNdlPltElem)) return;

        // @ts-ignore
        displayNeedlePlot(canvasNdlPlt.current, blocks, orientation);
        // @ts-ignore
        displayGradients(null, null, canvasV.current, gradients);
    })

    return (
        <div className="flex justify-evenly">
            <div className="my-auto mx-3">
                <p className={labelColor}>Combined Sobel</p>
                <canvas
                    className="crisp-pixels mx-auto"
                    ref={canvasV}
                    width={width}
                    height={height}
                />
            </div>
            <div className="my-auto mx-3">
                <p className={labelColor}>Needle Plot</p>
                <div className="axis-selector inline">
                    <button className={hogConfig === 'dense' ? 'selected' : ''} onClick={() => setHogConfig('dense')}>Dense</button>
                    <button className={hogConfig === 'medium' ? 'selected' : ''} onClick={() => setHogConfig('medium')}>Medium</button>
                    <button className={hogConfig === 'sparse' ? 'selected' : ''} onClick={() => setHogConfig('sparse')}>Sparse</button>
                </div>
                <canvas
                    className="crisp-pixels mx-auto max-w-screen-md"
                    ref={canvasNdlPlt}
                    width={width}
                    height={height}
                />
                <div className="axis-selector inline">
                    <button className={orientation === 'all' ? 'selected' : ''} onClick={() => setOrientation('all')}>All Orientations</button>
                    <button className={orientation === 'horizontal' ? 'selected' : ''} onClick={() => setOrientation('horizontal')}>Horizontal</button>
                    <button className={orientation === 'vertical' ? 'selected' : ''} onClick={() => setOrientation('vertical')}>Vertical</button>
                    <button className={orientation === 'diagonal45' ? 'selected' : ''} onClick={() => setOrientation('diagonal45')}>Diagonal 45</button>
                    <button className={orientation === 'diagonal135' ? 'selected' : ''} onClick={() => setOrientation('diagonal135')}>Diagonal 135</button>
                </div>
            </div>
        </div>
    )
}

const NeedleExampleTab: React.FC<HistOfGradDemoType> = ({labelColor}) => {
    const canvasHist = useRef<HTMLCanvasElement>(null);
    const canvasNdlPlt = useRef<HTMLCanvasElement>(null);

    useLayoutEffect(() => {
        const canvasHistElem = canvasHist.current;
        const canvasNdlPltElem = canvasNdlPlt.current;
        if (!(canvasHistElem && canvasNdlPltElem)) return;
        const needles: {[angle: number]: number} = {0: 75, 45: 18.75, 90: 7.5, 135: 55};
        // draw needles
        canvasNdlPlt.current?.getContext('2d')?.fillRect(0, 0, canvasNdlPlt.current?.width, canvasNdlPlt.current?.height);
        // @ts-ignore
        Object.entries(needles).forEach(([angle, mag]) => drawNeedle(canvasNdlPlt.current, 0, 0, canvasNdlPlt.current.width, parseInt(angle), mag / 100, 255));
        // draw histogram
        // @ts-ignore
        displayHistogram(canvasHist.current, Object.entries(needles).map(([angle, mag]) => mag), "all");
    })

    return (
        <div className="flex justify-evenly">
            <div className="my-auto mx-3">
                <p className={labelColor}>Needle Plot</p>
                <canvas
                    className="crisp-pixels mx-auto max-w-screen-md"
                    ref={canvasNdlPlt}
                    width={500}
                    height={500}
                />
            </div>
            <div className="my-auto mx-3">
                <p className={labelColor}>Aggregated Histogram</p>
                <canvas
                    className="crisp-pixels mx-auto max-w-screen-md"
                    ref={canvasHist}
                    width={500}
                    height={500}
                />
            </div>
        </div>
    )
}

const NeedleHistogramTab: React.FC<HogTabType> = ({
  labelColor,
  width,
  height,
  blocks,
  histogram,
  setHogConfig,
  hogConfig,
}) => {
  const canvasHist = useRef<HTMLCanvasElement>(null);
  const canvasNdlPlt = useRef<HTMLCanvasElement>(null);
  const [orientation, setOrientation] = useState<orientationConfigType>('all');

  useLayoutEffect(() => {
    const canvasHistElem = canvasHist.current;
    const canvasNdlPltElem = canvasNdlPlt.current;
    if (!(canvasHistElem && canvasNdlPltElem)) return;

    // @ts-ignore
    displayHistogram(canvasHist.current, histogram, orientation);
    // @ts-ignore
    displayNeedlePlot(canvasNdlPlt.current, blocks, orientation);
  })
  
  return (
    <div className="flex justify-evenly">
      <div className="my-auto mx-3">
        <p className={labelColor}>Needle Plot</p>
          <div className="axis-selector inline">
              <button className={hogConfig === 'dense' ? 'selected' : ''} onClick={() => setHogConfig('dense')}>Dense</button>
              <button className={hogConfig === 'medium' ? 'selected' : ''} onClick={() => setHogConfig('medium')}>Medium</button>
              <button className={hogConfig === 'sparse' ? 'selected' : ''} onClick={() => setHogConfig('sparse')}>Sparse</button>
          </div>
        <canvas
            className="crisp-pixels mx-auto max-w-screen-md"
            ref={canvasNdlPlt}
            width={width}
            height={height}
        />
        <div className="axis-selector inline">
            <button className={orientation === 'all' ? 'selected' : ''} onClick={() => setOrientation('all')}>All Orientations</button>
            <button className={orientation === 'horizontal' ? 'selected' : ''} onClick={() => setOrientation('horizontal')}>Horizontal</button>
            <button className={orientation === 'vertical' ? 'selected' : ''} onClick={() => setOrientation('vertical')}>Vertical</button>
            <button className={orientation === 'diagonal45' ? 'selected' : ''} onClick={() => setOrientation('diagonal45')}>Diagonal 45</button>
            <button className={orientation === 'diagonal135' ? 'selected' : ''} onClick={() => setOrientation('diagonal135')}>Diagonal 135</button>
        </div>
      </div>
      <div className="my-auto mx-3">
        <img src={needleImg} alt="img" />
        <p className={labelColor}>We take this needle, find the bin the angle belongs in, and add the needle's magnitude to the bin.</p>
      </div>
      <div className="my-auto mx-3">
        <p className={labelColor}>Aggregated Histogram</p>
        <canvas
            className="crisp-pixels mx-auto max-w-screen-md"
            ref={canvasHist}
            width={width}
            height={height}
        />
      </div>
    </div>
  )
}


const displayGradients = (cnvX: HTMLCanvasElement, cnvY: HTMLCanvasElement, cnvV: HTMLCanvasElement, gradients: GradientsType): void => {
    if (cnvX) createImageBitmap(gradients.x).then((img) => cnvX.getContext('2d')?.drawImage(img, 0, 0, cnvX.width, cnvX.height));
    if (cnvY) createImageBitmap(gradients.y).then((img) => cnvY.getContext('2d')?.drawImage(img, 0, 0, cnvY.width, cnvY.height));
    if (cnvV) createImageBitmap(gradients.v).then((img) => cnvV.getContext('2d')?.drawImage(img, 0, 0, cnvV.width, cnvV.height));
}

const displayNeedlePlot = (canvasNdlPlt: HTMLCanvasElement, blocks: BlocksType, orientation: orientationConfigType): void => {
    canvasNdlPlt.getContext('2d')?.fillRect(0, 0, canvasNdlPlt.width, canvasNdlPlt.height);
    const histograms: number[][][] = blocks.histogram;
    const magnitudes: number[][] = blocks.blockMagnitudes;
    let maxV = 0, minV = 10, maxH = 0, minH = 10;
    magnitudes.flat().forEach(v => {if (!isNaN(v)) {maxV = Math.max(maxV, v); minV = Math.min(minV, v);}});
    histograms.flat().flat().forEach(h => {if (!isNaN(h)) {maxH = Math.max(maxH, h); minH = Math.min(minH, h);}});
    for (let row = 0; row < histograms.length; row++) {
        for (let col = 0; col < histograms[0].length; col++) {
            const needles: number[] = histograms[row][col];
            const opacity: number = map(magnitudes[row][col], minV, maxV, 25, 255);
            for (let idx = 0; idx < needles.length; idx++) {
                const angle: number = (idx) * (180 / needles.length);
                if (!angleInOrientation(orientation, angle)) continue;
                const lengthPct: number = map(needles[idx], minH, maxH, 0, 1);
                drawNeedle(canvasNdlPlt, row, col, canvasNdlPlt.width / histograms[0].length, angle, lengthPct, opacity);
            }
        }
    }
}

// returns true if the angle is part of the orientation config
const angleInOrientation = (orientation: orientationConfigType, angleDeg: number): boolean => {
    switch(orientation) {
        case "all": return true;
        case "horizontal": return (angleDeg + 180) % 180 <= 10;
        case "vertical": return Math.abs(90 - angleDeg) <= 10;
        case "diagonal45": return Math.abs(45 - angleDeg) <= 15;
        case "diagonal135": return Math.abs(135 - angleDeg) <= 15;
        default: return false;
    }
}

const drawNeedle = (cnv: HTMLCanvasElement, blockRow: number, blockCol: number, blockSize: number, angleDeg: number, lengthPct: number, opacity: number): void => {
    const length: number = lengthPct * blockSize;
    const pt1 = {x: blockSize / 2 + (length / 2) * Math.cos(angleDeg * (Math.PI / 180)), y: blockSize / 2 + ( length / 2) * -1 * Math.sin(angleDeg * (Math.PI / 180))};
    const pt2 = {x: blockSize / 2 + (length / 2) * -1 * Math.cos(angleDeg * (Math.PI / 180)), y: blockSize / 2 + ( length / 2) * Math.sin(angleDeg * (Math.PI / 180))};
    const blockPos = {x: blockCol * blockSize, y: blockRow * blockSize};
    const context = cnv.getContext('2d');
    if (!context || !(context instanceof CanvasRenderingContext2D)) throw new Error('Failed to get 2D context');
    const ctx: CanvasRenderingContext2D = context;
    //console.log(pt1, pt2);

    ctx.strokeStyle = `rgba(${opacity}, ${opacity}, ${opacity}, ${opacity / 255})`;
    ctx.beginPath();
    ctx.moveTo(blockPos.x + pt1.x, blockPos.y + pt1.y);
    ctx.lineTo(blockPos.x + pt2.x, blockPos.y + pt2.y);
    ctx.stroke();
}

const displayHistogram = (cnvHist: HTMLCanvasElement, histogram: number[], orientation: orientationConfigType): void => {
    const bins = histogram.length;
    const filteredHistogram = histogram.map((h, i) => angleInOrientation(orientation, (i) * (180 / histogram.length)) ? h : 0);
    const labels: string[] = [];
    histogram.forEach((h, i) => labels.push(((180 / bins) * i).toString()));
    const chart =  new Chart(cnvHist?.getContext('2d'), {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Aggregated Histogram',
                data: filteredHistogram,
                backgroundColor: 'green',
            }]
        },
        options: {
            responsive: true,
            scales: {
                xAxes: [{
                    display: true,
                    ticks: {
                        autoSkip: false,
                        max: 10,
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Angle'
                    }
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Total Magnitude'
                    }
                }]
            },
            legend: {
                display: false
            },
            tooltips: {
                enabled: false,
            }
        }
    });
}

const HistOfGradDemo: React.FC<HistOfGradDemoType> = ({
  labelColor,
  imgUrl,
}) => {
    const imgRef = useRef<HTMLImageElement>(null);
    const [imgWidth, setImgWidth] = useState<number>(0);
    const [imgHeight, setImgHeight] = useState<number>(0);
    const [tab, setTab] = useState<number>(0);
    const [gradients, setGradients] = useState<GradientsType>();
    const [blocks, setBlocks] = useState<BlocksType>();
    const [histogram, setHistogram] = useState<number[]>();
    const [hogConfig, setHogConfig] = useState<hogConfigType>('dense');
    const configs: {[type: string]: hogConfig} = {'dense': denseConfig, 'medium': mediumConfig, 'sparse': sparseConfig};

    const img = useRef('');
    const config = useRef('');

    useLayoutEffect(() => {
      // reset to tab 0 when changing images
      if ((img.current !== imgUrl) || (config.current !== hogConfig)) {
        if (img.current !== imgUrl) setTab(0);
          // calculate HoG features
          Promise.all([gradientImages(imgUrl), histogramBlocks(imgUrl, configs[hogConfig]), histogramAggregate(imgUrl, configs[hogConfig])]).then(features => {
              setGradients(features[0]);
              setBlocks(features[1]);
              setHistogram(features[2]);
          });
      }
      img.current = imgUrl;
      config.current = hogConfig;

      const imgElem = imgRef.current;
      if (!imgElem) return;
      imgElem.onload = () => {
        setImgHeight(imgElem.height);
        setImgWidth(imgElem.width);
      };
    })

    const setBlockSparse = (type: hogConfigType): void => setHogConfig(type);

    return (
        <div className="border-2 border-navy pb-3 my-4">
          <img ref={imgRef} src={imgUrl} alt="image" className="hidden" />
          <div className="text-navy mb-3">
            {([1, 2, 3, 4, 5]).map((t, idx) => (
              <div className={`inline-flex border-b-2 ${idx < 4 && 'border-r-2'} border-navy cursor-pointer w-1/5 ${tab === idx && 'bg-teal-a-eye'}`} onClick={() => setTab(idx)}><p className="mx-auto">{t}</p></div>
            ))}
          </div>
            {tab === 0 && (gradients && blocks && histogram) && <SobelTab labelColor={labelColor} width={imgWidth} height={imgHeight} gradients={gradients} blocks={blocks} histogram={histogram} setHogConfig={setHogConfig} hogConfig={hogConfig}/> }
            {tab === 1 && (gradients && blocks && histogram) && <CombinedSobelTab labelColor={labelColor} width={imgWidth} height={imgHeight} gradients={gradients} blocks={blocks} histogram={histogram} setHogConfig={setHogConfig} hogConfig={hogConfig}/> }
            {tab === 2 && (gradients && blocks && histogram) && <SobelNeedleTab labelColor={labelColor} width={imgWidth * 1.25} height={imgHeight * 1.25} gradients={gradients} blocks={blocks} histogram={histogram} setHogConfig={setHogConfig} hogConfig={hogConfig}/> }
            {tab === 3 && <NeedleExampleTab labelColor={labelColor} imgUrl={imgUrl} /> }
            {tab === 4 && (gradients && blocks && histogram) && <NeedleHistogramTab labelColor={labelColor} width={imgWidth} height={imgHeight} gradients={gradients} blocks={blocks} histogram={histogram} setHogConfig={setHogConfig} hogConfig={hogConfig}/> }
        </div>
    );
}

export default HistOfGradDemo;

