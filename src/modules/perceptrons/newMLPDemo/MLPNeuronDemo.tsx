/* eslint-disable */
import { InputSharp } from "@material-ui/icons";
import { OldPlugin } from "postcss";
import React, { useState } from "react";


type ActivationType = 'sigmoid' | 'relu' | 'none';

type HiddenLayerType = {
    weights: number[][], // weights mapping [input,ouput] => num inputs x num outputs
    biases: number[], // bias mapping [output] => num outputs 
    activation: ActivationType, 
};

type MLPConfig = {
    inputs: number[], // inputs to the MLP
    layers: HiddenLayerType[], // each hidden layer contains the weights going forward
};

// TODO:
// calculate intermediary values

type MLPNeuronDemoType = {
    labelColor: string,
    initialMLPConfig?: MLPConfig,
}

export const MLPNeuronDemo: React.FC<MLPNeuronDemoType> = ({
    labelColor,
    initialMLPConfig,
}) => {
    if (!initialMLPConfig) {
        initialMLPConfig = {
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
    }


    // TODO:
    // add new node
    // remove node

    const [mlpConfig, setMLPConfig] = useState(initialMLPConfig);

    const updateInput = (newInput: number, idxToChange: number) => {
        setMLPConfig({
            inputs: mlpConfig.inputs.map((value: number, mapIdx:number) => (mapIdx == idxToChange?newInput:value)),
            layers: mlpConfig.layers,
        })
    }

    const updateWeight = (newWeight: number, layerIdx: number, inputWeightIdx: number, outputWeightIdx: number) => {
        const updateLayerWeight = (layer: HiddenLayerType) => {
            return {
                weights: layer.weights.map(
                    (value: number[], mapIdx) => (mapIdx==inputWeightIdx? 
                        (value.map((oldWeight: number, weightIdx: number) => 
                            (weightIdx == outputWeightIdx)?newWeight: oldWeight)): value)),
                biases: layer.biases,
                activation: layer.activation,
            }
        }

        setMLPConfig({
            inputs: mlpConfig.inputs,
            layers: mlpConfig.layers.map((oldLayer: HiddenLayerType, mapIdx) => (mapIdx == layerIdx?
                updateLayerWeight(oldLayer)
                : oldLayer)
            )
        })
    }

    const updateBias = (newBias: number, layerIdx: number, biasIdx: number) => {
        const updateLayerBias = (layer: HiddenLayerType) => {
            return {
                biases: layer.biases.map((oldBias: number, mapIdx: number) => (mapIdx == biasIdx)?newBias: oldBias),
                weights: layer.weights,
                activation: layer.activation,
            }
        }

        setMLPConfig({
            inputs: mlpConfig.inputs,
            layers: mlpConfig.layers.map((oldLayer: HiddenLayerType, mapIdx) => (mapIdx == layerIdx?
                updateLayerBias(oldLayer)
                : oldLayer)
            )
        })
    }

    const updateActivation = (newActivation: ActivationType, layerIdx: number) => {
        setMLPConfig({
            inputs: mlpConfig.inputs,
            layers: mlpConfig.layers.map((layer: HiddenLayerType, mapIdx) => (mapIdx == layerIdx?
                {
                    weights: layer.weights,
                    biases: layer.biases,
                    activation: newActivation
                }
                : layer)
            )
        })
    }

    const addLayer = () => {
        // add new layer at end; copy the last layer, and fill in the extra weights and biases needed to
        // complete the previous layer.


        const oldFinalLayer = mlpConfig.layers[mlpConfig.layers.length-1]
        // we want a new layer with the same number of nodes as the last layer
        const numNodesNewLayer = oldFinalLayer.weights.length



        // since there's only one output in the final layer, we need to extend the old last layer's
        // weights to be long enough to accomodate the new layer's size
        const penultimateLayerWeights = oldFinalLayer.weights.map((oldWeights, weightsIdx) => 
            Array.from({length: numNodesNewLayer}, (v, weightIdx) => (weightIdx == 0? oldWeights[0]: 1.0))
        )
        const penultimateLayerBiases = Array.from({length: numNodesNewLayer}, (v, biasIdx) => (biasIdx == 0? oldFinalLayer.biases[0]: 0.0))

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



        setMLPConfig({
            inputs: mlpConfig.inputs,
            layers: mlpConfig.layers.slice(0, -1).concat([penultimateLayer, newFinalLayer]),
        })

    }

    const removeLayer = () => {
        if (mlpConfig.layers.length <= 1) return

        const oldPenultimatelayer = mlpConfig.layers[mlpConfig.layers.length-2]

        const newFinalLayer: HiddenLayerType = {
            weights: oldPenultimatelayer.weights.map((weights, weightsIdx) => [weights[0]]),
            biases: [oldPenultimatelayer.biases[0]],
            activation: oldPenultimatelayer.activation,
        }

        setMLPConfig({
            inputs: mlpConfig.inputs,
            layers: mlpConfig.layers.slice(0, -2).concat([newFinalLayer]),
        })
    }


    return (
        <div></div>
    );
};

export default MLPNeuronDemo;
