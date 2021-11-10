/* eslint-disable */

import React, { useLayoutEffect, useRef, useState, useEffect, EffectCallback } from "react";
import {
    gradientImages,
    GradientsType
} from "../sobelFilter/sobelFilter";
import { denseConfig, histogramBlocks, mediumConfig, sparseConfig, BlocksType } from "./histOfGrad";
import { displayNeedlePlot, drawGrid } from "./hogComponents";



type NeedlePlotDemoType = {
    labelColor: string;
    imgUrl: string;
    img: CanvasImageSource;
};

const NeedlePlotDemo: React.FC<NeedlePlotDemoType> = ({
    labelColor,
    imgUrl,
    img,
}) => {
    const imgRef = useRef<HTMLImageElement>(null);

    const [step, setStep] = useState<number>(0);
    const maxStep = 4;

    const canvasWidth = 500 * (img.width as number / (img.height as number));
    const canvasHeight = 500;

    const [numGridCols, setNumGridCols] = useState<number>(0);
    const [numGridRows, setNumGridRows] = useState<number>(0);

    const [blocks, setBlocks] = useState<BlocksType>();

    const needleConfig = sparseConfig;

    const canvas = useRef<HTMLCanvasElement>(null)

    const fillOriginalImage = () => {
        const gridOverlayElm = canvas.current
        if (!gridOverlayElm) return;

        const ctx = gridOverlayElm.getContext('2d');
        if (!ctx) return;

        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
    }

    const fillNeedleOverlayCanvas = () => {
        const needleOverlayElm = canvas.current
        if (!needleOverlayElm) return;

        const ctx = needleOverlayElm.getContext('2d');
        if (!ctx) return;

        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);

        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight)

        drawGrid(needleOverlayElm, numGridRows, numGridCols, { r: 255, g: 255, b: 255 })
        if (!blocks) return
        displayNeedlePlot(needleOverlayElm, blocks, "all", { r: 255, g: 255, b: 255 }, true)
    }

    const fillGridOverlayCanvas = () => {
        const gridOverlayElm = canvas.current
        if (!gridOverlayElm) return;

        const ctx = gridOverlayElm.getContext('2d');
        if (!ctx) return;

        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);


        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight)

        drawGrid(gridOverlayElm, numGridRows, numGridCols, { r: 255, g: 255, b: 255 })

    }

    const fillGridNeedleCanvas = () => {
        const gridNeedleElm = canvas.current
        if (!gridNeedleElm) return;

        const ctx = gridNeedleElm.getContext('2d');
        if (!ctx) return;


        ctx.fillStyle = 'rgba(0,0,0)';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight)

        drawGrid(gridNeedleElm, numGridRows, numGridCols, { r: 255, g: 255, b: 255 })
        if (!blocks) return
        displayNeedlePlot(gridNeedleElm, blocks, "all", { r: 255, g: 255, b: 255 }, true)
    }

    const fillNeedleCanvas = () => {
        const needleElm = canvas.current
        if (!needleElm) return;

        const ctx = needleElm.getContext('2d');
        if (!ctx) return;


        ctx.fillStyle = 'rgba(0,0,0)';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight)

        if (!blocks) return
        displayNeedlePlot(needleElm, blocks, "all", { r: 255, g: 255, b: 255 }, true)
    }

    useEffect(() => {
        setStep(0);
        histogramBlocks(imgUrl, needleConfig).then((blocks) => {
            setBlocks(blocks)
            setNumGridRows(blocks.histogram.length)
            setNumGridCols(blocks.histogram[0].length)
        })
    },
        [imgUrl]
    );

    useLayoutEffect(() => {
        switch (step) {
            case 0:
                fillOriginalImage();
                break;
            case 1:
                fillGridOverlayCanvas();
                break;
            case 2:
                fillNeedleOverlayCanvas();
                break;
            case 3:
                fillGridNeedleCanvas();
                break;
            case 4:
                fillNeedleCanvas();
                break;
        }
    });


    return (

        <div>
            <div className='my-10'>
                <canvas
                    className="crisp-pixels mx-auto md30vw-sm60vw"
                    ref={canvas}
                    width={canvasWidth}
                    height={canvasHeight}
                />
            </div>
            <div className="text-moduleOffwhite m-3 space-x-2 justify-center space-y-3">
                <div className="flex justify-around rounded md:w-1/4 mx-auto bg-moduleNavy">
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
