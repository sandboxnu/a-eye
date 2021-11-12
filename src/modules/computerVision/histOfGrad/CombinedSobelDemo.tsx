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
  gradients: GradientsType;
};

const CombinedSobelFilterDemo: React.FC<CombinedSobelFilterDemoType> = ({
  labelColor,
  imgUrl,
  gradients,
}) => {
  const imgRef = useRef<HTMLImageElement>(null);

  const img = useRef('');
  const config = useRef('');

  useLayoutEffect(() => {
    img.current = imgUrl;
  });

  return (

    <div>
      {gradients &&
        <div className="my-3">
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

          <div className="flex flex-col md:flex-row justify-evenly my-3">
            <div className="flex flex-col md:flex-row justify-center items-center">
              <p className={`text-lg mx-3 md:w-1/4 ${labelColor}`}>We can now combine the activities of the four images into a new image that captures the edges in all directions.</p>
              {gradients &&
                <div>
                  <SobelImage
                    label="All Directions"
                    gradient={gradients.combined}
                    width={gradients.combined.width}
                    height={gradients.combined.height}
                    labelColor={labelColor}
                    forceLabelDisplay={true}
                  />
                </div>
              }
            </div>

          </div>
        </div>
      }

    </div>
  );
};

export default CombinedSobelFilterDemo;
