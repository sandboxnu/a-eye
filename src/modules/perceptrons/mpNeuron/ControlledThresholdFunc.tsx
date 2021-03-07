import React, { useEffect, useState } from 'react';
import { AddCircle, RemoveCircle } from '@material-ui/icons';
import { RblattConfig, INIT_CONFIG } from '../rosenblatt/constants';

// outlines
// both > and < shown, highlight the one you want
type ThresholdFuncType = {
    threshold: number,
    setThreshold,
    isGreater: boolean, 
    setIsGreater, 
    onFuncChange: ((func: (n: number) => number) => void)
};
const ControlledThresholdFunc: React.FC<ThresholdFuncType> = ({threshold, setThreshold, isGreater, setIsGreater, onFuncChange}) => {
    useEffect(() => {
        if (threshold === null) return;
        const func = (n: number) => {
            if (isGreater) {
                return n > threshold ? 1 : 0;
            } else {
                return n < threshold ? 1 : 0;
            }
        };
        onFuncChange(func);
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

export default ControlledThresholdFunc;