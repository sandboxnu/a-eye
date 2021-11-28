/* eslint-disable */
import { activations, ActivationType, addInput, addLayer, addNode, calculateIntermediateValues, changeActivation, changeBias, changeInput, changeWeight, isActivation, MLPConfig, removeInput, removeLayer, removeNode } from "./mlpConfig";
import React, { useState, useEffect } from "react";
import Sketch from "react-p5";
import p5Types from "p5";
import { calculateMLPDOMPlacements, DrawConfig, drawMLP, MLPDOMPlacements, nodeAtPosn, NodeIndex } from "./drawUtils";
import { AddCircle, RemoveCircle } from "@material-ui/icons";


const WeightInput = ({ layer, inNodeIdx, outNodeIdx, mlpConfig, setMLPConfig }) => {
    return (
        <div>
            <input
                className="number-input w-16  border-2 border-teal-700 hide-number-spinners"
                type="number"
                step="any"
                value={mlpConfig.hiddenLayers?.[layer]?.weights?.[inNodeIdx]?.[outNodeIdx]}
                onChange={(e) => {
                    const val = parseFloat(e.target.value);

                    if (!val) return

                    setMLPConfig(changeWeight(mlpConfig, val, layer, inNodeIdx, outNodeIdx))
                }}
            />
        </div>
    )
}

const BiasInput = ({ layerIdx, nodeIdx, mlpConfig, setMLPConfig }) => {
    return (
        <div>
            <input
                className="number-input w-16  border-2 border-teal-700"
                type="number"
                value={mlpConfig.hiddenLayers?.[layerIdx]?.biases?.[nodeIdx]}
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


const InputNode = ({ inputIdx, mlpConfig, setMLPConfig }) => {
    return (
        <div>
            <input
                className="rounded-full w-12 h-12 px-2 border-2 border-teal-700"
                type="number"
                value={mlpConfig.inputs?.[inputIdx]}
                onChange={(e) => {
                    const val = parseFloat(e.target.value);

                    if (!val) return

                    setMLPConfig(changeInput(mlpConfig, val, inputIdx))
                }}
            />
        </div>
    )
}



const AddRemoveLayerButtons = ({ labelColor, mlpConfig, setMLPConfig }) => {
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


const AddRemoveNodeButtons = ({ hiddenLayerIdx, mlpConfig, setMLPConfig }) => {
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

const AddRemoveInputButtons = ({ mlpConfig, setMLPConfig }) => {
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

const ActivationFunctionSelector = ({ layerIdx, mlpConfig, setMLPConfig }) => {
    const currActivation = mlpConfig.hiddenLayers?.[layerIdx]?.activation;
    return (
        <div className="">
            <select value={currActivation} onChange={(e) => {
                const selected = e.target.value;

                if (isActivation(selected)) {
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


/*
    This interactive demo has two rendering pipelines. First, a p5.js canvas is created. Here, all 'drawings' are created - the lines,
    the hidden nodes, etc. Next, we calculate where all of the HTML on top of this p5js canvas needs to be rendered - things like the
    input to the weights, inputs, or biases. These are then rendered using 'relative' overtop the canvas.
*/
type InterativeMLPType = {
    labelColor: string,
    mlpConfig: MLPConfig,
    setMLPConfig: (m: MLPConfig) => void,
    width?: number,
    height?: number
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
    const [mlpDOMPlacements, setMLPDOMPlacements] = useState<MLPDOMPlacements>()

    const divRef = React.createRef<HTMLDivElement>();




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


        p5.clear();

        const config = {
            p5: p5,
            mlpConfig: mlpConfig,
            canvasHeight: height,
            canvasWidth: width,
            intermediateValues: calculateIntermediateValues(mlpConfig),
            selectedNode: selectedNode,
        };

        drawMLP(config);
        setMLPDOMPlacements(calculateMLPDOMPlacements(config));

        p5.noLoop();
    };

    const mouseClicked = (p5: p5Types) => {
        if (!canvasElm) return;

        const config = {
            p5: p5,
            mlpConfig: mlpConfig,
            canvasHeight: height,
            canvasWidth: width,
            intermediateValues: [], // optimization: TODO; keep intermediate values or config as state
            selectedNode: selectedNode,
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
            {
                mlpDOMPlacements &&

                <div className="w-0 h-0">

                    {mlpDOMPlacements.weightInputs.map((placement) => {
                        return (
                            <div style={{
                                position: 'relative',
                                left: placement.posn.x,
                                top: placement.posn.y
                            }}
                                className="h-0"
                                key={`weights-layer-${placement.layer}-in-${placement.inNodeIdx}-out-${placement.outNodeIdx}`}
                            >
                                <WeightInput
                                    layer={placement.layer}
                                    inNodeIdx={placement.inNodeIdx}
                                    outNodeIdx={placement.outNodeIdx}
                                    mlpConfig={mlpConfig}
                                    setMLPConfig={setMLPConfig}
                                />
                            </div>)
                    })}

                    {mlpDOMPlacements.inputNodes.map((placement) => {
                        return (
                            <div style={{
                                position: 'relative',
                                left: placement.posn.x,
                                top: placement.posn.y
                            }}
                                className="h-0"
                                key={`input-node-${placement.inputIdx}`}
                            >
                                <InputNode
                                    inputIdx={placement.inputIdx}
                                    mlpConfig={mlpConfig}
                                    setMLPConfig={setMLPConfig}
                                />
                            </div>)
                    })}

                    {mlpDOMPlacements.addRemoveNode.map((placement) => {
                        return (
                            <div style={{
                                position: 'relative',
                                left: placement.posn.x,
                                top: placement.posn.y
                            }}
                                className="h-0"
                                key={`add-remove-node-${placement.hiddenLayerIdx}`}
                            >
                                <AddRemoveNodeButtons
                                    hiddenLayerIdx={placement.hiddenLayerIdx}
                                    mlpConfig={mlpConfig}
                                    setMLPConfig={setMLPConfig}
                                />
                            </div>)
                    })}

                    {mlpDOMPlacements.activationInputs.map((placement) => {
                        return (
                            <div style={{
                                position: 'relative',
                                left: placement.posn.x,
                                top: placement.posn.y
                            }}
                                className="h-0"
                                key={`add-remove-node-${placement.hiddenLayerIdx}`}
                            >
                                <ActivationFunctionSelector
                                    layerIdx={placement.hiddenLayerIdx}
                                    mlpConfig={mlpConfig}
                                    setMLPConfig={setMLPConfig}
                                />
                            </div>)
                    })}


                    {mlpDOMPlacements.biasInputs.map((placement) => {
                        return (
                            <div style={{
                                position: 'relative',
                                left: placement.posn.x,
                                top: placement.posn.y
                            }}
                                className="h-0"
                                key={`bias-inputs-${placement.hiddenLayerIdx}-${placement.nodeIdx}`}
                            >
                                <BiasInput
                                    layerIdx={placement.hiddenLayerIdx}
                                    nodeIdx={placement.nodeIdx}
                                    mlpConfig={mlpConfig}
                                    setMLPConfig={setMLPConfig}
                                />
                            </div>)
                    })}

                    <div style={{
                        position: 'relative',
                        left: mlpDOMPlacements.addRemoveInput.x,
                        top: mlpDOMPlacements.addRemoveInput.y
                    }}
                        className="h-0"
                    >
                        <AddRemoveInputButtons
                            mlpConfig={mlpConfig}
                            setMLPConfig={setMLPConfig}
                        />
                    </div>

                    <div style={{
                        position: 'relative',
                        left: mlpDOMPlacements.addRemoveLayer.x,
                        top: mlpDOMPlacements.addRemoveLayer.y
                    }}
                        className="h-0"
                    >
                        <AddRemoveLayerButtons
                            labelColor={labelColor}
                            mlpConfig={mlpConfig}
                            setMLPConfig={setMLPConfig}
                        />
                    </div>

                </div>
            }

            <Sketch setup={setup} draw={draw} mouseClicked={mouseClicked} />
        </div >
    );
}

export default InteractiveMLP