import React, { useState } from 'react';
const { Flowpoint, Flowspace } = require('flowpoints');

const MPNeuron = () => {
    // for some reason putting each input in an object makes the ui update correctly??
    // doing MP neuron, but with weights? are weights part of the og mp neuron stuff
    // react draggable?
    const [inputs, setInputs] = useState(
        [{val: 0, weight: .5}, 
        {val: 1, weight: 1}, 
        {val: 0, weight: .2}]
    );
    const top = 50;
    const left = 50;

    const flipInput = (idx: number) => {
        const newVal = inputs[idx].val === 1 ? 0 : 1;
        const newInputs = [...inputs];
        newInputs[idx].val = newVal;
        setInputs(newInputs);
    }
    const findSum = () => inputs.reduce((prev, acc) => prev + acc.val, 0);

    const makeInput = (inpt: {val: number}, idx: number) => {
        return (
        <Flowpoint
            key={idx}
            outputs={["dendrite"]}
            startPosition={{ x: left, y: top + idx * 60 }}
            minX={40} minY={40}
            width={40} height={40}
            onClick={() => flipInput(idx)}
            dragX={false} dragY={false}
        >
            <div className="flex flex-col justify-center h-full">{inpt.val}</div>
        </Flowpoint>);
    }

    return (
        <div>
            <Flowspace
                theme="indigo"
                variant="filled"
                background="black"
                style={{ width:'100vw', height:'50vh' }}
            >
                {inputs.map((val, idx) => makeInput(val, idx))}
                <Flowpoint
                    key="dendrite"
                    outputs={["non-linearity"]}
                    startPosition={{ x: left + 350, y: top + 45 }}
                    minX={100}
                    minY={100}
                    width={100}
                    height={100}
                    dragX={false}
                    dragY={false}
                >
                    dendrite <br/> 
                    {findSum()}
                </Flowpoint>
                <Flowpoint
                    key="non-linearity"
                    outputs={["output"]}
                    startPosition={{ x: left + 500, y: top + 55 }}
                    minX={200}
                    minY={80}
                    width={200}
                    height={80}
                    dragX={false}
                    dragY={false}
                >
                    <div className="inline"> 
                    {'>'} <input className="z-10 relative w-24" type="number"/>
                    </div>
                </Flowpoint>
                <Flowpoint
                    key="output"
                    startPosition={{ x: left + 750, y: top + 70 }}
                    minX={50}
                    minY={50}
                    width={50}
                    height={50}
                >
                    1 
                </Flowpoint>

            </Flowspace>
        </div>
    );
}

export default MPNeuron;