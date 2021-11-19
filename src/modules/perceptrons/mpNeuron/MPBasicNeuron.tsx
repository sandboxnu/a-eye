/* eslint-disable */
import React, { useCallback } from "react";
import { AddCircle, RemoveCircle } from "@material-ui/icons";

import { zip, calculateThreshold, calculateInputSum } from "./utils";
import ControlledThresholdFunc from "./ControlledThresholdFunc";
import InputLines from "./InputLines";

const OUTPT_CLR = "#0FD4C0";

type WeightInputType = {
  inpt: number;
  weight: number;
  idx: number;
  hideInputs: boolean;
  setInputs: any;
  changeVal: any;
  setWeights: any;
  changeWeight: any;
}

const WeightInput: React.FC<WeightInputType> = ({ inpt, weight, idx, hideInputs, setInputs, changeVal, setWeights, changeWeight }) => (
  <div
    className={`flex items-center cursor-pointer ${hideInputs ? "pb-2.5 pt-16" : ""
      }`}
    key={idx}
  >
    {!hideInputs &&
      (setInputs ? (
        <div className="m-1">
          <input
            className="number-input w-20 h-10 border-4 border-teal-700"
            type="number"
            value={inpt}
            onChange={(e) => changeVal(e, idx)}
          />
        </div>
      ) : (
        <div
          className="rounded-full w-12 h-12 font-bold bg-moduleTeal flex items-center justify-center"
          style={{
            backgroundColor: OUTPT_CLR,
            border: "none",
          }}
        >
          {inpt.toFixed(2)}
        </div>
      ))}
    <div className="w-10 h-1 bg-navy" />
    <div className="m-1">
      <input
        disabled={!setWeights}
        className="number-input w-20 h-10 border-4 border-pink-700"
        type="number"
        value={weight !== null ? weight : ""}
        onChange={(e) => changeWeight(e, idx)}
      />
    </div>
  </div>
);

type BiasInputType = {
  bias: number;
  setBias?: any;
}

const BiasInput: React.FC<BiasInputType> = ({ bias, setBias }) => (
  <div className="flex items-center self-end">
  {setBias ? (
    <div className="flex flex-row rounded-md w-auto h-10 mr-1 my-1 border-2 text-center border-purple-700 bg-purple-700 items-center">
      <p className={`text-center text-white ml-1 `}>Bias</p>
      <input
        className="w-16 pl-2 pr-1 ml-2 mr-half h-8 rounded-md focus:outline-none"
        type="number"
        value={bias}
        onChange={(e) => {
          let val = parseFloat(e.target.value);
          if (isNaN(val))
            val = 0.0

          setBias(val);
        }}
      />
    </div>
  ) : (
    <div
      className="rounded-full w-12 h-12 font-bold bg-moduleTeal flex items-center justify-center"
      style={{
        backgroundColor: OUTPT_CLR,
        border: "none",
      }}
    >
      {bias.toFixed(1)}
    </div>
  )}
</div>
);


type MPBasicNeuronType = {
  labelColor: string;
  canAddInputs?: boolean;
  hideInputs?: boolean;
  inputs: number[];
  setInputs?: any;
  weights: number[];
  setWeights?: any;
  connecting?: boolean;
  threshold;
  setThreshold?: any;
  isGreater;
  setIsGreater?: any;
  showInput?: boolean;
  inputSum?: number;
  output?: number;
  bias: number;
  setBias?: any;
  inputToAdd?: number;
  weightToAdd?: number;
  renderLabels?: boolean;
};


export const MPBasicNeuron: React.FC<MPBasicNeuronType> = ({
  labelColor,
  canAddInputs = true,
  connecting = false,
  hideInputs = false,
  inputs,
  setInputs,
  weights,
  setWeights,
  threshold,
  setThreshold,
  isGreater,
  setIsGreater,
  inputSum = undefined,
  output,
  bias,
  setBias,
  inputToAdd = 1,
  weightToAdd = 1,
  renderLabels = false,
}) => {
  const finalInputSum = inputSum
    ? inputSum
    : calculateInputSum(inputs, weights, bias || 0);

  const finalOutput = output
    ? output
    : calculateThreshold(finalInputSum, isGreater, threshold);

  const changeWeight = useCallback(
    (e, idx) => {
      const val = parseFloat(e.target.value);
      if (!isNaN(val))
        setWeights((w) => w.map((ov, i) => (i === idx ? val : ov)));
    },
    [setWeights]
  );

  const changeVal = useCallback(
    (e, idx) => {
      let val = parseFloat(e.target.value);
      if (isNaN(val))
        val = 0.0

      setInputs((w) => w.map((ov, i) => (i === idx ? val : ov)));
    },
    [setInputs]
  );

  const removeInput = useCallback(() => {
    setInputs((inputs) => {
      if (inputs.length == 1) return inputs;

      return inputs.slice(0, -1)
    });
    setWeights((weights) => {
      if (weights.length == 1) return weights;

      return weights.slice(0, -1)
    });
  }, [setInputs, setWeights]);

  const addInput = useCallback(() => {
    setInputs((newInputs) => newInputs.concat([inputToAdd]));
    setWeights((weights) => weights.concat([weightToAdd]));
  }, [setInputs, setWeights, inputToAdd, weightToAdd]);



  return (

    <div className="m-2 flex flex-col items-center justify-center">
      <div>

        <div className={`flex flex-row justify-start w-full ${renderLabels ? "" : "hidden"}`}>
          {/* I hate this */}
          <p className={`ml-4  ${labelColor}`}>Input</p>
          <p className={`ml-16  ${labelColor}`}>Weights</p>
          <p className='ml-8 mr-6' />
          <p className={`ml-24 ${labelColor}`}>Sum</p>
          <p className={`ml-6 ${labelColor}`}>Threshold</p>
          <p className={`ml-12 ${labelColor}`}>Result</p>
        </div>

        <div className="flex items-center">
          <div className="flex flex-col h-36">
            {inputs &&
              weights &&
              zip(inputs, weights).map(([input, weight], index) => (
                <WeightInput inpt={input} weight={weight} idx={index} key={index}
                  hideInputs={hideInputs} setInputs={setInputs} changeVal={changeVal}
                  setWeights={setWeights} changeWeight={changeWeight} />
              ))}
              <BiasInput bias={bias} setBias={setBias} />
          </div>
          <InputLines
            numInpts={1 + inputs.length} // 1 + is from the bias.
            transformY={hideInputs ? 2 : 1}
          />

          {typeof finalInputSum === "number" && (
            <div
              className="rounded-full w-20 h-20 bg-brightOrange
                flex items-center justify-center"
            >
              {finalInputSum.toFixed(2)}
            </div>
          )}
          <div className="w-2 h-1 bg-navy" />
          <ControlledThresholdFunc
            labelColor={labelColor}
            threshold={threshold}
            setThreshold={setThreshold}
            isGreater={isGreater}
            setIsGreater={setIsGreater}
          />
          <div className="w-16 h-1 bg-navy" />
          <div
            className="rounded-full w-12 h-12 font-bold bg-moduleTeal flex items-center justify-center"
            style={{
              backgroundColor: finalOutput === 1 ? OUTPT_CLR : "white",
              border: finalOutput === 1 ? "none" : `2px solid ${OUTPT_CLR}`,
            }}
          >
            {finalOutput}
          </div>
        </div>
        {canAddInputs && setInputs && (
          <div>
            <RemoveCircle
              className="icon-button"
              fontSize="large"
              onClick={removeInput}
            />
            <p className="inline m-2 text-white">{inputs.length} inputs</p>
            <AddCircle
              className="icon-button"
              fontSize="large"
              onClick={addInput}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MPBasicNeuron;
