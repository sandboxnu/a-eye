import React, { useEffect, useState } from 'react';

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
        /* eslint-disable-next-line */
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

export default ThresholdFunc;