import React, { useState, useCallback } from "react";
import MLPGraphNetwork from "../mlpNeuron/MLPGraphNetwork";
import { RblattInput, INIT_INPUTS } from "../rosenblatt/constants";
import EditingRblattGraph from "../rosenblatt/EditingRblattGraph";

import {
  setNeuronAttr,
  getNeuronOutputs,
  NeuronConfig,
  changeInputsAfterClick,
} from "../mpNeuron/utils";

import { neuronInputConfig } from "./constants";

// Get the last nested value of an array.
const getLastValue = (arr: any[]) => {
  let a = arr;
  while (Array.isArray(a)) {
    a = a[a.length - 1];
  }

  return a;
};

const MLPDemo = (props: { labelColor: string }) => {
  const [inputs, setInputs] = useState<RblattInput[]>(INIT_INPUTS);
  const [currPoint, setCurrPoint] = useState<number>(0);
  const [neuronState, setNeuronState] = useState<NeuronConfig[][]>(
    neuronInputConfig
  );

  // Update a neuron value to a new one!
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const changeNeuronValue = useCallback(setNeuronAttr(setNeuronState), [
    setNeuronState,
  ]);

  // reset neuron to default state
  const resetNeuronState = useCallback(() => {
    setNeuronState((_) => neuronInputConfig);
  }, [setNeuronState]);

  // go to the previous iteration of the graph
  const goPrev = useCallback(() => {
    setCurrPoint((cp) => (cp === 0 ? inputs.length - 1 : cp - 1));
  }, [setCurrPoint, inputs]);

  // go to the next iteration of the graph
  const goNext = useCallback(() => {
    setCurrPoint((cp) => (cp + 1) % inputs.length);
  }, [setCurrPoint, inputs]);

  // get the point color of the final neuron
  const calculatePointColor = useCallback(
    (clickedX, clickedY) => {
      return getLastValue(getNeuronOutputs([clickedX, clickedY], neuronState));
    },
    [neuronState]
  );

  const handleClick = useCallback(
    (x, y) =>
      // eslint-disable-next-line react-hooks/exhaustive-deps
      changeInputsAfterClick(setInputs)(x, y, calculatePointColor(x, y)),
    [setInputs, calculatePointColor]
  );

  const correctPointColorInputs: RblattInput[] = inputs.map(([x, y]) => [
    x,
    y,
    calculatePointColor(x, y),
  ]);

  const lines = (() => {
    const getCoord = ({ thresholdVal, weights, bias }) => {
      const weight = weights[0];
      return thresholdVal / (weight === 0 ? 1 : weight) - bias;
    };

    return [
      {
        x: getCoord(neuronState[0][0]),
        y: getCoord(neuronState[0][1]),
      },
    ];
  })();

  return (
    <div>
      <MLPGraphNetwork
        labelColor={props.labelColor}
        neuronState={neuronState}
        changeNeuronValue={changeNeuronValue}
        resetNeuronState={resetNeuronState}
        intermediateValues={getNeuronOutputs(inputs[currPoint], neuronState)}
      />
      <EditingRblattGraph
        inputs={correctPointColorInputs}
        highlighted={inputs[currPoint]}
        allowSelectingPointColor={false}
        handleClick={handleClick}
        lines={lines}
      />
      <button className="basic-button" onClick={goPrev} disabled={false}>
        Previous Step
      </button>
      <button className="basic-button" onClick={goNext} disabled={false}>
        Next Step
      </button>
    </div>
  );
};

export default MLPDemo;
