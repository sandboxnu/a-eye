/* eslint-disable */

import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import {
  gradientImages,
  GradientsType
} from "./sobelFilter";
import sobelFilter from "../../../media/modules/computerVision/sobelFilters.png";



type SobelFilterDemoType = {
  labelColor: string;
  imgUrl: string;
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

const SobelFilterDemo: React.FC<SobelFilterDemoType> = ({
  labelColor,
  imgUrl,
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgWidth, setImgWidth] = useState<number>(0);
  const [imgHeight, setImgHeight] = useState<number>(0);
  const [tab, setTab] = useState<number>(0);
  const [gradients, setGradients] = useState<GradientsType>();

  const img = useRef('');
  const config = useRef('');

  useLayoutEffect(() => {
    // reset to tab 0 when changing images
    if (img.current !== imgUrl) {
      if (img.current !== imgUrl) setTab(0);
      gradientImages(imgUrl)
      // calculate HoG features
      Promise.all([
        gradientImages(imgUrl),
      ]).then(features => {
        setGradients(features[0]);
      });
    }
    img.current = imgUrl;
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
      <div>


  {gradients &&
    <div>
  <div className="flex flex-col md:flex-row justify-evenly">
      <GradientImage
        label="Horizontal Sobel"
        gradient={gradients.horizLightDark}
        width={gradients.horizLightDark.width}
        height={gradients.horizLightDark.height}
        labelColor={labelColor}
      />
      {/* <div className="my-auto mx-3">
        <img src={sobelFilter} alt="img" />
      </div> */}
      <GradientImage
        label="Vertical Sobel"
        gradient={gradients.vertLightDark}
        width={gradients.vertLightDark.width}
        height={gradients.vertLightDark.height}
        labelColor={labelColor}
      />
    </div>
    <div className="flex flex-col md:flex-row justify-evenly my-8">
      <GradientImage
        label="Diagonal Down Sobel"
        gradient={gradients.diagDownLightDark}
        width={gradients.diagDownLightDark.width}
        height={gradients.diagDownLightDark.height}
        labelColor={labelColor}
      />
      {/* <div className="my-auto mx-3">
        <img src={sobelFilter} alt="img" />
      </div> */}
      <GradientImage
        label="Diagonal Up Sobel"
        gradient={gradients.diagUpLightDark}
        width={gradients.diagUpLightDark.width}
        height={gradients.diagUpLightDark.height}
        labelColor={labelColor}
      />
    </div>
      </div>
  }

    </div>
    </div>
  );
};

export default SobelFilterDemo;
