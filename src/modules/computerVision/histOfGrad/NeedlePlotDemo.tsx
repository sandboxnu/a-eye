/* eslint-disable */

import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import {
    gradientImages,
    GradientsType
} from "../sobelFilter/sobelFilter";
import { denseConfig, histogramBlocks, mediumConfig, sparseConfig } from "./histOfGrad";
import { displayNeedlePlot, drawGrid } from "./hogComponents";



type NeedlePlotDemoType = {
    labelColor: string;
    imgUrl: string;
};

const NeedlePlotDemo: React.FC<NeedlePlotDemoType> = ({
    labelColor,
    imgUrl,
}) => {
    const imgRef = useRef<HTMLImageElement>(null);

    const [step, setStep] = useState<number>(0);
    const maxStep = 4;

    const [canvasHeight, setCanvasHeight] = useState<number>(0);
    const [canvasWidth, setCanvasWidth] = useState<number>(0);

    const [numGridCols, setNumGridCols] = useState<number>(0);
    const [numGridRows, setNumGridRows] = useState<number>(0);

    const needleConfig = sparseConfig;

    const gridOverlay = useRef<HTMLCanvasElement>(null);
    const needleOverlay = useRef<HTMLCanvasElement>(null);

    const gridNeedle = useRef<HTMLCanvasElement>(null);
    const needleOnly = useRef<HTMLCanvasElement>(null);

    const fillNeedleOverlayCanvas = () => {
        const needleOverlayElm = needleOverlay.current
        if (!needleOverlayElm) return;

        const ctx = needleOverlayElm.getContext('2d');
        if (!ctx) return;

        var img = new Image();
        img.src = imgUrl;
        img.onload = function (e) {
            const width = 500 * (img.width / img.height);
            const height = 500;


            histogramBlocks(imgUrl, needleConfig).then((blocks) => {


                setNumGridRows(blocks.histogram.length)
                setNumGridCols(blocks.histogram[0].length)

                setCanvasHeight(height);
                setCanvasWidth(width);

                ctx.imageSmoothingEnabled = false;
                ctx.drawImage(img, 0, 0, width, height);

                ctx.fillStyle = 'rgba(0,0,0,0.5)';
                ctx.fillRect(0, 0, width, height)

                drawGrid(needleOverlayElm, numGridRows, numGridCols, { r: 255, g: 255, b: 255 })

                displayNeedlePlot(needleOverlayElm, blocks, "all", { r: 255, g: 255, b: 255 }, true)
            })
        }
    }

    const fillGridOverlayCanvas = () => {
        const gridOverlayElm = gridOverlay.current
        if (!gridOverlayElm) return;

        const ctx = gridOverlayElm.getContext('2d');
        if (!ctx) return;

        var img = new Image();
        img.src = imgUrl;
        img.onload = function (e) {
            const width = 500 * (img.width / img.height);
            const height = 500;

            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(img, 0, 0, width, height);


            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(0, 0, width, height)

            drawGrid(gridOverlayElm, numGridRows, numGridCols, { r: 255, g: 255, b: 255 })

        }
    }

    const fillGridNeedleCanvas = () => {
        const gridNeedleElm = gridNeedle.current
        if (!gridNeedleElm) return;

        const ctx = gridNeedleElm.getContext('2d');
        if (!ctx) return;

        var img = new Image();
        img.src = imgUrl;
        img.onload = function (e) {
            const width = 500 * (img.width / img.height);
            const height = 500;


            histogramBlocks(imgUrl, needleConfig).then((blocks) => {


                setNumGridRows(blocks.histogram.length)
                setNumGridCols(blocks.histogram[0].length)

                setCanvasHeight(height);
                setCanvasWidth(width);

                ctx.fillStyle = 'rgba(0,0,0)';
                ctx.fillRect(0, 0, width, height)

                drawGrid(gridNeedleElm, numGridRows, numGridCols, { r: 255, g: 255, b: 255 })

                displayNeedlePlot(gridNeedleElm, blocks, "all", { r: 255, g: 255, b: 255 }, true)
            })
        }
    }

    const fillNeedleCanvas = () => {
        const needleElm = needleOnly.current
        if (!needleElm) return;

        const ctx = needleElm.getContext('2d');
        if (!ctx) return;

        var img = new Image();
        img.src = imgUrl;
        img.onload = function (e) {
            const width = 500 * (img.width / img.height);
            const height = 500;


            histogramBlocks(imgUrl, needleConfig).then((blocks) => {


                setNumGridRows(blocks.histogram.length)
                setNumGridCols(blocks.histogram[0].length)

                setCanvasHeight(height);
                setCanvasWidth(width);

                ctx.fillStyle = 'rgba(0,0,0)';
                ctx.fillRect(0, 0, width, height)

                displayNeedlePlot(needleElm, blocks, "all", { r: 255, g: 255, b: 255 }, true)
            })
        }
    }


    useLayoutEffect(() => {
        fillNeedleOverlayCanvas();
        fillGridOverlayCanvas();
        fillGridNeedleCanvas();
        fillNeedleCanvas();
    });

    return (

        <div>
            <p className={`text-3xl crisp-pixels ${labelColor}`}>Original Image</p>

            {step == 0 &&
                <img ref={imgRef} src={imgUrl} alt="img" className="mx-auto max-w-60vw" />
            }

            {step == 1 &&
                <div className='my-10'>
                    <canvas
                        className="crisp-pixels mx-auto max-w-60vw"
                        ref={gridOverlay}
                        width={canvasWidth}
                        height={canvasHeight}
                    />
                </div>
            }

            {step == 2 &&

                <div className='my-10'>
                    <canvas
                        className="crisp-pixels mx-auto max-w-60vw"
                        ref={needleOverlay}
                        width={canvasWidth}
                        height={canvasHeight}
                    />
                </div>
            }

            {step == 3 &&

                <div className='my-10'>
                    <canvas
                        className="crisp-pixels mx-auto max-w-60vw"
                        ref={gridNeedle}
                        width={canvasWidth}
                        height={canvasHeight}
                    />
                </div>
            }
            {step == 4 &&

                <div className='my-10'>
                    <canvas
                        className="crisp-pixels mx-auto max-w-60vw"
                        ref={needleOnly}
                        width={canvasWidth}
                        height={canvasHeight}
                    />
                </div>
            }
            <div className="text-moduleOffwhite m-3 space-x-2 justify-center space-y-3">
                <div className="flex justify-around rounded w-1/4 mx-auto bg-moduleNavy">
                    <button
                        type="button"
                        onClick={() => setStep(step => Math.max(step - 1, 0))}
                        className="rounded mx-auto py-1 hover:text-moduleTeal outline-none"
                    >
                        <span className="m-auto text-2xl font-thin">−</span>
                    </button>
                    <div className="md:inline py-2">
                        {/* eslint-disable-next-line */}
                        Step {step} / {maxStep}
                    </div>
                    <button
                        type="button"
                        onClick={() => setStep(step => Math.min(step + 1, maxStep))}
                        className="rounded mx-auto py-1 hover:text-moduleTeal outline-none"
                    >
                        <span className="m-auto text-2xl font-thin">+</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NeedlePlotDemo;
