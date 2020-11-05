import React, { useEffect, useState } from 'react';

type NeuronInput = {
    val: number | null, 
    weight: number | null
}

// todo: pass in color for things that might not go well against bg
// what labels should i do for each bubble?
// how to make function piece obviously interactable
// this can take a number => number func, use its tostring to render
const MPNeuron = () => {
    // react draggable?
    const [inputs, setInputs] = useState <NeuronInput[]>(
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

    const inputSum = inputs.reduce((prev, acc) => {
        return prev + (acc.val && acc.weight ? acc.val * acc.weight : 0)
    }, 0);
    const output = func(inputSum);

    const makeInput = (inpt: NeuronInput, idx: number) => {
        const isOne = inpt.val === 1;
        return (
            <div className="flex items-center">
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
        <div className="flex items-center">
            <div className="flex flex-col">
                {inputs.map((val, idx) => makeInput(val, idx))}
            </div>
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
    );
}

const ThresholdFunc = (props: { onFuncChange: ((func: (n: number) => number) => void) }) => {
    const [isGreater, setIsGreater] = useState(true);
    const [threshold, setThreshold] = useState<number|null>(2);

    useEffect(() => {
        if (threshold === null) return;
        const func = (n: number) => (n - threshold > 0) === isGreater ? 1 : 0;
        props.onFuncChange(func);
    }, [isGreater, threshold])

    return (
        <div className="font-bold w-20 h-10 rounded-md bg-orange-500 
                        flex items-center justify-center px-2">
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