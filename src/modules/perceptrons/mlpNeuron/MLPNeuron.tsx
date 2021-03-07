import React, { useEffect, useState } from 'react';
import MPBasicNeuron, { NeuronInput } from '../mpNeuron/MPBasicNeuron';
import MPLayerNeuron from '../mpNeuron/MPLayerNeuron';

const MLPNeuron = (props: { labelColor: string }) => {

    const defaultInput = [{ val: 1, weight: 10 }];

    const [answer1, setAns1] = useState(0);
    const [answer2, setAns2] = useState(0);

    const initialWeights = [-.5, 1];

    const [weights, setWeights] = useState<number[]>(initialWeights);
    const [inputs, setInputs] = useState<NeuronInput[]>(defaultInput);
    const [inputs2, setInputs2] = useState<NeuronInput[]>(defaultInput);

    return (
        <div>
            <div className="m-2 flex items-center">
                <div>
                    <MPBasicNeuron labelColor={props.labelColor} canAddInputs={false} addBias={true} onAnsChange={setAns1} inputs={inputs} setInputs={setInputs} />
                    <MPBasicNeuron labelColor={props.labelColor} canAddInputs={false} addBias={true} onAnsChange={setAns2} inputs={inputs2} setInputs={setInputs2} />
                </div>
                <div className="">
                    <MPLayerNeuron
                        labelColor={props.labelColor} addBias={true} inputs={[answer1, answer2]} weights={weights} setWeights={setWeights} />
                </div>
            </div>
            <div>
                <button className="bg-white">
                    click me.
                </button>
            </div>
        </div>

    )
}


export default MLPNeuron;