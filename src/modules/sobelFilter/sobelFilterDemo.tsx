/* eslint-disable */

import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import {
  gradientImages,
  GradientsType
} from "./sobelFilter";
import vertDarkLightKernel from "../../media/modules/computerVision/sobelKernels/vertical_darktolight.png";
import vertLightDarkKernel from "../../media/modules/computerVision/sobelKernels/vertical_lighttodark.png";
import horizDarkLightKernel from "../../media/modules/computerVision/sobelKernels/horizontal_darktolight.png";
import horizLightDarkKernel from "../../media/modules/computerVision/sobelKernels/horizontal_lighttodark.png";
import diagDownDarkLightKernel from "../../media/modules/computerVision/sobelKernels/diagonaldown_darktolight.png";
import diagDownLightDarkKernel from "../../media/modules/computerVision/sobelKernels/diagonaldown_lighttodark.png";
import diagUpDarkLightKernel from "../../media/modules/computerVision/sobelKernels/diagonalup_darktolight.png";
import diagUpLightDarkKernel from "../../media/modules/computerVision/sobelKernels/diagonalup_lighttodark.png";


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
      <p className={`${labelColor} md:hidden`}>{label}</p>
      <canvas
        className="crisp-pixels mx-auto sobel-image-width"
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
          <div>
            <p className={`text-3xl ${labelColor}`}>Vertical Edges</p>
            <div className="flex flex-col md:flex-row justify-evenly ">
              <GradientImage
                label="Dark to Light"
                gradient={gradients.combined}
                width={gradients.vertDarkLight.width}
                height={gradients.vertDarkLight.height}
                labelColor={labelColor}
              />
              <div className="my-auto mx-auto">
                <img src={vertDarkLightKernel} alt="img" className="min-w-20vw"/>
              </div>
              <div className="my-auto mx-auto">
                <img src={vertLightDarkKernel} alt="img" className="min-w-20vw"/>
              </div>
              <GradientImage
                label="Light to Dark"
                gradient={gradients.vertLightDark}
                width={gradients.vertLightDark.width}
                height={gradients.vertLightDark.height}
                labelColor={labelColor}
              />
            </div>
          </div>
          <div className='mt-6'>
            <p className={`text-3xl ${labelColor}`}>Horizontal Edges</p>
            <div className="flex flex-col md:flex-row justify-evenly">
              <GradientImage
                label="Dark to Light"
                gradient={gradients.horizDarkLight}
                width={gradients.horizDarkLight.width}
                height={gradients.horizDarkLight.height}
                labelColor={labelColor}
              />
              <div className="my-auto mx-auto">
                <img src={horizDarkLightKernel} alt="img" className="min-w-20vw"/>
              </div>
              <div className="my-auto mx-auto">
                <img src={horizLightDarkKernel} alt="img" className="min-w-20vw"/>
              </div>
              <GradientImage
                label="Light to Dark"
                gradient={gradients.horizLightDark}
                width={gradients.horizLightDark.width}
                height={gradients.horizLightDark.height}
                labelColor={labelColor}
              />


            </div>
          </div>
          <div className='mt-6'>
            <p className={`text-3xl ${labelColor}`}>Diagonal Down Edges</p>
            <div className="flex flex-col md:flex-row justify-evenly">
              <GradientImage
                label="Dark to Light"
                gradient={gradients.diagDownDarkLight}
                width={gradients.diagDownDarkLight.width}
                height={gradients.diagDownDarkLight.height}
                labelColor={labelColor}
              />
              <div className="my-auto mx-auto">
                <img src={diagDownDarkLightKernel} alt="img" className="min-w-20vw"/>
              </div>
              <div className="my-auto mx-auto">
                <img src={diagDownLightDarkKernel} alt="img" className="min-w-20vw"/>
              </div>
              <GradientImage
                label="Light to Dark"
                gradient={gradients.diagDownLightDark}
                width={gradients.diagDownLightDark.width}
                height={gradients.diagDownLightDark.height}
                labelColor={labelColor}
              />

            </div>
          </div>
          <div className='mt-6'>
            <p className={`text-3xl ${labelColor}`}>Diagonal Up Edges</p>
            <div className="flex flex-col md:flex-row justify-evenly">
              <GradientImage
                label="Dark to Light"
                gradient={gradients.diagUpDarkLight}
                width={gradients.diagUpDarkLight.width}
                height={gradients.diagUpDarkLight.height}
                labelColor={labelColor}
              />
              <div className="my-auto mx-auto">
                <img src={diagUpDarkLightKernel} alt="img" className="min-w-20vw"/>
              </div>
              <div className="my-auto mx-auto">
                <img src={diagUpLightDarkKernel} alt="img" className="min-w-20vw"/>
              </div>
              <GradientImage
                label="Light to Dark"
                gradient={gradients.diagUpLightDark}
                width={gradients.diagUpLightDark.width}
                height={gradients.diagUpLightDark.height}
                labelColor={labelColor}
              />
            </div>
          </div>
        </div>
      }

    </div>
  );
};

export default SobelFilterDemo;
