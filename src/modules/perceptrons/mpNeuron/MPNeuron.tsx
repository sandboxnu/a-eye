import React, { useEffect, useState } from 'react';
import { AddCircle, RemoveCircle } from '@material-ui/icons';
import { RblattConfig, INIT_CONFIG } from '../rosenblatt/constants';


const zip = (arr1: Array<any>, arr2: Array<any>) => {
    return arr1.map(function (e, i) {
        return [e, arr2[i]];
    });
}

export type NeuronInput = {
    val: number | null,
    weight: number | null
}

export type MPNeuronType = {
    labelColor: string,
    canAddInputs?: boolean,
    addBias?: boolean,
    input?: { val: number, weight: number }[],
    onAnsChange?: (inpts: React.SetStateAction<number>) => void,
    connecting?: boolean
}

export const MPNeuron: React.FC<MPNeuronType> = ({
    labelColor,
    canAddInputs = true,
    addBias = false,
    input = [{ val: 1, weight: -.5 },
    { val: 1, weight: 1 }],
    onAnsChange = (() => null),
    connecting = false
}) => {
    console.log(input);

    const [inputs, setInputs] = useState<NeuronInput[]>(input);
    const [func, setFunc] = useState(() => ((n: number) => 0));
    console.log(inputs);

    const changeWeight = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
        const val = parseFloat(e.target.value);
        const newInputs = JSON.parse(JSON.stringify((inputs)));
        if (!isNaN(val)) {
            newInputs[idx].weight = val;
            setInputs(newInputs);
        } else if (e.target.value === '') {
            newInputs[idx].weight = null;
            setInputs(newInputs);
        }
    }

    const changeVal = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
        const val = parseFloat(e.target.value);
        const newInputs = JSON.parse(JSON.stringify((inputs)));
        // const newInputs = []
        if (!isNaN(val)) {
            newInputs[idx].val = val;
            setInputs(newInputs);
        } else if (e.target.value === '') {
            newInputs[idx].val = null;
            setInputs(newInputs);
        }
    }

    const onFuncChange = (func: (n: number) => number) => {
        setFunc(() => ((n: number) => func(n)));
    }
    const removeInput = () => {
        const newInputs = [...inputs];
        newInputs.pop();
        setInputs(newInputs);
    }
    const addInput = () => {
        const newInputs = [...inputs];
        newInputs.push({ val: 1, weight: .5 });
        setInputs(newInputs);
    }

    const inputSum = inputs.reduce((prev, acc) => {
        return (acc.val && acc.weight ? acc.val * acc.weight : 0) + prev
    }, 0) + INIT_CONFIG.bias;

    const output = func(inputSum);
    onAnsChange(output);

    const makeInput = (inpt: NeuronInput, idx: number, connecting: boolean) => {
        return (
            <div className="flex items-center cursor-pointer">
                {!connecting && <div className="m-1">
                    <input className="number-input w-20 h-10 border-2 border-pink-700"
                        type="number"
                        value={inpt.val !== null ? inpt.val : ''}
                        onChange={(e) => changeVal(e, idx)}
                    />
                </div>}
                <div className="w-10 h-1 bg-navy" />
                <div className="m-1">
                    <input className="number-input w-20 h-10 border-2 border-pink-700"
                        type="number"
                        value={inpt.weight !== null ? inpt.weight : ''}
                        onChange={(e) => changeWeight(e, idx)}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="m-2 flex flex-col items-center justify-center">
            <div className="flex items-center">
                <div className="flex flex-col">
                    {inputs.map((val, idx) => makeInput(val, idx, connecting))}
                    {addBias && <div className="flex items-center self-end">
                        <p className={labelColor}>bias</p>
                        <div
                            className="font-bold rounded-full w-12 h-12 bg-pink-700 m-1
                                        flex items-center justify-center text-white"
                        >

                            {INIT_CONFIG.bias.toFixed(1)}
                        </div>

                    </div>}
                </div>

                <InputLines numInpts={(addBias ? 1 : 0) + inputs.length} />
                <div className="rounded-full w-20 h-20 bg-brightOrange 
                flex items-center justify-center">
                    {inputSum}
                </div>
                <div className="w-2 h-1 bg-navy" />
                <ThresholdFunc onFuncChange={onFuncChange} />
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
            {canAddInputs && <div>

                <RemoveCircle className="icon-button" fontSize="large" onClick={removeInput} />
                <p className="inline m-2 text-white">{inputs.length} inputs</p>
                <AddCircle className="icon-button" fontSize="large" onClick={addInput} />
            </div>}
        </div>
    );
}

export const InputLines = (props: { numInpts: number }) => {
    const height = 56 * props.numInpts;
    const centerY = height / 2;

    return (
        <div>
            <svg width='125px' height={height} viewBox={`0 0 125 ${height}`} xmlns="http://www.w3.org/2000/svg">
                {Array(props.numInpts).fill(null).map((_, idx) => (
                    <line key={idx}
                        x1="0" y1={idx * 56 + 28}
                        x2="125" y2={centerY}
                        strokeWidth="4px" stroke="#394D73"
                    />
                ))}
            </svg>
        </div>
    );
}

export const InputLinesLayer = (props: { numInpts: number }) => {
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
    initialWeights: number[],
    inputs: number[],
    onAnsChange?: (inpts: React.SetStateAction<number>) => void,
}

export const MPLayerNeuron: React.FC<MPLayerNeuronType> = ({
    labelColor,
    addBias = false,
    initialWeights = [-.5, 1],
    inputs,
    onAnsChange = (() => null),
}) => {
    const [weights, setWeights] = useState<number[]>(initialWeights);
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
    }, 0) + INIT_CONFIG.bias;

    const output = func(inputSum);
    onAnsChange(output);

    const makeInput = (inpt: number, idx: number) => {
        return (
            <div className="flex items-center cursor-pointer pb-2.5 pt-16">
                <div className="w-10 h-1 bg-navy" />
                <div className="m-1">
                    <input className="number-input w-20 h-10 border-2 border-pink-700"
                        type="number"
                        value={inpt !== null ? inpt : ''}
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
                    {weights.map((weight, index) => makeInput(weight, index))}
                    {addBias && <div className="flex items-center self-end">
                        <p className={labelColor}>bias</p>
                        <div
                            className="font-bold rounded-full w-12 h-12 bg-pink-700 m-1
                                        flex items-center justify-center text-white"
                        >
                            {INIT_CONFIG.bias.toFixed(1)}
                        </div>
                    </div>}
                </div>

                <InputLinesLayer numInpts={(addBias ? 1 : 0) + inputs.length} />
                <div className="rounded-full w-20 h-20 bg-brightOrange 
                flex items-center justify-center">
                    {inputSum}
                </div>
                <div className="w-2 h-1 bg-navy" />
                <ThresholdFunc onFuncChange={onFuncChange} />
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



// outlines
// both > and < shown, highlight the one you want
const ThresholdFunc = (props: { onFuncChange: ((func: (n: number) => number) => void) }) => {
    const [isGreater, setIsGreater] = useState(true);
    const [threshold, setThreshold] = useState<number | null>(0);

    useEffect(() => {
        if (threshold === null) return;
        const func = (n: number) => {
            if (isGreater) {
                return n > threshold ? 1 : 0;
            } else {
                return n < threshold ? 1 : 0;
            }
        };
        props.onFuncChange(func);
    }, [isGreater, threshold])

    return (
        <div className="font-bold w-20 h-10 rounded-md border-2 border-orange-500 
                        flex items-center justify-center px-2 text-white">
            <div className="cursor-pointer"
                onClick={() => setIsGreater(!isGreater)}
            >
                {isGreater ? '>' : '<'}
            </div>
            <input className="number-input w-10 border-0 bg-transparent"
                type="number"
                value={threshold !== null ? threshold : ''}
                onChange={(e) => {
                    if (e.target.value === '') setThreshold(null);
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val)) setThreshold(val);
                }}
            />
        </div>
    );
}

const INPT_CLR = '#b92079';
const OUTPT_CLR = '#0FD4C0';

export default MPNeuron;