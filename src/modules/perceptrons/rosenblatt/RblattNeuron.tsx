import React from 'react';
import {InputLines} from '../mpNeuron/MPNeuron';
import {RblattConfig, RblattInput} from './constants';

// todo: make output colors match orange/blue
// actually that doesnt work bc the output color changes based on the updated config
// so you never see any error predictions

type RblattNeuronType = {
    input: RblattInput,
    config: RblattConfig,
    labelColor: string,
}

// a static version of the neuron demo, for the Rblatt demo
const RblattNeuron: React.FC<RblattNeuronType> = ({input, config, labelColor}) => {
    const [x, y, z] = input;

    const inputSum = x * config.weightX + y * config.weightY + config.bias;
    const output = inputSum > 0 ? 1 : 0;

    const makeInput = (val: number, weight: number, label: string) => {
        return (
            <div className={`flex items-center ${labelColor}`}>
                {label}
                <div
                    className="text-black font-bold rounded-full w-12 h-12 m-1 border-2 border-pink-700 bg-white
                                flex items-center justify-center"
                >
                    {val.toFixed(1)}
                </div>
                <div className="w-2 h-1 bg-navy" />
                <div className="m-1">
                    <input className="number-input w-16 border-none bg-pink-700 font-bold text-white py-1"
                        type="number" readOnly={true}
                        value={weight.toFixed(1)}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center m-4">
            <div className="flex flex-col">
                {makeInput(x, config.weightX, 'x')}
                {makeInput(y, config.weightY, 'y')}
                <div className="flex items-center self-end">
                    <p className={labelColor}>bias</p>
                    <div
                        className="font-bold rounded-full w-12 h-12 bg-pink-700 m-1
                                    flex items-center justify-center text-white"
                    >
                        {config.bias.toFixed(1)}
                    </div>
                </div>
            </div>
            <InputLines numInpts={3} />
            <div className="rounded-full w-20 h-20 bg-white border-2 border-orange-500 
                flex items-center justify-center">
                {inputSum.toFixed(1)}
            </div>
            <div className="w-2 h-1 bg-navy" />
            <div className={`w-20 h-10 rounded-md border-2 border-orange-500 flex items-center justify-center px-2 ${labelColor}`}>
                {'> 0'}
            </div>
            <div className="w-16 h-1 bg-navy" />
            <div
                className="rounded-full w-12 h-12 font-bold border-2 border-moduleTeal bg-white 
                        flex items-center justify-center"
            >
                {output}
            </div>
        </div>
    );
}

export default RblattNeuron;