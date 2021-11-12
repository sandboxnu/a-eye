/* eslint-disable */
import { CloudDownloadOutlined } from "@material-ui/icons";
import React, { useEffect, useRef, useState } from "react";
import { gradientImages, GradientsType } from "../sobelFilter/sobelFilter";
import {
  BlocksType, calculateSobelHog, calculateHistogram,
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
  const [orientation, setOrientation] = useState<OrientationConfigType>("all");
  const [histogram, setHistogram] = useState<number[]>();

  const [blockSize, setBlockSize] = useState<number>(32);

  const [gradientImg, setGradientImg] = useState<ImageData>(gradients.combined)
  const [gradientLabel, setGradientLabel] = useState<string>("")

  const img = useRef('');
  const config = useRef('');

  useEffect(() => {
    // calculate histogram
    calculateSobelHog(imgUrl, blockSize).then(blocks => {
      setBlocks(blocks);
      setHistogram(calculateHistogram(blocks.histogram));
    });

  }, [imgUrl, blockSize]);

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
          <div className="flex flex-col md:flex-row justify-evenly my-3">
            <GradientImage
              label={gradientLabel}
              gradient={gradientImg}
              width={gradientImg.width}
              height={gradientImg.height}
              labelColor={labelColor}
            />
            <NeedlePlot
              blocks={blocks}
              orientation={orientation}
              aspectRatio={gradientImg.width/gradientImg.height}
              labelColor={labelColor}
            />
            <Histogram
              histogram={histogram}
              orientation={orientation}
              width={gradientImg.width}
              height={gradientImg.height}
              aspectRatio={gradientImg.height / gradientImg.width}
              labelColor={labelColor}
            />
          </div>
          <div className="inline">
            {/* 
            Way #1


            <div className="text-xl">
              <label>Block Size: </label>
              <input type="range" className="bg-white bg-opacity-50" min={8} max={64} onChange={(event) => { setBlockSize(parseInt(event.target.value)) }} />
              <input
                className="pixel-input mx-3 text-lg"
                type="text"
                value={`${blockSize} px`}
                readOnly={true}
              />
            </div> */}

            <label>Block Size: </label>
            <div className="flex flex-row justify-center items-center">

                <div className="flex border-2 rounded-lg border-navy">
                    <button
                        className="mx-3 text-lg border-r border-navy mr-2 pr-2 focus:outline-none"
                        disabled={blockSize === 4}
                        onClick={() => { setBlockSize(blockSize / 2) }}
                    >-</button>

                    <p>{blockSize} px</p>

                    <button
                        className="mx-3 text-lg border-l border-navy ml-2 pl-2 focus:outline-none" 
                        disabled={blockSize === 64}
                        onClick={() => { setBlockSize(blockSize * 2) }}
                    >+</button>
                </div>


            </div>

          </div>
        </div>}
    </div>
  );
}

export default NeedleHistogramDemo;