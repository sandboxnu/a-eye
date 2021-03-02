import React, { useEffect, useState } from 'react';
import { MPNeuron } from '../mpNeuron/MPNeuron';


const MLPNeuron = (props:{labelColor: string}) => {

    const defaultInput = [{ val: 1, weight: 10 }];
    
    const [answer1, setAns1] = useState(0);
    const [answer2, setAns2] = useState(0);
    const defaultInputConnected = [{ val: answer1, weight: 10 },
        { val: answer2, weight: 10 }];

    return (
        <div className="m-2 flex items-center">
            <div >
                <MPNeuron labelColor={props.labelColor} canAddInputs={false} addBias={true} input={defaultInput} onAnsChange={setAns1}/>

                <MPNeuron labelColor={props.labelColor} canAddInputs={false} addBias={true} input={defaultInput} onAnsChange={setAns2}/>
            </div>
            <div className="">
                <MPNeuron labelColor={props.labelColor} canAddInputs={false} addBias={true} input={defaultInputConnected} connecting={true}/>
            </div>
        </div>
        
    )
}


export default MLPNeuron;