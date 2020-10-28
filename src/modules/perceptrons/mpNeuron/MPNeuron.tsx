import React from 'react';
const { Flowpoint, Flowspace } = require('flowpoints');

const MPNeuron = () => {

    const inputs = [0, 1, 0];
    const top = 50;
    const left = 50;

    const makeInput = (val: number, idx: number) => {
        return (
        <Flowpoint
            key={`input-${idx}`}
            outputs={["dendrite"]}
            startPosition={{ x: left, y: top + idx * 60 }}
            minX={50}
            minY={50}
            width={50}
            height={50}
        >
            {val}
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
                    3
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
                    {"> 2"} 
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