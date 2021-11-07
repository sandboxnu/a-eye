/* eslint-disable */

import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import {
  gradientImages,
  GradientsType
} from "./sobelFilter";
import vertDarkLightKernel from "../../../media/modules/computerVision/sobelKernels/vertical_darktolight.png";
import vertLightDarkKernel from "../../../media/modules/computerVision/sobelKernels/vertical_lighttodark.png";
import horizDarkLightKernel from "../../../media/modules/computerVision/sobelKernels/horizontal_darktolight.png";
import horizLightDarkKernel from "../../../media/modules/computerVision/sobelKernels/horizontal_lighttodark.png";
import diagDownDarkLightKernel from "../../../media/modules/computerVision/sobelKernels/diagonaldown_darktolight.png";
import diagDownLightDarkKernel from "../../../media/modules/computerVision/sobelKernels/diagonaldown_lighttodark.png";
import diagUpDarkLightKernel from "../../../media/modules/computerVision/sobelKernels/diagonalup_darktolight.png";
import diagUpLightDarkKernel from "../../../media/modules/computerVision/sobelKernels/diagonalup_lighttodark.png";

type SobelImageType = {
  label: string;
  gradient: ImageData;
  width: number;
  height: number;
  labelColor: string;
  forceLabelDisplay ?: boolean
};

export const SobelImage: React.FC<SobelImageType> = ({
  label,
  gradient,
  width,
  height,
  labelColor,
  forceLabelDisplay
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
      <p className={`${labelColor} ${forceLabelDisplay?'':'md:hidden'}`}>{label}</p>
      <canvas
        className="crisp-pixels mx-auto sobel-image-width"
        ref={canvasRef}
        width={width}
        height={height}
      />
    </div>
  );
};

type SobelFilterRowType = {
  label: string,
  labelColor: string,
  darkLightImage: ImageData,
  lightDarkImage: ImageData,
  darkLightKernelSrc: string,
  lightDarkKernelSrc: string
}

const SobelFilterRow: React.FC<SobelFilterRowType> = ({
  label,
  labelColor,
  darkLightImage,
  lightDarkImage,
  darkLightKernelSrc,
  lightDarkKernelSrc
}) => {
  return (
    <div className="my-3">
      <p className={`text-3xl ${labelColor}`}>{label}</p>
      <div className="flex flex-col md:flex-row justify-evenly ">
        <SobelImage
          label="Dark to Light"
          gradient={darkLightImage}
          width={darkLightImage.width}
          height={darkLightImage.height}
          labelColor={labelColor}
        />
        <div className="my-auto mx-auto">
          <img src={darkLightKernelSrc} alt="img" className={`min-w-20vw ${labelColor === "text-modulePaleBlue" ? "img-invert" : ""}`} />
        </div>
        <div className="my-auto mx-auto">
          <img src={lightDarkKernelSrc} alt="img" className={`min-w-20vw ${labelColor === "text-modulePaleBlue" ? "img-invert" : ""}`} />
        </div>
        <SobelImage
          label="Light to Dark"
          gradient={lightDarkImage}
          width={lightDarkImage.width}
          height={lightDarkImage.height}
          labelColor={labelColor}
        />
      </div>
    </div>
  )
};

type SobelFilterDemoType = {
  labelColor: string;
  imgUrl: string;
};

export const SobelFilterDemo: React.FC<SobelFilterDemoType> = ({
  labelColor,
  imgUrl,
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [gradients, setGradients] = useState<GradientsType>();

  const img = useRef('');
  const config = useRef('');

  useLayoutEffect(() => {
    // reset to tab 0 when changing images
    if (img.current !== imgUrl) {
      gradientImages(imgUrl).then(gradients => setGradients(gradients));
    }
    img.current = imgUrl;
  });

  return (

    <div>
      <p className={`text-3xl ${labelColor}`}>Original Image</p>
      <img ref={imgRef} src={imgUrl} alt="img" className="mx-auto sobel-image-width" />

      {gradients &&
        <div className='my-10'>
          <SobelFilterRow
            label="Vertical Edges"
            labelColor={labelColor}
            darkLightImage={gradients.vertDarkLight}
            lightDarkImage={gradients.vertLightDark}
            darkLightKernelSrc={vertDarkLightKernel}
            lightDarkKernelSrc={vertLightDarkKernel}
          />
          <SobelFilterRow
            label="Horizontal Edges"
            labelColor={labelColor}
            darkLightImage={gradients.horizDarkLight}
            lightDarkImage={gradients.horizLightDark}
            darkLightKernelSrc={horizDarkLightKernel}
            lightDarkKernelSrc={horizLightDarkKernel}
          />
          <SobelFilterRow
            label="Diagonal Down Edges"
            labelColor={labelColor}
            darkLightImage={gradients.diagDownDarkLight}
            lightDarkImage={gradients.diagDownLightDark}
            darkLightKernelSrc={diagDownDarkLightKernel}
            lightDarkKernelSrc={diagDownLightDarkKernel}
          />
          <SobelFilterRow
            label="Diagonal Up Edges"
            labelColor={labelColor}
            darkLightImage={gradients.diagUpDarkLight}
            lightDarkImage={gradients.diagUpLightDark}
            darkLightKernelSrc={diagUpDarkLightKernel}
            lightDarkKernelSrc={diagUpLightDarkKernel}
          />
        </div>
      }

    </div>
  );
};

export default SobelFilterDemo;
