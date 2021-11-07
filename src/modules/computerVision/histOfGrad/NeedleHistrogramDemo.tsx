/* eslint-disable */
import React, { useLayoutEffect, useRef, useState } from "react";
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


type NeedleHistrogramDemoType = {
  labelColor: string,
  imgUrl: string
}

const NeedleHistogramDemo: React.FC<NeedleHistrogramDemoType> = ({
  labelColor,
  imgUrl
}) => {

  const imgRef = useRef<HTMLImageElement>(null);
  const [gradients, setGradients] = useState<GradientsType>();
  const [blocks, setBlocks] = useState<BlocksType>();
  const [hogConfig, setHogConfig] = useState<HogConfigType>('dense');
  const [orientation, setOrientation] = useState<OrientationConfigType>("all");
  const [histogram, setHistogram] = useState<number[]>();
  const configs: { [type: string]: HogOptionsType } = {
    dense: denseConfig,
    medium: mediumConfig,
    sparse: sparseConfig,
  };

  const img = useRef('');
  const config = useRef('');

  useLayoutEffect(() => {
    // reset to tab 0 when changing images
    if (img.current !== imgUrl || config.current !== hogConfig) {
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
  });


  return (
    <div>
      {histogram && gradients && blocks &&
        <div>
          <div className="flex flex-col md:flex-row justify-evenly">
            <GradientImage
              label="Combined Sobel"
              gradient={gradients.combined}
              width={gradients.combined.width}
              height={gradients.combined.height}
              labelColor={labelColor}
            />
            <NeedlePlot
              blocks={blocks}
              hogConfig={hogConfig}
              setHogConfig={setHogConfig}
              orientation={orientation}
              setOrientation={setOrientation}
              width={gradients.combined.width}
              height={gradients.combined.height}
              labelColor={labelColor}
            />
          </div>
          <div className="flex flex-col md:flex-row justify-evenly">
            <Histogram
              histogram={histogram}
              orientation={orientation}
              width={gradients.combined.width}
              height={gradients.combined.height}
              labelColor={labelColor}
            />
          </div>
        </div>}
    </div>
  );
}

export default NeedleHistogramDemo;