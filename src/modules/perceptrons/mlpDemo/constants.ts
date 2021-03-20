const neuronInputConfig = [
    [
        {
            inputs: [1],
            weights: [-0.5],
            bias: 10,
            thresholdDir: true,
            thresholdVal: 0,
            output: 0,
        },
        {
            inputs: [1],
            weights: [1],
            bias: 10,
            thresholdDir: true,
            thresholdVal: 0,
            output: 0,
        },
    ],
    [
        {
            inputs: [1, 1],
            weights: [-0.5, 1],
            bias: 10,
            thresholdDir: true,
            thresholdVal: 0,
        },
    ]
]

export type NeuronConfig= {
    inputs: number[],
    weights: number[],
    bias: number,
    thresholdDir: boolean, 
    thresholdVal: number}[][]

export {neuronInputConfig};