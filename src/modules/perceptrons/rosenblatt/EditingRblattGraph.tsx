import React, {useEffect, useState} from 'react';
import RblattGraph from './RblattGraph';
import {RblattInput, RblattConfig, INIT_INPUTS, INIT_CONFIG, CLEARED_INPUTS} from './constants';

type EditingRblattGraphProps = {
    inputs: RblattInput[],
    line?: RblattConfig,
    highlighted?: RblattInput,
    onInputsChange: (inpts: React.SetStateAction<RblattInput[]>) => void,
    reset: {isReset:boolean, setReset:Function},
    clear: {isCleared:boolean, setCleared:Function}
 }

// const EditingRblattGraph = (props: {inputs: RblattInput[], line: RblattConfig,  highlighted: RblattInput,
//     onInputsChange: (inpts: React.SetStateAction<RblattInput[]>) => void,
//     reset: {isReset:boolean, setReset:Function},
//     clear: {isCleared:boolean, setCleared:Function}}) 
    
    
const EditingRblattGraph = (props: EditingRblattGraphProps) =>
{
    const [editingType, setEditingType] = useState<{val: 1 | 0 | null}>({val: 0});
    const [updated, setUpdated] = useState(false); // yes this is a hack to get it to rerender shhh do not look

    return (
        <div className="flex flex-col items-center justify-center">
            <RblattGraph {...props} editingType={editingType}  />
            <div className="flex items-center justify-center">
                <p className="text-modulePaleBlue">Select Point Color:</p>
                <button className={`basic-button alt py-1 px-2 bg-orange-500 border-4 ${editingType.val === 0 ? 'border-orange-800' : 'border-transparent'} `}
                        onClick={() => {
                            editingType.val === 0 ? setEditingType(et => {et.val = null; return et}) : setEditingType(et => {et.val = 0; return et});
                            setUpdated(!updated);
                        }}
                >
                    Orange
                </button>
                <button className={`basic-button py-1 px-2 bg-lightNavy border-4 ${editingType.val === 1 ? 'border-blue-900' : 'border-transparent'}`}
                        onClick={() => {
                            editingType.val === 1 ? setEditingType(et => {et.val = null; return et}) : setEditingType(et => {et.val = 1; return et});
                            setUpdated(!updated);
                        }}
                >
                    Blue
                </button>
            </div>
        </div>);
}

export default EditingRblattGraph;