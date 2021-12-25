/* eslint-disable */

import { HiddenLayer, MLPConfig } from "./mlpConfig";


export type NeuronGradient = {
    weightGrads: number[],
    biasGrad: number,
}

export type LayerGradients = {
    neuronGradients: NeuronGradient[],
}

export type GradientTable = {
    layerGradients: LayerGradients[],
}


// calculate the gradient table for the model
export const backProp = (mlpConfig: MLPConfig, inputs: number[][], outputs: number[][]): GradientTable => {
    return {
        layerGradients: [],
    }
}

// sgd on a single data point
export const sgd = (mlpConfig: MLPConfig, inputs: number[], outputs: number[], lr: number): MLPConfig => {
    return batchSGD(mlpConfig, [inputs], [outputs], lr);
}


// sgd on many data points
export const batchSGD = (mlpConfig: MLPConfig, inputs: number[][], outputs: number[][], lr: number): MLPConfig => {
    // compute the gradients
    const gradTable = backProp(mlpConfig, inputs, outputs);

    // simply move all weights/biases according to gradient naively
    return {
        numInputs: mlpConfig.numInputs,
        hiddenLayers: mlpConfig.hiddenLayers.map((oldLayer: HiddenLayer, layerIdx: number): HiddenLayer => {
            const layerGrads = gradTable.layerGradients[layerIdx];

            return {
                // transform all neurons
                neurons: oldLayer.neurons.map((neuron, neuronIdx) => {
                    const neuronGrads = layerGrads.neuronGradients[neuronIdx];
                    return {
                        // move weights and biases according to gradient.
                        weights: neuron.weights.map((weight, weightIdx) => {
                            return weight - lr * neuronGrads.weightGrads[weightIdx];
                        }),
                        bias: neuron.bias - lr * neuronGrads.biasGrad,
                    }
                }),
                activation: oldLayer.activation,
            }
        })
    }
}