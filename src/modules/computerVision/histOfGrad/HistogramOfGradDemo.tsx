/* eslint-disable */

import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import { gradientImages, GradientsType } from "../sobelFilter/sobelFilter";
import SobelFilterDemo from "../sobelFilter/SobelFilterDemo"
import CombinedSobelFilterDemo from "./CombinedSobelDemo"
import NeedleHistogramDemo from "./NeedleHistrogramDemo";
import NeedlePlotDemo from "./NeedlePlotDemo"
import ZoomedSobelExample from "./ZoomedSobelExample";


type HistogramOfGradType = {
  labelColor: string;
  imgUrl: string;
};

const HistogramOfGradDemo: React.FC<HistogramOfGradType> = ({
  labelColor,
  imgUrl,
}) => {

  const [img, setImg] = useState<CanvasImageSource>();
  const [gradients, setGradients] = useState<GradientsType>();

  useEffect(() => {
    gradientImages(imgUrl).then((newGradients) => {
      setGradients(newGradients);
    })

    let newImg = new Image()
    newImg.src = imgUrl

    setImg(newImg);

  }, [imgUrl])

  return (
    <div>
      {gradients && img &&
        <div>
          <SobelFilterDemo
            labelColor={labelColor}
            imgUrl={imgUrl}
            gradients={gradients} />
          <CombinedSobelFilterDemo 
            labelColor={labelColor} 
            imgUrl={imgUrl}
            gradients={gradients} />
          <ZoomedSobelExample 
            labelColor={labelColor} />
          <NeedlePlotDemo 
            labelColor={labelColor} 
            imgUrl={imgUrl}
            img={img} />
          <NeedleHistogramDemo 
            labelColor={labelColor} 
            imgUrl={imgUrl}
            gradients={gradients} />
        </div>
      }
    </div>
  );
};

export default HistogramOfGradDemo;
