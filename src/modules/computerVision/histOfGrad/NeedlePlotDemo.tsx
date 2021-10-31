/* eslint-disable */

import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import {
    gradientImages,
    GradientsType
} from "../sobelFilter/sobelFilter";
import { denseConfig, histogramBlocks } from "./histOfGrad";
import { displayNeedlePlot } from "./hogComponents";



type NeedlePlotDemoType = {
    labelColor: string;
    imgUrl: string;
};

const NeedlePlotDemo: React.FC<NeedlePlotDemoType> = ({
    labelColor,
    imgUrl,
}) => {
    const imgRef = useRef<HTMLImageElement>(null);

    const [canvasWidth, setCanvasWidth] = useState<number>(0);
    const [canvasHeight, setCanvasHeight] = useState<number>(0);

    const needleOverlay = useRef<HTMLCanvasElement>(null);


    useLayoutEffect(() => {
        const needleOverlayElm = needleOverlay.current
        if (!needleOverlayElm) return;

        const ctx = needleOverlayElm.getContext('2d');
        if (!ctx) return;

        var img = new Image();
        img.src = imgUrl;
        img.onload = function (e) {

            setCanvasHeight(img.height);
            setCanvasWidth(img.width);

            ctx.drawImage(img, 0, 0, img.width, img.height);

            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.fillRect(0, 0, img.width, img.height)

            histogramBlocks(imgUrl, denseConfig).then((blocks) => {
                displayNeedlePlot(needleOverlayElm, blocks, "all", { r: 0, g: 0, b: 0 }, true)
            })
        }



    });

    return (

        <div>
            <p className={`text-3xl ${labelColor}`}>Original Image</p>
            <img ref={imgRef} src={imgUrl} alt="img" className="mx-auto sobel-image-width" />

            <div className='my-10'>
                <canvas
                    className="crisp-pixels mx-auto max-w-60vw sobel-image-width"
                    ref={needleOverlay}
                    width={canvasWidth}
                    height={canvasHeight}
                />
            </div>

        </div>
    );
};

export default NeedlePlotDemo;
