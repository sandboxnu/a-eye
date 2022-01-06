/* eslint-disable */
import { activations, ActivationType, addInput, addLayer, addNode, forwardPropagation, changeActivation, changeBias, changeWeight, isActivation, MLPConfig, removeInput, removeLayer, removeNode } from "./mlpConfig";
import React, { useState, useEffect } from "react";
import Sketch from "react-p5";
import p5Types from "p5";
import { calculateMLPDOMPlacements, drawMLP, DrawParams, MLPDOMPlacements, nodeAtPosn, weightLineColor } from "./drawUtils";
import { AddCircle, RemoveCircle } from "@material-ui/icons";
import { NodeIndex, NodeComputationSummary, generateNodeComputationSummary } from "./utils"
import { sgd } from "./learning";


const maxNumLayers = 4;
const maxNumNodes = 4;

const WeightInput = ({ layer, inNodeIdx, outNodeIdx, mlpConfig, setMLPConfig }) => {
    const borderColor = weightLineColor(inNodeIdx);

    return (
        <div>
            <input
                className="number-input w-16 border-2 border-indigo-500 hide-number-spinners"
                style={{
                    borderColor: `rgb(${borderColor.r},${borderColor.g},${borderColor.b})`,
                }}
                type="number"
                step="any"
                value={mlpConfig.hiddenLayers?.[layer]?.neurons?.[outNodeIdx]?.weights?.[inNodeIdx]}
                onChange={(e) => {
                    const val = parseFloat(e.target.value);

                    if (!val) return

                    setMLPConfig(changeWeight(mlpConfig, val, layer, outNodeIdx, inNodeIdx))
                }}
            />
        </div>
    )
}

const BiasInput = ({ layerIdx, nodeIdx, mlpConfig, setMLPConfig }) => {
    const borderColor = weightLineColor(nodeIdx);
    return (
        <div>
            <input
                className="number-input w-16  border-2"
                style={{
                    borderColor: `rgb(${borderColor.r},${borderColor.g},${borderColor.b})`,
                }}
                type="number"
                value={mlpConfig.hiddenLayers?.[layerIdx]?.neurons?.[nodeIdx]?.bias}
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


const InputNode = ({ inputIdx, inputs, setInputs }) => {
    const borderColor = weightLineColor(inputIdx);

    return (
        <div>
            <input
                className="rounded-full w-12 h-12 px-2 border-2"
                style={{
                    borderColor: `rgb(${borderColor.r},${borderColor.g},${borderColor.b})`,
                }}
                type="number"
                value={inputs?.[inputIdx]}
                onChange={(e) => {
                    const newVal = parseFloat(e.target.value);

                    if (!newVal) return



                    setInputs(inputs.map((val, idx) => (idx == inputIdx ? newVal : val)))
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
                onClick={() => {
                    if (mlpConfig.hiddenLayers.length >= maxNumLayers) return;

                    setMLPConfig(addLayer(mlpConfig))
                }}
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
                onClick={() => {
                    if (mlpConfig?.hiddenLayers?.[hiddenLayerIdx]?.neurons?.length >= maxNumNodes) return;

                    setMLPConfig(addNode(mlpConfig, hiddenLayerIdx))
                }
                }
            />
        </div>

    )
}

const AddRemoveInputButtons = ({ mlpConfig, setMLPConfig, inputs, setInputs }) => {
    return (
        <div className="flex flex-row items-center">
            <RemoveCircle
                className="icon-button"
                fontSize="large"
                onClick={() => {

                    if (inputs.length <= 1) return;

                    setInputs(inputs.slice(0, -1));
                    setMLPConfig(removeInput(mlpConfig))
                }

                }
            />
            <AddCircle
                className="icon-button"
                fontSize="large"
                onClick={() => {

                    if (mlpConfig.numInputs >= maxNumNodes) return;

                    setInputs(inputs.concat([0.0]))
                    setMLPConfig(addInput(mlpConfig))
                }}
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


const SGDDebug = ({ mlpConfig, setMLPConfig, labelColor }) => {
    const [output, setOutput] = useState<number>(0.7);

    let initialInputs: number[] = []
    for (let i = 0; i < mlpConfig.numInputs; i++) {
        initialInputs.push(1.0);
    }

    const [inputs, setInputs] = useState<number[]>(initialInputs);

    const runSGD = () => {
        setMLPConfig(sgd(mlpConfig, inputs, [output], 1.00))
    }

    return (
        <div>
            <p className={labelColor}>Inputs:</p>
            {inputs.map((_, inputIdx) => {
                return (
                    <input
                        className="rounded-full w-36 h-12 px-2 border-2"
                        key={`sgd-debug-input-${inputIdx}`}
                        type="number"
                        value={inputs?.[inputIdx]}
                        onChange={(e) => {
                            const newVal = parseFloat(e.target.value);

                            if (!newVal) return

                            setInputs(inputs.map((val, idx) => (idx == inputIdx ? newVal : val)))
                        }}
                    />)
            })}
            <p className={labelColor}>Output:</p>
            <input
                className="rounded-full w-36 h-12 px-2 border-2"
                type="number"
                value={output}
                onChange={(e) => {
                    const newVal = parseFloat(e.target.value);

                    if (!newVal) return;

                    setOutput(newVal);
                }}
            />


            <button onClick={runSGD} className={labelColor}>Run SGD</button>
        </div>
    )
}

/*
    This interactive demo has two rendering pipelines. First, a p5.js canvas is created. Here, all of the static drawings are created - the lines,
    the hidden nodes, etc. Next, we calculate where all of the HTML on top of this p5js canvas needs to be rendered - things like the
    input to the weights, inputs, or biases. These are then rendered using 'relative' overtop the canvas.
*/
type InterativeMLPType = {
    labelColor: string,
    mlpConfig: MLPConfig,
    setMLPConfig: (m: MLPConfig) => void,
    inputs: number[],
    setInputs: (inputs: number[]) => void,
    width?: number,
    height?: number
};

export const InteractiveMLP: React.FC<InterativeMLPType> = ({
    labelColor,
    mlpConfig,
    setMLPConfig,
    inputs,
    setInputs,
}) => {

    // magic sizes
    const width = window.innerWidth;
    const height = window.innerWidth / 1.8;

    // function which allows you to refresh the p5js canvas
    const [redraw, setRedraw] = useState(() => () => { });

    // if the user has selected a node by clicking it, it will be here
    const [selectedNode, setSelectedNode] = useState<NodeIndex>();

    // contains info about where to place inputs over the canvas; e.g., the
    // positions of all of the weight inputs.
    const [mlpDOMPlacements, setMLPDOMPlacements] = useState<MLPDOMPlacements>();

    const makeDrawParams = (p5: p5Types) => {
        return {
            p5: p5,
            mlpConfig: mlpConfig,
            canvasHeight: height,
            canvasWidth: width,
            forwardPropValues: forwardPropagation(mlpConfig, inputs), // optimization: TODO; keep intermediate values or config as state
            selectedNode: selectedNode,
            darkmode: labelColor == "text-modulePaleBlue",
        }
    }

    // p5js setup: initializes canvas
    const setup = (p5: p5Types, canvasParentRef: Element) => {
        p5.createCanvas(width, height).parent(canvasParentRef);

        // set up rendering options
        p5.textFont('menlo')
        p5.textAlign('center', 'center')

        // keep redraw function to allow force re-draw on prop change
        setRedraw(() => () => {
            p5.redraw();
        })
    };

    // p5js draw: renders the canvas & updates the mlpDOMPlacements
    const draw = (p5: p5Types) => {

        p5.clear(); // clear what was previously in the canvas (i.e. make canvas transparent)

        const drawParams = makeDrawParams(p5);
        drawMLP(drawParams); // draw into the p5 canvas
        setMLPDOMPlacements(calculateMLPDOMPlacements(drawParams)); // update where inputs/buttons are placed over the canvas

        p5.noLoop(); // only execute once instead of looping
    };

    // p5js mouseClicked: called when the user clicks on the canvas; updates selected node
    const mouseClicked = (p5: p5Types) => {

        const drawParams = makeDrawParams(p5)
        const clicked = nodeAtPosn(drawParams, {
            x: p5.mouseX,
            y: p5.mouseY,
        }) // clicked: undefined if the user did not click on a node, otherwise returns the selected node.

        // only update if clicked caused an update
        if (clicked || (!clicked && selectedNode)) {
            setSelectedNode(clicked);
            if (clicked && clicked.layer != 0) {
                setSelectedNodeComputationSummary(generateNodeComputationSummary(mlpConfig, drawParams.forwardPropValues, clicked))
            } else {
                setSelectedNodeComputationSummary(undefined)
            }
        }

    };

    // if anything changes, force p5js to draw the canvas again.
    useEffect(() => {
        redraw();
    }, [mlpConfig, inputs, width, height, selectedNode])

    // if the user has selected a node, we should compute the computation summary and display it
    const [selectedNodeComputationSummary, setSelectedNodeComputationSummary] = useState<NodeComputationSummary>();



    return (
        <div>
            {
                mlpDOMPlacements && // draw inputs/buttons/etc. at their appropriate locations according to mlpDOMPlacements

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
                                    inputs={inputs}
                                    setInputs={setInputs}
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
                                key={`activation-${placement.hiddenLayerIdx}`}
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
                            inputs={inputs}
                            setInputs={setInputs}
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

            {/* p5.js canvas */}
            <Sketch setup={setup} draw={draw} mouseClicked={mouseClicked} />

            {
                selectedNode && selectedNodeComputationSummary && (
                    <div>
                        <p className={`${labelColor} text-xl`}>How was this node computed?</p>
                        <p className={`${labelColor}`}>
                            {selectedNodeComputationSummary.calculations.map((calc, i) => `${calc.inputVal.toFixed(2)}*${calc.weight.toFixed(1)}`).reduce((state, newVal) => state + (state == "" ? "" : " + ") + newVal, "")} + {selectedNodeComputationSummary.bias.toFixed(1)} = {selectedNodeComputationSummary.preActivationOutput.toFixed(1)}
                        </p>
                        <p className={`${labelColor}`}>
                            {selectedNodeComputationSummary.activation}({selectedNodeComputationSummary.preActivationOutput.toFixed(1)}) = {selectedNodeComputationSummary.postActivationOutput.toFixed(1)}
                        </p>
                    </div>)
            }

            <div>
                <SGDDebug mlpConfig={mlpConfig} setMLPConfig={setMLPConfig} labelColor={labelColor } />

            </div>
        </div >
    );
}

export default InteractiveMLP