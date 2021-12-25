/* eslint-disable */
import {  ActivationType, MLPConfig } from "./mlpConfig";


type WeightCalculation = {
    inputVal: number,
    weight: number
}

export type NodeComputationSummary = {
    numInputs: number,
    calculations: WeightCalculation[],
    bias: number,
    preActivationOutput: number,
    postActivationOutput: number,
    activation: ActivationType
}
 
export type NodeIndex = {
    layer: number,
    nodeIdx: number,
}

export const generateNodeComputationSummary = (mlpConfig: MLPConfig, forwardProp: number[][], selectedNode: NodeIndex): NodeComputationSummary => {
    const numInputs = mlpConfig.hiddenLayers[selectedNode.layer-1].neurons[selectedNode.nodeIdx].weights.length;

    let calculations: WeightCalculation[] = [];
    const bias = mlpConfig.hiddenLayers[selectedNode.layer-1].neurons[selectedNode.nodeIdx].bias;
    let preActivation = bias;

    for (let inputIdx = 0; inputIdx < numInputs; inputIdx++) {
        const inputVal = forwardProp[selectedNode.layer-1][inputIdx];

        const weight = mlpConfig.hiddenLayers[selectedNode.layer-1].neurons[selectedNode.nodeIdx].weights[inputIdx]

        calculations.push({
            inputVal: inputVal,
            weight: weight,
        })

        preActivation += inputVal * weight;
    }

    return {
        numInputs: numInputs ,
        calculations: calculations,
        bias: bias,
        preActivationOutput: preActivation ,
        postActivationOutput: forwardProp[selectedNode.layer][selectedNode.nodeIdx],
        activation: mlpConfig.hiddenLayers[selectedNode.layer - 1].activation
    }

}

