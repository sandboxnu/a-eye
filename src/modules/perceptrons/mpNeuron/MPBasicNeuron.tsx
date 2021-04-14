import React, { useMemo, useCallback } from "react";
import { AddCircle, RemoveCircle } from "@material-ui/icons";

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
  addBias?: boolean;
  inputs: NeuronInput[];
  setInputs: (inpts: React.SetStateAction<NeuronInput[]>) => void;
  onAnsChange?: (inpts: React.SetStateAction<number>) => void;
  connecting?: boolean;
  threshold;
  setThreshold;
  isGreater;
  setIsGreater;
  inputSum: number;
  output: number;
};

type InputType = { inpt: NeuronInput; idx: number; connecting: boolean };

export const MPBasicNeuron: React.FC<MPBasicNeuronType> = ({
  labelColor,
  canAddInputs = true,
  addBias = false,
  connecting = false,
  inputs,
  setInputs,
  threshold,
  setThreshold,
  isGreater,
  setIsGreater,
  inputSum,
  output,
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

  const changeWeight = (e, idx) => changeSetting("weight", e, idx);
  const changeVal = (e, idx) => changeSetting("val", e, idx);

  const removeInput = useCallback(
    () => setInputs((inputs) => inputs.slice(0, -1)),
    [setInputs]
  );

  const addInput = useCallback(
    () => setInputs((newInputs) => newInputs.concat([{ val: 1, weight: 0.5 }])),
    [inputs, setInputs]
  );

  const Input: React.FC<InputType> = ({ inpt, idx, connecting }) => (
    <div className="flex items-center cursor-pointer" key={idx}>
      {!connecting && (
        <div className="m-1">
          <input
            className="number-input w-20 h-10 border-2 border-pink-700"
            type="number"
            value={inpt.val !== null ? inpt.val : ""}
            onChange={(e) => changeVal(e, idx)}
          />
        </div>
      )}
      <div className="w-10 h-1 bg-navy" />
      <div className="m-1">
        <input
          className="number-input w-20 h-10 border-2 border-pink-700"
          type="number"
          value={inpt.weight !== null ? inpt.weight : ""}
          onChange={(e) => changeWeight(e, idx)}
        />
      </div>
    </div>
  );

  return (
    <div className="m-2 flex flex-col items-center justify-center">
      <div className="flex items-center">
        <div className="flex flex-col">
          {inputs.map((val, idx) => (
            <Input
              inpt={val}
              idx={idx}
              connecting={connecting}
              key={`input-${idx}`}
            />
          ))}
          {addBias && (
            <div className="flex items-center self-end">
              <p className={labelColor}>bias</p>
              <div
                className="font-bold rounded-full w-12 h-12 bg-pink-700 m-1
                                        flex items-center justify-center text-white"
              >
                {INIT_CONFIG.bias.toFixed(1)}
              </div>
            </div>
          )}
        </div>

        <InputLines numInpts={(addBias ? 1 : 0) + inputs.length} />
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
