import React, { useState } from 'react';
import RblattGraph from './RblattGraph';
import RblattNeuron from './RblattNeuron';

export type RblattInput = { x: number, y: number, z: 0 | 1 };
export type RblattConfig = { weightX: number, weightY: number, bias: number, learningRate: number };

const RosenBlattDemo = (props: { labelColor: string }) => {
    const [inputs, setInputs] = useState<RblattInput[]>(INIT_INPUTS);
    const [config, setConfig] = useState<RblattConfig>(INIT_CONFIG);
    const [currPoint, setCurrPoint] = useState<number>(0);
    const [animInterval, setAnimInterval] = useState<NodeJS.Timeout | null>(null);

    const trainSingle = (prevPoint: number) => {
        if (animInterval) return;
        const nextPoint = (prevPoint + 1) % inputs.length;
        setCurrPoint(nextPoint);
        setConfig(oldConf => {
            const newC = trainRblatt(inputs[nextPoint], oldConf);
            return {...newC, learningRate: oldConf.learningRate}
        });
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

    const resetConfig = () => {setConfig(INIT_CONFIG)};

    return (
        <div className="m-4">
            <div className="m-4 flex items-center justify-center">
                <div className="flex flex-col items-center justify-center">
                    <p className="-m-6 font-bold text-2xl"> 
                        {`${config.weightX.toFixed(1)}x + ${config.weightY.toFixed(1)}y + ${config.bias.toFixed(1)} > 0`}
                    </p>
                    <RblattNeuron input={inputs[currPoint]} config={config}/>
                </div>
                <EditingRblattGraph 
                    inputs={inputs} line={config} 
                    highlighted={inputs[currPoint]}
                    onInputsChange={setInputs}
                />
            </div>
            <button className={`basic-button ${animInterval ? 'alt' : ''}`}
                onClick={animateAll}
            >
                {animInterval ? 'Stop ■' : 'Animate ▶'}
            </button>
            <button className='basic-button' disabled={!!animInterval}
                onClick={() => trainSingle(currPoint)}
            >
                Train Single Point
            </button>
            <button className='basic-button' disabled={!!animInterval}
                onClick={trainAll}
            >
                Train All Points
            </button>
            <button className={`basic-button`}
                onClick={resetConfig}
            >
                Reset
            </button>
        </div>
    );
}
export default RosenBlattDemo;


const EditingRblattGraph = (props: {inputs: RblattInput[], line: RblattConfig,  highlighted: RblattInput,
                            onInputsChange: (inpts: React.SetStateAction<RblattInput[]>) => void}) => 
{
    const [editingType, setEditingType] = useState<{val: 1 | 0 | null}>({val: null});
    const [updated, setUpdated] = useState(false); // yes this is a hack to get it to rerender shhh do not look
    
    return (
    <div className="flex flex-col items-center justify-center">
        <RblattGraph {...props} editingType={editingType} />
        <div className="flex items-center justify-center">
            Add/Remove Points:
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

const INIT_CONFIG = { weightX: -.5, weightY: 1, bias: 7, learningRate: .1 };
const INIT_INPUTS: RblattInput[] = [
    { x: 2.101231155778894, y: 4.947319932998326, z: 0 },
    { x: 0.7838107202680059, y: 4.2886097152428815, z: 0 },
    { x: 2.7711055276381822, y: 9.000921273031828, z: 0 },
    { x: 5.344112227805695, y: 5.910050251256282, z: 0 },
    { x: 5.445452261306533, y: 1.1977386934673367, z: 0 },
    { x: 4.482721943048576, y: -0.7783919597989952, z: 0 },
    { x: 7.725603015075377, y: -3.05854271356784, z: 0 },
    { x: 5.445452261306533, y: -3.210552763819096, z: 0 },
    { x: -0.28025963149078823, y: 2.0084589614740372, z: 1 },
    { x: 2.506591289782244, y: -3.6159128978224464, z: 1 },
    { x: -2.2057202680067015, y: -0.4237018425460638, z: 1 },
    { x: -3.573810720268008, y: 2.819179229480737, z: 1 },
    { x: -5.549941373534341, y: 2.211139028475712, z: 1 },
    { x: 0.5304606365159121, y: -3.109212730318259, z: 1 },
    { x: -4.485871021775546, y: -3.1598827470686774, z: 1 }
];
