/* eslint-disable */
import React, { useEffect, useRef, useState } from "react";
import { gradientImages } from "../sobelFilter/sobelFilter";
import {
  GradientsType,
  BlocksType,
  denseConfig,
  mediumConfig,
  sparseConfig,
  HogOptionsType,
  histogramAggregate,
  histogramBlocks,
} from "./histOfGrad"
import {
  GradientImage,
  NeedlePlot,
  Histogram,
  HogConfigType,
  OrientationConfigType,
  displayHistogram,
  drawNeedle,
} from "./hogComponents";



const orientations: OrientationConfigType[] = [
  'all',
  'horizontal',
  'vertical',
  'diagonal45',
  'diagonal135',
];
const orientationLabels: string[] = [
  'All Orientations',
  'Horizontal',
  'Vertical',
  'Diagonal 45',
  'Diagonal 135',
];

const hogConfigs: HogConfigType[] = ['sparse', 'medium', 'dense'];

type NeedleHistogramDemoType = {
  labelColor: string,
  imgUrl: string,
  gradients: GradientsType,
}

const NeedleHistogramDemo: React.FC<NeedleHistogramDemoType> = ({
  labelColor,
  imgUrl,
  gradients
}) => {

  const imgRef = useRef<HTMLImageElement>(null);
  const [blocks, setBlocks] = useState<BlocksType>();
  const [hogConfig, setHogConfig] = useState<HogConfigType>('sparse');
  const [orientation, setOrientation] = useState<OrientationConfigType>("all");
  const [histogram, setHistogram] = useState<number[]>();
  const configs: { [type: string]: HogOptionsType } = {
    dense: denseConfig,
    medium: mediumConfig,
    sparse: sparseConfig,
  };

  const [gradientImg, setGradientImg] = useState<ImageData>(gradients.combined)
  const [gradientLabel, setGradientLabel] = useState<string>("")

  const img = useRef('');
  const config = useRef('');

  useEffect(() => {
    // reset to tab 0 when changing images
    if (config.current !== hogConfig) {
      // calculate HoG features
      Promise.all([
        histogramBlocks(imgUrl, configs[hogConfig]),
        histogramAggregate(imgUrl, configs[hogConfig]),
      ]).then(features => {
        setBlocks(features[0]);
        setHistogram(features[1]);
      });
    }
  }, [imgUrl, hogConfig]);

  useEffect(() => {
    switch (orientation) {
      case 'all':
        setGradientImg(gradients.combined);
        setGradientLabel('Combined Sobel');
        break;
      case 'horizontal':
        setGradientImg(gradients.horiz);
        setGradientLabel('Horizontal Sobel');
        break;
      case 'vertical':
        setGradientImg(gradients.vert);
        setGradientLabel('Vertical Sobel');
        break;
      case 'diagonal45':
        setGradientImg(gradients.diagUp);
        setGradientLabel('Diagonal 45 (Up) Sobel');
        break;
      case 'diagonal135':
        setGradientImg(gradients.diagDown);
        setGradientLabel('Diagonal 135 (Down) Sobel');
        break;
    }
  }, [imgUrl, gradients, orientation])

  return (
    <div>
      {histogram && blocks && gradientImg &&
        <div>
          <div className="axis-selector inline">
            {orientations.map((config, idx) => (
              <button
                type="button"
                className={orientation === config ? 'selected' : ''}
                onClick={() => setOrientation(config)}
              >
                {orientationLabels[idx]}
              </button>
            ))}
          </div>
          <div className="flex flex-col md:flex-row justify-evenly">
            <GradientImage
              label={gradientLabel}
              gradient={gradientImg}
              width={gradientImg.width}
              height={gradientImg.height}
              labelColor={labelColor}
            />
            <NeedlePlot
              blocks={blocks}
              hogConfig={hogConfig}
              setHogConfig={setHogConfig}
              orientation={orientation}
              width={gradientImg.width}
              height={gradientImg.height}
              labelColor={labelColor}
            />
            <Histogram
              histogram={histogram}
              orientation={orientation}
              width={gradientImg.width}
              height={gradientImg.height}
              aspectRatio={gradientImg.height/gradientImg.width}
              labelColor={labelColor}
            />
          </div>
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
        </div>}
    </div>
  );
}

export default NeedleHistogramDemo;