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
    const numInputs = mlpConfig.hiddenLayers[selectedNode.layer-1].weights.length;

    let calculations: WeightCalculation[] = [];
    const bias = mlpConfig.hiddenLayers[selectedNode.layer-1].biases[selectedNode.nodeIdx];
    let preActivation = bias;

    for (let inputIdx = 0; inputIdx < numInputs; inputIdx++) {
        const inputVal = forwardProp[selectedNode.layer-1][inputIdx];

        const weight = mlpConfig.hiddenLayers[selectedNode.layer-1].weights[inputIdx][selectedNode.nodeIdx]

        calculations.push({
            inputVal: inputVal | 0.0,
            weight: weight | 0.0,
        })

        preActivation += inputVal * weight;
    }

    return {
        numInputs: numInputs | 0,
        calculations: calculations,
        bias: bias | 0.0,
        preActivationOutput: preActivation | 0.0,
        postActivationOutput: forwardProp[selectedNode.layer][selectedNode.nodeIdx] | 0.0,
        activation: mlpConfig.hiddenLayers[selectedNode.layer - 1].activation
    }

}

