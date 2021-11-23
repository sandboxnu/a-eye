/* eslint-disable */
import { InputSharp } from "@material-ui/icons";
import { max, exp } from "mathjs";
import { OldPlugin } from "postcss";
import React, { useState, useEffect } from "react";
import MLPDebug from "./debugDemo";
import { MLPConfig, applyActivation, ActivationType, changeInput, changeWeight, changeBias, changeActivation, addLayer, removeLayer, addNode, removeNode, isActivation, activations } from "./mlpConfig"


// calculates the values at each layer given the mlpConfig's inputs: first hidden layer at idx 0,
// and so on.
let calculateIntermediateValues = (mlpConfig: MLPConfig): number[][] => {
    let intermediateValues: number[][] = []

    mlpConfig.layers.forEach((layer, i) => {
        let prevLayer: number[] = []

        if (i == 0) {
            prevLayer = mlpConfig.inputs
        } else {
            prevLayer = intermediateValues[i - 1]
        }

        let numOutputs = layer.biases.length
        let numInputs = layer.weights.length

        let layerOutputs: number[] = []

        for (let outputIdx = 0; outputIdx < numOutputs; outputIdx++) {
            let output = layer.biases[outputIdx]

            for (let inputIdx = 0; inputIdx < numInputs; inputIdx++) {
                output += layer.weights[inputIdx][outputIdx] * prevLayer[inputIdx]
            }

            output = applyActivation(output, layer.activation)

            layerOutputs.push(output)
        }

        intermediateValues.push(layerOutputs)
    })

    return intermediateValues;
}

const defaultMLPConfig: MLPConfig = {
    inputs: [1.0, 1.0],
    layers: [
        {
            weights: [
                [1.0, 1.0, 1.0],
                [1.0, 1.0, 1.0],
            ],
            biases: [
                1.0, 1.0, 1.0,
            ],
            activation: 'relu',
        },
        {
            weights: [
                [1.0],
                [1.0],
                [1.0],
            ],
            biases: [
                1.0
            ],
            activation: 'relu',
        },
    ],
}

type MLPDemoType = {
    labelColor: string,
    initialMLPConfig?: MLPConfig,
}

export const MLPDemo: React.FC<MLPDemoType> = ({
    labelColor,
    initialMLPConfig,
}) => {
    if (!initialMLPConfig) {
        initialMLPConfig = defaultMLPConfig
    }


    const [mlpConfig, setMLPConfig] = useState(initialMLPConfig);
    const [intermediateValues, setIntermediateValues] = useState<number[][]>([])

    useEffect(() => {
        console.log(mlpConfig)

        setIntermediateValues(calculateIntermediateValues(mlpConfig))
    }, [mlpConfig])


    const updateInput = (newInput: number, idxToChange: number) => {
        setMLPConfig(changeInput(mlpConfig, newInput, idxToChange))
    }

    const updateWeight = (newWeight: number, layerIdx: number, inputWeightIdx: number, outputWeightIdx: number) => {
        setMLPConfig(changeWeight(mlpConfig, newWeight, layerIdx, inputWeightIdx, outputWeightIdx))
    }

    const updateBias = (newBias: number, layerIdx: number, biasIdx: number) => {
        setMLPConfig(changeBias(mlpConfig, newBias, layerIdx, biasIdx))
    }

    const updateActivation = (newActivation: ActivationType, layerIdx: number) => {
        setMLPConfig(changeActivation(mlpConfig, newActivation, layerIdx))
    }

    const updateAddLayer = () => {
        setMLPConfig(addLayer(mlpConfig))
    }

    const updateRemoveLayer = () => {
        setMLPConfig(removeLayer(mlpConfig))
    }

    const updateAddNode = (layerIdx: number) => {
        setMLPConfig(addNode(mlpConfig, layerIdx))
    }

    const updateRemoveNode = (layerIdx: number) => {
        setMLPConfig(removeNode(mlpConfig, layerIdx))
    }

    return (
        <MLPDebug 
            labelColor={labelColor}
            mlpConfig={mlpConfig}
            setMLPConfig={setMLPConfig}
            intermediateValues={intermediateValues}
            updateWeight={updateWeight}
            updateBias={updateBias}
            updateInput={updateInput}
            updateAddLayer={updateAddLayer}
            updateRemoveLayer={updateRemoveLayer}
            updateActivation={updateActivation}
            updateAddNode={updateAddNode}
            updateRemoveNode={updateRemoveNode}
        />
    )
};

export default MLPDemo;
