/* eslint-disable */

import React, { useLayoutEffect, useRef, useState } from "react";
import {
  histogramAggregate,
  histogramBlocks,
  oldGradientImages,
  OldGradientsType,
  gradientImages,
  GradientsType,
  BlocksType,
  denseConfig,
  mediumConfig,
  sparseConfig,
  HogOptionsType,
} from "./histOfGrad";
import sobelFilter from "../../../media/modules/computerVision/sobelFilters.png";
import needleImg from "../../../media/modules/computerVision/needleExample.png";
import {
  GradientImage,
  NeedlePlot,
  Histogram,
  HogConfigType,
  OrientationConfigType,
  displayHistogram,
  drawNeedle,
} from "./hogComponents";

type HistOfGradDemoType = {
  labelColor: string;
  imgUrl: string;
};

type HogTabType = {
  labelColor: string;
  width: number;
  height: number;
  gradients: GradientsType;
  blocks: BlocksType;
  histogram: number[];
  setHogConfig: (type: HogConfigType) => void;
  hogConfig: HogConfigType;
};

const SobelTab: React.FC<HogTabType> = ({
  labelColor,
  width,
  height,
  gradients,
}) => (
  <div>
    <div className="flex flex-col md:flex-row justify-evenly">
      <GradientImage
        label="Horizontal Sobel"
        gradient={gradients.horiz}
        width={width}
        height={height}
        labelColor={labelColor}
      />
      <div className="my-auto mx-3">
        <img src={sobelFilter} alt="img" />
      </div>
      <GradientImage
        label="Vertical Sobel"
        gradient={gradients.vert}
        width={width}
        height={height}
        labelColor={labelColor}
      />
    </div>
    <div className="flex flex-col md:flex-row justify-evenly my-8">
      <GradientImage
        label="Diagonal Down Sobel"
        gradient={gradients.diagDown}
        width={width}
        height={height}
        labelColor={labelColor}
      />
      <div className="my-auto mx-3">
        <img src={sobelFilter} alt="img" />
      </div>
      <GradientImage
        label="Diagonal Up Sobel"
        gradient={gradients.diagUp}
        width={width}
        height={height}
        labelColor={labelColor}
      />
    </div>
  </div>
);

const SobelNeedleTab: React.FC<HogTabType> = ({
  labelColor,
  width,
  height,
  gradients,
  blocks,
  setHogConfig,
  hogConfig,
}) => {
  const [orientation, setOrientation] = useState<OrientationConfigType>("all");
  return (
    <div className="flex flex-col md:flex-row justify-evenly">
      <div>
        <GradientImage
          label="Horizontal Sobel"
          gradient={gradients.horiz}
          width={width}
          height={height}
          labelColor={labelColor}
        />
        <GradientImage
          label="Vertical Sobel"
          gradient={gradients.vert}
          width={width}
          height={height}
          labelColor={labelColor}
        />
      </div>
      <NeedlePlot
        blocks={blocks}
        hogConfig={hogConfig}
        setHogConfig={setHogConfig}
        orientation={orientation}
        width={width * 1.5}
        height={height * 1.5}
        labelColor={labelColor}
      />
    </div>
  );
};

const CombinedNeedleTab: React.FC<HogTabType> = ({
  labelColor,
  width,
  height,
  gradients,
  blocks,
  setHogConfig,
  hogConfig,
}) => {
  const [orientation, setOrientation] = useState<OrientationConfigType>("all");
  return (
    <div className="flex flex-col md:flex-row justify-evenly">
      <GradientImage
        label="Combined Sobel"
        //todo broken
        gradient={gradients.combined}
        width={width}
        height={height}
        labelColor={labelColor}
      />
      <NeedlePlot
        blocks={blocks}
        hogConfig={hogConfig}
        setHogConfig={setHogConfig}
        orientation={orientation}
        width={width}
        height={height}
        labelColor={labelColor}
      />
    </div>
  );
};

const NeedleExampleTab: React.FC<HistOfGradDemoType> = ({ labelColor }) => {
  const canvasHist = useRef<HTMLCanvasElement>(null);
  const canvasNdlPlt = useRef<HTMLCanvasElement>(null);

  const needles: { [angle: number]: number } = {
    0: 75,
    45: 18.75,
    90: 7.5,
    135: 55,
  };

  useLayoutEffect(() => {
    const canvasHistElem = canvasHist.current;
    const canvasNdlPltElem = canvasNdlPlt.current;
    if (!(canvasHistElem && canvasNdlPltElem)) return;

    // draw needles
    canvasNdlPlt.current
      ?.getContext("2d")
      ?.fillRect(
        0,
        0,
        canvasNdlPlt.current?.width,
        canvasNdlPlt.current?.height
      );
    // @ts-ignore
    Object.entries(needles).forEach(([angle, mag]) =>
      drawNeedle(
        // @ts-ignore
        canvasNdlPlt.current,
        0,
        0,
        // @ts-ignore
        canvasNdlPlt.current.width,
        parseInt(angle, 10),
        mag / 100,
        255,
        {r: 255, g: 255, b: 255}
      ),
    );
    // draw histogram
    displayHistogram(
      // @ts-ignore
      canvasHist.current,
      Object.entries(needles).map(([angle, mag]) => mag),
      'all',
    );
  });

  return (
    <div className="flex flex-col md:flex-row justify-evenly">
      <div className="my-auto mx-3">
        <p className={labelColor}>Needle Plot</p>
        <canvas
          className="crisp-pixels mx-auto max-w-60vw"
          ref={canvasNdlPlt}
          width={350}
          height={350}
        />
      </div>
      <div className="my-auto mx-3">
        <p className={labelColor}>Aggregated Histogram</p>
        <canvas
          className="crisp-pixels mx-auto max-w-60vw"
          ref={canvasHist}
          width={350}
          height={350}
        />
      </div>
    </div>
  );
};

const NeedleHistogramTab: React.FC<HogTabType> = ({
  labelColor,
  width,
  height,
  blocks,
  histogram,
  setHogConfig,
  hogConfig,
}) => {
  const [orientation, setOrientation] = useState<OrientationConfigType>('all');

  return (
    <div className="flex flex-col md:flex-row justify-evenly">
      <NeedlePlot
        blocks={blocks}
        hogConfig={hogConfig}
        setHogConfig={setHogConfig}
        orientation={orientation}
        width={width}
        height={height}
        labelColor={labelColor}
      />
      <div className="my-auto mx-auto max-w-20vw">
        <img src={needleImg} alt="" className="mx-auto" />
        {
          // @eslint-ignore-next-line
          <p className={labelColor}>We take this needle, find the bin the angle belongs in, and add the needle's magnitude to the bin.</p>
        }
      </div>
      <Histogram
        histogram={histogram}
        orientation={orientation}
        width={width}
        height={height}
        labelColor={labelColor}
      />
    </div>
  );
};

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
  const [hogConfig, setHogConfig] = useState<HogConfigType>('dense');
  const configs: { [type: string]: HogOptionsType } = {
    dense: denseConfig,
    medium: mediumConfig,
    sparse: sparseConfig,
  };
  const dialogues: string[] = [
    'Tab 1 description',
    'Tab 2 description',
    'Tab 3 description',
    'Tab 4 description',
    'Tab 5 description',
  ];

  const img = useRef('');
  const config = useRef('');

  useLayoutEffect(() => {
    // reset to tab 0 when changing images
    if (img.current !== imgUrl || config.current !== hogConfig) {
      if (img.current !== imgUrl) setTab(0);
      gradientImages(imgUrl)
      // calculate HoG features
      Promise.all([
        gradientImages(imgUrl),
        histogramBlocks(imgUrl, configs[hogConfig]),
        histogramAggregate(imgUrl, configs[hogConfig]),
      ]).then(features => {
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
      const resizeFactor = 350 / imgElem.width;
      setImgWidth(imgElem.width * resizeFactor);
      setImgHeight(imgElem.height * resizeFactor);
    };
  });

  return (
    <div className="border-2 border-navy pb-3 my-4">
      <img ref={imgRef} src={imgUrl} alt="img" className="hidden" />
      <div className="text-navy mb-3">
        {[1, 2, 3, 4, 5].map((t, idx) => (
          <div
            className={`inline-flex border-b-2 ${
              idx < 4 && 'border-r-2'
            } border-navy cursor-pointer w-1/5 ${
              tab === idx && 'bg-teal-a-eye'
            }`}
            role="tab-selector"
            onKeyPress={() => {}}
            onClick={() => setTab(idx)}
          >
            <p className="mx-auto">{t}</p>
          </div>
        ))}
      </div>
      <p className={`my-4 ${labelColor}`}>{dialogues[tab]}</p>
      {tab === 0 && gradients && blocks && histogram && (
        <SobelTab
          labelColor={labelColor}
          width={imgWidth}
          height={imgHeight}
          gradients={gradients}
          blocks={blocks}
          histogram={histogram}
          setHogConfig={setHogConfig}
          hogConfig={hogConfig}
        />
      )}
      {tab === 1 && gradients && blocks && histogram && (
        <SobelNeedleTab
          labelColor={labelColor}
          width={imgWidth}
          height={imgHeight}
          gradients={gradients}
          blocks={blocks}
          histogram={histogram}
          setHogConfig={setHogConfig}
          hogConfig={hogConfig}
        />
      )}
      {tab === 2 && gradients && blocks && histogram && (
        <CombinedNeedleTab
          labelColor={labelColor}
          width={imgWidth * 1.25}
          height={imgHeight * 1.25}
          gradients={gradients}
          blocks={blocks}
          histogram={histogram}
          setHogConfig={setHogConfig}
          hogConfig={hogConfig}
        />
      )}
      {tab === 3 && (
        <NeedleExampleTab labelColor={labelColor} imgUrl={imgUrl} />
      )}
      {tab === 4 && gradients && blocks && histogram && (
        <NeedleHistogramTab
          labelColor={labelColor}
          width={imgWidth}
          height={imgHeight}
          gradients={gradients}
          blocks={blocks}
          histogram={histogram}
          setHogConfig={setHogConfig}
          hogConfig={hogConfig}
        />
      )}
    </div>
  );
};

export default HistOfGradDemo;
