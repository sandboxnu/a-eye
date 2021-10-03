import { NeuronConfig } from "../mpNeuron/utils";

const neuronInputConfig: NeuronConfig[][] = [
  [
    {
      weights: [-0.5],
      bias: 0,
      isGreater: true,
      threshold: 0,
      output: 0,
    },
    {
      weights: [1],
      bias: 0,
      isGreater: true,
      threshold: 0,
      output: 1,
    },
  ],
  [
    {
      weights: [-0.5, 1],
      bias: 0,
      output: 123123,
      isGreater: true,
      threshold: 0,
    },
  ],
];

export { neuronInputConfig };
