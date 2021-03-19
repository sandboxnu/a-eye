import React, { useEffect, useState } from 'react';
import ControlledThresholdFunc from './ControlledThresholdFunc';

const zip = (arr1: Array<any>, arr2: Array<any>) => {
    return arr1.map(function (e, i) {
        return [e, arr2[i]];
    });
}

const InputLinesLayer = (props: { numInpts: number }) => {
    const height = 56 * props.numInpts;
    const centerY = height / 2;

    return (
        <div>
            <svg width='125px' height={height} viewBox={`0 0 125 ${height}`} xmlns="http://www.w3.org/2000/svg">
                {Array(props.numInpts).fill(null).map((_, idx) => (
                    <line key={idx}
                        x1="0" y1={idx * 56 * 2 + 28}
                        x2="125" y2={centerY}
                        strokeWidth="4px" stroke="#394D73"
                    />
                ))}
            </svg>
        </div>
    );
}

export type MPLayerNeuronType = {
    labelColor: string,
    addBias?: boolean,
    inputs: number[],
    weights: number[],
    setWeights: (inpts: React.SetStateAction<number[]>) => void,
    bias: number,
    threshold: number,
    setThreshold,
    isGreater: boolean, 
    setIsGreater, 
    setOutput?: (inpts: React.SetStateAction<number>) => void,
    showInput?: boolean,
}

const MPLayerNeuron: React.FC<MPLayerNeuronType> = ({
    labelColor,
    addBias = false,
    inputs,
    weights,
    setWeights = (() => null),
    bias,
    threshold,
    setThreshold,
    isGreater, 
    setIsGreater, 
    setOutput = (() => null),
    showInput = false,
}) => {
    const [func, setFunc] = useState(() => ((n: number) => 0));

    const changeWeight = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
        const val = parseFloat(e.target.value);
        const newInputs = JSON.parse(JSON.stringify((weights)));
        if (!isNaN(val)) {
            newInputs[idx] = val;
            setWeights(newInputs);
        } else if (e.target.value === '') {
            newInputs[idx] = null;
            setWeights(newInputs);
        }
    }

    const onFuncChange = (func: (n: number) => number) => {
        setFunc(() => ((n: number) => func(n)));
    }

    const inputSum = zip(inputs, weights).reduce((prev, acc) => {
        return (acc[0] && acc[1] ? acc[0] * acc[1] : 0) + prev
    }, 0) + bias;

    const output = func(inputSum);
    setOutput(output);

    const makeInput = (inpt: number, weight: number, idx: number) => {
        return (
            <div className="flex items-center cursor-pointer pb-2.5 pt-16">
                {showInput && 
                    <div
                        className="rounded-full w-12 h-12 font-bold bg-moduleTeal flex items-center justify-center"
                        style={{
                            backgroundColor: OUTPT_CLR,
                            border: 'none'
                        }}
                    >
                        {inpt.toFixed(2)}
                    </div>
                }
                <div className="w-10 h-1 bg-navy" />
                <div className="m-1">
                    <input className="number-input w-20 h-10 border-2 border-pink-700"
                        type="number"
                        value={weight !== null ? weight : ''}
                        onChange={(e) => changeWeight(e, idx)}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="m-2 flex flex-col items-center justify-center">
            <div className="flex items-center">
                <div className="flex flex-col h-36">
                    {zip(inputs, weights).map(([input, weight], index) => makeInput(input, weight, index))}
                    {addBias && <div className="flex items-center self-end">
                        <p className={labelColor}>bias</p>
                        <div
                            className="font-bold rounded-full w-12 h-12 bg-pink-700 m-1
                                        flex items-center justify-center text-white"
                        >
                            {bias}
                        </div>
                    </div>}
                </div>

                <InputLinesLayer numInpts={(addBias ? 1 : 0) + inputs.length} />
                <div className="rounded-full w-20 h-20 bg-brightOrange 
                flex items-center justify-center">
                    {inputSum.toFixed(2)}
                </div>
                <div className="w-2 h-1 bg-navy" />
                <ControlledThresholdFunc
                    threshold={threshold}
                    setThreshold={setThreshold}
                    isGreater={isGreater}
                    setIsGreater={setIsGreater}
                    onFuncChange={onFuncChange} 
                    />
                <div className="w-16 h-1 bg-navy" />
                <div
                    className="rounded-full w-12 h-12 font-bold bg-moduleTeal flex items-center justify-center"
                    style={{
                        backgroundColor: output === 1 ? OUTPT_CLR : 'white',
                        border: output === 1 ? 'none' : `2px solid ${OUTPT_CLR}`
                    }}
                >
                    {output}
                </div>
            </div>
        </div>
    );
}

const INPT_CLR = '#b92079';
const OUTPT_CLR = '#0FD4C0';

export default MPLayerNeuron;