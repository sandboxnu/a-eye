import React, { useEffect, useState } from 'react';
import {AddCircle, RemoveCircle} from '@material-ui/icons';

export type NeuronInput = {
    val: number | null,
    weight: number | null
}

// todo: pass in color for things that might not go well against bg
// what labels should i do for each bubble?
// how to make function piece obviously interactable
// this can take a number => number func, use its tostring to render
const MPNeuron = () => {
    // react draggable?
    const [inputs, setInputs] = useState<NeuronInput[]>(
        [{ val: 0, weight: .5 },
        { val: 1, weight: 1 },
        { val: 0, weight: .2 }]
    );
    const [func, setFunc] = useState(() => ((n: number) => 0));
    // need to recalc output when inputs change!

    const flipInput = (idx: number) => {
        const newVal = inputs[idx].val === 1 ? 0 : 1;
        const newInputs = [...inputs];
        newInputs[idx].val = newVal;
        setInputs(newInputs);
    }
    const changeWeight = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
        const val = parseFloat(e.target.value);
        const newInputs = [...inputs];
        if (!isNaN(val)) {
            newInputs[idx].weight = val;
            setInputs(newInputs);
        } else if (e.target.value === '') {
            newInputs[idx].weight = null;
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
        return prev + (acc.val && acc.weight ? acc.val * acc.weight : 0)
    }, 0);
    const output = func(inputSum);

    const makeInput = (inpt: NeuronInput, idx: number) => {
        const isOne = inpt.val === 1;
        return (
            <div className="flex items-center cursor-pointer">
                <div
                    className="font-bold rounded-full w-12 h-12 bg-navy m-1
                                flex items-center justify-center"
                    style={{
                        backgroundColor: isOne ? INPT_CLR : 'white',
                        border: isOne ? 'none' : `2px solid ${INPT_CLR}`,
                        color: isOne ? 'white' : 'black'
                    }}
                    onClick={() => flipInput(idx)}
                >
                    {inpt.val}
                </div>
                <div className="w-2 h-1 bg-navy" />
                <div className="m-1">
                    <input className="number-input w-16 border-2 border-pink-700"
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
                {inputs.map((val, idx) => makeInput(val, idx))}
            </div>
            <InputLines numInpts={inputs.length} />
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
        <div>
            <RemoveCircle className="icon-button" fontSize="large" onClick={removeInput}/>
            <p className="inline m-2 text-white">{inputs.length} inputs</p>
            <AddCircle className="icon-button" fontSize="large" onClick={addInput}/>
        </div>
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

// outlines
// both > and < shown, highlight the one you want
const ThresholdFunc = (props: { onFuncChange: ((func: (n: number) => number) => void) }) => {
    const [isGreater, setIsGreater] = useState(true);
    const [threshold, setThreshold] = useState<number | null>(2);

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