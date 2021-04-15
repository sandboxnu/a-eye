import React, { useState, useMemo, useCallback } from "react";
import MPBasicNeuron, { NeuronInput } from "../mpNeuron/MPBasicNeuron";
import MPLayerNeuron from "../mpNeuron/MPLayerNeuron";

import { INIT_CONFIG } from "../rosenblatt/constants";

const defaultInput = [{ val: 1, weight: 10 }];
const initialWeights = [-0.5, 1];
const defaultWeights = [10, 10];
const defaultThreshold = 0;
const NUM_NEURONS_FIRST_LAYER = 2;

const resetWeights = (inputObj, newWeight: number) =>
  inputObj.map(({ val, weight }) => ({ val, weight: newWeight }));

const applyThreshold = (n: number, threshold: number, isGreater: boolean) =>
  isGreater ? (n > threshold ? 1 : 0) : n < threshold ? 1 : 0;

const getInputSum = ({ inputs }) =>
  inputs.reduce(
    (prev, acc) => (acc.val && acc.weight ? acc.val * acc.weight : 0) + prev,
    0
  ) + INIT_CONFIG.bias;

const getOutputs = (nstate, layer) => nstate.map(({ output }) => output);

const getInitialInputs = (num) =>
  Array(num).fill({ inputs: defaultInput, threshold: 0, isGreater: true });

const getOutput = ({ inputs, threshold, isGreater }) =>
  applyThreshold(getInputSum({ inputs }), threshold, isGreater);

const MLPNeuron = (props: { labelColor: string }) => {
  const [neuronState, setNeuronState] = useState(
    getInitialInputs(NUM_NEURONS_FIRST_LAYER)
  );

  const setAttr = useCallback(
    (neuronNum, attr, value) =>
      setNeuronState((neuronState) =>
        neuronState.map((neuronValues, i) =>
          neuronNum === i ? { ...neuronValues, [attr]: value } : neuronValues
        )
      ),
    [setNeuronState]
  );

  const [thresholdLayer, setThresholdLayer] = useState(0);
  const [isGreaterLayer, setIsGreaterLayer] = useState(true);
  const [weights, setWeights] = useState<number[]>(initialWeights);
  const [bias, setBias] = useState(10);

  const finalNeuronState = neuronState.map((neuron) => ({
    ...neuron,
    inputSum: getInputSum(neuron),
    output: getOutput(neuron),
  }));

  console.log(finalNeuronState);

  const resetDemo = useCallback(() => {
    setNeuronState(() => getInitialInputs(NUM_NEURONS_FIRST_LAYER));
    setThresholdLayer(defaultThreshold);
    setIsGreaterLayer(true);
  }, [setNeuronState, setThresholdLayer, setIsGreaterLayer]);

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
        <div>
          {finalNeuronState.map(
            ({ inputs, threshold, isGreater, inputSum, output }, i) => (
              <MPBasicNeuron
                labelColor={props.labelColor}
                canAddInputs={false}
                addBias={true}
                threshold={threshold}
                setThreshold={(th) => setAttr(i, "threshold", th)}
                isGreater={isGreater}
                setIsGreater={(ig) => setAttr(i, "isGreater", ig)}
                inputs={inputs}
                setInputs={(ip) => setAttr(i, "inputs", ip)}
                inputSum={inputSum}
                output={output}
              />
            )
          )}
        </div>
        <div>
          <MPLayerNeuron
            threshold={thresholdLayer}
            setThreshold={setThresholdLayer}
            isGreater={isGreaterLayer}
            setIsGreater={setIsGreaterLayer}
            labelColor={props.labelColor}
            addBias={true}
            inputs={getOutputs(finalNeuronState, 1)}
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
