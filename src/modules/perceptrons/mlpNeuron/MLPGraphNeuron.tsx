import React, { useEffect, useState } from 'react';
import MPBasicNeuron, { NeuronInput } from '../mpNeuron/MPBasicNeuron';
import MPLayerNeuron from '../mpNeuron/MPLayerNeuron';

import {RblattInput} from '../rosenblatt/constants'

// inputCoordinates is array of two elements
const MLPGraphNeuron = (props: { labelColor: string, inputCoordinates: RblattInput}) => {
    const initialWeights = [-.5, 1];
    const DEFAULT_BIAS = 10;

    const [answer1, setAns1] = useState(0);
    const [answer2, setAns2] = useState(0);

    const [weights, setWeights] = useState<number[]>(initialWeights);
    const [weights1, setWeights1] = useState<number[]>([initialWeights[0]]);
    const [weights2, setWeights2] = useState<number[]>([initialWeights[1]]);

    // const [inputs, setInputs] = useState<NeuronInput[]>(defaultInput);
    // const [inputs2, setInputs2] = useState<NeuronInput[]>(defaultInput);

    const [threshold1, setThreshold1] = useState(0);
    const [isGreater1, setIsGreater1] = useState(true);

    const [threshold2, setThreshold2] = useState(0);
    const [isGreater2, setIsGreater2] = useState(true);

    const [thresholdLayer, setThresholdLayer] = useState(0);
    const [isGreaterLayer, setIsGreaterLayer] = useState(true);

    const [bias, setBias] = useState(10);

    const resetDemo = () => {
        setWeights([10, 10]);
        setWeights1([10]);
        setWeights2([10]);
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


export default MLPGraphNeuron;
