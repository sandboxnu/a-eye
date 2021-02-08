import React, {useEffect, useState} from 'react';
import RblattGraph from './RblattGraph';
import RblattInputsTable from './RblattInputsTable';
import RblattNeuron from './RblattNeuron';
import distanceToLineSegment from 'distance-to-line-segment';
import {RblattInput, RblattConfig, INIT_INPUTS, INIT_CONFIG, CLEARED_INPUTS} from './constants';

const round = (x: number, length: number) => {
    return Math.round(x * (10 ** length)) / (10 ** length);
}

const RosenBlattDemo = (props: { labelColor: string }) => {
    const [inputs, setInputs] = useState<RblattInput[]>(INIT_INPUTS);
    const [config, setConfig] = useState<RblattConfig>(INIT_CONFIG);
    const [currPoint, setCurrPoint] = useState<number>(0);
    const [animInterval, setAnimInterval] = useState<NodeJS.Timeout | null>(null);
    const [binMisclass, setBinMisclass] = useState<number>(0);
    const [msError, setMSEror] = useState<number>(0);
    const [isReset, setReset] = useState(false);
    const [isCleared, setCleared] = useState(false);

    const updateErrors = (inputs: RblattInput[], config: RblattConfig) => {
        let binCount = 0;
        let msCount = 0
        inputs.forEach(inpt => {
            const sum = inpt.x * config.weightX + inpt.y * config.weightY + config.bias;
            const predicted = sum > 0 ? 1 : 0;
            const error = inpt.z - predicted;

            const x1 = 0, y1 = config.bias / - config.weightY;
            const x2 = config.bias / - config.weightX,  y2 = 0;
            const msq = distanceToLineSegment.squared(x1, y1, x2, y2, inpt.x, inpt.y);

            if (error !== 0) {
                binCount++;
            }
            msCount += msq;
        })

        setBinMisclass(binCount);
        setMSEror(round(msCount / inputs.length, 3));
    }

    const trainSingle = (prevPoint: number) => {
        if (animInterval) return;
        const nextPoint = (prevPoint + 1) % inputs.length;
        setCurrPoint(nextPoint);
        setConfig(oldConf => {
            const newC = trainRblatt(inputs[nextPoint], oldConf);
            return {...newC, learningRate: oldConf.learningRate}
        });
        updateErrors(inputs, config);
    } 

    const trainAll = () => {
        if (animInterval) return;
        // have to keep track of the point index ourselves, because of weird closure things
        // regarding state variables and setInterval
        let newConf: RblattConfig = config;
        inputs.forEach(inpt => {
            newConf = trainRblatt(inpt, newConf);
        })
        setConfig(newConf);
        updateErrors(inputs, config);
    }

    const animateAll = () => {
        if (animInterval) {
            clearInterval(animInterval);
            setAnimInterval(null);
        } else {
            let prev = -1;
            const interval = setInterval(() => {
                trainSingle(prev) 
                prev += 1;
            }, 1000);
            setAnimInterval(interval);
        }
    }

    const resetConfig = () => {
        setReset(true);
    }

    const clearConfig = () => {
        setCleared(true);
    }

    useEffect(() => {
        if (!isReset) {
            setInputs(INIT_INPUTS);
            setConfig(INIT_CONFIG);
            setCurrPoint(0);
            updateErrors(INIT_INPUTS, INIT_CONFIG);
        }
    }, [isReset]);

    type OperationButtonType = {
        className?: string,
        disabled?: boolean,
        onClick?: () => void,
        text: string,
    }

    const OperationButton: React.FC<OperationButtonType> = ({className, disabled, onClick, text}) => 
        (<button className={`basic-button flex-shrink-0 ${className ? className : ''}`}
                 disabled={true && disabled}
                 onClick={onClick ? onClick : () => null}> {text} </button>);

    /*
       bugs:
       - can't train with 0 points
       - reset doesn't reset the lines
       - removing points doesn't remove data
       - replace whole diagram with 'add some points to start!'
     */
    return (
        <div className="m-4">
            <div className="m-4 flex items-center justify-center">
                <div className="flex flex-col items-center justify-center">
                    <p className={`m-6 font-bold text-2xl ${props.labelColor}`}>
                        {`${config.weightX.toFixed(1)}x + ${config.weightY.toFixed(1)}y + ${config.bias.toFixed(1)} > 0`}
                    </p>
                    {inputs.length === 0 ? <></> : <RblattNeuron input={inputs[currPoint]} config={config} labelColor={props.labelColor}/>}
                    <div className={`font-bold flex items-center justify-center m-4 ${props.labelColor}`}>
                        Learning rate:
                        <input type="range" min="-7" max="1" step="0.1" 
                            className="mx-2 w-64"
                            value={Math.log2(config.learningRate)}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setConfig({...(config), learningRate: round(2 ** parseFloat(e.target.value), 3)})}/>
                        {config.learningRate}
                    </div>
                    <div className={props.labelColor}>
                        <div>Number of Misclassified Points: {binMisclass}</div>
                    </div>
                </div>
                <EditingRblattGraph
                    inputs={inputs} line={config}
                    highlighted={inputs[currPoint]}
                    onInputsChange={setInputs}
                    reset={{isReset, setReset}}
                    clear={{isCleared, setCleared}}
                />

            </div>
        <div className='flex' >
            <OperationButton
                className={animInterval ? 'alt' : ''}
                onClick={animateAll}
                text={animInterval ? 'Stop ■' : 'Animate ▶'}
            />
            <OperationButton
                disabled={!!animInterval || inputs.length === 0}
                onClick={() => trainSingle(currPoint)}
                text={"Train Single Point"}
            />
            <OperationButton
                disabled={!!animInterval || inputs.length === 0}
                onClick={trainAll}
                text={"Train All Points"}
            />
            <OperationButton onClick={resetConfig} text={"Reset"}/>
            <OperationButton onClick={clearConfig} text={"Clear All"}/>

            </div>
            {inputs.length === 0 ? <></> : <RblattInputsTable labelColor={props.labelColor} data={inputs}/>}
        </div>
    );
}
export default RosenBlattDemo;


const EditingRblattGraph = (props: {inputs: RblattInput[], line: RblattConfig,  highlighted: RblattInput,
                            onInputsChange: (inpts: React.SetStateAction<RblattInput[]>) => void,
                                    reset: {isReset:boolean, setReset:Function},
                                    clear: {isCleared:boolean, setCleared:Function}}) => 
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

// ooooohh the sexy sexy math
function trainRblatt(inpt: RblattInput, config: RblattConfig) {
    const sum = inpt.x * config.weightX + inpt.y * config.weightY + config.bias;
    const predicted = sum > 0 ? 1 : 0;
    const error = inpt.z - predicted;
    if (error !== 0) {
        const newWeightX = config.weightX + config.learningRate * error * inpt.x;
        const newWeightY = config.weightY + config.learningRate * error * inpt.y;
        const newBias = config.bias + config.learningRate * error;
        return { ...config, bias: newBias, weightX: newWeightX, weightY: newWeightY, error };
    } else {
        return { ...config, error }
    }
}
