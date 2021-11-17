/* eslint-disable */

import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import { gradientImages, GradientsType } from "../sobelFilter/sobelFilter";
import { calculateSobelHog } from "./histOfGrad";
import SobelFilterDemo from "../sobelFilter/SobelFilterDemo"
import CombinedSobelFilterDemo from "./CombinedSobelDemo"
import NeedleHistogramDemo from "./NeedleHistogramDemo";
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
    setGradients(undefined)
    gradientImages(imgUrl).then((newGradients) => {
      setGradients(newGradients);
    })

    let newImg = new Image()
    newImg.src = imgUrl

    setImg(newImg);

  }, [imgUrl])

  return (
    <div>
      {!gradients &&
        <p className="my-6">Loading...</p>
      }

      {gradients && img &&
        <div className={labelColor}>

          <div>
            <p className={`text-3xl`}>Original Image</p>
            <img src={imgUrl} alt="img" className="mx-auto crisp-pixels md60vw-sm20vw" />
          </div>
          <div className="my-5">
            <p className="text-4xl">Sobel Filters</p>
            <p className="my-5">First, recall how we use the 8 sobel filters to extract edges in different angles and image gradients:</p>
            <SobelFilterDemo
              labelColor={labelColor}
              imgUrl={imgUrl}
              gradients={gradients}
              compact={true} />
          </div>
          <div className="my-5">
            <p className="text-4xl">Combined Filters</p>
            <p className="my-5 md:w-3/4 mx-auto">Next, we combine the activities for each dark-to-light and light-to-dark pair of operators to obtain the overall intensity in each direction.</p>
            <CombinedSobelFilterDemo
              labelColor={labelColor}
              imgUrl={imgUrl}
              gradients={gradients} />
          </div>
          <div className="my-5">
            <p className="text-4xl">From Filters to Needles</p>
            <p className="my-5 md:w-3/4 mx-auto">While the sobel filters give us valuable information about edges within an image, they are not the easiest to interpret. To get a better visualization of the edges in an image, we transform the four compound sobel outputs into "needles". See how we do this below:</p>
            <ZoomedSobelExample
              labelColor={labelColor} />
          </div>
          <div className="my-5">
            <p className="text-4xl">Creating the Needle Plot</p>
            <p className="my-5 md:w-3/4 mx-auto">By applying the above process across an entire image, we can obtain a more intuitive visualization of its edges.</p>
            <NeedlePlotDemo
              labelColor={labelColor}
              imgUrl={imgUrl}
              img={img} />
          </div>
          <div className="my-5">
            <p className="text-4xl">The Histogram</p>
            <p className="my-5 md:w-3/4 mx-auto">Finally, we create our "Histogram of Gradients", which has four bins (0, 45, 90, 135). For each block in the image, we take each of the four needles and add its magnitude to the appropriate bin.</p>
            <NeedleHistogramDemo
              labelColor={labelColor}
              imgUrl={imgUrl}
              gradients={gradients} />
          </div>
        </div>
      }
    </div>
  );
};

export default HistogramOfGradDemo;
