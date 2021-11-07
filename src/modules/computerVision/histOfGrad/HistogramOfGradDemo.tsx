/* eslint-disable */

import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import SobelFilterDemo from "../sobelFilter/SobelFilterDemo"
import CombinedSobelFilterDemo from "./CombinedSobelDemo"
import NeedleHistogramDemo from "./NeedleHistrogramDemo";
import NeedlePlotDemo from "./NeedlePlotDemo"


type HistogramOfGradType = {
  labelColor: string;
  imgUrl: string;
};

const HistogramOfGradDemo: React.FC<HistogramOfGradType> = ({
  labelColor,
  imgUrl,
}) => {

  return (
    <div>
      <SobelFilterDemo labelColor={labelColor} imgUrl={imgUrl}/>
      <CombinedSobelFilterDemo labelColor={labelColor} imgUrl={imgUrl}/>
      <NeedlePlotDemo labelColor={labelColor} imgUrl={imgUrl}/>
      <NeedleHistogramDemo labelColor={labelColor} imgUrl={imgUrl}/>
    </div>
  );
};

export default HistogramOfGradDemo;
