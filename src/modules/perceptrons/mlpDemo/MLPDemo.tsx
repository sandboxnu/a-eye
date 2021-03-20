import React, { useEffect, useState } from 'react';
// import MPBasicNeuron, { NeuronInput } from '../mpNeuron/MPBasicNeuron';
// import MPLayerNeuron from '../mpNeuron/MPLayerNeuron';
import MLPGraphNeuron from '../mlpNeuron/MLPGraphNeuron';
import {RblattInput, RblattConfig, INIT_INPUTS, INIT_CONFIG, CLEARED_INPUTS} from '../rosenblatt/constants';
import EditingRblattGraph from '../rosenblatt/EditingRblattGraph';

import { neuronInputConfig, NeuronConfig} from './constants';

const MLPDemo = (props: { labelColor: string }) => {
    // PROBLEMS: 
    // - JSXGraph not updating the point colors
    // - constant values are too negative to show variety in graph
    // - state not changing when resetting

    const [inputs, setInputs] = useState<RblattInput[]>(INIT_INPUTS);
    const [currPoint, setCurrPoint] = useState<number>(0);
    const [isReset, setReset] = useState(false);
    const [isCleared, setCleared] = useState(false);

    const [neuronState, setNeuronState] = useState<NeuronConfig>(neuronInputConfig);

    const changeNeuronValue = (layer: number, neuron: number, key: string, value: any) => {
        console.log(`changing key ${layer} ${neuron} ${key} to value ${value}`)
        const newState = JSON.parse(JSON.stringify(neuronState));
        newState[layer][neuron][key] = value;
        setNeuronState(newState);
    }

    const calculatePointColor = (inputs, inputConfig) => {
        let curResults = JSON.parse(JSON.stringify(inputs));
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
        })
        console.log(curResults);
        return curResults;
    }

    const correctPointColorInputs = inputs.map(({x, y}) => {return {x, y, z: calculatePointColor([x, y], neuronState)}});

    const resetNeuronState = () => {
        console.log('resetting neuron state');
        neuronState.forEach((layer, i) => {
            layer.forEach((neuron, j) => {
                Object.keys(neuronInputConfig[i][j]).forEach(key => 
                    changeNeuronValue(i, j, key, neuronInputConfig[i][j][key]))
            })
        })
    };
    // setNeuronState(nState => [...nState, ...neuronInputConfig]);

    console.log(currPoint);
    const goPrev = () => {
        let next = currPoint === 0 ? inputs.length - 1 : currPoint - 1;
        setCurrPoint(next);
    }
    const goNext = () => {
        setCurrPoint((currPoint + 1) % inputs.length)
    }

    // 1. correct points based on number
    // 2. triple or quadruple the points - see background more 'naturally'

    return(
        <div>
            <MLPGraphNeuron 
                labelColor={props.labelColor} 
                neuronState={neuronState}
                changeNeuronValue={changeNeuronValue}
                resetNeuronState={resetNeuronState}
                inputCoordinates={(({x, y}) => [x, y])(inputs[currPoint])}
            />
            <EditingRblattGraph
                inputs={correctPointColorInputs} 
                highlighted={inputs[currPoint]}
                onInputsChange={setInputs}
                reset={{isReset, setReset}}
                clear={{isCleared, setCleared}}
            />

            {/* if you want to remove adding points a feature, change EditingRblattGraph to RblattGraph 
            <RblattGraph {...props} editingType={editingType}  /> */}
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
