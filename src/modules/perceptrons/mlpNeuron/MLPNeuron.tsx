import React, { useEffect, useState } from 'react';
import MPBasicNeuron, { NeuronInput } from '../mpNeuron/MPBasicNeuron';
import MPLayerNeuron from '../mpNeuron/MPLayerNeuron';

const MLPNeuron = (props: { labelColor: string }) => {

    const defaultInput = [{ val: 1, weight: 10 }];

    const initialWeights = [-.5, 1];

    const [answer1, setAns1] = useState(0);
    const [answer2, setAns2] = useState(0);

    const [weights, setWeights] = useState<number[]>(initialWeights);

    const [inputs, setInputs] = useState<NeuronInput[]>(defaultInput);
    const [inputs2, setInputs2] = useState<NeuronInput[]>(defaultInput);

    const [threshold1, setThreshold1] = useState(0);
    const [isGreater1, setIsGreater1] = useState(true);

    const [threshold2, setThreshold2] = useState(0);
    const [isGreater2, setIsGreater2] = useState(true);

    const [thresholdLayer, setThresholdLayer] = useState(0);
    const [isGreaterLayer, setIsGreaterLayer] = useState(true);

    const [bias, setBias] = useState(10);

    const resetWeights = (inputObj, newWeight: number) => {
        const newInputs = JSON.parse(JSON.stringify((inputObj)));
        newInputs.forEach((input) => {
            input.weight = newWeight;
        })
        return newInputs;
    }

    const resetDemo = () => {
        setWeights([10, 10]);
        setInputs(resetWeights(inputs, defaultInput[0].weight));
        setInputs2(resetWeights(inputs2, defaultInput[0].weight));
        setThreshold1(0);
        setIsGreater1(true);
        setThreshold2(0);
        setIsGreater2(true);
        setThresholdLayer(0);
        setIsGreaterLayer(true);
    }

    const setAnd = () => {
        // reset all weights
        // reset threshold
        // keep inputs
        resetDemo();
        setBias(-15);
    }

    const setOr = () => {
        resetDemo();
        setBias(-5);
    }

    return (
        <div>
            <div className="m-2 flex items-center">
                <div>
                    <MPBasicNeuron 
                    threshold={threshold1}
                    setThreshold={setThreshold1}
                    isGreater={isGreater1}
                    setIsGreater={setIsGreater1}
                    labelColor={props.labelColor} canAddInputs={false} addBias={true} onAnsChange={setAns1} inputs={inputs} setInputs={setInputs} />
                    <MPBasicNeuron 
                    threshold={threshold2}
                    setThreshold={setThreshold2}
                    isGreater={isGreater2}
                    setIsGreater={setIsGreater2}
                    labelColor={props.labelColor} canAddInputs={false} addBias={true} onAnsChange={setAns2} inputs={inputs2} setInputs={setInputs2} />
                </div>
                <div className="">
                    <MPLayerNeuron
                        threshold={thresholdLayer}
                        setThreshold={setThresholdLayer}
                        isGreater={isGreaterLayer}
                        setIsGreater={setIsGreaterLayer}
                        labelColor={props.labelColor} addBias={true} inputs={[answer1, answer2]} weights={weights} setWeights={setWeights} 
                        bias={bias} 
                       />
                </div>
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


export default MLPNeuron;
