/* eslint-disable */

import React, { useLayoutEffect, useRef, useState, useEffect, EffectCallback } from "react";
import {
    gradientImages,
    GradientsType
} from "../sobelFilter/sobelFilter";
import {
    BlocksType,
    calculateSobelHog
} from "./histOfGrad";
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
    const maxStep = 3;

    const canvasWidth = 500 * (img.width as number / (img.height as number));
    const canvasHeight = 500;

    const [numGridCols, setNumGridCols] = useState<number>(0);
    const [numGridRows, setNumGridRows] = useState<number>(0);

    const [blocks, setBlocks] = useState<BlocksType>();

    const [blockSize, setBlockSize] = useState<number>(32);

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
    }, [imgUrl])

    useEffect(() => {
        //histogramBlocks(imgUrl, sparseConfig).then((blocks) => {
        calculateSobelHog(imgUrl, blockSize).then((blocks) => {
            setBlocks(blocks)
            setNumGridRows(blocks.histogram.length)
            setNumGridCols(blocks.histogram[0].length)
        })
    },
        [imgUrl, blockSize]
    );

    useLayoutEffect(() => {
        switch (step) {

            case 0:
                fillGridOverlayCanvas();
                break;
            case 1:
                fillNeedleOverlayCanvas();
                break;
            case 2:
                fillGridNeedleCanvas();
                break;
            case 3:
                fillNeedleCanvas();
                break;
        }
    });

    const descriptions: string[] = [
        `First, we separate the image into blocks of ${blockSize}x${blockSize} pixels. We do this because it would be too cluttered to show the needles for each pixel.`,
        "In each block, we compute the four needles for each pixel. We then sum the needles in each direction over all the pixels in the block, and display the four resulting composite needles.",
        "We then replace the original image with a black background to make the needles easier to see.",
        "After removing the grid lines, we are left with our needle plot."
    ];

    return (

        <div>
            <div className="flex flex-col md:flex-row justify-center items-center">
                <p className="mx-10 my-5 md:w-1/4">{descriptions[step]}</p>
                <div>
                    <label>Block Size: </label>
                    <div className="flex flex-row justify-center items-center">

                        <div className="flex border-2 rounded-lg border-navy">
                            <button
                                className="mx-3 text-lg border-r border-navy mr-2 pr-2 focus:outline-none"
                                disabled={blockSize === 4}
                                onClick={() => { setBlockSize(blockSize / 2) }}
                            >-</button>

                            <p>{blockSize} px</p>

                            <button
                                className="mx-3 text-lg border-l border-navy ml-2 pl-2 focus:outline-none"
                                disabled={blockSize === 64}
                                onClick={() => { setBlockSize(blockSize * 2) }}
                            >+</button>
                        </div>


                    </div>
                    <div className='my-5'>
                        <canvas
                            className="crisp-pixels mx-auto md30vw-sm60vw"
                            ref={canvas}
                            width={canvasWidth}
                            height={canvasHeight}
                        />
                    </div>
                </div>
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
                        Step {step + 1} / {maxStep + 1}
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
