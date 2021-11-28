/* eslint-disable */
import { activations, ActivationType, addInput, addLayer, addNode, calculateIntermediateValues, changeActivation, changeBias, changeInput, changeWeight, isActivation, MLPConfig, removeInput, removeLayer, removeNode } from "./mlpConfig";
import React, { useState, useEffect } from "react";
import Sketch from "react-p5";
import p5Types from "p5";
import { DrawConfig, drawMLP, nodeAtPosn, NodeIndex } from "./drawUtils";
import { AddCircle, RemoveCircle } from "@material-ui/icons";



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
    width = 1800,
    height = 1000,
}) => {

    const [redraw, setRedraw] = useState(() => () => { })
    const [canvasElm, setCanvasElm] = useState<p5Types.Element>()
    const [selectedNode, setSelectedNode] = useState<NodeIndex>()

    const divRef = React.createRef<HTMLDivElement>();

    // -------------------- JSX for inputs --------------------
    const createBiasInput = (layerIdx: number, nodeIdx: number): JSX.Element => {
        return ( 
            <div>
                <input
                    className="number-input w-16  border-2 border-teal-700"
                    type="number"
                    value={mlpConfig.hiddenLayers[layerIdx].biases[nodeIdx]}
                    onChange={(e) => {
                        let val = parseFloat(e.target.value);

                        if (e.target.value === "") {
                            val = 0.0
                        }
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

    const createWeightInput = (layer: number, inNodeIdx: number, outNodeIdx: number): JSX.Element => {
        return (
            <div>
                <input
                    className="number-input w-16  border-2 border-teal-700 hide-number-spinners"
                    type="number"
                    step="any"
                    value={mlpConfig.hiddenLayers[layer].weights[inNodeIdx][outNodeIdx]}
                    onChange={(e) => {
                        const val = parseFloat(e.target.value);

                        if (!val) return

                        setMLPConfig(changeWeight(mlpConfig, val, layer, inNodeIdx, outNodeIdx))
                    }}
                />
            </div>
        )
    }

    const createAddRemoveLayerButtons = (): JSX.Element => {
        return (
            <div className="flex flex-row items-center">
                <RemoveCircle
                    className="icon-button"
                    fontSize="large"
                    onClick={() => setMLPConfig(removeLayer(mlpConfig))}
                />
                <p className={`w-30 m-2 ${labelColor}`}>{mlpConfig.hiddenLayers.length} layer(s)</p>
                <AddCircle
                    className="icon-button"
                    fontSize="large"
                    onClick={() => setMLPConfig(addLayer(mlpConfig))}
                />
            </div>

        )
    }


    const createAddRemoveNodeButtons = (hiddenLayerIdx: number): JSX.Element => {
        return (
            <div className="flex flex-row items-center">
                <RemoveCircle
                    className="icon-button"
                    fontSize="large"
                    onClick={() => setMLPConfig(removeNode(mlpConfig, hiddenLayerIdx))}
                />
                <AddCircle
                    className="icon-button"
                    fontSize="large"
                    onClick={() => setMLPConfig(addNode(mlpConfig, hiddenLayerIdx))}
                />
            </div>

        )
    }

    const createAddRemoveInputButtons = (): JSX.Element => {
        return (
            <div className="flex flex-row items-center">
                <RemoveCircle
                    className="icon-button"
                    fontSize="large"
                    onClick={() => setMLPConfig(removeInput(mlpConfig))}
                />
                <AddCircle
                    className="icon-button"
                    fontSize="large"
                    onClick={() => setMLPConfig(addInput(mlpConfig))}
                />
            </div>

        )
    }

    const createActivationFunctionSelector = (layerIdx: number): JSX.Element => {
        const currActivation = mlpConfig.hiddenLayers[layerIdx].activation;
        return (
            <div className="">
                <select value={currActivation} onChange={(e) => {
                    const selected = e.target.value;

                    if (isActivation(selected)){
                        setMLPConfig(changeActivation(mlpConfig, selected, layerIdx));
                    } 
                 }} >
                    {
                        activations.map((activation, i) =>
                            <option key={`activation-${i}`}>{activation}</option>
                        )
                    }
                </select>
            </div>

        )
    }


    // -------------------- p5 functions --------------------
    const setup = (p5: p5Types, canvasParentRef: Element) => {
        const elm = p5.createCanvas(width, height).parent(canvasParentRef);

        // set up rendering options
        p5.textFont('menlo')
        p5.textAlign('center', 'center')
        setRedraw(() => () => {
            p5.redraw();
        })
        setCanvasElm(elm)
    };


    const draw = (p5: p5Types) => {
        if (!canvasElm) return;
        // remove all of the div ref's children
        // TODO: make this more intelligent
        if (divRef.current) {
            while (divRef.current.firstChild) {
                divRef.current.removeChild(divRef.current.firstChild);
            }
        }


        p5.clear();

        const config = {
            p5: p5,
            canvasEltDivRef: divRef,
            canvas: canvasElm,
            mlpConfig: mlpConfig,
            canvasHeight: height,
            canvasWidth: width,
            intermediateValues: calculateIntermediateValues(mlpConfig),
            selectedNode: selectedNode,
            inputs: {
                biasInput: createBiasInput,
                inputNode: createInputNode,
                weightInput: createWeightInput,
                addRemoveLayerButtons: createAddRemoveLayerButtons,
                addRemoveNodeButtons: createAddRemoveNodeButtons,
                addRemoveInputButtons: createAddRemoveInputButtons,
                activationFunctionSelector: createActivationFunctionSelector,
            }
        };

        drawMLP(config);

        p5.noLoop();
    };

    const mouseClicked = (p5: p5Types) => {
        if (!canvasElm) return;

        const config = {
            p5: p5,
            canvasEltDivRef: divRef,
            canvas: canvasElm,
            mlpConfig: mlpConfig,
            canvasHeight: height,
            canvasWidth: width,
            intermediateValues: [], // optimization: TODO; keep intermediate values or config as state
            selectedNode: selectedNode,
            inputs: {
                biasInput: createBiasInput,
                inputNode: createInputNode,
                weightInput: createWeightInput,
                addRemoveLayerButtons: createAddRemoveLayerButtons,
                addRemoveNodeButtons: createAddRemoveNodeButtons,
                addRemoveInputButtons: createAddRemoveInputButtons,
                activationFunctionSelector: createActivationFunctionSelector,
            }
        }

        const clicked = nodeAtPosn(config, {
            x: p5.mouseX,
            y: p5.mouseY,
        })

        // only update if clicked caused an update
        if (clicked || (!clicked && selectedNode)) {
            setSelectedNode(clicked);
        }

    };

    // if anything changes, force a refresh
    useEffect(() => {
        redraw();
    }, [mlpConfig, width, height, selectedNode])

    return (
        <div>
            {/* 
            
            TODO: Use fixed popup to show how "selectedNode" is being computed.
            <div className="fixed bottom-0">
                <div className="m-5 rounded-md border-2 w-20 h-20">
                    Test
                </div>
            </div> */}
            <div ref={divRef} className="w-0 h-0"></div>
            <Sketch setup={setup} draw={draw} mouseClicked={mouseClicked} />
        </div>
    );
}

export default InteractiveMLP