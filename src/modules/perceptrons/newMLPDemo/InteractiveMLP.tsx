/* eslint-disable */
import { MLPConfig } from "./mlpConfig";
import React, { useState, useEffect} from "react";
import Sketch from "react-p5";
import p5Types from "p5"; 
import { drawMLP } from "./drawUtils";

type InterativeMLPType = {
    labelColor: string,
    mlpConfig: MLPConfig,
    intermediateValues: number[][],
    setMLPConfig: (m: MLPConfig) => void,
    width?: number,
    height?: number
};

export const InteractiveMLP: React.FC<InterativeMLPType> = ({
    labelColor,
    mlpConfig,
    intermediateValues,
    setMLPConfig,
    width = 1000,
    height = 500,
}) => {

	const setup = (p5: p5Types, canvasParentRef: Element) => {
		p5.createCanvas(width, height).parent(canvasParentRef);

        // set up rendering options
        p5.textFont('menlo')
        p5.textAlign('center', 'center')    
	};

	const [redraw, setRedraw] = useState(() => () => {})


    const draw = (p5: p5Types) => {
        p5.clear();

        drawMLP({
            p5: p5,
            mlpConfig: mlpConfig,
            canvasHeight: height,
            canvasWidth: width,
            intermediateValues: intermediateValues,
        });
        setRedraw(() => () => {
            p5.redraw();
        })
        p5.noLoop();
    };

    useEffect(() => {
        redraw()
    }, [mlpConfig, width, height])

    return (
        <div>
            <Sketch setup={setup} draw={draw} />;
        </div>
    );
}

export default InteractiveMLP