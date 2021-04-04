/* eslint-disable */

var Chart = require('chart.js');
import React, {useLayoutEffect, useRef, useState} from 'react';
import {histogramAggregate, histogramBlocks, gradientImages, GradientsType, BlocksType, map} from './histOfGrad';

type HistOfGradDemoType = {
    labelColor: string;
    imgUrl: string;
}

type HogTabType = {
  labelColor: string;
  imgUrl: string;
  width: number;
  height: number;
}

const SobelTab: React.FC<HogTabType> = ({
  labelColor,
  imgUrl,
  width,
  height,
}) => {
  const canvasX = useRef<HTMLCanvasElement>(null);
  const canvasY = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const canvasXElem = canvasX.current;
    const canvasYElem = canvasY.current;
    if (!(canvasXElem && canvasYElem)) return;

    gradientImages(imgUrl).then((gradients: GradientsType) => {
      // @ts-ignore
      displayGradients(canvasX.current, canvasY.current, gradients);
    })
  
    const displayGradients = (cnvX: HTMLCanvasElement, cnvY: HTMLCanvasElement, gradients: GradientsType): void => {
      cnvX.getContext('2d')?.putImageData(gradients.x, 0, 0);
      cnvY.getContext('2d')?.putImageData(gradients.y, 0, 0);
    }
  })
  
  return (
    <div className="flex justify-evenly">
        <div className="my-auto">
            <p className={labelColor}>Horizontal Sobel</p>
            <canvas
                className="crisp-pixels mx-auto"
                ref={canvasX}
                width={width}
                height={height}
            />
        </div>
        <div className="my-auto">
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
  imgUrl,
  width,
  height,
}) => {
  const canvasX = useRef<HTMLCanvasElement>(null);
  const canvasY = useRef<HTMLCanvasElement>(null);
  const canvasV = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const canvasXElem = canvasX.current;
    const canvasYElem = canvasY.current;
    const canvasVElem = canvasV.current;
    if (!(canvasXElem && canvasYElem && canvasVElem)) return;

    gradientImages(imgUrl).then((gradients: GradientsType) => {
      // @ts-ignore
      displayGradients(canvasX.current, canvasY.current, canvasV.current, gradients);
    })
  
    const displayGradients = (cnvX: HTMLCanvasElement, cnvY: HTMLCanvasElement, cnvV: HTMLCanvasElement, gradients: GradientsType): void => {
      cnvX.getContext('2d')?.putImageData(gradients.x, 0, 0);
      cnvY.getContext('2d')?.putImageData(gradients.y, 0, 0);
      cnvV.getContext('2d')?.putImageData(gradients.v, 0, 0);
    }
  })
  
  return (
    <div className="flex justify-evenly">
      <div className="my-auto">
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
      <div className="my-auto">
        <p className={labelColor}>Combined Sobel</p>
        <canvas
            className="crisp-pixels mx-auto"
            ref={canvasV}
            width={width}
            height={height}
        />
      </div>
    </div>
  )
}

const SobelNeedleTab: React.FC<HogTabType> = (
{
    labelColor,
    imgUrl,
    width,
    height,
}) => {
    const canvasV = useRef<HTMLCanvasElement>(null);
    const canvasNdlPlt = useRef<HTMLCanvasElement>(null);

    useLayoutEffect(() => {
        const canvasVElem = canvasV.current;
        const canvasNdlPltElem = canvasNdlPlt.current;
        if (!(canvasVElem && canvasNdlPltElem)) return;

        gradientImages(imgUrl).then((gradients: GradientsType) => {
            histogramBlocks(imgUrl).then((blocks: BlocksType) => {
                // @ts-ignore
                displayNeedlePlot(canvasNdlPlt.current, blocks);
                // @ts-ignore
                displayGradients(canvasV.current, gradients);
            });
        })

        const displayGradients = ( cnvV: HTMLCanvasElement, gradients: GradientsType): void => {
            cnvV.getContext('2d')?.putImageData(gradients.v, 0, 0);
        }

        const displayNeedlePlot = (canvasNdlPlt: HTMLCanvasElement, blocks: BlocksType): void => {
            canvasNdlPlt.getContext('2d')?.fillRect(0, 0, width, height);
            const histograms: number[][][] = blocks.histogram;
            const magnitudes: number[][] = blocks.blockMagnitudes;
            let maxV = 0, minV = 10, maxH = 0, minH = 10;
            magnitudes.flat().forEach(v => {if (!isNaN(v)) {maxV = Math.max(maxV, v); minV = Math.min(minV, v);}});
            histograms.flat().flat().forEach(h => {if (!isNaN(h)) {maxH = Math.max(maxH, h); minH = Math.min(minH, h);}});
            for (let row = 0; row < histograms.length; row++) {
                for (let col = 0; col < histograms[0].length; col++) {
                    const histogram: number[] = histograms[row][col];
                    const opacity: number = map(magnitudes[row][col], minV, maxV, 25, 255);
                    for (let idx = 0; idx < histogram.length; idx++) {
                        const lengthPct: number = map(histogram[idx], minH, maxH, 0, 1);
                        drawNeedle(canvasNdlPlt, row, col, canvasNdlPlt.width / histograms[0].length, idx * 20, lengthPct, opacity);
                    }

                }
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

            ctx.strokeStyle = `rgba(${opacity}, ${opacity}, ${opacity}, ${opacity / 255})`;
            ctx.beginPath();
            ctx.moveTo(blockPos.x + pt1.x, blockPos.y + pt1.y);
            ctx.lineTo(blockPos.x + pt2.x, blockPos.y + pt2.y);
            ctx.stroke();
        }
    })

    return (
        <div className="flex justify-evenly">
            <div className="my-auto">
                <p className={labelColor}>Combined Sobel</p>
                <canvas
                    className="crisp-pixels mx-auto"
                    ref={canvasV}
                    width={width}
                    height={height}
                />
            </div>
            <div className="my-auto">
                <p className={labelColor}>Needle Plot</p>
                <canvas
                    className="crisp-pixels mx-auto max-w-screen-md"
                    ref={canvasNdlPlt}
                    width={width}
                    height={height}
                />
            </div>
        </div>
    )
}

const NeedleHistogramTab: React.FC<HogTabType> = ({
  labelColor,
  imgUrl,
  width,
  height,
}) => {
  const canvasHist = useRef<HTMLCanvasElement>(null);
  const canvasNdlPlt = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const canvasHistElem = canvasHist.current;
    const canvasNdlPltElem = canvasNdlPlt.current;
    if (!(canvasHistElem && canvasNdlPltElem)) return;

    gradientImages(imgUrl).then(() => {
      histogramBlocks(imgUrl).then((blocks: BlocksType) => {
      // @ts-ignore
      displayNeedlePlot(canvasNdlPlt.current, blocks);
      });

      histogramAggregate(imgUrl).then((histogram: number[]) => {
          // @ts-ignore
          displayHistogram(canvasHist.current, histogram);
      });
    })
  
    const displayNeedlePlot = (canvasNdlPlt: HTMLCanvasElement, blocks: BlocksType): void => {
      canvasNdlPlt.getContext('2d')?.fillRect(0, 0, width, height);
      const histograms: number[][][] = blocks.histogram;
      const magnitudes: number[][] = blocks.blockMagnitudes;
      let maxV = 0, minV = 10, maxH = 0, minH = 10;
      magnitudes.flat().forEach(v => {if (!isNaN(v)) {maxV = Math.max(maxV, v); minV = Math.min(minV, v);}});
      histograms.flat().flat().forEach(h => {if (!isNaN(h)) {maxH = Math.max(maxH, h); minH = Math.min(minH, h);}});
      for (let row = 0; row < histograms.length; row++) {
          for (let col = 0; col < histograms[0].length; col++) {
              const histogram: number[] = histograms[row][col];
              const opacity: number = map(magnitudes[row][col], minV, maxV, 25, 255);
              for (let idx = 0; idx < histogram.length; idx++) {
                  const lengthPct: number = map(histogram[idx], minH, maxH, 0, 1);
                  drawNeedle(canvasNdlPlt, row, col, canvasNdlPlt.width / histograms[0].length, idx * 20, lengthPct, opacity);
              }

          }
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

      ctx.strokeStyle = `rgba(${opacity}, ${opacity}, ${opacity}, ${opacity / 255})`;
      ctx.beginPath();
      ctx.moveTo(blockPos.x + pt1.x, blockPos.y + pt1.y);
      ctx.lineTo(blockPos.x + pt2.x, blockPos.y + pt2.y);
      ctx.stroke();
  }


  const displayHistogram = (cnvHist: HTMLCanvasElement, histogram: number[]): void => {
      const bins = histogram.length;
      const labels: string[] = [];
      for (let i = 0; i <= histogram.length; i++) labels.push(((180 / bins) * i).toString())
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
  })
  
  return (
    <div className="flex justify-evenly">
      <div className="my-auto">
        <p className={labelColor}>Needle Plot</p>
        <canvas
            className="crisp-pixels mx-auto max-w-screen-md"
            ref={canvasNdlPlt}
            width={width}
            height={height}
        />
      </div>
      <div className="my-auto">
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


const HistOfGradDemo: React.FC<HistOfGradDemoType> = ({
  labelColor,
  imgUrl,
}) => {
    const imgRef = useRef<HTMLImageElement>(null);
    const [imgWidth, setImgWidth] = useState<number>(0);
    const [imgHeight, setImgHeight] = useState<number>(0);
    const [tab, setTab] = useState<number>(0);

    useLayoutEffect(() => {
      const imgElem = imgRef.current;

      if (!imgElem) return;
      imgElem.onload = () => {
        setImgHeight(imgElem.height);
        setImgWidth(imgElem.width);
      };
    })

    return (
        <div>
          <img ref={imgRef} src={imgUrl} alt="image" className="hidden"></img>
          <div>
            <button className="basic-button" onClick={() => setTab(0)}>1</button>
            <button className="basic-button" onClick={() => setTab(1)}>2</button>
            <button className="basic-button" onClick={() => setTab(2)}>3</button>
              <button className="basic-button" onClick={() => setTab(3)}>4</button>
          </div>
            {tab === 0 && <SobelTab labelColor={labelColor} imgUrl={imgUrl} width={imgWidth} height={imgHeight} />}
            {tab === 1 && <CombinedSobelTab labelColor={labelColor} imgUrl={imgUrl} width={imgWidth} height={imgHeight} />}
            {tab === 2 && <SobelNeedleTab labelColor={labelColor} imgUrl={imgUrl} width={imgWidth} height={imgHeight} />}
            {tab === 3 && <NeedleHistogramTab labelColor={labelColor} imgUrl={imgUrl} width={imgWidth} height={imgHeight} />}
        </div>
    );
}

export default HistOfGradDemo;

