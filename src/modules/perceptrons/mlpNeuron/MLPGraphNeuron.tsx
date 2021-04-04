import React, { useEffect, useState, useCallback } from 'react';
import MPBasicNeuron, { NeuronInput } from '../mpNeuron/MPBasicNeuron';
import MPLayerNeuron from '../mpNeuron/MPLayerNeuron';

import {RblattInput} from '../rosenblatt/constants'
import {NeuronConfig} from '../mlpDemo/constants';

type MLPGraphNeuronType = {
    labelColor: string,
    neuronState: NeuronConfig[][],
    changeNeuronValue: Function,
    resetNeuronState: Function,
    // [...layers, [... neurons, [.. inputs for each neuron (all rows but first one are outputs, so this is just one element for them.)]]]
    intermediateValues: number[][][],
};

const MLPGraphNeuron: React.FC<MLPGraphNeuronType> = ({ 
        labelColor,
        neuronState,
        changeNeuronValue,
        resetNeuronState,
        intermediateValues,
}) => {
    // hardcoded for two layers and one neuron on second layer
    const setBias = useCallback(bias => changeNeuronValue(1, 0, 'bias', bias), [changeNeuronValue]);

    const setAnd = useCallback(() => {
        // reset all weights
        // reset threshold
        // keep inputs
        resetNeuronState();
        setBias(-15);
    }, [resetNeuronState, setBias]);
    const setOr = useCallback(() => {
        resetNeuronState();
        setBias(-5);
    }, [resetNeuronState, setBias]);

    // get the inputs to a neuron on a specific layer
    // assume numinputs is equal for all neurons on the layer
    const getInputs = useCallback((layerNum, neuronNum, numInputs) => {
        return intermediateValues[layerNum].concat().map(([a]) => a).slice(numInputs * neuronNum, numInputs * (neuronNum + 1));
    }, [intermediateValues])

    // get the outputs to the current neuron layer
    const getOutput = useCallback((layerNum, neuronNum) => {
        return intermediateValues[layerNum + 1][neuronNum][0];
    }, [intermediateValues]);

    return (
        <div>
            <div className="m-2 flex items-center">
                {neuronState.map((layer, layerNum) => 
                    <div id="layer">
                        {layer.map(({weights, bias, greaterThan, thresholdVal}, neuronNum) => 
                            <MPLayerNeuron
                                key={`LayerNeuron ${layerNum} ${neuronNum}` }
                                labelColor={labelColor}
                                addBias={true}
                                bias={bias}
                                threshold={thresholdVal}
                                setThreshold={(threshold: number) => 
                                    changeNeuronValue(layerNum, neuronNum, 'thresholdVal', threshold)}
                                isGreater={greaterThan}
                                setIsGreater={(isGreater: boolean) => 
                                    changeNeuronValue(layerNum, neuronNum, 'greaterThan', isGreater)}
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
            <div className="flex flex-row">
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
