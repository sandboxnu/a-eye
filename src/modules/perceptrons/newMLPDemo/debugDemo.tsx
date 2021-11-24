/* eslint-disable */
import { MLPConfig, defaultMLPConfig, ActivationType, isActivation, activations } from "./mlpConfig"
import React, { useState, useEffect } from "react";

type MLPDebugType = {
    labelColor: string,
    mlpConfig: MLPConfig,
    setMLPConfig: any,
    intermediateValues: number[][],
    updateWeight: any,
    updateBias: any,
    updateInput: any,
    updateAddLayer: any,
    updateRemoveLayer: any,
    updateActivation: any,
    updateAddNode: any,
    updateRemoveNode: any
}

export const MLPDebug: React.FC<MLPDebugType> = ({
    labelColor,
    mlpConfig,
    setMLPConfig,
    intermediateValues,
    updateWeight,
    updateBias,
    updateInput,
    updateAddLayer,
    updateRemoveLayer,
    updateActivation,
    updateAddNode,
    updateRemoveNode }) => {
    const [layerToChange, setLayerToChange] = useState(0)
    const [weightInToChange, setWeightInToChange] = useState(0)
    const [weightOutToChange, setWeightOutToChange] = useState(0)
    const [biasToChange, setBiasToChange] = useState(0)
    const [inputToChange, setInputToChange] = useState(0)

    const [weightValue, setWeightValue] = useState(0.0)
    const [biasValue, setBiasValue] = useState(0.0)
    const [inputValue, setInputValue] = useState(0.0)

    const [activation, setActivation] = useState<ActivationType>('none')

    return (
        <div className={labelColor}>
            <p className="text-3xl text-left mx-3">DEBUG</p>

            <p className="text-xl text-left mx-3 mt-6">MLP Config</p>
            <div className="flex flex-row">
                <div className="flex flex-col mx-3">
                    <p>Input Layer</p>
                    <br/>
                    <div className="flex flex-col">
                        {mlpConfig.inputs.map((input, i) => <p className="mx-3" key={`-input-${i}`}>{input}</p>)}
                    </div>
                </div>

                {mlpConfig.hiddenLayers.map((layer, i) => {
                    return (
                        <div className="flex flex-col mx-3" key={`layer-${i}`}>
                            <p>Layer {i}</p>
                            <p>{layer.activation} </p>
                            {layer.weights.map(((weights, j) =>
                                <div className="flex flex-row" key={`layer-${i}-weight-${j}`}>
                                    <p className="mx-3">w (inp {j}):</p>
                                    {weights.map((weight, k) => <p className="mx-3" key={`layer-${i}-weight-${j}-${k}`}>{weight} </p>)}
                                </div>
                            ))}

                            <div className="flex flex-row">
                                <p className="mr-3">b: </p>
                                {layer.biases.map((bias, j) => <p className="mx-3" key={`layer-${i}-bias-${j}`}>{bias} </p>)}
                            </div>
                        </div>
                    )
                })}
            </div>

            <p className="text-xl text-left mx-3 mt-6">Intermediary Values</p>
            <div className="flex flex-row">
                {intermediateValues.map((layerValues, i) => {
                    return (
                        <div className="flex flex-col mx-3" key={`layer-${i}`}>
                            <p>{i ==mlpConfig.hiddenLayers.length-1?"Output":`Post-Layer ${i}`}</p>

                            <div className="flex flex-row">
                                {layerValues.map((bias, j) => <p className="mx-3" key={`layer-${i}-bias-${j}`}>{bias} </p>)}
                            </div>
                        </div>
                    )
                })}
            </div>


            <p className="text-xl text-left mx-3 mt-6">Controls</p>
            <div className="flex flex-row">
                <div>
                    <button onClick={() => setMLPConfig(defaultMLPConfig)} className="mx-3">Reset</button>

                    <button onClick={() => updateAddLayer()} className="mx-3">Add Layer</button>
                    <button onClick={() => updateRemoveLayer()} className="mx-3">Remove Layer</button>

                    <div className="flex flex-row">
                        <button onClick={() => updateAddNode(layerToChange)} className="mx-3">Add Node</button>
                        <button onClick={() => updateRemoveNode(layerToChange)} className="mx-3">Remove Node</button>
                    </div>

                    <div className="flex flex-row mx-3">
                        <button onClick={() => updateInput(inputValue, inputToChange)}>Update Input</button>
                        <div className="w-3"><input value={inputValue} onChange={(e) => setInputValue(parseFloat(e.target.value) ? parseFloat(e.target.value) : 0.0)} /></div>
                    </div>

                    <div className="flex flex-row mx-3">
                        <button onClick={() => updateWeight(weightValue, layerToChange, weightInToChange, weightOutToChange)}>Update Weight</button>
                        <div className="w-3"><input value={weightValue} onChange={(e) => setWeightValue(parseFloat(e.target.value) ? parseFloat(e.target.value) : 0.0)} /></div>
                    </div>

                    <div className="flex flex-row mx-3">
                        <button onClick={() => updateBias(biasValue, layerToChange, biasToChange)}>Update Bias</button>
                        <div className="w-3"><input value={biasValue} onChange={(e) => setBiasValue(parseFloat(e.target.value) ? parseFloat(e.target.value) : 0.0)} /></div>
                    </div>

                    <div className="flex flex-row mx-3">
                        <button onClick={() => updateActivation(activation, layerToChange)}>Update Activation</button>
                        <div className="w-3">
                            <select value={activation} onChange={(e) => setActivation((isActivation(e.target.value) ? e.target.value : activation))} >
                                {
                                    activations.map((activation, i) =>
                                        <option key={`activation-${i}`}>{activation}</option>
                                    )
                                }
                            </select>
                        </div>
                    </div>

                    <p className="mx-3">Indices:</p>

                    <div className="flex flex-row mx-3">
                        <p>Layer</p>
                        <div className="w-3"><input value={layerToChange} onChange={(e) => setLayerToChange(parseInt(e.target.value) ? parseInt(e.target.value) : 0)} /></div>
                    </div>

                    <div className="flex flex-row mx-3">
                        <p>Weight [input]</p>
                        <div className="w-3"><input value={weightInToChange} onChange={(e) => setWeightInToChange(parseInt(e.target.value) ? parseInt(e.target.value) : 0)} /></div>
                    </div>
                    <div className="flex flex-row mx-3">
                        <p>Weight [output]</p>
                        <div className="w-3"><input value={weightOutToChange} onChange={(e) => setWeightOutToChange(parseInt(e.target.value) ? parseInt(e.target.value) : 0)} /></div>
                    </div>

                    <div className="flex flex-row mx-3">
                        <p>Bias [output]</p>
                        <div className="w-3"><input value={biasToChange} onChange={(e) => setBiasToChange(parseInt(e.target.value) ? parseInt(e.target.value) : 0)} /></div>
                    </div>

                    <div className="flex flex-row mx-3">
                        <p>Input</p>
                        <div className="w-3"><input value={inputToChange} onChange={(e) => setInputToChange(parseInt(e.target.value) ? parseInt(e.target.value) : 0)} /></div>
                    </div>


                </div>
            </div>

        </div>
    );
}


export default MLPDebug;