import React, { useEffect, useState } from 'react';
// import MPBasicNeuron, { NeuronInput } from '../mpNeuron/MPBasicNeuron';
// import MPLayerNeuron from '../mpNeuron/MPLayerNeuron';
import MLPNeuron from '../mlpNeuron/MLPNeuron';
import {RblattInput, RblattConfig, INIT_INPUTS, INIT_CONFIG, CLEARED_INPUTS} from '../rosenblatt/constants';
import EditingRblattGraph from '../rosenblatt/EditingRblattGraph';


const MLPDemo = (props: { labelColor: string }) => {
    
    const [inputs, setInputs] = useState<RblattInput[]>(INIT_INPUTS);
    const [config, setConfig] = useState<RblattConfig>(INIT_CONFIG);
    const [currPoint, setCurrPoint] = useState<number>(0);
    const [isReset, setReset] = useState(false);
    const [isCleared, setCleared] = useState(false);

    const goPrev = () => {
        setCurrPoint((currPoint - 1) % inputs.length)
    }
    const goNext = () => {
        setCurrPoint((currPoint + 1) % inputs.length)
    }

    return(
        <div>
            <MLPNeuron labelColor={props.labelColor}/>

            <EditingRblattGraph
                    inputs={inputs} line={config}
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