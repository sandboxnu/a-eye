import React, { useEffect, useState, useCallback } from 'react';
import RblattGraph from './RblattGraph';
import EditingRblattGraph from './EditingRblattGraph';
import RblattInputsTable from './RblattInputsTable';
import RblattNeuron from './RblattNeuron';
import distanceToLineSegment from 'distance-to-line-segment';
import { RblattInput, RblattConfig, INIT_INPUTS, INIT_CONFIG, CLEARED_INPUTS } from './constants';

const round = (x: number, length: number) => {
    return Math.round(x * (10 ** length)) / (10 ** length);
}

const RosenBlattDemo = (props: { labelColor: string }) => {
    const [inputs, setInputs] = useState<RblattInput[]>(INIT_INPUTS);
    const [config, setConfig] = useState<RblattConfig>(INIT_CONFIG);
    const [currPoint, setCurrPoint] = useState<number>(0);
    const [animInterval, setAnimInterval] = useState<NodeJS.Timeout | null>(null);
    const [binMisclass, setBinMisclass] = useState<number>(0);
    const [msError, setMSError] = useState<number>(0);

    const updateErrors = useCallback((inputs: RblattInput[], config: RblattConfig) => {
        let binCount = 0;
        let msCount = 0
        inputs.forEach(([x, y, z]) => {
            const sum = x * config.weightX + y * config.weightY + config.bias;
            const predicted = sum > 0 ? 1 : 0;
            const error = z - predicted;

            const x1 = 0, y1 = config.bias / - config.weightY;
            const x2 = config.bias / - config.weightX, y2 = 0;
            const msq = distanceToLineSegment.squared(x1, y1, x2, y2, x, y);

            if (error !== 0) {
                binCount++;
            }
            msCount += msq;
        })

        setBinMisclass(binCount);
        setMSError(round(msCount / inputs.length, 3));
    }, []);

    const trainSingle = useCallback((prevPoint: number) => {
        if (animInterval) return;
        const nextPoint = (prevPoint + 1) % inputs.length;
        setCurrPoint(nextPoint);
        setConfig(oldConf => {
            const newC = trainRblatt(inputs[nextPoint], oldConf);
            return { ...newC, learningRate: oldConf.learningRate }
        });
        updateErrors(inputs, config);
    }, [animInterval, inputs, config, updateErrors]);

    const trainAll = useCallback(() => {
        if (animInterval) return;
        // have to keep track of the point index ourselves, because of weird closure things
        // regarding state variables and setInterval
        let newConf: RblattConfig = config;
        inputs.forEach(inpt => {
            newConf = trainRblatt(inpt, newConf);
        })
        setConfig(newConf);
        updateErrors(inputs, config);
    }, [animInterval, config, inputs, updateErrors]);

    const animateAll = useCallback(() => {
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
    }, [animInterval, trainSingle]);

    const resetConfig = useCallback(() => {
        setInputs(INIT_INPUTS);
        setConfig(INIT_CONFIG);
        setCurrPoint(0);
        updateErrors(INIT_INPUTS, INIT_CONFIG);
    }, [setInputs, setConfig, setCurrPoint, updateErrors]);

    const clearConfig = useCallback(() => {
        setInputs([[ 0, 0, 0]]); // TODO: make this 0 points!
        setConfig(INIT_CONFIG);
        setCurrPoint(0);
        updateErrors([], INIT_CONFIG);
    }, [setInputs, setConfig, setCurrPoint, updateErrors]);

    type OperationButtonType = {
        className?: string,
        disabled?: boolean,
        onClick?: () => void,
        text: string,
    }

    const OperationButton: React.FC<OperationButtonType> = ({ className, disabled, onClick, text }) =>
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

    const handleClick = useCallback((clickedX, clickedY, color) => {
        setInputs(inp => {
            console.log(clickedX, clickedY);
            // TODO: should use a bounding box rather than an exact number
            const newInputs = inp.filter(([x, y]) => x !== clickedX && y !== clickedY);
            if(newInputs.length === inp.length) {
                return newInputs.concat([[clickedX, clickedY, color ? color : 0]])  // TODO: Fix Z
            }
            return newInputs;
        })
    }, [setInputs]);

    if(!inputs || inputs.length <= 0) return <div>Reset the graph to start?</div>;

    return (
        <div className="m-4 w-max">
            <div className="m-4 flex items-center justify-center">
                <div className="flex flex-col items-center justify-center">
                    <p className={`m-6 font-bold text-2xl ${props.labelColor}`}>
                        {`${config.weightX.toFixed(1)}x + ${config.weightY.toFixed(1)}y + ${config.bias.toFixed(1)} > 0`}
                    </p>
                    {inputs.length === 0 ? <></> : <RblattNeuron input={inputs[currPoint]} config={config} labelColor={props.labelColor} />}
                    <div className={`font-bold flex items-center justify-center m-4 ${props.labelColor}`}>
                        Learning rate:
                        <input type="range" min="-7" max="1" step="0.1"
                            className="mx-2 w-64"
                            value={Math.log2(config.learningRate)}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setConfig({ ...(config), learningRate: round(2 ** parseFloat(e.target.value), 3) })} />
                        {config.learningRate}
                    </div>
                    <div className={props.labelColor}>
                        <div>Number of Misclassified Points: {binMisclass}</div>
                    </div>
                </div>
                <EditingRblattGraph
                    inputs={inputs} 
                    line={config}
                    highlighted={inputs[currPoint]} 
                    handleClick={handleClick}
                />

            </div>
            <div className='' >
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
                <OperationButton onClick={resetConfig} text={"Reset"} />
                <OperationButton onClick={clearConfig} text={"Clear All"} />

            </div>
            {inputs.length === 0 ? <></> : <RblattInputsTable labelColor={props.labelColor} data={inputs} />}
        </div>
    );
}
export default RosenBlattDemo;

// ooooohh the sexy sexy math
function trainRblatt(inpt: RblattInput, config: RblattConfig) {
    const [ x, y, z] = inpt;
    const sum = x * config.weightX + y * config.weightY + config.bias;
    const predicted = sum > 0 ? 1 : 0;
    const error = z - predicted;
    if (error !== 0) {
        const newWeightX = config.weightX + config.learningRate * error * x;
        const newWeightY = config.weightY + config.learningRate * error * y;
        const newBias = config.bias + config.learningRate * error;
        return { ...config, bias: newBias, weightX: newWeightX, weightY: newWeightY, error };
    } else {
        return { ...config, error }
    }
}