import React, { useEffect, useState } from 'react';
import MPBasicNeuron, { NeuronInput } from '../mpNeuron/MPBasicNeuron';
import MPLayerNeuron from '../mpNeuron/MPLayerNeuron';

import {RblattInput} from '../rosenblatt/constants'
import {NeuronConfig} from '../mlpDemo/constants';

type MLPGraphNeuronType = {
    labelColor: string,
    neuronState: NeuronConfig,
    changeNeuronValue,
    resetNeuronState,
    // [...layers, [... neurons, [.. inputs for each neuron (all rows but first one are outputs, so this is just one element for them.)]]]
    intermediateValues: number[][][],
};

const MLPGraphNeuron: React.FC<MLPGraphNeuronType> = ({ 
        labelColor,
        neuronState,
        changeNeuronValue,
        resetNeuronState,
        intermediateValues
}) => {

    // hardcoded for two layers and one neuron on second layer
    const setBias = bias => changeNeuronValue(1, 0, 'bias', bias);

    const setAnd = () => {
        // reset all weights
        // reset threshold
        // keep inputs
        resetNeuronState();
        setBias(-15);
    };
    const setOr = () => {
        resetNeuronState();
        setBias(-5);
    }

    // get the inputs to a neuron on a specific layer
    // assume numinputs is equal for all neurons on the layer
    const getInputs = (layerNum, neuronNum, numInputs) => {
        return intermediateValues[layerNum].concat().map(([a]) => a).slice(numInputs * neuronNum, numInputs * (neuronNum + 1));
    }

    // get the outputs to the current neuron layer
    const getOutput = (layerNum, neuronNum) => {
        return intermediateValues[layerNum + 1][neuronNum][0];
    }

    console.log(intermediateValues);

    return (
        <div>
            <div className="m-2 flex items-center">
                {neuronState.map((layer, layerNum) => 
                    <div id="layer">
                        {layer.map(({weights, bias, thresholdDir, thresholdVal}, neuronNum) => 
                            <MPLayerNeuron
                                key={`LayerNeuron ${layerNum} ${neuronNum}` }
                                labelColor={labelColor}
                                addBias={true}
                                bias={bias}
                                threshold={thresholdVal}
                                setThreshold={threshold => 
                                    changeNeuronValue(layerNum, neuronNum, 'thresholdVal', threshold)}
                                isGreater={thresholdDir}
                                setIsGreater={isGreater => 
                                    changeNeuronValue(layerNum, neuronNum, 'thresholdDir', isGreater)}
                                inputs={getInputs(layerNum, neuronNum, weights.length)}
                                weights={weights}
                                setWeights={weights => 
                                    changeNeuronValue(layerNum, neuronNum, 'weights', weights)}
                                showInput={layerNum === 0}
                                noutput={getOutput(layerNum, neuronNum)}
                            />
                        )} 
                    </div>
                )}
            </div>
            <div>
                <button className="basic-button" onClick={setAnd}>
                    Set to And
                </button>
                <br/>
                <button className="basic-button" onClick={setOr}>
                    Set to Or
                </button>
            </div>
        </div>

    )
}


export default MLPGraphNeuron;
