/* eslint-disable */
import React, { useState } from "react";
import { INIT_CONFIG } from "../rosenblatt/constants";
import MPBasicNeuron from "./MPBasicNeuron";
import { calculateThreshold, calculateInputSum } from "./utils";

type MPNeuronType = {
  labelColor: string;
  canAddInputs?: boolean;
  input?: number[];
  weight?: number[];
  connecting?: boolean;
  startThreshold?: number;
  startGreater?: boolean;
  bias?: number;
};

export const MPNeuron: React.FC<MPNeuronType> = ({
  labelColor,
  canAddInputs = true,
  input = [1, 1],
  weight = [-0.5, 1],
  startThreshold = 0,
  startGreater = true,
  connecting = false,
  bias = INIT_CONFIG.bias,
}) => {
  const [inputs, setInputs] = useState(input);
  const [weights, setWeights] = useState(weight);
  const [threshold, setThreshold] = useState(startThreshold);
  const [isGreater, setGreater] = useState(startGreater);

  const inputSum = calculateInputSum(inputs, weights, undefined);

  return (
    <MPBasicNeuron
      labelColor={labelColor}
      canAddInputs
      inputs={inputs}
      setInputs={setInputs}
      weights={weights}
      setWeights={setWeights}
      threshold={threshold}
      setThreshold={setThreshold}
      isGreater={isGreater}
      setIsGreater={setGreater}
      output={calculateThreshold(inputSum, isGreater, threshold)}
      renderLabels={true}
    />
  );
};

export default MPNeuron;
