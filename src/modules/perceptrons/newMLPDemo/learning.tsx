/* eslint-disable */

import { ActivationType, applyActivationDerivative, forwardPropagation, HiddenLayer, MLPConfig, Neuron } from "./mlpConfig";


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

const mseGradient = (expectedOutputs: number[], computedOutputs: number[]): number[] => {
    return expectedOutputs.map((expectedOutput, i) => {
        return 2 * (computedOutputs[i] - expectedOutput);
    });
}

const activationGradient = (outputs: number[], activation: ActivationType): number[] => {
        return outputs.map((val, i) => val * applyActivationDerivative(val, activation));
}

// calculate the gradient table for the model
export const backProp = (mlpConfig: MLPConfig, inputs: number[], expectedOutputs: number[]): GradientTable => {

    const forwardProp: number[][] = forwardPropagation(mlpConfig, inputs)
    const actualOutputs: number[] = forwardProp[forwardProp.length - 1];

    let lastLayerOutputGradients: number[] = mseGradient(expectedOutputs, actualOutputs)

    let layerGradients: LayerGradients[] = []

    for (let i = mlpConfig.hiddenLayers.length-1; i >= 0; i--) {
        let layer: HiddenLayer = mlpConfig.hiddenLayers[i];
        let layerForwardProp: number[] = forwardProp[i];

        let preActivationGrads: number[] = activationGradient(lastLayerOutputGradients, layer.activation);

        const nextLayerForwardProp: number[] = forwardProp[i]; // forward prop starts with inputs, so we just need to get ith to get prev layer

        const neuronGrads: NeuronGradient[] = layer.neurons.map((neuron, k) => {
            let neuronOverallGrad = preActivationGrads[k];

            const biasGrad = neuronOverallGrad;
            const weightGrads = neuron.weights.map((weight, w) => {
                return nextLayerForwardProp[w] * neuronOverallGrad; 
            })

            return {
                weightGrads: weightGrads,
                biasGrad: biasGrad,
            }
        })

        layerGradients.unshift({
            neuronGradients: neuronGrads,
        })

        lastLayerOutputGradients = nextLayerForwardProp.map((_, k) => {
            let sum: number = 0.0
            layer.neurons.map((neuron, j) => {
                sum += neuron.weights[k] * preActivationGrads[j]
            })
            return sum;
        })
    }

    

    return {
        layerGradients: layerGradients,
    }
}

// // sgd on a single data point
// export const sgd = (mlpConfig: MLPConfig, inputs: number[], outputs: number[], lr: number): MLPConfig => {
//     return batchSGD(mlpConfig, [inputs], [outputs], lr);
// }


// sgd on many data points
export const sgd = (mlpConfig: MLPConfig, inputs: number[], outputs: number[], lr: number): MLPConfig => {
    // compute the gradients
    const gradTable = backProp(mlpConfig, inputs, outputs);
    console.log(gradTable)

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