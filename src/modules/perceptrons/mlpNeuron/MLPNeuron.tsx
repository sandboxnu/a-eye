import React, { useState, useMemo } from "react";
import MPBasicNeuron, { NeuronInput } from "../mpNeuron/MPBasicNeuron";
import MPLayerNeuron from "../mpNeuron/MPLayerNeuron";

import { INIT_CONFIG } from "../rosenblatt/constants";

const defaultInput = [{ val: 1, weight: 10 }];
const initialWeights = [-0.5, 1];
const defaultWeights = [10, 10];
const defaultThreshold = 0;

const resetWeights = (inputObj, newWeight: number) =>
  inputObj.map(({ val, weight }) => ({ val, weight: newWeight }));

const applyThreshold = (n: number, threshold: number, isGreater: boolean) =>
  isGreater ? (n > threshold ? 1 : 0) : n < threshold ? 1 : 0;

const getInputSum = (inputs) =>
  inputs.reduce(
    (prev, acc) => (acc.val && acc.weight ? acc.val * acc.weight : 0) + prev,
    0
  ) + INIT_CONFIG.bias;

const getOutput = (inputs, threshold, isGreater) =>
  applyThreshold(getInputSum(inputs), threshold, isGreater);

/* const output = applyThreshold(inputSum, threshold, isGreater);
 *
 * onAnsChange(output); */

const MLPNeuron = (props: { labelColor: string }) => {
  const [weights, setWeights] = useState<number[]>(initialWeights);

  const [inputs, setInputs] = useState<NeuronInput[]>(defaultInput);
  const [inputs2, setInputs2] = useState<NeuronInput[]>(defaultInput);

  const [threshold1, setThreshold1] = useState(0);
  const [isGreater1, setIsGreater1] = useState(true);

  const [threshold2, setThreshold2] = useState(0);
  const [isGreater2, setIsGreater2] = useState(true);

  const [thresholdLayer, setThresholdLayer] = useState(0);
  const [isGreaterLayer, setIsGreaterLayer] = useState(true);

  const [bias, setBias] = useState(10);

  const inputSum1 = getInputSum(inputs);
  const inputSum2 = getInputSum(inputs2);
  const answer1 = getOutput(inputs, threshold1, isGreater1);
  const answer2 = getOutput(inputs2, threshold2, isGreater2);

  const resetDemo = () => {
    setWeights(defaultWeights);
    setInputs(resetWeights(inputs, defaultInput[0].weight));
    setInputs2(resetWeights(inputs2, defaultInput[0].weight));
    setThreshold1(defaultThreshold);
    setIsGreater1(true);
    setThreshold2(defaultThreshold);
    setIsGreater2(true);
    setThresholdLayer(defaultThreshold);
    setIsGreaterLayer(true);
  };

  const setAnd = () => {
    resetDemo();
    setBias(-15);
  };

  const setOr = () => {
    resetDemo();
    setBias(-5);
  };

  return (
    <div>
      <div className="m-2 flex items-center">
        <div>
          <MPBasicNeuron
            threshold={threshold1}
            setThreshold={setThreshold1}
            isGreater={isGreater1}
            setIsGreater={setIsGreater1}
            labelColor={props.labelColor}
            canAddInputs={false}
            addBias={true}
            inputs={inputs}
            setInputs={setInputs}
            inputSum={inputSum1}
            output={answer1}
          />
          <MPBasicNeuron
            threshold={threshold2}
            setThreshold={setThreshold2}
            isGreater={isGreater2}
            setIsGreater={setIsGreater2}
            labelColor={props.labelColor}
            canAddInputs={false}
            addBias={true}
            inputs={inputs2}
            inputSum={inputSum2}
            setInputs={setInputs2}
            output={answer2}
          />
        </div>
        <div>
          <MPLayerNeuron
            threshold={thresholdLayer}
            setThreshold={setThresholdLayer}
            isGreater={isGreaterLayer}
            setIsGreater={setIsGreaterLayer}
            labelColor={props.labelColor}
            addBias={true}
            inputs={[answer1, answer2]}
            weights={weights}
            setWeights={setWeights}
            bias={bias}
          />
        </div>
      </div>
      <div>
        <button className="bg-white" onClick={setAnd}>
          Set to And
        </button>
        <br />
        <button className="bg-white" onClick={setOr}>
          Set to Or
        </button>
      </div>
    </div>
  );
};

export default MLPNeuron;
