/* eslint-disable */
import React from "react";
import RblattNeuron from "./RblattNeuron";
import { round } from "./utils";

const InteractiveNeuron = ({
  labelColor,
  config,
  inputs,
  currPoint,
  setConfig,
  binMisclass,
}) => (
  <div className="flex flex-col items-center justify-center">
    <p className={`m-6 font-bold text-2xl ${labelColor}`}>
      {`${config.weightX.toFixed(1)}x + ${config.weightY.toFixed(
        1
      )}y + ${config.bias.toFixed(1)} > 0`}
    </p>
    {inputs.length !== 0 && (
      <RblattNeuron
        input={inputs[currPoint]}
        config={config}
        labelColor={labelColor}
      />
    )}
    <div
      className={`font-bold flex items-center justify-center m-4 ${labelColor}`}
    >
      Learning rate:
      <input
        type="range"
        min="-7"
        max="1"
        step="0.1"
        className="mx-2 w-64"
        value={Math.log2(config.learningRate)}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setConfig((config) => ({
            ...config,
            learningRate: round(2 ** parseFloat(e.target.value), 3),
          }))
        }
        disabled
      />
      {config.learningRate}
    </div>
    <div className={labelColor}>
      <div>Number of Misclassified Points: {binMisclass}</div>
    </div>
  </div>
);

export default InteractiveNeuron;
