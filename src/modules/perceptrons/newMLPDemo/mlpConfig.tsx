/* eslint-disable */
export const activations = ['sigmoid', 'relu', 'none']
export type ActivationType = 'sigmoid' | 'relu' | 'none';

export function isActivation(value: string): value is ActivationType {
    return activations.indexOf(value) !== -1;
}

export let applyActivation = (val: number, activation: ActivationType): number => {
    switch (activation) {
        case 'sigmoid':
            return (1.0) / (1.0 + Math.exp(-1.0 * val))
        case 'relu':
            return Math.max(0.0, val)
        case 'none':
            return val
    }
}

export type HiddenLayerType = {
    weights: number[][], // weights mapping [input,ouput] => num inputs x num outputs
    biases: number[], // bias mapping [output] => num outputs 
    activation: ActivationType,
};


export type MLPConfig = {
    inputs: number[], // inputs to the MLP
    hiddenLayers: HiddenLayerType[], // each hidden layer contains the weights going forward
};

export const changeInput = (mlpConfig: MLPConfig, newInput: number, idxToChange: number): MLPConfig => {
    return {
        inputs: mlpConfig.inputs.map((value: number, mapIdx: number) => (mapIdx == idxToChange ? newInput : value)),
        hiddenLayers: mlpConfig.hiddenLayers,
    }
}

export const changeWeight = (mlpConfig: MLPConfig, newWeight: number, layerIdx: number, inputWeightIdx: number, outputWeightIdx: number): MLPConfig => {
    const transformLayerWeight = (layer: HiddenLayerType): HiddenLayerType => {
        return {
            weights: layer.weights.map(
                (value: number[], mapIdx) => (mapIdx == inputWeightIdx ?
                    (value.map((oldWeight: number, weightIdx: number) =>
                        (weightIdx == outputWeightIdx) ? newWeight : oldWeight)) : value)),
            biases: layer.biases,
            activation: layer.activation,
        }
    }

    return {
        inputs: mlpConfig.inputs,
        hiddenLayers: mlpConfig.hiddenLayers.map((oldLayer: HiddenLayerType, mapIdx) => (mapIdx == layerIdx ?
            transformLayerWeight(oldLayer)
            : oldLayer)
        )
    }
}

export const changeBias = (mlpConfig: MLPConfig, newBias: number, layerIdx: number, biasIdx: number): MLPConfig => {
    const transformLayerBias = (layer: HiddenLayerType): HiddenLayerType => {
        return {
            biases: layer.biases.map((oldBias: number, mapIdx: number) => (mapIdx == biasIdx) ? newBias : oldBias),
            weights: layer.weights,
            activation: layer.activation,
        }
    }

    return {
        inputs: mlpConfig.inputs,
        hiddenLayers: mlpConfig.hiddenLayers.map((oldLayer: HiddenLayerType, mapIdx) => (mapIdx == layerIdx ?
            transformLayerBias(oldLayer)
            : oldLayer)
        )
    }
}

export const changeActivation = (mlpConfig: MLPConfig, newActivation: ActivationType, layerIdx: number): MLPConfig => {
    return {
        inputs: mlpConfig.inputs,
        hiddenLayers: mlpConfig.hiddenLayers.map((layer: HiddenLayerType, mapIdx) => (mapIdx == layerIdx ?
            {
                weights: layer.weights,
                biases: layer.biases,
                activation: newActivation
            }
            : layer)
        )
    }
}

export const addLayer = (mlpConfig: MLPConfig): MLPConfig => {
    // add new layer at end; copy the last layer, and fill in the extra weights and biases needed to
    // complete the previous layer.


    const oldFinalLayer = mlpConfig.hiddenLayers[mlpConfig.hiddenLayers.length - 1]
    // we want a new layer with the same number of nodes as the last layer
    const numNodesNewLayer = oldFinalLayer.weights.length



    // since there's only one output in the final layer, we need to extend the old last layer's
    // weights to be long enough to accomodate the new layer's size
    const penultimateLayerWeights = oldFinalLayer.weights.map((oldWeights, weightsIdx) =>
        Array.from({ length: numNodesNewLayer }, (v, weightIdx) => (weightIdx == 0 ? oldWeights[0] : 0.0))
    )
    const penultimateLayerBiases = Array.from({ length: numNodesNewLayer }, (v, biasIdx) => (biasIdx == 0 ? oldFinalLayer.biases[0] : 0.0))

    const penultimateLayer: HiddenLayerType = {
        weights: penultimateLayerWeights,
        biases: penultimateLayerBiases,
        activation: oldFinalLayer.activation,
    }


    const newFinalLayer: HiddenLayerType = {
        weights: oldFinalLayer.weights,
        biases: oldFinalLayer.biases,
        activation: oldFinalLayer.activation,
    }

    return {
        inputs: mlpConfig.inputs,
        hiddenLayers: mlpConfig.hiddenLayers.slice(0, -1).concat([penultimateLayer, newFinalLayer]),
    }

}

export const removeLayer = (mlpConfig: MLPConfig): MLPConfig => {
    if (mlpConfig.hiddenLayers.length <= 1) return mlpConfig

    const oldPenultimatelayer = mlpConfig.hiddenLayers[mlpConfig.hiddenLayers.length - 2]

    const newFinalLayer: HiddenLayerType = {
        weights: oldPenultimatelayer.weights.map((weights, weightsIdx) => [weights[0]]),
        biases: [oldPenultimatelayer.biases[0]],
        activation: oldPenultimatelayer.activation,
    }

    return ({
        inputs: mlpConfig.inputs,
        hiddenLayers: mlpConfig.hiddenLayers.slice(0, -2).concat([newFinalLayer]),
    })
}

export const addNode = (mlpConfig: MLPConfig, layerIdx: number): MLPConfig => {
    if (layerIdx >= mlpConfig.hiddenLayers.length - 1 || layerIdx < 0) return mlpConfig // last layer MUST have only one node.

    // adds the weights to create this node from input layer
    const transformNodeLayer = (layer: HiddenLayerType): HiddenLayerType => {
        const addNewOutput = (outputs: number[]): number[] => {
            return outputs.concat([0.0])
        }

        return {
            weights: layer.weights.map(addNewOutput),
            biases: layer.biases.concat([0.0]),
            activation: layer.activation,
        }
    }


    // adds the weights to apply this node to the next layer
    const transformNextLayer = (layer: HiddenLayerType): HiddenLayerType => {
        const numOutputs = layer.weights[0].length
        const newInputWeights: number[] = []

        for (let i = 0; i < numOutputs; i++) {
            newInputWeights.push(0.0)
        }

        return {
            weights: layer.weights.concat([newInputWeights]),
            biases: layer.biases,
            activation: layer.activation,
        }
    }


    return {
        inputs: mlpConfig.inputs,
        hiddenLayers: mlpConfig.hiddenLayers.map((layer, i) => {
            if (i == layerIdx) {
                return transformNodeLayer(layer)
            }
            if (i == layerIdx + 1) {
                return transformNextLayer(layer)
            }

            return layer;
        })
    }
}

export const removeNode = (mlpConfig: MLPConfig, layerIdx: number): MLPConfig => {
    if (layerIdx >= mlpConfig.hiddenLayers.length - 1 || layerIdx < 0) return mlpConfig // last layer MUST have only one node.
    if (mlpConfig.hiddenLayers[layerIdx].biases.length == 1) return mlpConfig// cannot remove last output in layer

    // adds the weights to create this node from input layer
    const transformNodeLayer = (layer: HiddenLayerType): HiddenLayerType => {
        const removeOutput = (outputs: number[]): number[] => {
            return outputs.slice(0, -1) // cut off last value of node mapping for each input.
        }

        return {
            weights: layer.weights.map(removeOutput),
            biases: layer.biases.slice(0, -1),
            activation: layer.activation,
        }
    }


    // adds the weights to apply this node to the next layer
    const transformNextLayer = (layer: HiddenLayerType): HiddenLayerType => {

        return {
            weights: layer.weights.slice(0, -1), // cut off last input->node mapping
            biases: layer.biases,
            activation: layer.activation,
        }
    }


    return {
        inputs: mlpConfig.inputs,
        hiddenLayers: mlpConfig.hiddenLayers.map((layer, i) => {
            if (i == layerIdx) {
                return transformNodeLayer(layer)
            }
            if (i == layerIdx + 1) {
                return transformNextLayer(layer)
            }

            return layer
        })
    }
}


// calculates the values at each layer given the mlpConfig's inputs: first hidden layer at idx 0,
// and so on.
export const calculateIntermediateValues = (mlpConfig: MLPConfig): number[][] => {
    let intermediateValues: number[][] = []

    mlpConfig.hiddenLayers.forEach((layer, i) => {
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

export const addInput = (mlpConfig: MLPConfig): MLPConfig => {



    // adds the weights to apply this node to the next layer
    const transformFirstLayer = (layer: HiddenLayerType): HiddenLayerType => {
        const numOutputs = layer.weights[0].length
        const newInputWeights: number[] = []

        for (let i = 0; i < numOutputs; i++) {
            newInputWeights.push(0.0)
        }

        return {
            weights: layer.weights.concat([newInputWeights]),
            biases: layer.biases,
            activation: layer.activation,
        }
    }


    return {
        inputs: mlpConfig.inputs.concat([0.0]),
        hiddenLayers: mlpConfig.hiddenLayers.map((layer, i) => {
            if (i == 0) {
                return transformFirstLayer(layer)
            }

            return layer;
        })
    }
}


export const removeInput = (mlpConfig: MLPConfig): MLPConfig => {

    if (mlpConfig.inputs.length == 1) return mlpConfig;

    // adds the weights to apply this node to the next layer
    const transformFirstLayer = (layer: HiddenLayerType): HiddenLayerType => {

        return {
            weights: layer.weights.slice(0, -1), // cut off last input->node mapping
            biases: layer.biases,
            activation: layer.activation,
        }
    }


    return {
        inputs: mlpConfig.inputs.slice(0,-1),
        hiddenLayers: mlpConfig.hiddenLayers.map((layer, i) => {
            if (i == 0) {
                return transformFirstLayer(layer)
            }

            return layer;
        })
    }
}

export const defaultMLPConfig: MLPConfig = {
    inputs: [1.0, 1.0],
    hiddenLayers: [
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