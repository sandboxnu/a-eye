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

export type Neuron = {
    weights: number[],
    bias: number,
}

export type HiddenLayer = {
    neurons: Neuron[],
    activation: ActivationType,
};


export type MLPConfig = {
    numInputs: number, // inputs to the MLP
    hiddenLayers: HiddenLayer[], // each hidden layer contains the weights going forward
};

export const changeWeight = (mlpConfig: MLPConfig, newWeight: number, layerIdx: number, nodeIdx: number, inputNodeIdx: number): MLPConfig => {
    const transformLayerWeight = (layer: HiddenLayer): HiddenLayer => {
        return {
            neurons: layer.neurons.map((neuron, neuronIdx) => {
                if (nodeIdx == neuronIdx) {
                    return {
                        weights: neuron.weights.map((oldVal, i) => (i == inputNodeIdx ? newWeight : oldVal)),
                        bias: neuron.bias
                    };
                }
                return neuron;
            }),
            activation: layer.activation,
        }
    }

    return {
        numInputs: mlpConfig.numInputs,
        hiddenLayers: mlpConfig.hiddenLayers.map((oldLayer: HiddenLayer, mapIdx) => (mapIdx == layerIdx ?
            transformLayerWeight(oldLayer)
            : oldLayer)
        )
    }
}

export const changeBias = (mlpConfig: MLPConfig, newBias: number, layerIdx: number, biasIdx: number): MLPConfig => {
    const transformLayerBias = (layer: HiddenLayer): HiddenLayer => {
        return {
            neurons: layer.neurons.map((neuron, neuronIdx) => {
                const bias = (neuronIdx == biasIdx ? newBias : neuron.bias);

                return {
                    weights: neuron.weights,
                    bias: bias,
                };
            }),
            activation: layer.activation,
        }
    }

    return {
        numInputs: mlpConfig.numInputs,
        hiddenLayers: mlpConfig.hiddenLayers.map((oldLayer: HiddenLayer, mapIdx) => (mapIdx == layerIdx ?
            transformLayerBias(oldLayer)
            : oldLayer)
        )
    }
}

export const changeActivation = (mlpConfig: MLPConfig, newActivation: ActivationType, layerIdx: number): MLPConfig => {
    return {
        numInputs: mlpConfig.numInputs,
        hiddenLayers: mlpConfig.hiddenLayers.map((layer: HiddenLayer, mapIdx) => (mapIdx == layerIdx ?
            {
                neurons: layer.neurons,
                activation: newActivation
            }
            : layer)
        )
    }
}

export const addLayer = (mlpConfig: MLPConfig): MLPConfig => {
    // add new layer at end; copy the last layer, and fill in the extra weights and biases needed to
    // complete the previous layer.


    const oldPenultimatelayer = mlpConfig.hiddenLayers[mlpConfig.hiddenLayers.length - 2]
    // we want a new layer with the same number of nodes as the last layer
    const numNodesNewPenultimate = oldPenultimatelayer.neurons.length
    const numNodesOldPenultimate = oldPenultimatelayer.neurons.length



    // since there's only one output in the final layer, we need to extend the old last layer's
    // weights to be long enough to accomodate the new layer's size

    const newPenultimateLayer: HiddenLayer = {
        neurons: oldPenultimatelayer.neurons.map((neuron) => {
            
            let weights: number[] = []
            // make sure it has the correct number of inputs
            for (let i = 0; i < numNodesOldPenultimate; i++) {
                // if there weren't enough weights before, add zeros.
                const weightVal = (neuron.weights.length > i?neuron.weights[i]:0.0);

                weights.push(weightVal)
            }

            return {
                weights: weights,
                bias: neuron.bias,
            }

        }),
        activation: oldPenultimatelayer.activation,
    }


    return {
        numInputs: mlpConfig.numInputs,
        hiddenLayers: mlpConfig.hiddenLayers.slice(0, -1).concat([newPenultimateLayer, mlpConfig.hiddenLayers[mlpConfig.hiddenLayers.length - 1]]),
    }

}

export const removeLayer = (mlpConfig: MLPConfig): MLPConfig => {
    if (mlpConfig.hiddenLayers.length <= 1) return mlpConfig

    const oldPenultimatelayer = mlpConfig.hiddenLayers[mlpConfig.hiddenLayers.length - 2]

    const newFinalLayer: HiddenLayer = {
        neurons: [oldPenultimatelayer.neurons[0]],
        activation: oldPenultimatelayer.activation,
    }

    return ({
        numInputs: mlpConfig.numInputs,
        hiddenLayers: mlpConfig.hiddenLayers.slice(0, -2).concat([newFinalLayer]),
    })
}

export const addNode = (mlpConfig: MLPConfig, layerIdx: number): MLPConfig => {
    if (layerIdx >= mlpConfig.hiddenLayers.length - 1 || layerIdx < 0) return mlpConfig // last layer MUST have only one node.

    // adds the weights to create this node from input layer
    const transformNodeLayer = (layer: HiddenLayer): HiddenLayer => {
 
        let newNeuronWeights: number[] = []
        for (let i = 0; i < layer.neurons[0].weights.length; i++) {
            newNeuronWeights.push(0.0);
        }

        return {
            neurons: layer.neurons.concat({
                weights: newNeuronWeights,
                bias: 0.0,
            }),
            activation: layer.activation,
        }
    }


    // adds the weights to apply this node to the next layer
    const transformNextLayer = (layer: HiddenLayer): HiddenLayer => {

        return {
            neurons: layer.neurons.map((neuron) => {
                return {
                    weights: neuron.weights.concat([0.0]),
                    bias: neuron.bias,
                }
            }),
            activation: layer.activation,
        }
    }


    return {
        numInputs: mlpConfig.numInputs,
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
    if (mlpConfig.hiddenLayers[layerIdx].neurons.length == 1) return mlpConfig// cannot remove last output in layer

    const transformNodeLayer = (layer: HiddenLayer): HiddenLayer => {
        return {
            neurons: layer.neurons.slice(0,-1),
            activation: layer.activation,
        }
    }


    // adds the weights to apply this node to the next layer
    const transformNextLayer = (layer: HiddenLayer): HiddenLayer => {

        return {
            neurons: layer.neurons.map((neuron) => {
                return {
                    weights: neuron.weights.slice(0,-1),
                    bias: neuron.bias,
                }
            }),
            activation: layer.activation,
        }
    }


    return {
        numInputs: mlpConfig.numInputs,
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


// calculates the values at each layer given the mlpConfig's inputs: input layer at idx 0,
// first hidden layer at idx 1, and so on.
export const forwardPropagation = (mlpConfig: MLPConfig, inputs: number[]): number[][] => {
    let intermediateValues: number[][] = [inputs]

    mlpConfig.hiddenLayers.forEach((layer, i) => {
        let prevLayer: number[] = intermediateValues[i ]
        let layerOutputs: number[] = []

        for (let neuronIdx = 0; neuronIdx < layer.neurons.length; neuronIdx++) {
            const neuron = layer.neurons[neuronIdx];
            let output = neuron.bias;

            for (let inputIdx = 0; inputIdx < neuron.weights.length; inputIdx++) {
                output += neuron.weights[inputIdx] * prevLayer[inputIdx]
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
    const transformFirstLayer = (layer: HiddenLayer): HiddenLayer => {

        return {
            neurons: layer.neurons.map((neuron) => {
                return {
                    weights: neuron.weights.concat([0.0]),
                    bias: neuron.bias,
                }
            }),
            activation: layer.activation,
        }
    }


    return {
        numInputs: mlpConfig.numInputs +1,
        hiddenLayers: mlpConfig.hiddenLayers.map((layer, i) => {
            if (i == 0) {
                return transformFirstLayer(layer)
            }

            return layer;
        })
    }
}


export const removeInput = (mlpConfig: MLPConfig): MLPConfig => {

    if (mlpConfig.numInputs == 1) return mlpConfig;

    // adds the weights to apply this node to the next layer
    const transformFirstLayer = (layer: HiddenLayer): HiddenLayer => {

        return {
            neurons: layer.neurons.map((neuron) => {
                return {
                    weights: neuron.weights.slice(0,-1),
                    bias: neuron.bias,
                }
            }),
            activation: layer.activation,
        }
    }


    return {
        numInputs: mlpConfig.numInputs-1,
        hiddenLayers: mlpConfig.hiddenLayers.map((layer, i) => {
            if (i == 0) {
                return transformFirstLayer(layer)
            }

            return layer;
        })
    }
}

export const defaultMLPConfig: MLPConfig = {
    numInputs: 2,
    hiddenLayers: [
        {
            neurons: [
                {
                    weights: [0.2, -0.13],
                    bias: 0.2,
                },
                {
                    weights: [-0.3, 0.03],
                    bias: 0.1,
                }
            ],
            activation: 'relu',
        },
        {
            neurons: [
                {
                    weights: [-0.05, 0.1],
                    bias: 0.2,
                }
            ],
            activation: 'sigmoid',
        },
    ],
}
export const defaultMLPConfigInput: number[] = [1.0, 1.0]
