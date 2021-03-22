import React, { useEffect, useState } from 'react';
// import MPBasicNeuron, { NeuronInput } from '../mpNeuron/MPBasicNeuron';
// import MPLayerNeuron from '../mpNeuron/MPLayerNeuron';
import MLPGraphNeuron from '../mlpNeuron/MLPGraphNeuron';
import {RblattInput, RblattConfig, INIT_INPUTS, INIT_CONFIG, CLEARED_INPUTS} from '../rosenblatt/constants';
import EditingRblattGraph from '../rosenblatt/EditingRblattGraph';

import { neuronInputConfig, NeuronConfig} from './constants';


// Get the last nested value of an array
const getLastValue = (arr) => {
    let a = arr;
    while(Array.isArray(a)) {
        a = a[a.length - 1];
    }

    return a;
}

// make a deep copy of a javascript object
const deepcopy = (obj) => JSON.parse(JSON.stringify(obj));

    // - JSXGraph not updating the point colors
const MLPDemo = (props: { labelColor: string }) => {
    const [inputs, setInputs] = useState<RblattInput[]>(INIT_INPUTS);
    const [currPoint, setCurrPoint] = useState<number>(0);
    const [isReset, setReset] = useState(false);
    const [isCleared, setCleared] = useState(false);
    const [neuronState, setNeuronState] = useState<NeuronConfig>(neuronInputConfig);

    // update a neuron value to a new one!!
    const changeNeuronValue = (layer: number, neuron: number, key: string, value: any) => {
        setNeuronState((oldState => {  
            const newState = deepcopy(oldState);
            newState[layer][neuron][key] = value;
            return newState;
        } ));
    }

    const getNeuronOutputs = (inputs, inputConfig) => {
        const allResults :number[][][] = [deepcopy(inputs).map((num => [num]))];
        let curResults = deepcopy(inputs);
        inputConfig.forEach((layer, i) => {
            let layerResults: number[] = [];
            layer.forEach(({weights, bias, thresholdDir, thresholdVal}, j) => {
                const thresholdFunction = thresholdDir 
                    ? (a) => (a > thresholdVal ? 1 : 0) 
                    : (a) => (a < thresholdVal ? 1 : 0);

                let result = 0;
                weights.forEach(weight => {
                        const input = curResults.pop();
                        result += weight * input;
                    }
                ) 
                     
                layerResults.push(thresholdFunction(result + bias)); 
            })
            curResults = layerResults;
            allResults.push(layerResults.map((num => [num])));
        })
        return allResults;
    }

    // reset neuron to default state
    const resetNeuronState = () => {
        setNeuronState(_ => [...neuronInputConfig]);
    };

    // go to the previous iteration of the graph
    const goPrev = () => {
        const next = currPoint === 0 ? inputs.length - 1 : currPoint - 1;
        setCurrPoint(next);
    }

    // go to the next iteration of the graph
    const goNext = () => {
        setCurrPoint((currPoint + 1) % inputs.length)
    }

    // get the point color of the final neuron 
    const calculatePointColor = (inputs, inputConfig) => {
        return getLastValue(getNeuronOutputs(inputs, inputConfig));
    }

    const formattedInputs = (({x, y}) => [x, y])(inputs[currPoint]);
    const outputs = getNeuronOutputs(formattedInputs, neuronState);
    const correctPointColorInputs = inputs.map(({x, y}) => {return {x, y, z: calculatePointColor([x, y], neuronState)}});

    return(
        <div>
            <MLPGraphNeuron 
                labelColor={props.labelColor} 
                neuronState={neuronState}
                changeNeuronValue={changeNeuronValue}
                resetNeuronState={resetNeuronState}
                intermediateValues={outputs}
            />
            <EditingRblattGraph
                inputs={correctPointColorInputs} 
                highlighted={inputs[currPoint]}
                onInputsChange={setInputs}
                reset={{isReset, setReset}}
                clear={{isCleared, setCleared}}
            />
            <button className='basic-button' onClick={goPrev} disabled={false}>
                Previous Step
            </button>
            <button className='basic-button' onClick={goNext} disabled={false}>
                Next Step
            </button>
        </div>
    )
}

export default MLPDemo;
