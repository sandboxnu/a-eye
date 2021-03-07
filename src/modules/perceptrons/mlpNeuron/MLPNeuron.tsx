import React, { useEffect, useState } from 'react';
import { MPNeuron, MPLayerNeuron} from '../mpNeuron/MPNeuron';


const MLPNeuron = (props: { labelColor: string }) => {

    const defaultInput = [{ val: 1, weight: 10 }];

    const [answer1, setAns1] = useState(0);
    const [answer2, setAns2] = useState(0);

    const defaultInputConnected = [{ val: answer1, weight: 10 }, { val: answer2, weight: 10 }];

    return (
        <div className="m-2 flex items-center">
            <div >
                <MPNeuron labelColor={props.labelColor} canAddInputs={false} addBias={true} input={defaultInput} onAnsChange={setAns1} />
                <MPNeuron labelColor={props.labelColor} canAddInputs={false} addBias={true} input={defaultInput} onAnsChange={setAns2} />
            </div>
            <div className="">
                <MPLayerNeuron 
                labelColor={props.labelColor} addBias={true} inputs={[answer1, answer2]} initialWeights={[10, 10]} />
            </div>
        </div>

    )
}


export default MLPNeuron;