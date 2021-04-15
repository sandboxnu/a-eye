import React, { useState, useMemo, useCallback } from "react";
import MPBasicNeuron, { NeuronInput } from "../mpNeuron/MPBasicNeuron";
import MPLayerNeuron from "../mpNeuron/MPLayerNeuron";

import { zip, calculateThreshold } from "../mpNeuron/utils";
import { INIT_CONFIG } from "../rosenblatt/constants";

const defaultInput = [{ val: 1, weight: 10 }];
const initialWeights = [-0.5, 1];
const defaultWeights = [10, 10];
const defaultThreshold = 0;
const NUM_NEURONS_FIRST_LAYER = 2;

type NeuronLayer = {
  inputs: number[];
  weights: number[];
  threshold: number;
  isGreater: boolean;
  bias?: number;
};

const applyThreshold = (n: number, threshold: number, isGreater: boolean) =>
  isGreater ? (n > threshold ? 1 : 0) : n < threshold ? 1 : 0;

const getInputSum = ({ inputs, weights, bias }: NeuronLayer) =>
  zip(inputs, weights).reduce(
    (prev, [input, weight]) => (input && weight ? input * weight : 0) + prev,
    0
  ) + (bias ? bias : INIT_CONFIG.bias);

const getOutputs = (nlayer) => nlayer.map(({ output }) => output);

const getInitialInputs = (num): NeuronLayer[][] => [
  Array(num).fill({
    inputs: [1],
    weights: [10],
    threshold: 0,
    isGreater: true,
    bias: 10,
  }),
  [
    {
      inputs: [],
      weights: initialWeights,
      threshold: 0,
      isGreater: true,
      bias: INIT_CONFIG.bias,
    },
  ],
];

const getOutput = (neuron) =>
  applyThreshold(getInputSum(neuron), neuron.threshold, neuron.isGreater);

const MLPNeuron = (props: { labelColor: string }) => {
  const [neuronState, setNeuronState] = useState(
    getInitialInputs(NUM_NEURONS_FIRST_LAYER)
  );

  const setAttr = useCallback(
    (neuronLayerNum, neuronNum, attr, value) =>
      setNeuronState((neuronState) =>
        neuronState.map((neuronLayer, i) =>
          neuronLayer.map((neuronValues, j) =>
            neuronLayerNum === i && neuronNum === j
              ? {
                  ...neuronValues,
                  [attr]:
                    typeof value === "function"
                      ? value(neuronValues[attr])
                      : value,
                }
              : neuronValues
          )
        )
      ),
    [setNeuronState]
  );

  const setBias = (val) => setAttr(1, 0, "bias", val);

  console.log(neuronState);

  const finalNeuronState = (() => {
    let lastLayer;
    return neuronState.map((neuronLayer, layerNum) => {
      const res = neuronLayer.map((neuron) => {
        const finalNeuron =
          layerNum === 0
            ? neuron
            : {
                ...neuron,
                inputs: getOutputs(lastLayer),
              };
        return {
          ...finalNeuron,
          inputSum: getInputSum(neuron),
          output: getOutput(neuron),
        };
      });
      lastLayer = res;
      return res;
    });
  })();

  console.log(finalNeuronState);

  const resetDemo = useCallback(
    () => setNeuronState(() => getInitialInputs(NUM_NEURONS_FIRST_LAYER)),
    [setNeuronState]
  );

  const setAnd = useCallback(() => {
    resetDemo();
    setBias(-15);
  }, [resetDemo, setBias]);

  const setOr = useCallback(() => {
    resetDemo();
    setBias(-5);
  }, [resetDemo, setBias]);

  return (
    <div>
      <div className="m-2 flex items-center">
        {finalNeuronState.map((neuronLayer, i) => (
          <div key={`neuronLayer-${i}`}>
            {neuronLayer.map(
              (
                {
                  inputs,
                  weights,
                  threshold,
                  isGreater,
                  inputSum,
                  output,
                  bias,
                },
                j
              ) => (
                <MPBasicNeuron
                  key={`neuron-${i}-${j}`}
                  labelColor={props.labelColor}
                  canAddInputs={false}
                  hideInputs={i !== 0}
                  weights={weights}
                  setWeights={(we) => setAttr(i, j, "weights", we)}
                  threshold={threshold}
                  setThreshold={(th) => setAttr(i, j, "threshold", th)}
                  isGreater={isGreater}
                  setIsGreater={(ig) => setAttr(i, j, "isGreater", ig)}
                  inputs={inputs}
                  setInputs={(ip) => setAttr(i, j, "inputs", ip)}
                  inputSum={inputSum}
                  output={output}
                  bias={bias}
                />
              )
            )}
          </div>
        ))}
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
