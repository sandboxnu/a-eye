/* eslint-disable */
import React, { useEffect, useRef } from 'react';
import { BlocksType, map } from './histOfGrad';

const Chart = require('chart.js');

export type HogConfigType = 'dense' | 'medium' | 'sparse';
export type OrientationConfigType =
  | 'all'
  | 'horizontal'
  | 'vertical'
  | 'diagonal45'
  | 'diagonal135';

const hogConfigs: HogConfigType[] = ['dense', 'medium', 'sparse'];


export const drawNeedle = (
  cnv: HTMLCanvasElement,
  blockRow: number,
  blockCol: number,
  blockSize: number,
  angleDeg: number,
  lengthPct: number,
  opacity: number,
  color: { r: number; g: number; b: number },
): void => {
  const length: number = lengthPct * blockSize;
  const pt1 = {
    x: blockSize / 2 + (length / 2) * Math.cos(angleDeg * (Math.PI / 180)),
    y: blockSize / 2 + (length / 2) * -1 * Math.sin(angleDeg * (Math.PI / 180)),
  };
  const pt2 = {
    x: blockSize / 2 + (length / 2) * -1 * Math.cos(angleDeg * (Math.PI / 180)),
    y: blockSize / 2 + (length / 2) * Math.sin(angleDeg * (Math.PI / 180)),
  };
  const blockPos = { x: blockCol * blockSize, y: blockRow * blockSize };
  const context = cnv.getContext('2d');
  if (!context || !(context instanceof CanvasRenderingContext2D))
    throw new Error('Failed to get 2D context');
  const ctx: CanvasRenderingContext2D = context;

  ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${
    opacity / 255
  })`;
  ctx.beginPath();
  ctx.moveTo(blockPos.x + pt1.x, blockPos.y + pt1.y);
  ctx.lineTo(blockPos.x + pt2.x, blockPos.y + pt2.y);
  ctx.stroke();
};

export const drawGrid = (
  cnv: HTMLCanvasElement,
  numRow: number,
  numCol: number,
  color: { r: number; g: number; b: number },
): void => {
  const width = cnv.width
  const height = cnv.height

  const colSize = width / numCol;
  const rowSize = height / numRow;

  var ctx = cnv.getContext("2d");
  if (!ctx) return;


  for (let i = 0; i <= numCol; i++) {
    ctx.beginPath();
    ctx.moveTo(i*colSize, 0);
    ctx.lineTo(i*colSize, height);
    ctx.strokeStyle = `rgb(${color.r},${color.g},${color.b})`;
    ctx.stroke();  
  }

  for (let i = 0; i <= numRow; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i*rowSize);
    ctx.lineTo(width, i*rowSize);
    ctx.strokeStyle = `rgb(${color.r},${color.g},${color.b})`;
    ctx.stroke();  
  }
}

// returns true if the angle is part of the orientation config
const angleInOrientation = (
  orientation: OrientationConfigType,
  angleDeg: number,
): boolean => {
  switch (orientation) {
    case 'all':
      return true;
    case 'horizontal':
      return (angleDeg + 180) % 180 <= 10;
    case 'vertical':
      return Math.abs(90 - angleDeg) <= 10;
    case 'diagonal45':
      return Math.abs(45 - angleDeg) <= 15;
    case 'diagonal135':
      return Math.abs(135 - angleDeg) <= 15;
    default:
      return false;
  }
};

export const displayNeedlePlot = (
  canvasNdlPlt: HTMLCanvasElement,
  blocks: BlocksType,
  orientation: OrientationConfigType,
  needleColor?: { r: number; g: number; b: number },
  transparent?: boolean,
): void => {
  if (!transparent) {
    canvasNdlPlt
      .getContext('2d')
      ?.fillRect(0, 0, canvasNdlPlt.width, canvasNdlPlt.height);
  }
  const histograms: number[][][] = blocks.histogram;
  const magnitudes: number[][] = blocks.blockMagnitudes;
  let maxV = 0;
  let minV = 10;
  let maxH = 0;
  let minH = 10;
  magnitudes.flat().forEach(v => {
    if (!Number.isNaN(v)) {
      maxV = Math.max(maxV, v);
      minV = Math.min(minV, v);
    }
  });
  histograms
    .flat()
    .flat()
    .forEach(h => {
      if (!Number.isNaN(h)) {
        maxH = Math.max(maxH, h);
        minH = Math.min(minH, h);
      }
    });
  for (let row = 0; row < histograms.length; row += 1) {
    for (let col = 0; col < histograms[0].length; col += 1) {
      const needles: number[] = histograms[row][col];
      const opacity: number = map(magnitudes[row][col], minV, maxV, 25, 255);
      for (let idx = 0; idx < needles.length; idx += 1) {
        const angle: number = idx * (180 / needles.length);
        if (angleInOrientation(orientation, angle)) {
          const lengthPct: number = map(needles[idx], minH, maxH, 0, 1);
          drawNeedle(
            canvasNdlPlt,
            row,
            col,
            canvasNdlPlt.width / histograms[0].length,
            angle,
            lengthPct,
            opacity,
            needleColor || { r: opacity, g: opacity, b: opacity },
          );
        }
      }
    }
  }
};

export const displayHistogram = (
  cnvHist: HTMLCanvasElement,
  histogram: number[],
  orientation: OrientationConfigType,
): any => {
  const bins = histogram.length;
  const filteredHistogram = histogram.map((h, i) =>
    angleInOrientation(orientation, i * (180 / histogram.length)) ? h : 0,
  );
  const labels: string[] = [];
  histogram.forEach((h, i) => labels.push(((180 / bins) * i).toString()));
  return new Chart(cnvHist?.getContext('2d'), {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Aggregated Histogram',
          data: filteredHistogram,
          backgroundColor: 'green',
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        xAxes: [
          {
            display: true,
            ticks: {
              autoSkip: false,
              max: 10,
            },
            scaleLabel: {
              display: true,
              labelString: 'Angle',
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
            scaleLabel: {
              display: true,
              labelString: 'Total Magnitude',
            },
          },
        ],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

type GradientImageType = {
  label: string;
  gradient: ImageData;
  width: number;
  height: number;
  labelColor: string;
};

export const GradientImage: React.FC<GradientImageType> = ({
  label,
  gradient,
  width,
  height,
  labelColor,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cnvElm = canvasRef.current;
    if (!cnvElm) return;
    createImageBitmap(gradient).then(img =>
      cnvElm
        .getContext('2d')
        ?.drawImage(img, 0, 0, cnvElm.width, cnvElm.height),
    );
  });

  return (
    <div className="my-auto mx-3">
      <p className={labelColor}>{label}</p>
      <canvas
        className="crisp-pixels mx-auto max-w-60vw"
        ref={canvasRef}
        width={width}
        height={height}
      />
    </div>
  );
};

type NeedlePlotType = {
  blocks: BlocksType;
  hogConfig: HogConfigType;
  setHogConfig: (type: HogConfigType) => void;
  orientation: OrientationConfigType;
  width: number;
  height: number;
  labelColor: string;
};

export const NeedlePlot: React.FC<NeedlePlotType> = ({
  blocks,
  hogConfig,
  setHogConfig,
  orientation,
  width,
  height,
  labelColor,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cnvElm = canvasRef.current;
    if (!cnvElm) return;
    displayNeedlePlot(cnvElm, blocks, orientation);
  });

  return (
    <div className="my-auto mx-3">
      <p className={labelColor}>Needle Plot</p>
      <div className="axis-selector inline">
        {hogConfigs.map(config => (
          <button
            type="button"
            className={hogConfig === config ? 'selected' : ''}
            onClick={() => setHogConfig(config)}
          >
            {config.charAt(0).toUpperCase() + config.slice(1)}
          </button>
        ))}
      </div>
      <canvas
        className="crisp-pixels mx-auto max-w-60vw"
        ref={canvasRef}
        width={width}
        height={height}
      />

    </div>
  );
};

type HistogramType = {
  histogram: number[];
  orientation: OrientationConfigType;
  width: number;
  height: number;
  labelColor: string;
};

export const Histogram: React.FC<HistogramType> = ({
  histogram,
  orientation,
  width,
  height,
  labelColor,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cnvElm = canvasRef.current;
    if (!cnvElm) return;
    displayHistogram(cnvElm, histogram, orientation);
  });

  return (
    <div className="my-auto mx-3">
      <p className={labelColor}>Aggregated Histogram</p>
      <canvas
        className="crisp-pixels mx-auto max-w-60vw"
        ref={canvasRef}
        width={width}
        height={height}
      />
    </div>
  );
};
