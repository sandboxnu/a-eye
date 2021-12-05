import React, { useCallback } from "react";
import MPBasicNeuron from "../mpNeuron/MPBasicNeuron";

import { NeuronConfig } from "../mpNeuron/utils";

type MLPGraphNetworkType = {
  labelColor: string;
  neuronState: NeuronConfig[][];
  changeNeuronValue: Function;
  resetNeuronState: Function;
  // [...layers, [... neurons, [.. inputs for each neuron (all rows but first one are outputs, so this is just one element for them.)]]]
  intermediateValues: number[][][];
};

const MLPGraphNetwork: React.FC<MLPGraphNetworkType> = ({
  labelColor,
  neuronState,
  changeNeuronValue,
  resetNeuronState,
  intermediateValues,
}) => {
  // hardcoded for two layers and one neuron on second layer
  const setBias = useCallback((bias) => changeNeuronValue(1, 0, "bias", bias), [
    changeNeuronValue,
  ]);

  const setAnd = useCallback(() => {
    // reset all weights
    // reset threshold
    // keep inputs
    resetNeuronState();
    setBias(-15);
  }, [resetNeuronState, setBias]);
  const setOr = useCallback(() => {
    resetNeuronState();
    setBias(-5);
  }, [resetNeuronState, setBias]);

  // get the inputs to a neuron on a specific layer
  // assume numinputs is equal for all neurons on the layer
  const getInputs = useCallback(
    (layerNum, neuronNum, numInputs) => {
      return intermediateValues[layerNum]
        .concat()
        .map(([a]) => a)
        .slice(numInputs * neuronNum, numInputs * (neuronNum + 1));
    },
    [intermediateValues]
  );

  // get the outputs to the current neuron layer
  const getOutput = useCallback(
    (layerNum, neuronNum) => {
      return intermediateValues[layerNum + 1][neuronNum][0];
    },
    [intermediateValues]
  );

  return (
    <div>
      <div className="m-2 flex items-center">
        {neuronState.map((layer, layerNum) => (
          <div id="layer" key={layerNum}>
            {layer.map(({ weights, bias, isGreater, threshold }, neuronNum) => (
              <MPBasicNeuron
                key={`LayerNeuron-${layerNum}-${neuronNum}`}
                labelColor={labelColor}
                canAddInputs={false}
                hideInputs={layerNum !== 0}
                inputs={getInputs(layerNum, neuronNum, weights.length)}
                weights={weights}
                bias={bias}
                setBias={(newBias: number) => 
                  changeNeuronValue(layerNum, neuronNum, "bias", newBias)
                }
                isGreater={isGreater}
                threshold={threshold}
                output={getOutput(layerNum, neuronNum)}
                setIsGreater={(isGreater: boolean) =>
                  changeNeuronValue(layerNum, neuronNum, "isGreater", isGreater)
                }
                setThreshold={(threshold: number) =>
                  changeNeuronValue(layerNum, neuronNum, "threshold", threshold)
                }
                setWeights={(weights) =>
                  changeNeuronValue(layerNum, neuronNum, "weights", weights)
                }
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

export default MLPGraphNetwork;
