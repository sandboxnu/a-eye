/* eslint-disable */
import { ActivationType, addLayer, addNode, calculateIntermediateValues, changeActivation, changeBias, changeInput, changeWeight, MLPConfig, removeLayer, removeNode } from "./mlpConfig";
import React, { useState, useEffect } from "react";
import Sketch from "react-p5";
import p5Types from "p5";
import { drawMLP } from "./drawUtils";

type InterativeMLPType = {
    labelColor: string,
    mlpConfig: MLPConfig,
    setMLPConfig: (m: MLPConfig) => void,
    width?: number,
    height?: number
    id?: string,
};

export const InteractiveMLP: React.FC<InterativeMLPType> = ({
    labelColor,
    mlpConfig,
    setMLPConfig,
    width = 1000,
    height = 500,
    id = "default",
}) => {

    const [redraw, setRedraw] = useState(() => () => { })
    const [canvasElm, setCanvasElm] = useState<p5Types.Element>()

    const divID = "interatve-mlp-elts-" + id;

    const setup = (p5: p5Types, canvasParentRef: Element) => {
        const elm = p5.createCanvas(width, height).parent(canvasParentRef);
        setCanvasElm(elm);

        // set up rendering options
        p5.textFont('menlo')
        p5.textAlign('center', 'center')
    };


    const createBiasInput = (layerIdx: number, nodeIdx: number): JSX.Element => {
        return (
            <div>
                <input
                    className="number-input w-12  border-2 border-teal-700"
                    type="number"
                    value={mlpConfig.hiddenLayers[layerIdx].biases[nodeIdx]}
                    onChange={(e) => {
                        const val = parseFloat(e.target.value);

                        if (!val) return

                        setMLPConfig(changeBias(mlpConfig, val, layerIdx, nodeIdx))
                    }}
                />
            </div>
        )
    }


    const createInputNode = (inputIdx: number): JSX.Element => {
        return (
            <div>
                <input
                    className="rounded-full w-12 h-12 px-2 border-2 border-teal-700"
                    type="number"
                    value={mlpConfig.inputs[inputIdx]}
                    onChange={(e) => {
                        const val = parseFloat(e.target.value);

                        if (!val) return

                        setMLPConfig(changeInput(mlpConfig, val, inputIdx))
                    }}
                />
            </div>
        )
    }

    const draw = (p5: p5Types) => {
        if (!canvasElm) return;

        p5.clear();

        drawMLP({
            p5: p5,
            parentDivID: divID,
            canvas: canvasElm,
            mlpConfig: mlpConfig,
            canvasHeight: height,
            canvasWidth: width,
            intermediateValues: calculateIntermediateValues(mlpConfig),
            inputs: {
                biasInput: createBiasInput,
                inputNode: createInputNode,
            }
        });
        setRedraw(() => () => {
            p5.redraw();
        })
        p5.noLoop();
    };

    useEffect(() => {
        // remove all of the 
        const elmParent = document.getElementById(divID);
        if (elmParent) {
            while (elmParent.firstChild) {
                elmParent.removeChild(elmParent.firstChild);
            }
        }


        redraw();


    }, [mlpConfig, width, height])

    return (
        <div>
            <div id={divID} className="w-0 h-0"></div>
            <Sketch setup={setup} draw={draw} />
        </div>
    );
}

export default InteractiveMLP