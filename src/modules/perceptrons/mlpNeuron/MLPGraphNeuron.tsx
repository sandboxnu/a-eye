import React, { useEffect, useState } from 'react';
import MPBasicNeuron, { NeuronInput } from '../mpNeuron/MPBasicNeuron';
import MPLayerNeuron from '../mpNeuron/MPLayerNeuron';

import {RblattInput} from '../rosenblatt/constants'
import {NeuronConfig} from '../mlpDemo/constants';

type MLPGraphNeuronType = {

};
// inputCoordinates is array of two elements
const MLPGraphNeuron = (props: { 
    labelColor: string,
    inputCoordinates: number[],
    neuronState: NeuronConfig,
    changeNeuronValue,
    resetNeuronState
}) => {
    const {
        labelColor,
        inputCoordinates,
        neuronState,
        changeNeuronValue,
        resetNeuronState
    } = props;

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

    const getInputs = (layerNum, neuronNumber) => {
        // NOTE: not generalized for neurons that take more than one input
        if(layerNum === 0) return [inputCoordinates[neuronNumber]];

        return neuronState[layerNum - 1].map(({output}) => output);
    }

    return (
        <div>
            <div className="m-2 flex items-center">
                {neuronState.map((layer, layerNum) => 
                    <div id="layer">
                        {layer.map(({weights, bias, thresholdDir, thresholdVal}, neuronNum) => 
                            <MPLayerNeuron
                                labelColor={labelColor}
                                addBias={true}
                                bias={bias}
                                threshold={thresholdVal}
                                setThreshold={threshold => 
                                    changeNeuronValue(layerNum, neuronNum, 'thresholdVal', threshold)}
                                isGreater={thresholdDir}
                                setIsGreater={isGreater => 
                                    changeNeuronValue(layerNum, neuronNum, 'thresholdDir', isGreater)}
                                inputs={getInputs(layerNum, neuronNum)}
                                weights={weights}
                                setWeights={weights => 
                                    changeNeuronValue(layerNum, neuronNum, 'weights', weights)}
                                showInput={layerNum === 0}
                            />
                        )} 
                    </div>
                )}
                {/* <div>
                    <MPLayerNeuron
                        threshold={threshold1}
                        setThreshold={setThreshold1}
                        isGreater={isGreater1}
                        setIsGreater={setIsGreater1}
                        labelColor={props.labelColor} 
                        addBias={true} 
                        inputs={[props.inputCoordinates.x]} 
                        weights={weights1} 
                        setWeights={setWeights1} 
                        bias={DEFAULT_BIAS} 
                        setOutput={setAns1}
                        showInput={true}
                       />
                    <MPLayerNeuron
                        threshold={threshold2}
                        setThreshold={setThreshold2}
                        isGreater={isGreater2}
                        setIsGreater={setIsGreater2}
                        labelColor={props.labelColor} 
                        addBias={true} 
                        inputs={[props.inputCoordinates.y]} 
                        weights={weights2} 
                        setWeights={setWeights2} 
                        bias={DEFAULT_BIAS} 
                        setOutput={setAns2}
                        showInput={true}
                    />
                </div>
                <div className="">
                    <MPLayerNeuron
                        threshold={thresholdLayer}
                        setThreshold={setThresholdLayer}
                        isGreater={isGreaterLayer}
                        setIsGreater={setIsGreaterLayer}
                        labelColor={props.labelColor} 
                        addBias={true} 
                        inputs={[answer1, answer2]} 
                        weights={weights} 
                        setWeights={setWeights} 
                        bias={bias} 
                       />
                </div> */}
            </div>
            <div>
                <button className="bg-white" onClick={setAnd}>
                    Set to And
                </button>
                <br/>
                <button className="bg-white" onClick={setOr}>
                    Set to Or
                </button>
            </div>
        </div>

    )
}


export default MLPGraphNeuron;
