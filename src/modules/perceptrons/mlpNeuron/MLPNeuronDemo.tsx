/* eslint-disable */
import React, { useState, useCallback } from "react";
import MPBasicNeuron from "../mpNeuron/MPBasicNeuron";

import {
  calculateThreshold,
  calculateInputSum,
  setNeuronAttr,
} from "../mpNeuron/utils";
import { INIT_CONFIG } from "../rosenblatt/constants";

const DEFAULT_INPUT = [1];
const DEFAULT_WEIGHT = [10];
const DEFAULT_WEIGHTS_2 = [-0.5, 1];
const DEFAULT_THRESHOLD = 0;
const NUM_NEURONS_FIRST_LAYER = 2;

type NeuronLayer = {
  inputs: number[];
  weights: number[];
  threshold: number;
  isGreater: boolean;
  bias: number;
};

const getOutputs = (nlayer) => nlayer.map(({ output }) => output);

const getInitialInputs = (num): NeuronLayer[][] => [
  Array(num).fill({
    inputs: DEFAULT_INPUT,
    weights: DEFAULT_WEIGHT,
    threshold: 0,
    isGreater: true,
    bias: 10,
  }),
  [
    {
      inputs: [],
      weights: DEFAULT_WEIGHTS_2,
      threshold: DEFAULT_THRESHOLD,
      isGreater: true,
      bias: INIT_CONFIG.bias,
    },
  ],
];

const getOutput = (neuron) =>
  calculateThreshold(
    calculateInputSum(neuron.inputs, neuron.weights, neuron.bias),
    neuron.threshold,
    neuron.isGreater
  );

const MLPNeuronDemo = (props: { labelColor: string }) => {
  const [neuronState, setNeuronState] = useState(
    getInitialInputs(NUM_NEURONS_FIRST_LAYER)
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setAttr = useCallback(setNeuronAttr(setNeuronState), [setNeuronState]);

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
          inputSum: calculateInputSum(
            neuron.inputs,
            neuron.weights,
            neuron.bias
          ),
          output: getOutput(neuron),
        };
      });
      lastLayer = res;
      return res;
    });
  })();

  const resetDemo = useCallback(
    () => setNeuronState(() => getInitialInputs(NUM_NEURONS_FIRST_LAYER)),
    [setNeuronState]
  );

  const setBias = useCallback((val) => setAttr(1, 0, "bias", val), [setAttr]);

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
        {finalNeuronState.map((neuronLayer, layerNum) => (
          <div key={`neuronLayer-${layerNum}`}>
            {neuronLayer.map((neuron, neuronNum) => (
              <MPBasicNeuron
                {...neuron}
                key={`neuron-${layerNum}-${neuronNum}`}
                labelColor={props.labelColor}
                canAddInputs={layerNum==0}
                hideInputs={layerNum !== 0}
                setWeights={(we) => setAttr(layerNum, neuronNum, "weights", we)}
                setThreshold={(th) =>
                  setAttr(layerNum, neuronNum, "threshold", th)
                }
                setIsGreater={(ig) =>
                  setAttr(layerNum, neuronNum, "isGreater", ig)
                }
                setInputs={(ip) => setAttr(layerNum, neuronNum, "inputs", ip)}
                bias={neuronState[layerNum][neuronNum].bias}
                setBias={(ib) => setAttr(layerNum, neuronNum, "bias", ib)}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex flex-row">
        <button className="basic-button" onClick={setAnd}>
          Set to And
        </button>
        <br />
        <button className="basic-button" onClick={setOr}>
          Set to Or
        </button>
      </div>
    </div>
  );
};

export default MLPNeuronDemo;
