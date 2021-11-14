/* eslint-disable */
import React from "react";
import { RblattConfig, RblattInput } from "./constants";
import MPBasicNeuron from "../mpNeuron/MPBasicNeuron";
import { calculateThreshold, calculateInputSum } from "../mpNeuron/utils";

type RblattNeuronType = {
  input: RblattInput;
  config: RblattConfig;
  labelColor: string;
};

// a static version of the neuron demo, for the Rblatt demo
const RblattNeuron: React.FC<RblattNeuronType> = ({
  input,
  config,
  labelColor,
}) => {
  const inputs = input.slice(0, 2);
  const weights = [config.weightX, config.weightY];
  const bias = config.bias;
  const threshold = 0;
  const isGreater = true;
  const inputSum = calculateInputSum(inputs, weights, bias);
  const output = calculateThreshold(inputSum, isGreater, threshold);

  return (
    <MPBasicNeuron
      labelColor={labelColor}
      inputs={inputs}
      weights={weights}
      bias={bias}
      threshold={threshold}
      isGreater={isGreater}
      output={output}
    />
  );
};

export default RblattNeuron;
