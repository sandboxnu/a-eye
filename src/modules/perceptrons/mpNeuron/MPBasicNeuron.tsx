import React, { useMemo, useCallback } from "react";
import { AddCircle, RemoveCircle } from "@material-ui/icons";

import { zip, calculateThreshold } from "./utils";
import { INIT_CONFIG } from "../rosenblatt/constants";
import ControlledThresholdFunc from "./ControlledThresholdFunc";
import InputLines from "./InputLines";

// const INPT_CLR = '#b92079';
const OUTPT_CLR = "#0FD4C0";

export type NeuronInput = {
  val: number | null;
  weight: number | null;
};

export type MPBasicNeuronType = {
  labelColor: string;
  canAddInputs?: boolean;
  hideInputs?: boolean;
  inputs: number[];
  setInputs;
  weights: number[];
  setWeights;
  connecting?: boolean;
  threshold;
  setThreshold;
  isGreater;
  setIsGreater;
  showInput?: boolean;
  inputSum: number;
  output: number;
  bias?: number;
  canChangeInputs?: boolean;
};

type InputType = { inpt: NeuronInput; idx: number; connecting: boolean };

export const MPBasicNeuron: React.FC<MPBasicNeuronType> = ({
  labelColor,
  canAddInputs = true,
  connecting = false,
  hideInputs = false,
  canChangeInputs = true,
  inputs,
  setInputs,
  weights,
  setWeights,
  threshold,
  setThreshold,
  isGreater,
  setIsGreater,
  inputSum,
  output,
  bias,
}) => {
  const changeSetting = useCallback(
    (type: string, e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
      const val = parseFloat(e.target.value);
      const newInputs = JSON.parse(JSON.stringify(inputs));
      if (!isNaN(val)) {
        newInputs[idx][type] = val;
        setInputs(newInputs);
      } else if (e.target.value === "") {
        newInputs[idx][type] = null;
        setInputs(newInputs);
      }
    },
    [inputs, setInputs]
  );

  const changeWeight = (e, idx) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val))
      setWeights((w) => w.map((ov, i) => (i === idx ? val : ov)));
  };

  const changeVal = (e, idx) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) setInputs((w) => w.map((ov, i) => (i === idx ? val : ov)));
  };

  const removeInput = useCallback(() => {
    setInputs((inputs) => inputs.slice(0, -1));
    setWeights((weights) => weights.slice(0, -1));
  }, [setInputs, setWeights]);

  const addInput = useCallback(() => {
    setInputs((newInputs) => newInputs.concat([1]));
    setWeights((weights) => weights.concat([0]));
  }, [setInputs, setWeights]);

  const Input = ({ inpt, weight, idx }) => (
    <div className="flex items-center cursor-pointer" key={idx}>
      {!hideInputs &&
        (canChangeInputs ? (
          <div className="m-1">
            <input
              className="number-input w-20 h-10 border-2 border-pink-700"
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
          className="number-input w-20 h-10 border-2 border-pink-700"
          type="number"
          value={weight !== null ? weight : ""}
          onChange={(e) => changeWeight(e, idx)}
        />
      </div>
    </div>
  );

  return (
    <div className="m-2 flex flex-col items-center justify-center">
      <div className="flex items-center">
        <div className="flex flex-col">
          {inputs &&
            weights &&
            zip(inputs, weights).map(([input, weight], index) => (
              <Input inpt={input} weight={weight} idx={index} key={index} />
            ))}
          {bias && (
            <div className="flex items-center self-end">
              <p className={labelColor}>bias</p>
              <div
                className="font-bold rounded-full w-12 h-12 bg-pink-700 m-1
                                        flex items-center justify-center text-white"
              >
                {bias}
              </div>
            </div>
          )}
        </div>
        <InputLines
          numInpts={(bias ? 1 : 0) + inputs.length}
          transformY={hideInputs ? 2 : 1}
        />
        <div
          className="rounded-full w-20 h-20 bg-brightOrange
                flex items-center justify-center"
        >
          {inputSum}
        </div>
        <div className="w-2 h-1 bg-navy" />
        <ControlledThresholdFunc
          threshold={threshold}
          setThreshold={setThreshold}
          isGreater={isGreater}
          setIsGreater={setIsGreater}
        />
        <div className="w-16 h-1 bg-navy" />
        <div
          className="rounded-full w-12 h-12 font-bold bg-moduleTeal flex items-center justify-center"
          style={{
            backgroundColor: output === 1 ? OUTPT_CLR : "white",
            border: output === 1 ? "none" : `2px solid ${OUTPT_CLR}`,
          }}
        >
          {output}
        </div>
      </div>
      {canAddInputs && (
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
  );
};

export default MPBasicNeuron;
