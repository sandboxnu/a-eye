import React, { useEffect, useState } from 'react';
import RblattGraph from './RblattGraph';
import { RblattInput, RblattConfig, INIT_INPUTS, INIT_CONFIG, CLEARED_INPUTS } from './constants';
import { NeuronInput } from '../mpNeuron/MPBasicNeuron';

import { NeuronConfig } from '../mlpDemo/constants';

type EditingRblattGraphProps = {
    inputs: RblattInput[],
    line?: RblattConfig,
    highlighted?: RblattInput,
    allowSelectingPointColor?: boolean,
    calculatePointColor?: (RblattInput, NeuronConfig) => 0 | 1,
    handleClick?: any,
}

const EditingRblattGraph: React.FC<EditingRblattGraphProps> = ({
    inputs,
    line = undefined,
    highlighted = undefined,
    allowSelectingPointColor = true,
    handleClick,
}) => {
    const [editingType, setEditingType] = useState< 1 | 0 >(0);

    return (
        <div className="flex flex-col items-center justify-center">
            <RblattGraph
                inputs={inputs}
                line={line}
                highlighted={highlighted}
                editingType={editingType}
                handleClick={handleClick}
            />
            <div className="flex items-center justify-center">
                {allowSelectingPointColor && <>
                    <p className="text-modulePaleBlue">Select Point Color:</p>
                    <button className={`basic-button alt py-1 px-2 bg-orange-500 border-4 ${editingType === 0 ? 'border-orange-800' : 'border-transparent'} `}
                        onClick={() => setEditingType(et => (et==0 ? 1 : 0))}
                    >
                        Orange
                </button>
                    <button className={`basic-button py-1 px-2 bg-lightNavy border-4 ${editingType === 1 ? 'border-blue-900' : 'border-transparent'}`}
                        onClick={() => setEditingType(et => (et==0 ? 1 : 0))}
                    >
                        Blue
                </button>
                </>}
            </div>
        </div>);
}

export default EditingRblattGraph;