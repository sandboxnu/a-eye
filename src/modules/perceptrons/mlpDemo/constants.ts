const neuronInputConfig: NeuronConfig[][] = [
  [
    {
      weights: [-0.5],
      bias: 10,
      greaterThan: true,
      thresholdVal: 0,
      output: 0,
    },
    {
      weights: [1],
      bias: 10,
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

export type NeuronConfig = {
  weights: number[];
  bias: number;
  output: number;
  greaterThan: boolean;
  thresholdVal: number;
};

export { neuronInputConfig };
