import { NeuronConfig } from "../mpNeuron/utils";

const neuronInputConfig: NeuronConfig[][] = [
  [
    {
      weights: [-0.5],
      bias: 0,
      greaterThan: true,
      thresholdVal: 0,
      output: 0,
    },
    {
      weights: [1],
      bias: 0,
      greaterThan: true,
      thresholdVal: 0,
      output: 1,
    },
  ],
  [
    {
      weights: [-0.5, 1],
      bias: 0,
      output: 123123,
      greaterThan: true,
      thresholdVal: 0,
    },
  ],
];

export { neuronInputConfig };
