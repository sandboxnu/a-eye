import React, { useEffect, useState } from 'react';
// import MPBasicNeuron, { NeuronInput } from '../mpNeuron/MPBasicNeuron';
// import MPLayerNeuron from '../mpNeuron/MPLayerNeuron';
import MLPGraphNeuron from '../mlpNeuron/MLPGraphNeuron';
import {RblattInput, RblattConfig, INIT_INPUTS, INIT_CONFIG, CLEARED_INPUTS} from '../rosenblatt/constants';
import EditingRblattGraph from '../rosenblatt/EditingRblattGraph';

import { neuronInputConfig } from './constants';

const MLPDemo = (props: { labelColor: string }) => {
    const [inputs, setInputs] = useState<RblattInput[]>(INIT_INPUTS);
    const [config, setConfig] = useState<RblattConfig>(INIT_CONFIG);
    const [currPoint, setCurrPoint] = useState<number>(0);
    const [isReset, setReset] = useState(false);
    const [isCleared, setCleared] = useState(false);

    const [neuronState, setNeuronState] = useState(neuronInputConfig);


    const changeNeuronValue = (layer: number, neuron: number, key: string, value: any) => {
        const newState = JSON.parse(JSON.stringify(neuronState));
        newState[layer][neuron][key] = value;
        setNeuronState(newState);
    }

    const updateNeuron1Inputs = (inputs) => changeNeuronValue(0, 0, 'inputs', inputs)

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
                inputCoordinates={inputs[currPoint]}
            />
            <EditingRblattGraph
                inputs={inputs} 
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
