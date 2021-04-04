import React, { useEffect, useState, useCallback } from 'react';
// import MPBasicNeuron, { NeuronInput } from '../mpNeuron/MPBasicNeuron';
// import MPLayerNeuron from '../mpNeuron/MPLayerNeuron';
import MLPGraphNeuron from '../mlpNeuron/MLPGraphNeuron';
import {RblattInput, RblattConfig, INIT_INPUTS, INIT_CONFIG, CLEARED_INPUTS} from '../rosenblatt/constants';
import EditingRblattGraph from '../rosenblatt/EditingRblattGraph';

import { neuronInputConfig, NeuronConfig } from './constants';

// Get the last nested value of an array.
const getLastValue = (arr: any[]) => {
    let a = arr;
    while(Array.isArray(a)) {
        a = a[a.length - 1];
    }

    return a;
}

// Make a deep copy of an object.
const deepcopy = (obj: {}) => JSON.parse(JSON.stringify(obj));

const MLPDemo = (props: { labelColor: string }) => {
    const [inputs, setInputs] = useState<RblattInput[]>(INIT_INPUTS);
    const [currPoint, setCurrPoint] = useState<number>(0);
    const [neuronState, setNeuronState] = useState<NeuronConfig[][]>(neuronInputConfig);

    // Update a neuron value to a new one!
    const changeNeuronValue = useCallback((layer: number, neuron: number, key: string, value: any) => {
        setNeuronState((oldState => {  
            const newState = deepcopy(oldState);
            newState[layer][neuron][key] = value;
            return newState;
        }));
    }, [setNeuronState]);

    const getNeuronOutputs = useCallback((inputs) => {
        const allResults :number[][][] = [deepcopy(inputs).map((num => [num]))];
        let curResults = deepcopy(inputs);
        neuronState.forEach((layer: NeuronConfig[], i: number) => {
            const layerResults: number[] = layer.map(({weights, bias, greaterThan, thresholdVal}, j: number) => {
                const thresholdFunc = greaterThan 
                    ? (a: number) => (a > thresholdVal ? 1 : 0) 
                    : (a: number) => (a < thresholdVal ? 1 : 0);

                const result = weights.reduce((acc: number, weight: number) => {
                        const input = curResults.splice(0,1)[0];
                        return weight * input + acc;
                    }, 0) + bias; 
                     
                return thresholdFunc(result);
            });
            curResults = layerResults;
            allResults.push(layerResults.map((num => [num])));
        })
        return allResults;
    }, [neuronState]);

    // reset neuron to default state
    const resetNeuronState = useCallback(() => {
        setNeuronState(_ => [...neuronInputConfig]);
    }, [setNeuronState]);

    // go to the previous iteration of the graph
    const goPrev = useCallback(() => {
        setCurrPoint(cp => cp === 0 ? inputs.length - 1 : cp - 1);
    }, [setCurrPoint, inputs]);

    // go to the next iteration of the graph
    const goNext = useCallback(() => {
        setCurrPoint(cp => (cp + 1) % inputs.length)
    }, [setCurrPoint, inputs]);

    // get the point color of the final neuron 
    const calculatePointColor = useCallback((clickedX, clickedY) => {
        return getLastValue(getNeuronOutputs([clickedX, clickedY]));
    }, [getNeuronOutputs]);

    const handleClick = useCallback((clickedX, clickedY) => {
        setInputs(inp => {
            // TODO: Make sure that this bounding box is lenient enough!
            const BOUND = 0.01;
            console.log(clickedX, clickedY);

            const newInputs = inp.filter(([x, y]) => 
                clickedX - BOUND <= x && 
                x <= clickedX + BOUND && 
                clickedY - BOUND <= y && 
                y <= clickedY + BOUND);

            // If the length changed, then we removed one, so we didn't add one! Otherwise, we know we added one.
            return newInputs.length === inp.length ? 
                newInputs.concat([[clickedX, clickedY, calculatePointColor(clickedX, clickedY)]]) : newInputs;
        })
    }, [setInputs, calculatePointColor]);

    const formattedInputs: RblattInput = inputs[currPoint];
    const outputs = getNeuronOutputs(formattedInputs);

    // TODO: This should be set in state rather than calculated on every render
    const correctPointColorInputs: RblattInput[] = inputs.map(([x, y]) => [x, y, calculatePointColor(x, y)]);

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
                allowSelectingPointColor={false}
                handleClick={handleClick}
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
