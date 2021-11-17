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

const filters: string[] = [
  "Vertical",
  "Horizontal",
  "Diagonal Up",
  "Diagonal Down",
];

type SobelImageType = {
  label: string;
  gradient: ImageData;
  width: number;
  height: number;
  labelColor: string;
  forceLabelDisplay?: boolean
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
      <p className={`${labelColor} ${forceLabelDisplay ? '' : 'md:hidden'}`}>{label}</p>
      <canvas
        className="crisp-pixels mx-auto md60vw-sm20vw"
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
  hideLabel?: boolean,
}

const SobelFilterRow: React.FC<SobelFilterRowType> = ({
  label,
  labelColor,
  darkLightImage,
  lightDarkImage,
  darkLightKernelSrc,
  lightDarkKernelSrc,
  hideLabel,
}) => {
  return (
    <div className="my-3">
      <p className={`text-3xl ${labelColor} ${(hideLabel ? 'hidden' : '')}`}>{label}</p>
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
  gradients: GradientsType;
  compact?: boolean;
};

export const SobelFilterDemo: React.FC<SobelFilterDemoType> = ({
  labelColor,
  imgUrl,
  gradients,
  compact,
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [filterIdx, setFilterIdx] = useState<number>(0);

  const img = useRef('');
  const config = useRef('');

  useLayoutEffect(() => {
    // reset to tab 0 when changing images
    img.current = imgUrl;
  });

  return (

    <div>
      {!compact &&
        <div>
          <p className={`text-3xl ${labelColor}`}>Original Image</p>
          <img ref={imgRef} src={imgUrl} alt="img" className="mx-auto md60vw-sm20vw" />
        </div>
      }
      {gradients &&

        <div className='my-10'>
          {compact &&
            <div className="text-2xl">
              <label htmlFor="filters">Filter: </label>
              <select className="bg-white bg-opacity-50" id="filters" name="filters" onChange={(event) => { setFilterIdx(parseInt(event.target.value)) }}>
                {
                  ([0, 1, 2, 3]).map((idx) => <option value={idx} >{[filters[idx]]}</option>)
                }
              </select>
            </div>
          }

          {(filterIdx == 0 || !compact) &&
            <SobelFilterRow
              label="Vertical Edges"
              labelColor={labelColor}
              hideLabel={compact}
              darkLightImage={gradients.vertDarkLight}
              lightDarkImage={gradients.vertLightDark}
              darkLightKernelSrc={vertDarkLightKernel}
              lightDarkKernelSrc={vertLightDarkKernel}
            />
          }

          {(filterIdx == 1 || !compact) &&

            <SobelFilterRow
              label="Horizontal Edges"
              labelColor={labelColor}
              hideLabel={compact}
              darkLightImage={gradients.horizDarkLight}
              lightDarkImage={gradients.horizLightDark}
              darkLightKernelSrc={horizDarkLightKernel}
              lightDarkKernelSrc={horizLightDarkKernel}
            />
          }

          {(filterIdx == 2 || !compact) &&

            <SobelFilterRow
              label="Diagonal Up Edges"
              labelColor={labelColor}
              hideLabel={compact}
              darkLightImage={gradients.diagUpDarkLight}
              lightDarkImage={gradients.diagUpLightDark}
              darkLightKernelSrc={diagUpDarkLightKernel}
              lightDarkKernelSrc={diagUpLightDarkKernel}
            />
          }
          {(filterIdx == 3 || !compact) &&

            <SobelFilterRow
              label="Diagonal Down Edges"
              labelColor={labelColor}
              hideLabel={compact}
              darkLightImage={gradients.diagDownDarkLight}
              lightDarkImage={gradients.diagDownLightDark}
              darkLightKernelSrc={diagDownDarkLightKernel}
              lightDarkKernelSrc={diagDownLightDarkKernel}
            />
          }

        </div>
      }

    </div>
  );
};

export default SobelFilterDemo;
