/* eslint-disable */

import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import {
  gradientImages,
  GradientsType
} from "../sobelFilter/sobelFilter";

import {
    SobelImage
} from "../sobelFilter/SobelFilterDemo"


type CombinedSobelFilterDemoType = {
  labelColor: string;
  imgUrl: string;
};

const CombinedSobelFilterDemo: React.FC<CombinedSobelFilterDemoType> = ({
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
      <div className="flex flex-col md:flex-row justify-evenly my-3">
        <div>
            <p className={`text-3xl ${labelColor}`}>Original Image</p>

            <img ref={imgRef} src={imgUrl} alt="img" className="mx-auto sobel-image-width" />
        </div>
        {gradients &&
            <div>
                <p className={`text-3xl ${labelColor}`}>All Directions</p>
                <SobelImage
                        label=""
                        gradient={gradients.combined}
                        width={gradients.combined.width}
                        height={gradients.combined.height}
                        labelColor={labelColor}
                        forceLabelDisplay={true}
                    />
            </div>
        }
      </div>
      {gradients &&
        <div className="my-3">
        <p className={`text-3xl ${labelColor}`}>Combined Filters</p>
        <div className="flex flex-col md:flex-row justify-evenly my-3">
            <SobelImage
                label="Vertical"
                gradient={gradients.vert}
                width={gradients.vert.width}
                height={gradients.vert.height}
                labelColor={labelColor}
                forceLabelDisplay={true}
            />
            <SobelImage
                label="Horizontal"
                gradient={gradients.horiz}
                width={gradients.horiz.width}
                height={gradients.horiz.height}
                labelColor={labelColor}
                forceLabelDisplay={true}
            />
            <SobelImage
                label="Diagonal Up"
                gradient={gradients.diagUp}
                width={gradients.diagUp.width}
                height={gradients.diagUp.height}
                labelColor={labelColor}
                forceLabelDisplay={true}
            />
            <SobelImage
                label="Diagonal Down"
                gradient={gradients.diagDown}
                width={gradients.diagDown.width}
                height={gradients.diagDown.height}
                labelColor={labelColor}
                forceLabelDisplay={true}
            />
        </div>
    </div>
      }

    </div>
  );
};

export default CombinedSobelFilterDemo;
